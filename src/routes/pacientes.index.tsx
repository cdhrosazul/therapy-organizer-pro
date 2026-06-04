import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { buscarPacientes } from "@/services";
import { PageHeader } from "@/components/layout/AppShell";
import { Search, Plus, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/pacientes/")({
  head: () => ({ meta: [{ title: "Pacientes — Escola Rosazul" }] }),
  component: PacientesList,
});

function PacientesList() {
  const [termo, setTermo] = useState("");
  const navigate = useNavigate();
  const q = useQuery({ queryKey: ["pacientes:buscar", termo], queryFn: () => buscarPacientes(termo) });
  const lista = q.data ?? [];
  return (
    <div>
      <PageHeader
        title="Pacientes"
        description="Cadastro centralizado, busca rápida por nome."
        actions={
          <button
            onClick={() => navigate({ to: "/pacientes/novo" })}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="size-4" /> Novo paciente
          </button>
        }
      />

      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-md">
            <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Buscar por nome…"
              value={termo}
              onChange={(e) => setTermo(e.target.value)}
              className="w-full h-11 rounded-lg border bg-card pl-10 pr-3 text-sm"
            />
          </div>
        </div>
        <ul className="divide-y">
          {lista.length === 0 && <li className="p-8 text-center text-sm text-muted-foreground">Nenhum paciente.</li>}
          {lista.map((p) => (
            <li key={p.id}>
              <Link
                to="/pacientes/$id"
                params={{ id: p.id }}
                className="flex items-center gap-4 p-4 hover:bg-accent/40 transition-colors"
              >
                <div className="size-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm">
                  {p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{p.nome}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {p.convenio} · {p.terapias.join(", ")}
                  </p>
                </div>
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
