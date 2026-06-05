import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { listAtendimentos, listFuncionarios, listPacientes, removeAtendimento, saveAtendimento } from "@/services";
import type { Atendimento, DiaSemana, Especialidade } from "@/types";
import { DIAS_SEMANA, slotsHorarios } from "@/lib/format";
import { X, Plus, Trash2, AlertCircle, Calendar, Clock, User } from "lucide-react";

interface SlotDraft {
  id: string;
  atendimentoId?: string; // existente
  diaSemana: DiaSemana | "";
  hora: string;
  terapeutaId: string;
}

export function TerapiaScheduleModal({
  pacienteId,
  pacienteNome,
  terapia,
  onClose,
  onSaved,
  onRemoveTerapia,
}: {
  pacienteId: string;
  pacienteNome: string;
  terapia: Especialidade;
  onClose: () => void;
  onSaved: () => void;
  onRemoveTerapia?: () => void;
}) {
  const qc = useQueryClient();
  const funcQuery = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });
  const allAt = useQuery({ queryKey: ["atendimentos:all"], queryFn: () => listAtendimentos() });
  const pacQuery = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });

  const terapeutas = useMemo(
    () => (funcQuery.data ?? []).filter((f) => f.especialidade === terapia),
    [funcQuery.data, terapia],
  );
  const todos = allAt.data ?? [];
  const pacMap = useMemo(() => new Map((pacQuery.data ?? []).map((p) => [p.id, p])), [pacQuery.data]);

  // Slots existentes desta terapia para este paciente
  const existentes = useMemo(
    () => todos.filter((a) => a.pacienteId === pacienteId && a.terapia === terapia),
    [todos, pacienteId, terapia],
  );

  const [slots, setSlots] = useState<SlotDraft[]>([]);
  const [initialIds, setInitialIds] = useState<string[]>([]);

  useEffect(() => {
    if (allAt.isLoading || funcQuery.isLoading) return;
    if (existentes.length === 0) {
      setSlots([
        {
          id: crypto.randomUUID(),
          diaSemana: "",
          hora: "",
          terapeutaId: terapeutas[0]?.id ?? "",
        },
      ]);
      setInitialIds([]);
    } else {
      setSlots(
        existentes.map((a) => ({
          id: crypto.randomUUID(),
          atendimentoId: a.id,
          diaSemana: a.diaSemana,
          hora: a.hora,
          terapeutaId: a.terapeutaId,
        })),
      );
      setInitialIds(existentes.map((a) => a.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allAt.isLoading, funcQuery.isLoading]);

  const horarios = slotsHorarios();

  function updateSlot(id: string, patch: Partial<SlotDraft>) {
    setSlots((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function addSlot() {
    setSlots((s) => [
      ...s,
      { id: crypto.randomUUID(), diaSemana: "", hora: "", terapeutaId: terapeutas[0]?.id ?? "" },
    ]);
  }
  function removeSlot(id: string) {
    setSlots((s) => s.filter((x) => x.id !== id));
  }

  function conflictFor(slot: SlotDraft): string | null {
    if (!slot.diaSemana || !slot.hora || !slot.terapeutaId) return null;
    const clash = todos.find(
      (a) =>
        a.diaSemana === slot.diaSemana &&
        a.hora === slot.hora &&
        a.terapeutaId === slot.terapeutaId &&
        a.id !== slot.atendimentoId,
    );
    if (!clash) return null;
    const pac = pacMap.get(clash.pacienteId);
    return `Ocupado por ${pac?.nome ?? "outro paciente"}`;
  }

  const incompletos = slots.some((s) => !s.diaSemana || !s.hora || !s.terapeutaId);
  const temConflito = slots.some((s) => conflictFor(s) !== null);
  const duplicado = slots.some((a, i) =>
    slots.some(
      (b, j) =>
        i !== j && a.diaSemana && a.hora && a.terapeutaId &&
        a.diaSemana === b.diaSemana && a.hora === b.hora && a.terapeutaId === b.terapeutaId,
    ),
  );

  const canSave = !incompletos && !temConflito && !duplicado && terapeutas.length > 0;

  async function handleSave() {
    if (!canSave) return;
    const keptIds = new Set(slots.map((s) => s.atendimentoId).filter(Boolean) as string[]);
    const toRemove = initialIds.filter((id) => !keptIds.has(id));
    await Promise.all(toRemove.map((id) => removeAtendimento(id)));
    await Promise.all(
      slots.map((s) =>
        saveAtendimento({
          id: s.atendimentoId ?? "",
          diaSemana: s.diaSemana as DiaSemana,
          hora: s.hora,
          pacienteId,
          terapeutaId: s.terapeutaId,
          terapia,
        }),
      ),
    );
    await qc.invalidateQueries({ queryKey: ["atendimentos"] });
    await qc.invalidateQueries({ queryKey: ["atendimentos:all"] });
    onSaved();
  }

  async function handleRemoveAll() {
    if (!confirm(`Remover a terapia "${terapia}" e todos os horários fixos vinculados?`)) return;
    await Promise.all(initialIds.map((id) => removeAtendimento(id)));
    await qc.invalidateQueries({ queryKey: ["atendimentos"] });
    await qc.invalidateQueries({ queryKey: ["atendimentos:all"] });
    onRemoveTerapia?.();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl border w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h3 className="font-semibold text-lg">Agendar {terapia}</h3>
            <p className="text-xs text-muted-foreground">Para {pacienteNome} · horários fixos semanais</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-md hover:bg-accent"><X className="size-4" /></button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {terapeutas.length === 0 ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm flex gap-2">
              <AlertCircle className="size-4 text-destructive shrink-0 mt-0.5" />
              <p>Não há nenhum terapeuta cadastrado com a especialidade <b>{terapia}</b>. Cadastre um funcionário com essa especialidade antes de agendar.</p>
            </div>
          ) : (
            <>
              {slots.map((slot, idx) => {
                const conflict = conflictFor(slot);
                const ocupados = new Map<string, string>();
                if (slot.diaSemana && slot.terapeutaId) {
                  todos
                    .filter((a) => a.diaSemana === slot.diaSemana && a.terapeutaId === slot.terapeutaId && a.id !== slot.atendimentoId)
                    .forEach((a) => ocupados.set(a.hora, pacMap.get(a.pacienteId)?.nome ?? "ocupado"));
                }
                return (
                  <div key={slot.id} className="rounded-xl border bg-background/50 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Horário {idx + 1}
                      </p>
                      {slots.length > 1 && (
                        <button
                          onClick={() => removeSlot(slot.id)}
                          className="text-destructive hover:underline inline-flex items-center gap-1 text-xs"
                        >
                          <Trash2 className="size-3" /> remover
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground">
                        <User className="size-3" /> Terapeuta
                      </label>
                      <select
                        value={slot.terapeutaId}
                        onChange={(e) => updateSlot(slot.id, { terapeutaId: e.target.value })}
                        className="w-full h-10 rounded-md border bg-card px-3 text-sm"
                      >
                        {terapeutas.map((t) => (
                          <option key={t.id} value={t.id}>{t.nome}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground">
                        <Calendar className="size-3" /> Dia da semana
                      </label>
                      <div className="flex flex-wrap gap-1.5">
                        {DIAS_SEMANA.map((d) => (
                          <button
                            key={d.value}
                            onClick={() => updateSlot(slot.id, { diaSemana: d.value, hora: "" })}
                            className={`px-3 h-8 rounded-full text-xs font-medium border transition-colors ${
                              slot.diaSemana === d.value
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border hover:bg-accent"
                            }`}
                          >
                            {d.labelCurto}
                          </button>
                        ))}
                      </div>
                    </div>

                    {slot.diaSemana && (
                      <div>
                        <label className="text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground">
                          <Clock className="size-3" /> Horário
                        </label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5">
                          {horarios.map((h) => {
                            const ocupadoPor = ocupados.get(h);
                            const selected = slot.hora === h;
                            return (
                              <button
                                key={h}
                                disabled={!!ocupadoPor}
                                title={ocupadoPor ? `Ocupado por ${ocupadoPor}` : undefined}
                                onClick={() => updateSlot(slot.id, { hora: h })}
                                className={`h-9 rounded-md text-xs font-semibold border transition-colors ${
                                  ocupadoPor
                                    ? "bg-muted text-muted-foreground/50 border-muted line-through cursor-not-allowed"
                                    : selected
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border hover:bg-accent"
                                }`}
                              >
                                {h}
                              </button>
                            );
                          })}
                        </div>
                        {conflict && (
                          <p className="mt-2 text-xs text-destructive inline-flex items-center gap-1">
                            <AlertCircle className="size-3" /> {conflict}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={addSlot}
                className="w-full rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-soft py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center gap-1.5"
              >
                <Plus className="size-4" /> Adicionar outro horário
              </button>

              {duplicado && (
                <p className="text-xs text-destructive inline-flex items-center gap-1">
                  <AlertCircle className="size-3" /> Há horários duplicados na lista.
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-2 px-6 py-4 border-t bg-muted/30 rounded-b-2xl">
          {initialIds.length > 0 && onRemoveTerapia ? (
            <button
              onClick={handleRemoveAll}
              className="inline-flex items-center gap-1 text-sm text-destructive hover:underline"
            >
              <Trash2 className="size-4" /> Remover terapia
            </button>
          ) : <span />}
          <div className="flex gap-2">
            <button onClick={onClose} className="rounded-md border px-3 py-2 text-sm">Cancelar</button>
            <button
              onClick={handleSave}
              disabled={!canSave}
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
