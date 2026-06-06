import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import {
  listUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  resetUserPasswordAdmin,
  deleteUserAdmin,
} from "@/lib/admin-users.functions";
import { listFuncionarios } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { PERFIL_LABEL } from "@/lib/permissions";
import { useAuth } from "@/lib/auth";
import type { Perfil } from "@/types";
import { Plus, KeyRound, X, Trash2, Power } from "lucide-react";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — Centro de Desenvolvimento Humano Rosazul" }] }),
  component: UsuariosPage,
});

interface NovoForm {
  email: string;
  password: string;
  nome: string;
  perfil: Perfil;
  funcionarioId: string;
}

function UsuariosPage() {
  const qc = useQueryClient();
  const { session } = useAuth();

  const listFn = useServerFn(listUsersAdmin);
  const createFn = useServerFn(createUserAdmin);
  const updateFn = useServerFn(updateUserAdmin);
  const resetFn = useServerFn(resetUserPasswordAdmin);
  const deleteFn = useServerFn(deleteUserAdmin);

  const q = useQuery({
    queryKey: ["usuarios-admin"],
    queryFn: () => listFn(),
    enabled: session?.perfil === "diretor",
  });
  const funcs = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });

  const [novo, setNovo] = useState<NovoForm | null>(null);
  const [resetFor, setResetFor] = useState<{ id: string; email: string } | null>(null);
  const [resetPwd, setResetPwd] = useState("");

  const invalidate = () => qc.invalidateQueries({ queryKey: ["usuarios-admin"] });

  const createM = useMutation({
    mutationFn: (input: NovoForm) =>
      createFn({
        data: {
          email: input.email,
          password: input.password,
          nome: input.nome,
          perfil: input.perfil,
          funcionarioId: input.funcionarioId || null,
        },
      }),
    onSuccess: () => {
      invalidate();
      setNovo(null);
    },
  });

  const toggleM = useMutation({
    mutationFn: (u: { id: string; ativo: boolean }) =>
      updateFn({ data: { id: u.id, ativo: !u.ativo } }),
    onSuccess: invalidate,
  });

  const deleteM = useMutation({
    mutationFn: (id: string) => deleteFn({ data: { id } }),
    onSuccess: invalidate,
  });

  const resetM = useMutation({
    mutationFn: (input: { id: string; password: string }) => resetFn({ data: input }),
    onSuccess: () => {
      setResetFor(null);
      setResetPwd("");
    },
  });

  if (session?.perfil !== "diretor") {
    return (
      <div>
        <PageHeader title="Usuários" />
        <div className="rounded-2xl border bg-card p-6 text-sm text-muted-foreground">
          Apenas o Diretor pode acessar a gestão de usuários.
        </div>
      </div>
    );
  }

  const lista = q.data ?? [];
  const funcionarios = funcs.data ?? [];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Crie, ative/desative e redefina senhas dos usuários do sistema."
        actions={
          <button
            onClick={() =>
              setNovo({ email: "", password: "", nome: "", perfil: "recepcao", funcionarioId: "" })
            }
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Novo usuário
          </button>
        }
      />

      {q.isLoading && <p className="text-sm text-muted-foreground">Carregando…</p>}
      {q.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {(q.error as Error).message}
        </div>
      )}

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Email</th>
              <th className="p-3">Perfil</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lista.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40">
                <td className="p-3 font-medium">{u.nome || "—"}</td>
                <td className="p-3 text-muted-foreground">{u.usuario}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium">
                    {PERFIL_LABEL[u.perfil]}
                  </span>
                </td>
                <td className="p-3">
                  <span className={`text-xs ${u.ativo ? "text-success" : "text-muted-foreground"}`}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3 text-right space-x-1">
                  <button
                    onClick={() => setResetFor({ id: u.id, email: u.usuario })}
                    className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-accent"
                  >
                    <KeyRound className="size-3" /> Senha
                  </button>
                  <button
                    onClick={() => toggleM.mutate({ id: u.id, ativo: u.ativo })}
                    disabled={u.id === session.userId}
                    className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-accent disabled:opacity-40"
                  >
                    <Power className="size-3" /> {u.ativo ? "Desativar" : "Ativar"}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Excluir usuário ${u.usuario}?`)) deleteM.mutate(u.id);
                    }}
                    disabled={u.id === session.userId}
                    className="inline-flex items-center gap-1 text-xs rounded-md border border-destructive/40 text-destructive px-2 py-1 hover:bg-destructive/10 disabled:opacity-40"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </td>
              </tr>
            ))}
            {!q.isLoading && lista.length === 0 && (
              <tr><td colSpan={5} className="p-6 text-center text-muted-foreground text-sm">Nenhum usuário.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {novo && (
        <Modal title="Novo usuário" onClose={() => setNovo(null)}>
          <div className="p-5 space-y-3">
            <Field label="Nome">
              <input className={inp} value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
            </Field>
            <Field label="Email">
              <input type="email" className={inp} value={novo.email} onChange={(e) => setNovo({ ...novo, email: e.target.value })} />
            </Field>
            <Field label="Senha (mín. 6)">
              <input type="text" className={inp} value={novo.password} onChange={(e) => setNovo({ ...novo, password: e.target.value })} />
            </Field>
            <Field label="Perfil">
              <select className={inp} value={novo.perfil} onChange={(e) => setNovo({ ...novo, perfil: e.target.value as Perfil })}>
                <option value="diretor">Diretor</option>
                <option value="administrativo">Administrativo</option>
                <option value="recepcao">Recepção</option>
                <option value="terapeuta">Terapeuta</option>
              </select>
            </Field>
            {novo.perfil === "terapeuta" && (
              <Field label="Funcionário vinculado (terapeuta)">
                <select className={inp} value={novo.funcionarioId} onChange={(e) => setNovo({ ...novo, funcionarioId: e.target.value })}>
                  <option value="">— selecione —</option>
                  {funcionarios.map((f) => (
                    <option key={f.id} value={f.id}>{f.nome}</option>
                  ))}
                </select>
              </Field>
            )}
            {createM.error && (
              <p className="text-sm text-destructive">{(createM.error as Error).message}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t bg-muted/30">
            <button onClick={() => setNovo(null)} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
            <button
              disabled={createM.isPending}
              onClick={() => createM.mutate(novo)}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {createM.isPending ? "Criando…" : "Criar"}
            </button>
          </div>
        </Modal>
      )}

      {resetFor && (
        <Modal title={`Redefinir senha — ${resetFor.email}`} onClose={() => setResetFor(null)}>
          <div className="p-5 space-y-3">
            <Field label="Nova senha (mín. 6)">
              <input type="text" className={inp} value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} />
            </Field>
            {resetM.error && <p className="text-sm text-destructive">{(resetM.error as Error).message}</p>}
          </div>
          <div className="flex justify-end gap-2 px-5 py-4 border-t bg-muted/30">
            <button onClick={() => setResetFor(null)} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
            <button
              disabled={resetM.isPending || resetPwd.length < 6}
              onClick={() => resetM.mutate({ id: resetFor.id, password: resetPwd })}
              className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60"
            >
              {resetM.isPending ? "Salvando…" : "Salvar"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inp = "w-full h-10 rounded-md border bg-card px-3 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium mb-1.5 block">{label}</label>{children}</div>;
}
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button onClick={onClose} className="p-2 rounded hover:bg-accent"><X className="size-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
