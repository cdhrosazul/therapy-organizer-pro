import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { d as diaSemanaHoje, m as slotsHorarios, D as DIAS_SEMANA, e as DIAS_SEMANA_LOOKUP, n as removeAtendimento, o as saveAtendimento, a as listAtendimentos, l as listFuncionarios, b as listPacientes } from "./index-Dl77HIym.mjs";
import { u as useAuth, p as podeEditarAgenda, P as PageHeader } from "./router-D0wc9rb3.mjs";
import { e as especialidades } from "./data-CC6vuQ0w.mjs";
import { P as Plus, X, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function AgendaPage() {
  const {
    session
  } = useAuth();
  const podeEditar = session ? podeEditarAgenda(session.perfil) : false;
  const [diaSemana, setDiaSemana] = reactExports.useState(() => {
    const hoje = diaSemanaHoje();
    return hoje === "sab" || hoje === "dom" ? "seg" : hoje;
  });
  const qc = useQueryClient();
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
  const pacQuery = useQuery({
    queryKey: ["pacientes"],
    queryFn: listPacientes
  });
  const terapeutas = (funcQuery.data ?? []).filter((f) => !!f.especialidade);
  const atendimentos = atQuery.data ?? [];
  const pacMap = new Map((pacQuery.data ?? []).map((p) => [p.id, p]));
  const slots = slotsHorarios();
  const [modal, setModal] = reactExports.useState(null);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Agenda", description: "Grade fixa semanal · o que for marcado aqui se repete todas as semanas" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 inline-flex rounded-xl border bg-card p-1", children: DIAS_SEMANA.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDiaSemana(d.value), className: `px-4 h-9 rounded-lg text-sm font-medium transition-colors ${diaSemana === d.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent"}`, children: d.labelCurto }, d.value)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm border-collapse", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "sticky top-0 bg-muted/50 z-10", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "text-left p-3 border-b w-20", children: "Horário" }),
        terapeutas.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("th", { className: "text-left p-3 border-b min-w-[180px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-semibold", children: t.nome.split(" ").slice(0, 2).join(" ") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground font-normal", children: t.especialidade })
        ] }, t.id))
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: slots.map((hora) => {
        const isLastBeforeLunch = hora === "11:30";
        return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-accent/20", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-2 border-b border-r font-semibold text-muted-foreground align-top", children: hora }),
            terapeutas.map((t) => {
              const at = atendimentos.find((a) => a.hora === hora && a.terapeutaId === t.id);
              const pac = at ? pacMap.get(at.pacienteId) : void 0;
              const toneBg = at ? "bg-primary-soft border-primary/20" : "bg-card hover:bg-accent/30";
              return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-1 border-b align-top", children: /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
                if (!podeEditar && !at) return;
                setModal({
                  hora,
                  terapeutaId: t.id,
                  editar: at
                });
              }, disabled: !podeEditar && !at, className: `w-full text-left rounded-md border p-2 min-h-[58px] transition-colors ${toneBg} ${podeEditar || at ? "cursor-pointer" : "cursor-default"}`, children: at ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium leading-tight truncate", children: pac?.nome ?? "Paciente" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground truncate", children: at.terapia })
              ] }) : podeEditar && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground inline-flex items-center gap-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-3" }),
                " Agendar"
              ] }) }) }, t.id);
            })
          ] }),
          isLastBeforeLunch && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: terapeutas.length + 1, className: "p-3 text-center text-xs font-semibold text-muted-foreground bg-muted/40 border-b", children: "🍽️ Intervalo · 12:00 — 13:00" }) }, "lunch")
        ] }, hora);
      }) })
    ] }) }),
    modal && /* @__PURE__ */ jsxRuntimeExports.jsx(AppointmentModal, { diaSemana, hora: modal.hora, terapeutaId: modal.terapeutaId, editar: modal.editar, pacientes: pacQuery.data ?? [], podeEditar, onClose: () => setModal(null), onSaved: async () => {
      await qc.invalidateQueries({
        queryKey: ["atendimentos", diaSemana]
      });
      setModal(null);
    } })
  ] });
}
function AppointmentModal({
  diaSemana,
  hora,
  terapeutaId,
  editar,
  pacientes,
  podeEditar,
  onClose,
  onSaved
}) {
  const [pacienteId, setPacienteId] = reactExports.useState(editar?.pacienteId ?? "");
  const [terapia, setTerapia] = reactExports.useState(editar?.terapia ?? especialidades[0]);
  const diaLabel = DIAS_SEMANA_LOOKUP[diaSemana]?.label ?? "";
  async function handleSave() {
    if (!pacienteId) return;
    await saveAtendimento({
      id: editar?.id ?? "",
      diaSemana,
      hora,
      pacienteId,
      terapeutaId,
      terapia
    });
    onSaved();
  }
  async function handleDelete() {
    if (!editar) return;
    await removeAtendimento(editar.id);
    onSaved();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border w-full max-w-md shadow-xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: editar ? "Editar slot fixo" : "Novo slot fixo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Toda ",
          diaLabel.toLowerCase(),
          " · ",
          hora
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 rounded-md hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Paciente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: pacienteId, onChange: (e) => setPacienteId(e.target.value), disabled: !podeEditar, className: "w-full h-10 rounded-md border bg-card px-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "Selecione…" }),
          pacientes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.nome }, p.id))
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Terapia" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { value: terapia, onChange: (e) => setTerapia(e.target.value), disabled: !podeEditar, className: "w-full h-10 rounded-md border bg-card px-3 text-sm", children: especialidades.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: e, children: e }, e)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground bg-muted/40 rounded-md p-2", children: "Este horário ficará reservado para o paciente toda semana neste dia." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-5 py-4 border-t bg-muted/30 rounded-b-2xl", children: [
      editar && podeEditar ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleDelete, className: "inline-flex items-center gap-1 text-sm text-destructive hover:underline", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
        " Remover"
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-2 text-sm", children: "Cancelar" }),
        podeEditar && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: handleSave, className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: "Salvar" })
      ] })
    ] })
  ] }) });
}
export {
  AgendaPage as component
};
