import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { h as hojeISO, d as diaSemanaHoje, e as DIAS_SEMANA_LOOKUP, i as checkinPaciente, j as buscarPacientes, a as listAtendimentos, l as listFuncionarios, g as listPresencas } from "./index-Dl77HIym.mjs";
import { u as useAuth, P as PageHeader } from "./router-D0wc9rb3.mjs";
import { S as StatusBadge } from "./StatusBadge-BCaguFOt.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { j as Search, C as CircleCheck, k as Clock } from "../_libs/lucide-react.mjs";
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
function CheckinPage() {
  const data = hojeISO();
  const diaSemana = diaSemanaHoje();
  const diaLabel = DIAS_SEMANA_LOOKUP[diaSemana]?.label ?? "";
  const [termo, setTermo] = reactExports.useState("");
  const [selectedId, setSelectedId] = reactExports.useState(null);
  const qc = useQueryClient();
  const {
    session
  } = useAuth();
  const podeConfirmar = session?.perfil === "recepcao" || session?.perfil === "diretor" || session?.perfil === "administrativo";
  const pacQuery = useQuery({
    queryKey: ["pacientes:buscar", termo],
    queryFn: () => buscarPacientes(termo)
  });
  const atQuery = useQuery({
    queryKey: ["atendimentos", diaSemana],
    queryFn: () => listAtendimentos({
      diaSemana
    })
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
  const funcMap = reactExports.useMemo(() => new Map((funcQuery.data ?? []).map((f) => [f.id, f])), [funcQuery.data]);
  const presMap = reactExports.useMemo(() => new Map((presQuery.data ?? []).map((p) => [p.atendimentoId, p.status])), [presQuery.data]);
  const atendimentos = atQuery.data ?? [];
  const resultados = pacQuery.data ?? [];
  const selecionado = resultados.find((p) => p.id === selectedId) ?? null;
  const sessoes = selecionado ? atendimentos.filter((a) => a.pacienteId === selecionado.id).sort((a, b) => a.hora.localeCompare(b.hora)) : [];
  const proxima = sessoes.find((s) => {
    const st = presMap.get(s.id);
    return !st || st === "presente";
  });
  const tudoConfirmado = sessoes.length > 0 && sessoes.every((s) => {
    const st = presMap.get(s.id);
    return st === "presente" || st === "concluido";
  });
  async function handleCheckin() {
    if (!selecionado) return;
    try {
      const n = await checkinPaciente(selecionado.id, data);
      await qc.invalidateQueries({
        queryKey: ["presencas", data]
      });
      if (n > 0) toast.success(`${n} sessão(ões) confirmada(s)`);
      else toast.info("Nenhuma sessão pendente para confirmar.");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Falha ao confirmar chegada.");
    }
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Check-in", description: `Confirme a chegada do paciente · hoje é ${diaLabel.toLowerCase()}` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid lg:grid-cols-[420px_1fr] gap-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium block mb-2", children: "Buscar paciente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { autoFocus: true, placeholder: "Digite o nome…", value: termo, onChange: (e) => setTermo(e.target.value), className: "w-full h-12 rounded-lg border bg-card pl-10 pr-3 text-base outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-1 max-h-[60vh] overflow-y-auto", children: [
          resultados.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Nenhum paciente encontrado." }),
          resultados.map((p) => {
            const sessoesDia = atendimentos.filter((a) => a.pacienteId === p.id);
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setSelectedId(p.id), className: `w-full text-left rounded-lg border px-3 py-2.5 transition-colors ${selectedId === p.id ? "border-primary bg-primary-soft" : "border-transparent hover:bg-accent"}`, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: p.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
                sessoesDia.length,
                " sessão(ões) hoje · ",
                p.convenio
              ] })
            ] }, p.id);
          })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-6", children: !selecionado ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center text-center text-muted-foreground py-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-10 mb-3 opacity-40" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { children: "Selecione um paciente para visualizar suas sessões do dia." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold", children: selecionado.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
              selecionado.convenio,
              " · ",
              selecionado.telefone
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { disabled: !podeConfirmar || tudoConfirmado || sessoes.length === 0, onClick: handleCheckin, title: !podeConfirmar ? "Apenas perfis Recepção, Administrativo ou Diretor podem confirmar chegada" : void 0, className: "inline-flex items-center gap-2 h-12 px-6 rounded-xl bg-success text-success-foreground font-semibold hover:bg-success/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "size-5" }),
            tudoConfirmado ? "Já presente" : !podeConfirmar ? "Sem permissão" : "Confirmar chegada"
          ] })
        ] }),
        proxima && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 rounded-xl border border-primary/30 bg-primary-soft px-4 py-3 flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-5 text-primary" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-primary font-semibold uppercase tracking-wide", children: "Próxima sessão" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "font-medium", children: [
              proxima.hora,
              " · ",
              proxima.terapia,
              " · ",
              funcMap.get(proxima.terapeutaId)?.nome
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold mb-3", children: "Sessões de hoje" }),
          sessoes.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Nenhuma sessão fixa neste dia da semana." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "divide-y border rounded-lg", children: sessoes.map((s) => {
            const status = presMap.get(s.id) ?? "agendado";
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-4 px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-primary w-14", children: s.hora }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: s.terapia }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: funcMap.get(s.terapeutaId)?.nome })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(StatusBadge, { status })
            ] }, s.id);
          }) })
        ] })
      ] }) })
    ] })
  ] });
}
export {
  CheckinPage as component
};
