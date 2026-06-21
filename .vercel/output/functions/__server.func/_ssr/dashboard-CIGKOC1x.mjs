import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as hojeISO, d as diaSemanaHoje, e as DIAS_SEMANA_LOOKUP, a as listAtendimentos, b as listPacientes, l as listFuncionarios, g as listPresencas } from "./index-Dl77HIym.mjs";
import { P as PageHeader } from "./router-D0wc9rb3.mjs";
import { S as StatusBadge } from "./StatusBadge-BCaguFOt.mjs";
import { g as CalendarDays, h as UserCheck, C as CircleCheck, i as UserX, A as ArrowRight } from "../_libs/lucide-react.mjs";
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
function Dashboard() {
  const data = hojeISO();
  const dia = diaSemanaHoje();
  const diaLabel = DIAS_SEMANA_LOOKUP[dia]?.label ?? "";
  const atQuery = useQuery({
    queryKey: ["atendimentos", dia],
    queryFn: () => listAtendimentos({
      diaSemana: dia
    })
  });
  const pacQuery = useQuery({
    queryKey: ["pacientes"],
    queryFn: listPacientes
  });
  const funcQuery = useQuery({
    queryKey: ["funcionarios"],
    queryFn: listFuncionarios
  });
  const presQuery = useQuery({
    queryKey: ["presencas", data],
    queryFn: () => listPresencas({
      data
    })
  });
  const atendimentos = atQuery.data ?? [];
  const pacientesMap = new Map((pacQuery.data ?? []).map((p) => [p.id, p]));
  const funcMap = new Map((funcQuery.data ?? []).map((f) => [f.id, f]));
  const presMap = new Map((presQuery.data ?? []).map((p) => [p.atendimentoId, p.status]));
  const totalDia = atendimentos.length;
  const presentes = atendimentos.filter((a) => {
    const st = presMap.get(a.id);
    return st === "presente" || st === "concluido";
  }).length;
  const concluidos = atendimentos.filter((a) => presMap.get(a.id) === "concluido").length;
  const faltas = atendimentos.filter((a) => presMap.get(a.id) === "faltou").length;
  const ordenados = [...atendimentos].sort((a, b) => a.hora.localeCompare(b.hora));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Dashboard", description: `Visão geral · ${diaLabel}, ${(/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR", {
      dateStyle: "long"
    })}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarDays, { className: "size-5" }), label: "Atendimentos do dia", value: totalDia, tone: "primary" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserCheck, { className: "size-5" }), label: "Presentes", value: presentes, tone: "success" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }), label: "Concluídos", value: concluidos, tone: "info" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(KPI, { icon: /* @__PURE__ */ jsxRuntimeExports.jsx(UserX, { className: "size-5" }), label: "Faltas", value: faltas, tone: "destructive" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-semibold", children: "Agenda de hoje" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            ordenados.length,
            " atendimentos fixos"
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/agenda", className: "inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline", children: [
          "Ver agenda completa ",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "size-4" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "divide-y", children: [
        ordenados.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-6 py-10 text-center text-sm text-muted-foreground", children: "Nenhum atendimento fixo para hoje." }),
        ordenados.map((a) => {
          const pac = pacientesMap.get(a.pacienteId);
          const ter = funcMap.get(a.terapeutaId);
          const status = presMap.get(a.id) ?? "agendado";
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 px-6 py-3 hover:bg-accent/40 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-16 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-lg font-bold text-primary", children: a.hora }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: pac?.nome ?? "Paciente" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                a.terapia,
                " • ",
                ter?.nome ?? "—"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
          ] }, a.id);
        })
      ] })
    ] })
  ] });
}
function KPI({
  icon,
  label,
  value,
  tone
}) {
  const toneClass = {
    primary: "bg-primary-soft text-primary",
    success: "bg-success/15 text-success",
    info: "bg-info/15 text-info",
    destructive: "bg-destructive/15 text-destructive"
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `size-9 rounded-lg flex items-center justify-center ${toneClass}`, children: icon })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-3xl font-bold mt-2", children: value })
  ] });
}
export {
  Dashboard as component
};
