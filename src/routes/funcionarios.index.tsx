import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listFuncionarios } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { formatBRL } from "@/lib/format";
import { Plus, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/funcionarios/")({
  head: () => ({ meta: [{ title: "Funcionários — Escola Rosazul" }] }),
  component: FuncList,
});

function FuncList() {
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });
  const lista = q.data ?? [];
  return (
    <div>
      <PageHeader
        title="Funcionários"
        description="Equipe administrativa e clínica."
        actions={
          <button
            onClick={() => navigate({ to: "/funcionarios/$id", params: { id: "novo" } })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Novo funcionário
          </button>
        }
      />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr className="text-left">
              <th className="p-3 font-semibold">Nome</th>
              <th className="p-3 font-semibold">Cargo</th>
              <th className="p-3 font-semibold">Escala</th>
              <th className="p-3 font-semibold">Salário</th>
              <th className="p-3 font-semibold">Status</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {lista.map((f) => (
              <tr key={f.id} className="hover:bg-accent/40">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <div className="size-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                      {f.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                    </div>
                    <div>
                      <p className="font-medium">{f.nome}</p>
                      <p className="text-xs text-muted-foreground">{f.especialidade ?? "—"}</p>
                    </div>
                  </div>
                </td>
                <td className="p-3">{f.cargo}</td>
                <td className="p-3 text-muted-foreground">{f.escala} · {f.horarioEntrada}–{f.horarioSaida}</td>
                <td className="p-3 font-medium">{formatBRL(f.salario)}</td>
                <td className="p-3">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                    f.status === "ativo" ? "bg-success/15 text-success" :
                    f.status === "ferias" ? "bg-warning/20 text-warning-foreground" :
                    "bg-muted text-muted-foreground"
                  }`}>{f.status}</span>
                </td>
                <td className="p-3 text-right">
                  <Link to="/funcionarios/$id" params={{ id: f.id }} className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1">
                    Abrir <ChevronRight className="size-4" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
