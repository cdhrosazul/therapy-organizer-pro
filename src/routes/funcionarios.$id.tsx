import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { getFuncionario, removeFuncionario, saveFuncionario } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import type { Funcionario, Especialidade } from "@/types";
import { especialidades } from "@/mocks/data";
import { calcularIdade } from "@/lib/format";
import { Upload, X, Save, ArrowLeft, Trash2 } from "lucide-react";
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


export const Route = createFileRoute("/funcionarios/$id")({
  head: () => ({ meta: [{ title: "Funcionário — Centro de Desenv" }] }),
  component: FuncForm,
});

const empty: Funcionario = {
  id: "",
  nome: "",
  dataNascimento: "",
  cpf: "",
  rg: "",
  endereco: "",
  telefone: "",
  cargo: "",
  especialidade: undefined,
  salario: 0,
  escala: "Seg-Sex",
  horarioEntrada: "08:00",
  horarioSaida: "17:00",
  status: "ativo",
  documentos: [],
};

function FuncForm() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "novo";
  const [f, setF] = useState<Funcionario>(empty);
  const [tab, setTab] = useState<"dados" | "documentos">("dados");
  const [confirmDel, setConfirmDel] = useState(false);

  useEffect(() => {
    if (isNew) {
      setF(empty);
      return;
    }
    getFuncionario(id).then((res) => res && setF(res));
  }, [id, isNew]);

  async function handleSave() {
    await saveFuncionario(f);
    navigate({ to: "/funcionarios" });
  }

  async function handleDelete() {
    await removeFuncionario(f.id);
    navigate({ to: "/funcionarios" });
  }


  function handleFiles(tipo: string, files: FileList | null) {
    if (!files) return;
    const novos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      tipo,
      nomeArquivo: file.name,
      tamanho: file.size,
      criadoEm: new Date().toISOString(),
    }));
    setF((prev) => ({ ...prev, documentos: [...prev.documentos, ...novos] }));
  }

  return (
    <div>
      <button onClick={() => navigate({ to: "/funcionarios" })} className="text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1">
        <ArrowLeft className="size-4" /> Voltar
      </button>
      <PageHeader
        title={isNew ? "Novo funcionário" : f.nome || "Funcionário"}
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
              className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
            >
              {t === "dados" ? "Dados" : "Documentos"}
            </button>
          ))}
        </div>

        {tab === "dados" && (
          <div className="p-6 grid md:grid-cols-2 gap-4">
            <F label="Nome completo" full>
              <input className={inp} value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} />
            </F>
            <F label="Data de nascimento">
              <input type="date" className={inp} value={f.dataNascimento} onChange={(e) => setF({ ...f, dataNascimento: e.target.value })} />
            </F>
            <F label="Idade">
              <input className={`${inp} bg-muted`} readOnly value={f.dataNascimento ? `${calcularIdade(f.dataNascimento)} anos` : ""} />
            </F>
            <F label="CPF">
              <input className={inp} value={f.cpf} onChange={(e) => setF({ ...f, cpf: e.target.value })} />
            </F>
            <F label="RG">
              <input className={inp} value={f.rg} onChange={(e) => setF({ ...f, rg: e.target.value })} />
            </F>
            <F label="Telefone">
              <input className={inp} value={f.telefone} onChange={(e) => setF({ ...f, telefone: e.target.value })} />
            </F>
            <F label="Endereço" full>
              <input className={inp} value={f.endereco} onChange={(e) => setF({ ...f, endereco: e.target.value })} />
            </F>
            <F label="Cargo">
              <input className={inp} value={f.cargo} onChange={(e) => setF({ ...f, cargo: e.target.value })} />
            </F>
            <F label="Especialidade">
              <select className={inp} value={f.especialidade ?? ""} onChange={(e) => setF({ ...f, especialidade: (e.target.value || undefined) as Especialidade | undefined })}>
                <option value="">— Nenhuma —</option>
                {especialidades.map((esp) => <option key={esp}>{esp}</option>)}
              </select>
            </F>
            <F label="Salário (R$)">
              <input type="number" className={inp} value={f.salario} onChange={(e) => setF({ ...f, salario: Number(e.target.value) })} />
            </F>
            <F label="Escala">
              <input className={inp} value={f.escala} onChange={(e) => setF({ ...f, escala: e.target.value })} />
            </F>
            <F label="Horário entrada">
              <input type="time" className={inp} value={f.horarioEntrada} onChange={(e) => setF({ ...f, horarioEntrada: e.target.value })} />
            </F>
            <F label="Horário saída">
              <input type="time" className={inp} value={f.horarioSaida} onChange={(e) => setF({ ...f, horarioSaida: e.target.value })} />
            </F>
            <F label="Status">
              <select className={inp} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as Funcionario["status"] })}>
                <option value="ativo">Ativo</option>
                <option value="ferias">Férias</option>
                <option value="inativo">Inativo</option>
              </select>
            </F>
          </div>
        )}

        {tab === "documentos" && (
          <div className="p-6 space-y-5">
            {["RG", "CPF", "Comprovante de residência", "Diploma", "Certificados", "Contrato de trabalho", "Currículo", "Foto"].map((tipo) => {
              const docs = f.documentos.filter((d) => d.tipo === tipo);
              return (
                <div key={tipo}>
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">{tipo}</p>
                    <label className="inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 cursor-pointer hover:bg-accent">
                      <Upload className="size-3" /> Enviar
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={(e) => handleFiles(tipo, e.target.files)} />
                    </label>
                  </div>
                  {docs.length === 0 ? (
                    <p className="text-xs text-muted-foreground">Nenhum arquivo.</p>
                  ) : (
                    <ul className="space-y-1">
                      {docs.map((d) => (
                        <li key={d.id} className="flex items-center justify-between rounded border px-3 py-2 text-sm">
                          <span className="truncate">{d.nomeArquivo}</span>
                          <button onClick={() => setF((prev) => ({ ...prev, documentos: prev.documentos.filter((x) => x.id !== d.id) }))} className="text-muted-foreground hover:text-destructive">
                            <X className="size-4" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const inp = "w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";

function F({ label, children, full }: { label: string; children: React.ReactNode; full?: boolean }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}
