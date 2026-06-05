import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listAtendimentos, listPacientes } from "@/services";
import { DIAS_SEMANA, diaSemanaHoje } from "@/lib/format";
import { PageHeader } from "@/components/layout/AppShell";
import type { DiaSemana } from "@/types";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/minha-agenda")({
  head: () => ({ meta: [{ title: "Minha agenda — Escola Rosazul" }] }),
  component: MinhaAgenda,
});

function MinhaAgenda() {
  const { session } = useAuth();
  const [diaSemana, setDiaSemana] = useState<DiaSemana>(diaSemanaHoje());
  const at = useQuery({
    queryKey: ["atendimentos", diaSemana, session?.funcionarioId],
    queryFn: () => listAtendimentos({ diaSemana, terapeutaId: session?.funcionarioId }),
  });
  const pac = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });
  const lista = (at.data ?? []).sort((a, b) => a.hora.localeCompare(b.hora));
  const pacMap = new Map((pac.data ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader title="Minha agenda" description="Sua grade fixa semanal" />

      <div className="mb-4 inline-flex rounded-xl border bg-card p-1">
        {DIAS_SEMANA.map((d) => (
          <button
            key={d.value}
            onClick={() => setDiaSemana(d.value)}
            className={`px-4 h-9 rounded-lg text-sm font-medium transition-colors ${
              diaSemana === d.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"
            }`}
          >
            {d.labelCurto}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="divide-y">
          {lista.length === 0 && (
            <p className="p-10 text-center text-muted-foreground text-sm">Nenhum atendimento fixo neste dia.</p>
          )}
          {lista.map((a) => {
            const p = pacMap.get(a.pacienteId);
            return (
              <div key={a.id} className="flex items-center gap-4 px-6 py-4">
                <p className="text-xl font-bold text-primary w-20">{a.hora}</p>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{p?.nome ?? "Paciente"}</p>
                  <p className="text-xs text-muted-foreground">{a.terapia} · {p?.convenio}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
