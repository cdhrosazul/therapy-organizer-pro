import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listAnotacoes, listAtendimentos, listPacientes, removeAnotacao, saveAnotacao } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import type { Anotacao } from "@/types";
import { Plus, Trash2, Pencil, Save, X, Search } from "lucide-react";
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

export const Route = createFileRoute("/anotacoes")({
  head: () => ({ meta: [{ title: "Anotações — Centro de Desenvolvimento Humano Rosazul" }] }),
  component: AnotacoesPage,
});

function AnotacoesPage() {
  const { session } = useAuth();
  const qc = useQueryClient();
  const isTerapeuta = session?.perfil === "terapeuta";
  const podeEditarTodas = session?.perfil === "diretor";

  const pacQuery = useQuery({ queryKey: ["pacientes:lista"], queryFn: () => listPacientes() });
  const atQuery = useQuery({
    queryKey: ["atendimentos:terapeuta", session?.funcionarioId ?? ""],
    queryFn: () => listAtendimentos({ terapeutaId: session?.funcionarioId }),
    enabled: isTerapeuta && !!session?.funcionarioId,
  });

  const pacientesVisiveis = useMemo(() => {
    const todos = pacQuery.data ?? [];
    if (!isTerapeuta) return todos;
    const ids = new Set((atQuery.data ?? []).map((a) => a.pacienteId));
    return todos.filter((p) => ids.has(p.id));
  }, [pacQuery.data, atQuery.data, isTerapeuta]);

  const pacIds = useMemo(() => pacientesVisiveis.map((p) => p.id), [pacientesVisiveis]);

  const anotQuery = useQuery({
    queryKey: ["anotacoes", isTerapeuta ? pacIds.join(",") : "todas"],
    queryFn: () => (isTerapeuta ? listAnotacoes({ pacienteIds: pacIds }) : listAnotacoes()),
    enabled: !isTerapeuta || pacIds.length >= 0,
  });

  const [filtroPaciente, setFiltroPaciente] = useState<string>("todos");
  const [busca, setBusca] = useState("");
  const [editing, setEditing] = useState<Anotacao | null>(null);
  const [creating, setCreating] = useState(false);
  const [confirmDel, setConfirmDel] = useState<Anotacao | null>(null);

  const saveMut = useMutation({
    mutationFn: (a: Anotacao) => saveAnotacao(a, session?.usuario ?? "admin", session?.nome ?? "—"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["anotacoes"] });
      setEditing(null);
      setCreating(false);
    },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => removeAnotacao(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["anotacoes"] });
      setConfirmDel(null);
    },
  });

  const lista = (anotQuery.data ?? []).filter((n) => {
    if (filtroPaciente !== "todos" && n.pacienteId !== filtroPaciente) return false;
    if (busca.trim() && !n.texto.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });

  const pacNome = (id: string) => pacientesVisiveis.find((p) => p.id === id)?.nome ?? "—";
  const podeEditar = (n: Anotacao) => podeEditarTodas || n.autor === session?.usuario;

  return (
    <div>
      <PageHeader
        title="Anotações"
        description="Registros vinculados aos pacientes."
        actions={
          <button
            onClick={() => setCreating(true)}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Nova anotação
          </button>
        }
      />

      <div className="mb-4 grid gap-3 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            placeholder="Buscar no texto..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full h-10 rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <select
          value={filtroPaciente}
          onChange={(e) => setFiltroPaciente(e.target.value)}
          className="h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="todos">Todos os pacientes</option>
          {pacientesVisiveis.map((p) => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border bg-card divide-y">
        {lista.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">Nenhuma anotação.</div>
        ) : (
          lista.map((n) => (
            <div key={n.id} className="p-4 group">
              <div className="flex items-start justify-between gap-3 mb-1">
                <div className="min-w-0">
                  <p className="text-sm font-semibold truncate">{pacNome(n.pacienteId)}</p>
                  <p className="text-xs text-muted-foreground">
                    {n.autorNome} · {new Date(n.data).toLocaleString("pt-BR")}
                  </p>
                </div>
                {podeEditar(n) && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(n)}
                      className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground"
                      aria-label="Editar"
                    >
                      <Pencil className="size-4" />
                    </button>
                    <button
                      onClick={() => setConfirmDel(n)}
                      className="p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      aria-label="Excluir"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-sm whitespace-pre-wrap">{n.texto}</p>
            </div>
          ))
        )}
      </div>

      {(creating || editing) && (
        <AnotacaoModal
          initial={editing}
          pacientes={pacientesVisiveis.map((p) => ({ id: p.id, nome: p.nome }))}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSave={(payload) => saveMut.mutate(payload)}
          saving={saveMut.isPending}
        />
      )}

      <AlertDialog open={!!confirmDel} onOpenChange={(o) => !o && setConfirmDel(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir anotação?</AlertDialogTitle>
            <AlertDialogDescription>Esta ação não pode ser desfeita.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDel && delMut.mutate(confirmDel.id)}
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

function AnotacaoModal({
  initial,
  pacientes,
  onCancel,
  onSave,
  saving,
}: {
  initial: Anotacao | null;
  pacientes: { id: string; nome: string }[];
  onCancel: () => void;
  onSave: (a: Anotacao) => void;
  saving: boolean;
}) {
  const [pacienteId, setPacienteId] = useState(initial?.pacienteId ?? pacientes[0]?.id ?? "");
  const [texto, setTexto] = useState(initial?.texto ?? "");

  function submit() {
    if (!pacienteId || !texto.trim()) return;
    onSave({
      id: initial?.id ?? "",
      pacienteId,
      autor: initial?.autor ?? "",
      autorNome: initial?.autorNome ?? "",
      data: initial?.data ?? "",
      texto: texto.trim(),
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div className="w-full max-w-lg rounded-2xl bg-card p-5 shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{initial ? "Editar anotação" : "Nova anotação"}</h2>
          <button onClick={onCancel} className="p-1 rounded hover:bg-accent"><X className="size-4" /></button>
        </div>
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Paciente</label>
            <select
              disabled={!!initial}
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              className="w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60"
            >
              {pacientes.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Anotação</label>
            <textarea
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              rows={6}
              className="w-full rounded-md border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Escreva sua anotação..."
            />
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Cancelar</button>
          <button
            onClick={submit}
            disabled={saving || !pacienteId || !texto.trim()}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Save className="size-4" /> Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
