import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listAtendimentos, listPacientes } from "@/services";
import { hojeISO } from "@/lib/format";
import { PageHeader } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/minha-agenda")({
  head: () => ({ meta: [{ title: "Minha agenda — Escola Rosazul" }] }),
  component: MinhaAgenda,
});

function MinhaAgenda() {
  const { session } = useAuth();
  const data = hojeISO();
  const at = useQuery({ queryKey: ["atendimentos", data, session?.funcionarioId], queryFn: () => listAtendimentos({ data, terapeutaId: session?.funcionarioId }) });
  const pac = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });
  const lista = (at.data ?? []).sort((a, b) => a.hora.localeCompare(b.hora));
  const pacMap = new Map((pac.data ?? []).map((p) => [p.id, p]));

  return (
    <div>
      <PageHeader title="Minha agenda" description={new Date().toLocaleDateString("pt-BR", { dateStyle: "full" })} />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="divide-y">
          {lista.length === 0 && (
            <p className="p-10 text-center text-muted-foreground text-sm">Nenhum atendimento hoje.</p>
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
                <StatusBadge status={a.status} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
