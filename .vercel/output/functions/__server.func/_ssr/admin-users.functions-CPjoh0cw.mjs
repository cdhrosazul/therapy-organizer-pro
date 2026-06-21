import { T as TSS_SERVER_FUNCTION, a as createServerFn, g as getRequestHeader } from "./server-BZvcqNow.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { e as enumType, o as objectType, s as stringType, b as booleanType } from "../_libs/zod.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
var createServerRpc = (serverFnMeta, splitImportFn) => {
  const url = "/_serverFn/" + serverFnMeta.id;
  return Object.assign(splitImportFn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PerfilEnum = enumType(["diretor", "administrativo", "recepcao", "terapeuta"]);
const CreateUserSchema = objectType({
  email: stringType().trim().email().max(255),
  password: stringType().min(6).max(72),
  nome: stringType().trim().min(1).max(120),
  perfil: PerfilEnum,
  funcionarioId: stringType().uuid().nullable().optional()
});
const UpdateUserSchema = objectType({
  id: stringType().uuid(),
  nome: stringType().trim().min(1).max(120).optional(),
  perfil: PerfilEnum.optional(),
  funcionarioId: stringType().uuid().nullable().optional(),
  ativo: booleanType().optional()
});
const ResetSchema = objectType({
  id: stringType().uuid(),
  password: stringType().min(6).max(72)
});
const DeleteSchema = objectType({
  id: stringType().uuid()
});
async function requireDiretor() {
  const {
    getSupabaseAdmin,
    getSupabaseAsUser
  } = await import("./admin.server-Dr99Awnr.mjs");
  const authHeader = getRequestHeader("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "");
  if (!token) throw new Error("Não autenticado.");
  const userClient = getSupabaseAsUser(token);
  const {
    data: userData,
    error: userErr
  } = await userClient.auth.getUser(token);
  if (userErr || !userData.user) throw new Error("Sessão inválida.");
  const admin = getSupabaseAdmin();
  const {
    data: prof
  } = await admin.from("profiles").select("perfil, ativo, nome, id").eq("id", userData.user.id).maybeSingle();
  if (!prof || !prof.ativo || prof.perfil !== "diretor") {
    throw new Error("Apenas diretores podem executar esta ação.");
  }
  return {
    admin,
    caller: {
      id: prof.id,
      nome: prof.nome ?? userData.user.email ?? "diretor"
    }
  };
}
async function pushLog(admin, usuario, acao, detalhe) {
  await admin.from("logs").insert({
    data: (/* @__PURE__ */ new Date()).toISOString(),
    usuario,
    acao,
    detalhe
  });
}
const listUsersAdmin_createServerFn_handler = createServerRpc({
  id: "958965a0fb05a98a6f1030cfadf8abc7795fbc2d4c9ee85416a448f0b89bf98a",
  name: "listUsersAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => listUsersAdmin.__executeServer(opts));
const listUsersAdmin = createServerFn({
  method: "POST"
}).handler(listUsersAdmin_createServerFn_handler, async () => {
  const {
    admin
  } = await requireDiretor();
  const {
    data: profiles,
    error
  } = await admin.from("profiles").select("id, nome, email, perfil, funcionario_id, ativo").order("nome");
  if (error) throw new Error(error.message);
  return (profiles ?? []).map((p) => ({
    id: p.id,
    nome: p.nome ?? "",
    usuario: p.email ?? "",
    perfil: p.perfil,
    funcionarioId: p.funcionario_id ?? void 0,
    ativo: Boolean(p.ativo)
  }));
});
const createUserAdmin_createServerFn_handler = createServerRpc({
  id: "2b7d27e7b84eddf8b46ae96c7c943d63abf364d20bd994daaf98681487e97458",
  name: "createUserAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => createUserAdmin.__executeServer(opts));
const createUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => CreateUserSchema.parse(d)).handler(createUserAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    admin,
    caller
  } = await requireDiretor();
  const {
    data: created,
    error: createErr
  } = await admin.auth.admin.createUser({
    email: data.email,
    password: data.password,
    email_confirm: true,
    user_metadata: {
      nome: data.nome
    }
  });
  if (createErr || !created.user) throw new Error(createErr?.message ?? "Falha ao criar usuário.");
  const {
    error: updErr
  } = await admin.from("profiles").update({
    nome: data.nome,
    perfil: data.perfil,
    funcionario_id: data.funcionarioId ?? null,
    ativo: true
  }).eq("id", created.user.id);
  if (updErr) {
    await admin.auth.admin.deleteUser(created.user.id);
    throw new Error(`Falha ao definir perfil: ${updErr.message}`);
  }
  await pushLog(admin, caller.nome, "Usuário criado", `${data.email} (${data.perfil})`);
  return {
    id: created.user.id
  };
});
const updateUserAdmin_createServerFn_handler = createServerRpc({
  id: "1488ab94b720d23d643ff391ad38a7cf995eb4e8a7b4f8b667f182ee3d2a6b89",
  name: "updateUserAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => updateUserAdmin.__executeServer(opts));
const updateUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => UpdateUserSchema.parse(d)).handler(updateUserAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    admin,
    caller
  } = await requireDiretor();
  const patch = {};
  if (data.nome !== void 0) patch.nome = data.nome;
  if (data.perfil !== void 0) patch.perfil = data.perfil;
  if (data.funcionarioId !== void 0) patch.funcionario_id = data.funcionarioId ?? null;
  if (data.ativo !== void 0) patch.ativo = data.ativo;
  const {
    error
  } = await admin.from("profiles").update(patch).eq("id", data.id);
  if (error) throw new Error(error.message);
  await pushLog(admin, caller.nome, "Usuário atualizado", `${data.id} ${JSON.stringify(patch)}`);
  return {
    ok: true
  };
});
const resetUserPasswordAdmin_createServerFn_handler = createServerRpc({
  id: "cbed3bc001639f3386c930d864651db0def7d2649be88f64adc927b681c1c0b9",
  name: "resetUserPasswordAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => resetUserPasswordAdmin.__executeServer(opts));
const resetUserPasswordAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => ResetSchema.parse(d)).handler(resetUserPasswordAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    admin,
    caller
  } = await requireDiretor();
  const {
    error
  } = await admin.auth.admin.updateUserById(data.id, {
    password: data.password
  });
  if (error) throw new Error(error.message);
  await pushLog(admin, caller.nome, "Senha redefinida", `user ${data.id}`);
  return {
    ok: true
  };
});
const deleteUserAdmin_createServerFn_handler = createServerRpc({
  id: "b038b7038b64255b64730d00c779b1e888cf7dc5f301274ff8e5fecae8ec0084",
  name: "deleteUserAdmin",
  filename: "src/lib/admin-users.functions.ts"
}, (opts) => deleteUserAdmin.__executeServer(opts));
const deleteUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => DeleteSchema.parse(d)).handler(deleteUserAdmin_createServerFn_handler, async ({
  data
}) => {
  const {
    admin,
    caller
  } = await requireDiretor();
  const {
    error
  } = await admin.auth.admin.deleteUser(data.id);
  if (error) throw new Error(error.message);
  await pushLog(admin, caller.nome, "Usuário excluído", data.id);
  return {
    ok: true
  };
});
export {
  createUserAdmin_createServerFn_handler,
  deleteUserAdmin_createServerFn_handler,
  listUsersAdmin_createServerFn_handler,
  resetUserPasswordAdmin_createServerFn_handler,
  updateUserAdmin_createServerFn_handler
};
