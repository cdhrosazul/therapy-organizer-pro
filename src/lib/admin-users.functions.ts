import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";

const PerfilEnum = z.enum(["diretor", "administrativo", "recepcao", "terapeuta"]);

const CreateUserSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  nome: z.string().trim().min(1).max(120),
  perfil: PerfilEnum,
  funcionarioId: z.string().uuid().nullable().optional(),
});

const UpdateUserSchema = z.object({
  id: z.string().uuid(),
  nome: z.string().trim().min(1).max(120).optional(),
  perfil: PerfilEnum.optional(),
  funcionarioId: z.string().uuid().nullable().optional(),
  ativo: z.boolean().optional(),
});

const ResetSchema = z.object({ id: z.string().uuid(), password: z.string().min(6).max(72) });
const DeleteSchema = z.object({ id: z.string().uuid() });

async function requireDiretor() {
  const { getSupabaseAdmin, getSupabaseAsUser } = await import(
    "@/integrations/supabase/admin.server"
  );
  const authHeader = getRequestHeader("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("Não autenticado.");
  const userClient = getSupabaseAsUser(token);
  const { data: userData, error: userErr } = await userClient.auth.getUser(token);
  if (userErr || !userData.user) throw new Error("Sessão inválida.");
  const admin = getSupabaseAdmin();
  const { data: prof } = await admin
    .from("profiles")
    .select("perfil, ativo, nome, id")
    .eq("id", userData.user.id)
    .maybeSingle();
  if (!prof || !prof.ativo || prof.perfil !== "diretor") {
    throw new Error("Apenas diretores podem executar esta ação.");
  }
  return { admin, caller: { id: prof.id, nome: prof.nome ?? userData.user.email ?? "diretor" } };
}

async function pushLog(admin: ReturnType<typeof Object> | any, usuario: string, acao: string, detalhe: string) {
  await admin.from("logs").insert({
    data: new Date().toISOString(),
    usuario,
    acao,
    detalhe,
  });
}

export const listUsersAdmin = createServerFn({ method: "POST" }).handler(async () => {
  const { admin } = await requireDiretor();
  const { data: profiles, error } = await admin
    .from("profiles")
    .select("id, nome, email, perfil, funcionario_id, ativo")
    .order("nome");
  if (error) throw new Error(error.message);
  return (profiles ?? []).map((p) => ({
    id: p.id as string,
    nome: (p.nome as string | null) ?? "",
    usuario: (p.email as string | null) ?? "",
    perfil: p.perfil as "diretor" | "administrativo" | "recepcao" | "terapeuta",
    funcionarioId: (p.funcionario_id as string | null) ?? undefined,
    ativo: Boolean(p.ativo),
  }));
});

export const createUserAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => CreateUserSchema.parse(d))
  .handler(async ({ data }) => {
    const { admin, caller } = await requireDiretor();
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { nome: data.nome },
    });
    if (createErr || !created.user) throw new Error(createErr?.message ?? "Falha ao criar usuário.");
    const { error: updErr } = await admin
      .from("profiles")
      .update({
        nome: data.nome,
        perfil: data.perfil,
        funcionario_id: data.funcionarioId ?? null,
        ativo: true,
      })
      .eq("id", created.user.id);
    if (updErr) {
      await admin.auth.admin.deleteUser(created.user.id);
      throw new Error(`Falha ao definir perfil: ${updErr.message}`);
    }
    await pushLog(admin, caller.nome, "Usuário criado", `${data.email} (${data.perfil})`);
    return { id: created.user.id };
  });

export const updateUserAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => UpdateUserSchema.parse(d))
  .handler(async ({ data }) => {
    const { admin, caller } = await requireDiretor();
    const patch: Record<string, unknown> = {};
    if (data.nome !== undefined) patch.nome = data.nome;
    if (data.perfil !== undefined) patch.perfil = data.perfil;
    if (data.funcionarioId !== undefined) patch.funcionario_id = data.funcionarioId ?? null;
    if (data.ativo !== undefined) patch.ativo = data.ativo;
    const { error } = await admin.from("profiles").update(patch).eq("id", data.id);
    if (error) throw new Error(error.message);
    await pushLog(admin, caller.nome, "Usuário atualizado", `${data.id} ${JSON.stringify(patch)}`);
    return { ok: true };
  });

export const resetUserPasswordAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => ResetSchema.parse(d))
  .handler(async ({ data }) => {
    const { admin, caller } = await requireDiretor();
    const { error } = await admin.auth.admin.updateUserById(data.id, { password: data.password });
    if (error) throw new Error(error.message);
    await pushLog(admin, caller.nome, "Senha redefinida", `user ${data.id}`);
    return { ok: true };
  });

export const deleteUserAdmin = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => DeleteSchema.parse(d))
  .handler(async ({ data }) => {
    const { admin, caller } = await requireDiretor();
    const { error } = await admin.auth.admin.deleteUser(data.id);
    if (error) throw new Error(error.message);
    await pushLog(admin, caller.nome, "Usuário excluído", data.id);
    return { ok: true };
  });
