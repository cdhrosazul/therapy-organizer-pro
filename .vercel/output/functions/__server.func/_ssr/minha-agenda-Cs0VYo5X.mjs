import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as diaSemanaHoje, D as DIAS_SEMANA, a as listAtendimentos, b as listPacientes } from "./index-Dl77HIym.mjs";
import { u as useAuth, P as PageHeader } from "./router-D0wc9rb3.mjs";
import "../_libs/tanstack__query-core.mjs";
import "./client-XPspV5Wt.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/lucide-react.mjs";
function MinhaAgenda() {
  const {
    session
  } = useAuth();
  const [diaSemana, setDiaSemana] = reactExports.useState(() => {
    const hoje = diaSemanaHoje();
    return hoje === "sab" || hoje === "dom" ? "seg" : hoje;
  });
  const at = useQuery({
    queryKey: ["atendimentos", diaSemana, session?.funcionarioId],
    queryFn: () => listAtendimentos({
      diaSemana,
      terapeutaId: session?.funcionarioId
    })
  });
  const pac = useQuery({
    queryKey: ["pacientes"],
    queryFn: listPacientes
  });
  const lista = (at.data ?? []).sort((a, b) => a.hora.localeCompare(b.hora));
  const pacMap = new Map((pac.data ?? []).map((p) => [p.id, p]));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Minha agenda", description: "Sua grade fixa semanal" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex rounded-xl border bg-card p-1", children: DIAS_SEMANA.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDiaSemana(d.value), className: `px-4 h-9 rounded-lg text-sm font-medium transition-colors ${diaSemana === d.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`, children: d.labelCurto }, d.value)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
      lista.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "p-10 text-center text-muted-foreground text-sm", children: "Nenhum atendimento fixo neste dia." }),
      lista.map((a) => {
        const p = pacMap.get(a.pacienteId);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-6 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl font-bold text-primary w-20", children: a.hora }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p?.nome ?? "Paciente" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
              a.terapia,
              " · ",
              p?.convenio
            ] })
          ] })
        ] }, a.id);
      })
    ] }) })
  ] });
}
export {
  MinhaAgenda as component
};
