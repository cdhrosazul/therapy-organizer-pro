import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { listUsuarios, saveUsuario, redefinirSenha } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { PERFIL_LABEL } from "@/lib/permissions";
import type { Perfil, Usuario } from "@/types";
import { Plus, KeyRound, X } from "lucide-react";

export const Route = createFileRoute("/usuarios")({
  head: () => ({ meta: [{ title: "Usuários — Centro de Desenvolvimento Humano Rosazul" }] }),
  component: UsuariosPage,
});

function UsuariosPage() {
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["usuarios"], queryFn: listUsuarios });
  const [novo, setNovo] = useState<Usuario | null>(null);
  const lista = q.data ?? [];

  return (
    <div>
      <PageHeader
        title="Usuários"
        description="Apenas o Diretor pode criar usuários."
        actions={
          <button
            onClick={() => setNovo({ id: "", nome: "", usuario: "", perfil: "recepcao", ativo: true })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Novo usuário
          </button>
        }
      />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Nome</th>
              <th className="p-3">Usuário</th>
              <th className="p-3">Perfil</th>
              <th className="p-3">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lista.map((u) => (
              <tr key={u.id} className="hover:bg-accent/40">
                <td className="p-3 font-medium">{u.nome}</td>
                <td className="p-3 text-muted-foreground">{u.usuario}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium">{PERFIL_LABEL[u.perfil]}</span>
                </td>
                <td className="p-3">
                  <span className={`text-xs ${u.ativo ? "text-success" : "text-muted-foreground"}`}>
                    {u.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={async () => {
                      await redefinirSenha(u.usuario);
                      alert(`Senha do usuário "${u.usuario}" redefinida.`);
                    }}
                    className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-accent"
                  >
                    <KeyRound className="size-3" /> Redefinir senha
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {novo && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setNovo(null)}>
          <div className="bg-card rounded-2xl border w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-semibold">Novo usuário</h3>
              <button onClick={() => setNovo(null)} className="p-2 rounded hover:bg-accent"><X className="size-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <Field label="Nome">
                <input className={inp} value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} />
              </Field>
              <Field label="Usuário">
                <input className={inp} value={novo.usuario} onChange={(e) => setNovo({ ...novo, usuario: e.target.value })} />
              </Field>
              <Field label="Perfil">
                <select className={inp} value={novo.perfil} onChange={(e) => setNovo({ ...novo, perfil: e.target.value as Perfil })}>
                  <option value="diretor">Diretor</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="recepcao">Recepção</option>
                  <option value="terapeuta">Terapeuta</option>
                </select>
              </Field>
            </div>
            <div className="flex justify-end gap-2 px-5 py-4 border-t bg-muted/30">
              <button onClick={() => setNovo(null)} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
              <button
                onClick={async () => {
                  await saveUsuario(novo);
                  await qc.invalidateQueries({ queryKey: ["usuarios"] });
                  setNovo(null);
                }}
                className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold"
              >
                Criar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full h-10 rounded-md border bg-card px-3 text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-sm font-medium mb-1.5 block">{label}</label>{children}</div>;
}
