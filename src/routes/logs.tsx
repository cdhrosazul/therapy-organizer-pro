import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listLogs } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { formatDataHora } from "@/lib/format";

export const Route = createFileRoute("/logs")({
  head: () => ({ meta: [{ title: "Logs — Centro de Desenv" }] }),
  component: LogsPage,
});

function LogsPage() {
  const q = useQuery({ queryKey: ["logs"], queryFn: listLogs });
  const lista = q.data ?? [];
  return (
    <div>
      <PageHeader title="Logs do sistema" description="Auditoria de ações importantes." />
      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left">
            <tr>
              <th className="p-3">Quando</th>
              <th className="p-3">Usuário</th>
              <th className="p-3">Ação</th>
              <th className="p-3">Detalhe</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lista.map((l) => (
              <tr key={l.id} className="hover:bg-accent/40">
                <td className="p-3 text-muted-foreground whitespace-nowrap">{formatDataHora(l.data)}</td>
                <td className="p-3 font-medium">{l.usuario}</td>
                <td className="p-3">
                  <span className="inline-flex rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium">{l.acao}</span>
                </td>
                <td className="p-3 text-muted-foreground">{l.detalhe}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
