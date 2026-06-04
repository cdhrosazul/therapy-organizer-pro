import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  listAtendimentos,
  listFuncionarios,
  listPacientes,
  saveAtendimento,
  removeAtendimento,
} from "@/services";
import type { Atendimento, Especialidade } from "@/types";
import { hojeISO, slotsHorarios } from "@/lib/format";
import { PageHeader } from "@/components/layout/AppShell";
import { useAuth } from "@/lib/auth";
import { podeEditarAgenda } from "@/lib/permissions";
import { especialidades } from "@/mocks/data";
import { Plus, Trash2, X } from "lucide-react";

export const Route = createFileRoute("/agenda")({
  head: () => ({ meta: [{ title: "Agenda — Escola Rosazul" }] }),
  component: AgendaPage,
});

function AgendaPage() {
  const { session } = useAuth();
  const podeEditar = session ? podeEditarAgenda(session.perfil) : false;
  const [data, setData] = useState(hojeISO());
  const qc = useQueryClient();

  const atQuery = useQuery({ queryKey: ["atendimentos", data], queryFn: () => listAtendimentos({ data }) });
  const funcQuery = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });
  const pacQuery = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });

  const terapeutas = (funcQuery.data ?? []).filter((f) => !!f.especialidade);
  const atendimentos = atQuery.data ?? [];
  const pacMap = new Map((pacQuery.data ?? []).map((p) => [p.id, p]));

  const slots = slotsHorarios();

  const [modal, setModal] = useState<{ hora: string; terapeutaId: string; editar?: Atendimento } | null>(null);

  return (
    <div>
      <PageHeader
        title="Agenda"
        description="Grade de atendimentos. Slots de 30 min · 08:00–12:00 · 13:00–17:00"
        actions={
          <input
            type="date"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="h-10 rounded-md border bg-card px-3 text-sm"
          />
        }
      />

      <div className="rounded-2xl border bg-card overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 bg-muted/50 z-10">
            <tr>
              <th className="text-left p-3 border-b w-20">Horário</th>
              {terapeutas.map((t) => (
                <th key={t.id} className="text-left p-3 border-b min-w-[180px]">
                  <p className="font-semibold">{t.nome.split(" ").slice(0, 2).join(" ")}</p>
                  <p className="text-xs text-muted-foreground font-normal">{t.especialidade}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((hora, idx) => {
              const isLastBeforeLunch = hora === "11:30";
              return (
                <>
                  <tr key={hora} className="hover:bg-accent/20">
                    <td className="p-2 border-b border-r font-semibold text-muted-foreground align-top">{hora}</td>
                    {terapeutas.map((t) => {
                      const at = atendimentos.find((a) => a.hora === hora && a.terapeutaId === t.id);
                      const pac = at ? pacMap.get(at.pacienteId) : undefined;
                      const toneBg = at
                        ? at.status === "presente"
                          ? "bg-success/10 border-success/30"
                          : at.status === "concluido"
                          ? "bg-info/10 border-info/30"
                          : at.status === "faltou"
                          ? "bg-destructive/10 border-destructive/30"
                          : "bg-primary-soft border-primary/20"
                        : "bg-card hover:bg-accent/30";
                      return (
                        <td key={t.id} className="p-1 border-b align-top">
                          <button
                            onClick={() => {
                              if (!podeEditar && !at) return;
                              setModal({ hora, terapeutaId: t.id, editar: at });
                            }}
                            disabled={!podeEditar && !at}
                            className={`w-full text-left rounded-md border p-2 min-h-[58px] transition-colors ${toneBg} ${podeEditar || at ? "cursor-pointer" : "cursor-default"}`}
                          >
                            {at ? (
                              <>
                                <p className="font-medium leading-tight truncate">{pac?.nome ?? "Paciente"}</p>
                                <p className="text-xs text-muted-foreground truncate">{at.terapia}</p>
                              </>
                            ) : (
                              podeEditar && <span className="text-xs text-muted-foreground inline-flex items-center gap-1"><Plus className="size-3" /> Agendar</span>
                            )}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                  {isLastBeforeLunch && (
                    <tr key="lunch">
                      <td colSpan={terapeutas.length + 1} className="p-3 text-center text-xs font-semibold text-muted-foreground bg-muted/40 border-b">
                        🍽️ Intervalo · 12:00 — 13:00
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>
      </div>

      {modal && (
        <AppointmentModal
          data={data}
          hora={modal.hora}
          terapeutaId={modal.terapeutaId}
          editar={modal.editar}
          pacientes={pacQuery.data ?? []}
          podeEditar={podeEditar}
          onClose={() => setModal(null)}
          onSaved={async () => {
            await qc.invalidateQueries({ queryKey: ["atendimentos", data] });
            setModal(null);
          }}
        />
      )}
    </div>
  );
}

function AppointmentModal({
  data,
  hora,
  terapeutaId,
  editar,
  pacientes,
  podeEditar,
  onClose,
  onSaved,
}: {
  data: string;
  hora: string;
  terapeutaId: string;
  editar?: Atendimento;
  pacientes: { id: string; nome: string; terapias: Especialidade[] }[];
  podeEditar: boolean;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [pacienteId, setPacienteId] = useState(editar?.pacienteId ?? "");
  const [terapia, setTerapia] = useState<Especialidade>(editar?.terapia ?? especialidades[0]);

  async function handleSave() {
    if (!pacienteId) return;
    await saveAtendimento({
      id: editar?.id ?? "",
      data,
      hora,
      pacienteId,
      terapeutaId,
      terapia,
      status: editar?.status ?? "agendado",
    });
    onSaved();
  }
  async function handleDelete() {
    if (!editar) return;
    await removeAtendimento(editar.id);
    onSaved();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h3 className="font-semibold">{editar ? "Editar atendimento" : "Novo atendimento"}</h3>
            <p className="text-xs text-muted-foreground">{data} · {hora}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-accent"><X className="size-4" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Paciente</label>
            <select
              value={pacienteId}
              onChange={(e) => setPacienteId(e.target.value)}
              disabled={!podeEditar}
              className="w-full h-10 rounded-md border bg-card px-3 text-sm"
            >
              <option value="">Selecione…</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Terapia</label>
            <select
              value={terapia}
              onChange={(e) => setTerapia(e.target.value as Especialidade)}
              disabled={!podeEditar}
              className="w-full h-10 rounded-md border bg-card px-3 text-sm"
            >
              {especialidades.map((e) => <option key={e} value={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 px-5 py-4 border-t bg-muted/30 rounded-b-2xl">
          {editar && podeEditar ? (
            <button onClick={handleDelete} className="inline-flex items-center gap-1 text-sm text-destructive hover:underline">
              <Trash2 className="size-4" /> Remover
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
            {podeEditar && (
              <button onClick={handleSave} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
                Salvar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
