import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getPaciente, savePaciente } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import type { Paciente, Especialidade } from "@/types";
import { convenios, especialidades } from "@/mocks/data";
import { Upload, X, Save, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/pacientes/$id")({
  head: () => ({ meta: [{ title: "Paciente — Escola Rosazul" }] }),
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
  const isNew = id === "novo";
  const [p, setP] = useState<Paciente>(empty);
  const [tab, setTab] = useState<"dados" | "documentos">("dados");

  useEffect(() => {
    if (isNew) {
      setP(empty);
      return;
    }
    getPaciente(id).then((res) => res && setP(res));
  }, [id, isNew]);

  function toggleTerapia(e: Especialidade) {
    setP((prev) => ({
      ...prev,
      terapias: prev.terapias.includes(e) ? prev.terapias.filter((t) => t !== e) : [...prev.terapias, e],
    }));
  }

  async function handleSave() {
    await savePaciente(p);
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
          <button onClick={handleSave} className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
            <Save className="size-4" /> Salvar
          </button>
        }
      />

      <div className="rounded-2xl border bg-card">
        <div className="flex gap-1 border-b px-4 pt-3">
          {(["dados", "documentos"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "dados" ? "Dados" : "Documentos"}
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
              <div className="flex flex-wrap gap-2">
                {especialidades.map((e) => {
                  const on = p.terapias.includes(e);
                  return (
                    <button
                      key={e}
                      type="button"
                      onClick={() => toggleTerapia(e)}
                      className={`rounded-full px-3 py-1.5 text-sm border transition-colors ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}
                    >
                      {e}
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
      </div>
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
