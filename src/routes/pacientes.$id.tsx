import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getPaciente, listAnotacoes, listAtendimentos, removeAnotacao, removePaciente, saveAnotacao, savePaciente } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { TerapiaScheduleModal } from "@/components/TerapiaScheduleModal";
import { useAuth } from "@/lib/auth";
import type { Anotacao, Paciente, Especialidade } from "@/types";
import { convenios, especialidades } from "@/mocks/data";
import { Upload, X, Save, ArrowLeft, CalendarClock, Trash2, Plus, Pencil } from "lucide-react";

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

export const Route = createFileRoute("/pacientes/$id")({
  head: () => ({ meta: [{ title: "Paciente — Centro de Desenvolvimento Humano Rosazul" }] }),
  component: PacienteForm,
});

const empty: Paciente = {
  id: "",
  nome: "",
  endereco: "",
  telefone: "",
  convenio: "Particular",
  terapias: [],
  documentos: [],
};

function PacienteForm() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "novo";
  const [p, setP] = useState<Paciente>(empty);
  const [tab, setTab] = useState<"dados" | "documentos" | "anotacoes">("dados");
  const [terapiaModal, setTerapiaModal] = useState<Especialidade | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);

  const atQuery = useQuery({
    queryKey: ["atendimentos:paciente", p.id],
    queryFn: () => listAtendimentos({ pacienteId: p.id }),
    enabled: !!p.id && !isNew,
  });
  const atendimentos = atQuery.data ?? [];

  useEffect(() => {
    if (isNew) {
      setP(empty);
      return;
    }
    getPaciente(id).then((res) => res && setP(res));
  }, [id, isNew]);

  function handleTerapiaClick(e: Especialidade) {
    if (isNew) {
      // No paciente novo, toggle simples — salva primeiro para depois agendar.
      setP((prev) => ({
        ...prev,
        terapias: prev.terapias.includes(e) ? prev.terapias.filter((t) => t !== e) : [...prev.terapias, e],
      }));
      return;
    }
    setTerapiaModal(e);
  }

  async function handleSave() {
    await savePaciente(p);
    navigate({ to: "/pacientes" });
  }

  async function handleDelete() {
    await removePaciente(p.id);
    await qc.invalidateQueries({ queryKey: ["pacientes:buscar"] });
    await qc.invalidateQueries({ queryKey: ["atendimentos"] });
    navigate({ to: "/pacientes" });
  }


  function handleFiles(tipo: string, files: FileList | null) {
    if (!files) return;
    const novos = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      tipo,
      nomeArquivo: f.name,
      tamanho: f.size,
      criadoEm: new Date().toISOString(),
    }));
    setP((prev) => ({ ...prev, documentos: [...prev.documentos, ...novos] }));
  }

  function removeDoc(id: string) {
    setP((prev) => ({ ...prev, documentos: prev.documentos.filter((d) => d.id !== id) }));
  }

  return (
    <div>
      <button onClick={() => navigate({ to: "/pacientes" })} className="text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1">
        <ArrowLeft className="size-4" /> Voltar
      </button>
      <PageHeader
        title={isNew ? "Novo paciente" : p.nome || "Paciente"}
        actions={
          <div className="flex items-center gap-2">
            {!isNew && (
              <button
                onClick={() => setConfirmDel(true)}
                className="inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4" /> Excluir
              </button>
            )}
            <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
              <Save className="size-4" /> Salvar
            </button>
          </div>
        }
      />

      <div className="rounded-2xl border bg-card">
        <div className="flex gap-1 border-b px-4 pt-3">
          {(["dados", "documentos", "anotacoes"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "dados" ? "Dados" : t === "documentos" ? "Documentos" : "Anotações"}
            </button>
          ))}
        </div>


        {tab === "dados" && (
          <div className="p-6 grid md:grid-cols-2 gap-4">
            <Field label="Nome completo" full>
              <input className={inputCls} value={p.nome} onChange={(e) => setP({ ...p, nome: e.target.value })} />
            </Field>
            <Field label="Telefone">
              <input className={inputCls} value={p.telefone} onChange={(e) => setP({ ...p, telefone: e.target.value })} />
            </Field>
            <Field label="Convênio">
              <select className={inputCls} value={p.convenio} onChange={(e) => setP({ ...p, convenio: e.target.value })}>
                {convenios.map((c) => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Endereço" full>
              <input className={inputCls} value={p.endereco} onChange={(e) => setP({ ...p, endereco: e.target.value })} />
            </Field>
            <Field label="Responsável">
              <input className={inputCls} value={p.responsavel ?? ""} onChange={(e) => setP({ ...p, responsavel: e.target.value })} />
            </Field>
            <Field label="Data de nascimento">
              <input type="date" className={inputCls} value={p.dataNascimento ?? ""} onChange={(e) => setP({ ...p, dataNascimento: e.target.value })} />
            </Field>
            <div className="md:col-span-2">
              <label className="text-sm font-medium mb-2 block">Terapias vinculadas</label>
              {!isNew && (
                <p className="text-xs text-muted-foreground mb-3 inline-flex items-center gap-1">
                  <CalendarClock className="size-3" /> Clique em uma terapia para definir os horários fixos na agenda.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {especialidades.map((e) => {
                  const on = p.terapias.includes(e);
                  const count = atendimentos.filter((a) => a.terapia === e).length;
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => handleTerapiaClick(e)}
                      className={`rounded-full px-3 py-1.5 text-sm border transition-colors inline-flex items-center gap-1.5 ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}
                    >
                      {e}
                      {on && count > 0 && (
                        <span className="inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-primary-foreground/20 text-[10px] font-bold px-1.5">
                          {count}x
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {tab === "documentos" && (
          <div className="p-6 space-y-5">
            {["Documento pessoal", "Carteirinha do convênio", "Laudo médico", "Relatório terapêutico", "Encaminhamento", "Outros"].map((tipo) => (
              <DocSection key={tipo} tipo={tipo} docs={p.documentos.filter((d) => d.tipo === tipo)} onUpload={(f) => handleFiles(tipo, f)} onRemove={removeDoc} />
            ))}
          </div>
        )}

        {tab === "anotacoes" && !isNew && <AnotacoesSection pacienteId={p.id} />}
        {tab === "anotacoes" && isNew && (
          <div className="p-8 text-center text-sm text-muted-foreground">Salve o paciente antes de adicionar anotações.</div>
        )}
      </div>


      {terapiaModal && !isNew && (
        <TerapiaScheduleModal
          pacienteId={p.id}
          pacienteNome={p.nome || "paciente"}
          terapia={terapiaModal}
          onClose={() => setTerapiaModal(null)}
          onSaved={async () => {
            if (!p.terapias.includes(terapiaModal)) {
              const novo = { ...p, terapias: [...p.terapias, terapiaModal] };
              setP(novo);
              await savePaciente(novo);
            }
            await qc.invalidateQueries({ queryKey: ["atendimentos:paciente", p.id] });
            setTerapiaModal(null);
          }}
          onRemoveTerapia={async () => {
            const novo = { ...p, terapias: p.terapias.filter((t) => t !== terapiaModal) };
            setP(novo);
            await savePaciente(novo);
            await qc.invalidateQueries({ queryKey: ["atendimentos:paciente", p.id] });
            setTerapiaModal(null);
          }}
        />
      )}

      <AlertDialog open={confirmDel} onOpenChange={setConfirmDel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir {p.nome || "paciente"}?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação remove o paciente e todos os horários fixos vinculados. Não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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



const inputCls = "w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function Field({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function DocSection({ tipo, docs, onUpload, onRemove }: { tipo: string; docs: { id: string; nomeArquivo: string; tamanho: number }[]; onUpload: (f: FileList | null) => void; onRemove: (id: string) => void }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-semibold">{tipo}</p>
        <label className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 cursor-pointer hover:bg-accent">
          <Upload className="size-3" /> Enviar
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => onUpload(e.target.files)} />
        </label>
      </div>
      {docs.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhum arquivo.</p>
      ) : (
        <ul className="space-y-1">
          {docs.map((d) => (
            <li key={d.id} className="flex items-center justify-between gap-2 rounded border px-3 py-2 text-sm">
              <span className="truncate">{d.nomeArquivo}</span>
              <button onClick={() => onRemove(d.id)} className="text-muted-foreground hover:text-destructive"><X className="size-4" /></button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnotacoesSection({ pacienteId }: { pacienteId: string }) {
  const { session } = useAuth();
  const qc = useQueryClient();
  const podeEditarTodas = session?.perfil === "diretor";
  const { data } = useQuery({
    queryKey: ["anotacoes:paciente", pacienteId],
    queryFn: () => listAnotacoes({ pacienteId }),
  });
  const [texto, setTexto] = useState("");
  const [editing, setEditing] = useState<Anotacao | null>(null);
  const [confirmDel, setConfirmDel] = useState<Anotacao | null>(null);

  const inv = () => {
    qc.invalidateQueries({ queryKey: ["anotacoes:paciente", pacienteId] });
    qc.invalidateQueries({ queryKey: ["anotacoes"] });
  };

  const addMut = useMutation({
    mutationFn: () =>
      saveAnotacao(
        { id: "", pacienteId, autor: "", autorNome: "", data: "", texto: texto.trim() },
        session?.usuario ?? "admin",
        session?.nome ?? "—",
      ),
    onSuccess: () => {
      setTexto("");
      inv();
    },
  });
  const editMut = useMutation({
    mutationFn: (a: Anotacao) => saveAnotacao(a, session?.usuario ?? "admin", session?.nome ?? "—"),
    onSuccess: () => {
      setEditing(null);
      inv();
    },
  });
  const delMut = useMutation({
    mutationFn: (id: string) => removeAnotacao(id),
    onSuccess: () => {
      setConfirmDel(null);
      inv();
    },
  });

  const podeEditar = (n: Anotacao) => podeEditarTodas || n.autor === session?.usuario;
  const lista = data ?? [];

  return (
    <div className="p-6 space-y-4">
      <div className="rounded-lg border bg-background p-3">
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={3}
          placeholder="Nova anotação..."
          className="w-full rounded-md border bg-card p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-2 flex justify-end">
          <button
            onClick={() => addMut.mutate()}
            disabled={!texto.trim() || addMut.isPending}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <Plus className="size-4" /> Adicionar
          </button>
        </div>
      </div>

      {lista.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-6">Nenhuma anotação ainda.</p>
      ) : (
        <ul className="space-y-2">
          {lista.map((n) => (
            <li key={n.id} className="rounded-lg border p-3 group">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-xs text-muted-foreground">
                  {n.autorNome} · {new Date(n.data).toLocaleString("pt-BR")}
                </p>
                {podeEditar(n) && (
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(n)} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground"><Pencil className="size-3.5" /></button>
                    <button onClick={() => setConfirmDel(n)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"><Trash2 className="size-3.5" /></button>
                  </div>
                )}
              </div>
              {editing?.id === n.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editing.texto}
                    onChange={(e) => setEditing({ ...editing, texto: e.target.value })}
                    rows={3}
                    className="w-full rounded-md border bg-card p-2 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                  <div className="flex justify-end gap-2">
                    <button onClick={() => setEditing(null)} className="rounded-md border px-3 py-1 text-xs hover:bg-accent">Cancelar</button>
                    <button
                      onClick={() => editing.texto.trim() && editMut.mutate({ ...editing, texto: editing.texto.trim() })}
                      className="rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm whitespace-pre-wrap">{n.texto}</p>
              )}
            </li>
          ))}
        </ul>
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
