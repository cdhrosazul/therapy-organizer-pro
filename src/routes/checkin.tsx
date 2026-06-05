import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { buscarPacientes, checkinPaciente, listAtendimentos, listFuncionarios, listPresencas } from "@/services";
import { hojeISO, diaSemanaHoje, DIAS_SEMANA } from "@/lib/format";
import { PageHeader } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import type { StatusPresenca } from "@/types";
import { Search, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/checkin")({
  head: () => ({ meta: [{ title: "Check-in — Escola Rosazul" }] }),
  component: CheckinPage,
});

function CheckinPage() {
  const data = hojeISO();
  const diaSemana = diaSemanaHoje();
  const diaLabel = DIAS_SEMANA.find((d) => d.value === diaSemana)?.label ?? "";
  const [termo, setTermo] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const qc = useQueryClient();

  const pacQuery = useQuery({ queryKey: ["pacientes:buscar", termo], queryFn: () => buscarPacientes(termo) });
  const atQuery = useQuery({ queryKey: ["atendimentos", diaSemana], queryFn: () => listAtendimentos({ diaSemana }) });
  const funcQuery = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });
  const presQuery = useQuery({ queryKey: ["presencas", data], queryFn: () => listPresencas({ data }) });

  const funcMap = useMemo(() => new Map((funcQuery.data ?? []).map((f) => [f.id, f])), [funcQuery.data]);
  const presMap = useMemo(
    () => new Map((presQuery.data ?? []).map((p) => [p.atendimentoId, p.status as StatusPresenca])),
    [presQuery.data],
  );
  const atendimentos = atQuery.data ?? [];
  const resultados = pacQuery.data ?? [];

  const selecionado = resultados.find((p) => p.id === selectedId) ?? null;
  const sessoes = selecionado
    ? atendimentos.filter((a) => a.pacienteId === selecionado.id).sort((a, b) => a.hora.localeCompare(b.hora))
    : [];
  const proxima = sessoes.find((s) => {
    const st = presMap.get(s.id);
    return !st || st === "presente";
  });
  const jaPresente = sessoes.some((s) => {
    const st = presMap.get(s.id);
    return st === "presente" || st === "concluido";
  });

  async function handleCheckin() {
    if (!selecionado) return;
    await checkinPaciente(selecionado.id, data);
    await qc.invalidateQueries({ queryKey: ["presencas", data] });
  }

  return (
    <div>
      <PageHeader title="Check-in" description={`Confirme a chegada do paciente · hoje é ${diaLabel.toLowerCase()}`} />

      <div className="grid lg:grid-cols-[420px_1fr] gap-6">
        <div className="rounded-2xl border bg-card p-5">
          <label className="text-sm font-medium block mb-2">Buscar paciente</label>
          <div className="relative">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              autoFocus
              placeholder="Digite o nome…"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="w-full h-12 rounded-lg border bg-card pl-10 pr-3 text-base outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="mt-4 space-y-1 max-h-[60vh] overflow-y-auto">
            {resultados.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">Nenhum paciente encontrado.</p>
            )}
            {resultados.map((p) => {
              const sessoesDia = atendimentos.filter((a) => a.pacienteId === p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${
                    selectedId === p.id ? "border-primary bg-primary-soft" : "border-transparent hover:bg-accent"
                  }`}
                >
                  <p className="font-medium">{p.nome}</p>
                  <p className="text-xs text-muted-foreground">{sessoesDia.length} sessão(ões) hoje · {p.convenio}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6">
          {!selecionado ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground py-20">
              <Search className="size-10 mb-3 opacity-40" />
              <p>Selecione um paciente para visualizar suas sessões do dia.</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b">
                <div>
                  <h2 className="text-xl font-bold">{selecionado.nome}</h2>
                  <p className="text-sm text-muted-foreground">{selecionado.convenio} · {selecionado.telefone}</p>
                </div>
                <button
                  disabled={jaPresente || sessoes.length === 0}
                  onClick={handleCheckin}
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-success text-success-foreground font-semibold hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckCircle2 className="size-5" />
                  {jaPresente ? "Já presente" : "Confirmar chegada"}
                </button>
              </div>

              {proxima && (
                <div className="mt-5 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 flex items-center gap-3">
                  <Clock className="size-5 text-primary" />
                  <div>
                    <p className="text-xs text-primary font-semibold uppercase tracking-wide">Próxima sessão</p>
                    <p className="font-medium">{proxima.hora} · {proxima.terapia} · {funcMap.get(proxima.terapeutaId)?.nome}</p>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <h3 className="font-semibold mb-3">Sessões de hoje</h3>
                {sessoes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Nenhuma sessão fixa neste dia da semana.</p>
                ) : (
                  <ul className="divide-y border rounded-lg">
                    {sessoes.map((s) => {
                      const status = presMap.get(s.id) ?? "agendado";
                      return (
                        <li key={s.id} className="flex items-center gap-4 px-4 py-3">
                          <p className="font-bold text-primary w-14">{s.hora}</p>
                          <div className="flex-1">
                            <p className="font-medium">{s.terapia}</p>
                            <p className="text-xs text-muted-foreground">{funcMap.get(s.terapeutaId)?.nome}</p>
                          </div>
                          <StatusBadge status={status} />
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
