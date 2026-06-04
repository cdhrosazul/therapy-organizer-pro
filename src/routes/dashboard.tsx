import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listAtendimentos, listPacientes, listFuncionarios } from "@/services";
import { hojeISO } from "@/lib/format";
import { PageHeader } from "@/components/layout/AppShell";
import { StatusBadge } from "@/components/StatusBadge";
import { CalendarDays, CheckCircle2, UserCheck, UserX, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Escola Rosazul" }] }),
  component: Dashboard,
});

function Dashboard() {
  const data = hojeISO();
  const atQuery = useQuery({ queryKey: ["atendimentos", data], queryFn: () => listAtendimentos({ data }) });
  const pacQuery = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });
  const funcQuery = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });

  const atendimentos = atQuery.data ?? [];
  const pacientesMap = new Map((pacQuery.data ?? []).map((p) => [p.id, p]));
  const funcMap = new Map((funcQuery.data ?? []).map((f) => [f.id, f]));

  const totalDia = atendimentos.length;
  const presentes = atendimentos.filter((a) => a.status === "presente" || a.status === "concluido").length;
  const concluidos = atendimentos.filter((a) => a.status === "concluido").length;
  const faltas = atendimentos.filter((a) => a.status === "faltou").length;

  const ordenados = [...atendimentos].sort((a, b) => a.hora.localeCompare(b.hora));

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description={`Visão geral do dia ${new Date().toLocaleDateString("pt-BR", { dateStyle: "long" })}`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KPI icon={<CalendarDays className="size-5" />} label="Atendimentos do dia" value={totalDia} tone="primary" />
        <KPI icon={<UserCheck className="size-5" />} label="Presentes" value={presentes} tone="success" />
        <KPI icon={<CheckCircle2 className="size-5" />} label="Concluídos" value={concluidos} tone="info" />
        <KPI icon={<UserX className="size-5" />} label="Faltas" value={faltas} tone="destructive" />
      </div>

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold">Agenda de hoje</h2>
            <p className="text-xs text-muted-foreground">{ordenados.length} atendimentos</p>
          </div>
          <Link to="/agenda" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
            Ver agenda completa <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="divide-y">
          {ordenados.length === 0 && (
            <p className="px-6 py-10 text-center text-sm text-muted-foreground">Nenhum atendimento agendado para hoje.</p>
          )}
          {ordenados.map((a) => {
            const pac = pacientesMap.get(a.pacienteId);
            const ter = funcMap.get(a.terapeutaId);
            return (
              <div key={a.id} className="flex items-center gap-4 px-6 py-3 hover:bg-accent/40 transition-colors">
                <div className="w-16 text-center">
                  <p className="text-lg font-bold text-primary">{a.hora}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{pac?.nome ?? "Paciente"}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.terapia} • {ter?.nome ?? "—"}
                  </p>
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

function KPI({
  icon,
  label,
  value,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  tone: "primary" | "success" | "info" | "destructive";
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    destructive: "bg-destructive/15 text-destructive",
  }[tone];
  return (
    <div className="rounded-2xl border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{label}</p>
        <div className={`size-9 rounded-lg flex items-center justify-center ${toneClass}`}>{icon}</div>
      </div>
      <p className="text-3xl font-bold mt-2">{value}</p>
    </div>
  );
}
