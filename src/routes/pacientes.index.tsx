import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { buscarPacientes, removePaciente } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { Search, Plus, ChevronRight, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/pacientes/")({
  head: () => ({ meta: [{ title: "Pacientes — Escola Rosazul" }] }),
  component: PacientesList,
});

function PacientesList() {
  const [termo, setTermo] = useState("");
  const [confirm, setConfirm] = useState<{ id: string; nome: string } | null>(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({ queryKey: ["pacientes:buscar", termo], queryFn: () => buscarPacientes(termo) });
  const lista = q.data ?? [];

  const del = useMutation({
    mutationFn: (id: string) => removePaciente(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pacientes:buscar"] });
      qc.invalidateQueries({ queryKey: ["pacientes"] });
      qc.invalidateQueries({ queryKey: ["atendimentos"] });
      setConfirm(null);
    },
  });

  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Cadastro centralizado, busca rápida por nome."
        actions={
          <button
            onClick={() => navigate({ to: "/pacientes/novo" })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Novo paciente
          </button>
        }
      />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar por nome…"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="w-full h-11 rounded-lg border bg-card pl-10 pr-3 text-sm"
            />
          </div>
        </div>
        <ul className="divide-y">
          {lista.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">Nenhum paciente.</li>}
          {lista.map((p) => (
            <li key={p.id} className="group relative">
              <Link
                to="/pacientes/$id"
                params={{ id: p.id }}
                className="flex items-center gap-4 p-4 pr-20 hover:bg-accent/40 transition-colors"
              >
                <div className="size-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                  {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.convenio} · {p.terapias.join(", ")}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
              <button
                type="button"
                aria-label={`Excluir ${p.nome}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setConfirm({ id: p.id, nome: p.nome });
                }}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {confirm?.nome}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove o paciente e todos os horários fixos vinculados. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirm && del.mutate(confirm.id)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
