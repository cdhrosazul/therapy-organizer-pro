import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as getPaciente, v as savePaciente, s as saveAnotacao, r as removeAnotacao, m as slotsHorarios, D as DIAS_SEMANA, p as removePaciente, n as removeAtendimento, o as saveAtendimento, l as listFuncionarios, a as listAtendimentos, b as listPacientes, k as listAnotacoes } from "./index-Dl77HIym.mjs";
import { R as Route$1, P as PageHeader, u as useAuth } from "./router-D0wc9rb3.mjs";
import { c as convenios, e as especialidades } from "./data-CC6vuQ0w.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BN-TPJM-.mjs";
import { o as ArrowLeft, T as Trash2, m as Save, p as CalendarClock, q as Upload, X, P as Plus, l as Pencil, r as CircleAlert, s as User, b as Calendar, k as Clock } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-alert-dialog.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/react-remove-scroll.mjs";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/class-variance-authority.mjs";
function TerapiaScheduleModal({
  pacienteId,
  pacienteNome,
  terapia,
  onClose,
  onSaved,
  onRemoveTerapia
}) {
  const qc = useQueryClient();
  const funcQuery = useQuery({ queryKey: ["funcionarios"], queryFn: listFuncionarios });
  const allAt = useQuery({ queryKey: ["atendimentos:all"], queryFn: () => listAtendimentos() });
  const pacQuery = useQuery({ queryKey: ["pacientes"], queryFn: listPacientes });
  const terapeutas = reactExports.useMemo(
    () => (funcQuery.data ?? []).filter((f) => f.especialidade === terapia),
    [funcQuery.data, terapia]
  );
  const todos = allAt.data ?? [];
  const pacMap = reactExports.useMemo(() => new Map((pacQuery.data ?? []).map((p) => [p.id, p])), [pacQuery.data]);
  const existentes = reactExports.useMemo(
    () => todos.filter((a) => a.pacienteId === pacienteId && a.terapia === terapia),
    [todos, pacienteId, terapia]
  );
  const [slots, setSlots] = reactExports.useState([]);
  const [initialIds, setInitialIds] = reactExports.useState([]);
  reactExports.useEffect(() => {
    if (allAt.isLoading || funcQuery.isLoading) return;
    if (existentes.length === 0) {
      setSlots([
        {
          id: crypto.randomUUID(),
          diaSemana: "",
          hora: "",
          terapeutaId: terapeutas[0]?.id ?? ""
        }
      ]);
      setInitialIds([]);
    } else {
      setSlots(
        existentes.map((a) => ({
          id: crypto.randomUUID(),
          atendimentoId: a.id,
          diaSemana: a.diaSemana,
          hora: a.hora,
          terapeutaId: a.terapeutaId
        }))
      );
      setInitialIds(existentes.map((a) => a.id));
    }
  }, [allAt.isLoading, funcQuery.isLoading]);
  const horarios = slotsHorarios();
  function updateSlot(id, patch) {
    setSlots((s) => s.map((x) => x.id === id ? { ...x, ...patch } : x));
  }
  function addSlot() {
    setSlots((s) => [
      ...s,
      { id: crypto.randomUUID(), diaSemana: "", hora: "", terapeutaId: terapeutas[0]?.id ?? "" }
    ]);
  }
  function removeSlot(id) {
    setSlots((s) => s.filter((x) => x.id !== id));
  }
  function conflictFor(slot) {
    if (!slot.diaSemana || !slot.hora || !slot.terapeutaId) return null;
    const clash = todos.find(
      (a) => a.diaSemana === slot.diaSemana && a.hora === slot.hora && a.terapeutaId === slot.terapeutaId && a.id !== slot.atendimentoId
    );
    if (!clash) return null;
    const pac = pacMap.get(clash.pacienteId);
    return `Ocupado por ${pac?.nome ?? "outro paciente"}`;
  }
  const incompletos = slots.some((s) => !s.diaSemana || !s.hora || !s.terapeutaId);
  const temConflito = slots.some((s) => conflictFor(s) !== null);
  const duplicado = slots.some(
    (a, i) => slots.some(
      (b, j) => i !== j && a.diaSemana && a.hora && a.terapeutaId && a.diaSemana === b.diaSemana && a.hora === b.hora && a.terapeutaId === b.terapeutaId
    )
  );
  const canSave = !incompletos && !temConflito && !duplicado && terapeutas.length > 0;
  async function handleSave() {
    if (!canSave) return;
    const keptIds = new Set(slots.map((s) => s.atendimentoId).filter(Boolean));
    const toRemove = initialIds.filter((id) => !keptIds.has(id));
    await Promise.all(toRemove.map((id) => removeAtendimento(id)));
    await Promise.all(
      slots.map(
        (s) => saveAtendimento({
          id: s.atendimentoId ?? "",
          diaSemana: s.diaSemana,
          hora: s.hora,
          pacienteId,
          terapeutaId: s.terapeutaId,
          terapia
        })
      )
    );
    await qc.invalidateQueries({ queryKey: ["atendimentos"] });
    await qc.invalidateQueries({ queryKey: ["atendimentos:all"] });
    onSaved();
  }
  async function handleRemoveAll() {
    if (!confirm(`Remover a terapia "${terapia}" e todos os horários fixos vinculados?`)) return;
    await Promise.all(initialIds.map((id) => removeAtendimento(id)));
    await qc.invalidateQueries({ queryKey: ["atendimentos"] });
    await qc.invalidateQueries({ queryKey: ["atendimentos:all"] });
    onRemoveTerapia?.();
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border w-full max-w-2xl shadow-xl max-h-[90vh] flex flex-col", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-semibold text-lg", children: [
          "Agendar ",
          terapia
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          "Para ",
          pacienteNome,
          " · horários fixos semanais"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 rounded-md hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-4 overflow-y-auto flex-1", children: terapeutas.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-4 text-destructive shrink-0 mt-0.5" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
        "Não há nenhum terapeuta cadastrado com a especialidade ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("b", { children: terapia }),
        ". Cadastre um funcionário com essa especialidade antes de agendar."
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      slots.map((slot, idx) => {
        const conflict = conflictFor(slot);
        const ocupados = /* @__PURE__ */ new Map();
        if (slot.diaSemana && slot.terapeutaId) {
          todos.filter((a) => a.diaSemana === slot.diaSemana && a.terapeutaId === slot.terapeutaId && a.id !== slot.atendimentoId).forEach((a) => ocupados.set(a.hora, pacMap.get(a.pacienteId)?.nome ?? "ocupado"));
        }
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border bg-background/50 p-4 space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs font-semibold uppercase tracking-wide text-muted-foreground", children: [
              "Horário ",
              idx + 1
            ] }),
            slots.length > 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                onClick: () => removeSlot(slot.id),
                className: "text-destructive hover:underline inline-flex items-center gap-1 text-xs",
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }),
                  " remover"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "size-3" }),
              " Terapeuta"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "select",
              {
                value: slot.terapeutaId,
                onChange: (e) => updateSlot(slot.id, { terapeutaId: e.target.value }),
                className: "w-full h-10 rounded-md border bg-card px-3 text-sm",
                children: terapeutas.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: t.id, children: t.nome }, t.id))
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Calendar, { className: "size-3" }),
              " Dia da semana"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1.5", children: DIAS_SEMANA.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => updateSlot(slot.id, { diaSemana: d.value, hora: "" }),
                className: `px-3 h-8 rounded-full text-xs font-medium border transition-colors ${slot.diaSemana === d.value ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`,
                children: d.labelCurto
              },
              d.value
            )) })
          ] }),
          slot.diaSemana && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "text-xs font-medium mb-1.5 flex items-center gap-1 text-muted-foreground", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "size-3" }),
              " Horário"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-4 sm:grid-cols-6 gap-1.5", children: horarios.map((h) => {
              const ocupadoPor = ocupados.get(h);
              const selected = slot.hora === h;
              return /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  disabled: !!ocupadoPor,
                  title: ocupadoPor ? `Ocupado por ${ocupadoPor}` : void 0,
                  onClick: () => updateSlot(slot.id, { hora: h }),
                  className: `h-9 rounded-md text-xs font-semibold border transition-colors ${ocupadoPor ? "bg-muted text-muted-foreground/50 border-muted line-through cursor-not-allowed" : selected ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`,
                  children: h
                },
                h
              );
            }) }),
            conflict && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-xs text-destructive inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3" }),
              " ",
              conflict
            ] })
          ] })
        ] }, slot.id);
      }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: addSlot,
          className: "w-full rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-soft py-3 text-sm font-medium text-muted-foreground hover:text-primary transition-colors inline-flex items-center justify-center gap-1.5",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
            " Adicionar outro horário"
          ]
        }
      ),
      duplicado && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-destructive inline-flex items-center gap-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "size-3" }),
        " Há horários duplicados na lista."
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-2 px-6 py-4 border-t bg-muted/30 rounded-b-2xl", children: [
      initialIds.length > 0 && onRemoveTerapia ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: handleRemoveAll,
          className: "inline-flex items-center gap-1 text-sm text-destructive hover:underline",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
            " Remover terapia"
          ]
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "rounded-md border px-3 py-2 text-sm", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: handleSave,
            disabled: !canSave,
            className: "rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed",
            children: "Confirmar agendamento"
          }
        )
      ] })
    ] })
  ] }) });
}
const empty = {
  id: "",
  nome: "",
  endereco: "",
  telefone: "",
  convenio: "Particular",
  terapias: [],
  documentos: []
};
function PacienteForm() {
  const {
    id
  } = Route$1.useParams();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = id === "novo";
  const [p, setP] = reactExports.useState(empty);
  const [tab, setTab] = reactExports.useState("dados");
  const [terapiaModal, setTerapiaModal] = reactExports.useState(null);
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  const atQuery = useQuery({
    queryKey: ["atendimentos:paciente", p.id],
    queryFn: () => listAtendimentos({
      pacienteId: p.id
    }),
    enabled: !!p.id && !isNew
  });
  const atendimentos = atQuery.data ?? [];
  reactExports.useEffect(() => {
    if (isNew) {
      setP(empty);
      return;
    }
    getPaciente(id).then((res) => res && setP(res));
  }, [id, isNew]);
  function handleTerapiaClick(e) {
    if (isNew) {
      setP((prev) => ({
        ...prev,
        terapias: prev.terapias.includes(e) ? prev.terapias.filter((t) => t !== e) : [...prev.terapias, e]
      }));
      return;
    }
    setTerapiaModal(e);
  }
  async function handleSave() {
    await savePaciente(p);
    navigate({
      to: "/pacientes"
    });
  }
  async function handleDelete() {
    await removePaciente(p.id);
    await qc.invalidateQueries({
      queryKey: ["pacientes:buscar"]
    });
    await qc.invalidateQueries({
      queryKey: ["atendimentos"]
    });
    navigate({
      to: "/pacientes"
    });
  }
  function handleFiles(tipo, files) {
    if (!files) return;
    const novos = Array.from(files).map((f) => ({
      id: Math.random().toString(36).slice(2),
      tipo,
      nomeArquivo: f.name,
      tamanho: f.size,
      criadoEm: (/* @__PURE__ */ new Date()).toISOString()
    }));
    setP((prev) => ({
      ...prev,
      documentos: [...prev.documentos, ...novos]
    }));
  }
  function removeDoc(id2) {
    setP((prev) => ({
      ...prev,
      documentos: prev.documentos.filter((d) => d.id !== id2)
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/pacientes"
    }), className: "text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Voltar"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: isNew ? "Novo paciente" : p.nome || "Paciente", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConfirmDel(true), className: "inline-flex items-center gap-2 rounded-md border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
        " Excluir"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
        " Salvar"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b px-4 pt-3", children: ["dados", "documentos", "anotacoes"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: t === "dados" ? "Dados" : t === "documentos" ? "Documentos" : "Anotações" }, t)) }),
      tab === "dados" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome completo", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: p.nome, onChange: (e) => setP({
          ...p,
          nome: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Telefone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: p.telefone, onChange: (e) => setP({
          ...p,
          telefone: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Convênio", children: /* @__PURE__ */ jsxRuntimeExports.jsx("select", { className: inputCls, value: p.convenio, onChange: (e) => setP({
          ...p,
          convenio: e.target.value
        }), children: convenios.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: c }, c)) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Endereço", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: p.endereco, onChange: (e) => setP({
          ...p,
          endereco: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Responsável", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inputCls, value: p.responsavel ?? "", onChange: (e) => setP({
          ...p,
          responsavel: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Data de nascimento", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: inputCls, value: p.dataNascimento ?? "", onChange: (e) => setP({
          ...p,
          dataNascimento: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:col-span-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-2 block", children: "Terapias vinculadas" }),
          !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground mb-3 inline-flex items-center gap-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "size-3" }),
            " Clique em uma terapia para definir os horários fixos na agenda."
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: especialidades.map((e) => {
            const on = p.terapias.includes(e);
            const count = atendimentos.filter((a) => a.terapia === e).length;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "button", onClick: () => handleTerapiaClick(e), className: `rounded-full px-3 py-1.5 text-sm border transition-colors inline-flex items-center gap-1.5 ${on ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`, children: [
              e,
              on && count > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center justify-center min-w-5 h-5 rounded-full bg-primary-foreground/20 text-[10px] font-bold px-1.5", children: [
                count,
                "x"
              ] })
            ] }, e);
          }) })
        ] })
      ] }),
      tab === "documentos" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-5", children: ["Documento pessoal", "Carteirinha do convênio", "Laudo médico", "Relatório terapêutico", "Encaminhamento", "Outros"].map((tipo) => /* @__PURE__ */ jsxRuntimeExports.jsx(DocSection, { tipo, docs: p.documentos.filter((d) => d.tipo === tipo), onUpload: (f) => handleFiles(tipo, f), onRemove: removeDoc }, tipo)) }),
      tab === "anotacoes" && !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx(AnotacoesSection, { pacienteId: p.id }),
      tab === "anotacoes" && isNew && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Salve o paciente antes de adicionar anotações." })
    ] }),
    terapiaModal && !isNew && /* @__PURE__ */ jsxRuntimeExports.jsx(TerapiaScheduleModal, { pacienteId: p.id, pacienteNome: p.nome || "paciente", terapia: terapiaModal, onClose: () => setTerapiaModal(null), onSaved: async () => {
      if (!p.terapias.includes(terapiaModal)) {
        const novo = {
          ...p,
          terapias: [...p.terapias, terapiaModal]
        };
        setP(novo);
        await savePaciente(novo);
      }
      await qc.invalidateQueries({
        queryKey: ["atendimentos:paciente", p.id]
      });
      setTerapiaModal(null);
    }, onRemoveTerapia: async () => {
      const novo = {
        ...p,
        terapias: p.terapias.filter((t) => t !== terapiaModal)
      };
      setP(novo);
      await savePaciente(novo);
      await qc.invalidateQueries({
        queryKey: ["atendimentos:paciente", p.id]
      });
      setTerapiaModal(null);
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmDel, onOpenChange: setConfirmDel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Excluir ",
          p.nome || "paciente",
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação remove o paciente e todos os horários fixos vinculados. Não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
const inputCls = "w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
function Field({
  label,
  children,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "md:col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: label }),
    children
  ] });
}
function DocSection({
  tipo,
  docs,
  onUpload,
  onRemove
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: tipo }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 cursor-pointer hover:bg-accent", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3" }),
        " Enviar",
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,.jpg,.jpeg,.png", multiple: true, className: "hidden", onChange: (e) => onUpload(e.target.files) })
      ] })
    ] }),
    docs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Nenhum arquivo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: docs.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between gap-2 rounded border px-3 py-2 text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: d.nomeArquivo }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => onRemove(d.id), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }, d.id)) })
  ] });
}
function AnotacoesSection({
  pacienteId
}) {
  const {
    session
  } = useAuth();
  const qc = useQueryClient();
  const podeEditarTodas = session?.perfil === "diretor";
  const {
    data
  } = useQuery({
    queryKey: ["anotacoes:paciente", pacienteId],
    queryFn: () => listAnotacoes({
      pacienteId
    })
  });
  const [texto, setTexto] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [confirmDel, setConfirmDel] = reactExports.useState(null);
  const inv = () => {
    qc.invalidateQueries({
      queryKey: ["anotacoes:paciente", pacienteId]
    });
    qc.invalidateQueries({
      queryKey: ["anotacoes"]
    });
  };
  const addMut = useMutation({
    mutationFn: () => saveAnotacao({
      id: "",
      pacienteId,
      texto: texto.trim()
    }, session?.usuario ?? "admin", session?.nome ?? "—"),
    onSuccess: () => {
      setTexto("");
      inv();
    }
  });
  const editMut = useMutation({
    mutationFn: (a) => saveAnotacao(a, session?.usuario ?? "admin", session?.nome ?? "—"),
    onSuccess: () => {
      setEditing(null);
      inv();
    }
  });
  const delMut = useMutation({
    mutationFn: (id) => removeAnotacao(id),
    onSuccess: () => {
      setConfirmDel(null);
      inv();
    }
  });
  const podeEditar = (n) => podeEditarTodas || n.autor === session?.userId;
  const lista = data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border bg-background p-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: texto, onChange: (e) => setTexto(e.target.value), rows: 3, placeholder: "Nova anotação...", className: "w-full rounded-md border bg-card p-2 text-sm outline-none focus:ring-2 focus:ring-ring" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addMut.mutate(), disabled: !texto.trim() || addMut.isPending, className: "inline-flex items-center gap-2 rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
        " Adicionar"
      ] }) })
    ] }),
    lista.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground text-center py-6", children: "Nenhuma anotação ainda." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: lista.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-lg border p-3 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
          n.autorNome,
          " · ",
          new Date(n.data).toLocaleString("pt-BR")
        ] }),
        podeEditar(n) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(n), className: "p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(n), className: "p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3.5" }) })
        ] })
      ] }),
      editing?.id === n.id ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: editing.texto, onChange: (e) => setEditing({
          ...editing,
          texto: e.target.value
        }), rows: 3, className: "w-full rounded-md border bg-card p-2 text-sm outline-none focus:ring-2 focus:ring-ring" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(null), className: "rounded-md border px-3 py-1 text-xs hover:bg-accent", children: "Cancelar" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => editing.texto.trim() && editMut.mutate({
            ...editing,
            texto: editing.texto.trim()
          }), className: "rounded-md bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:bg-primary/90", children: "Salvar" })
        ] })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap", children: n.texto })
    ] }, n.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirmDel, onOpenChange: (o) => !o && setConfirmDel(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogTitle, { children: "Excluir anotação?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => confirmDel && delMut.mutate(confirmDel.id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
export {
  PacienteForm as component
};
