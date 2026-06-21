import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { s as saveAnotacao, r as removeAnotacao, b as listPacientes, a as listAtendimentos, k as listAnotacoes } from "./index-Dl77HIym.mjs";
import { u as useAuth, P as PageHeader } from "./router-D0wc9rb3.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BN-TPJM-.mjs";
import { P as Plus, j as Search, l as Pencil, T as Trash2, X, m as Save } from "../_libs/lucide-react.mjs";
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
function AnotacoesPage() {
  const {
    session
  } = useAuth();
  const qc = useQueryClient();
  const isTerapeuta = session?.perfil === "terapeuta";
  const podeEditarTodas = session?.perfil === "diretor";
  const pacQuery = useQuery({
    queryKey: ["pacientes:lista"],
    queryFn: () => listPacientes()
  });
  const atQuery = useQuery({
    queryKey: ["atendimentos:terapeuta", session?.funcionarioId ?? ""],
    queryFn: () => listAtendimentos({
      terapeutaId: session?.funcionarioId
    }),
    enabled: isTerapeuta && !!session?.funcionarioId
  });
  const pacientesVisiveis = reactExports.useMemo(() => {
    const todos = pacQuery.data ?? [];
    if (!isTerapeuta) return todos;
    const ids = new Set((atQuery.data ?? []).map((a) => a.pacienteId));
    return todos.filter((p) => ids.has(p.id));
  }, [pacQuery.data, atQuery.data, isTerapeuta]);
  const pacIds = reactExports.useMemo(() => pacientesVisiveis.map((p) => p.id), [pacientesVisiveis]);
  const anotQuery = useQuery({
    queryKey: ["anotacoes", isTerapeuta ? pacIds.join(",") : "todas"],
    queryFn: () => isTerapeuta ? listAnotacoes({
      pacienteIds: pacIds
    }) : listAnotacoes(),
    enabled: !isTerapeuta || pacIds.length >= 0
  });
  const [filtroPaciente, setFiltroPaciente] = reactExports.useState("todos");
  const [busca, setBusca] = reactExports.useState("");
  const [editing, setEditing] = reactExports.useState(null);
  const [creating, setCreating] = reactExports.useState(false);
  const [confirmDel, setConfirmDel] = reactExports.useState(null);
  const saveMut = useMutation({
    mutationFn: (a) => saveAnotacao(a, session?.usuario ?? "admin", session?.nome ?? "—"),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["anotacoes"]
      });
      setEditing(null);
      setCreating(false);
    }
  });
  const delMut = useMutation({
    mutationFn: (id) => removeAnotacao(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["anotacoes"]
      });
      setConfirmDel(null);
    }
  });
  const lista = (anotQuery.data ?? []).filter((n) => {
    if (filtroPaciente !== "todos" && n.pacienteId !== filtroPaciente) return false;
    if (busca.trim() && !n.texto.toLowerCase().includes(busca.toLowerCase())) return false;
    return true;
  });
  const pacNome = (id) => pacientesVisiveis.find((p) => p.id === id)?.nome ?? "—";
  const podeEditar = (n) => podeEditarTodas || n.autor === session?.userId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Anotações", description: "Registros vinculados aos pacientes.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setCreating(true), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " Nova anotação"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 grid gap-3 sm:grid-cols-[1fr_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar no texto...", value: busca, onChange: (e) => setBusca(e.target.value), className: "w-full h-10 rounded-md border bg-card pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { value: filtroPaciente, onChange: (e) => setFiltroPaciente(e.target.value), className: "h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "todos", children: "Todos os pacientes" }),
        pacientesVisiveis.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.nome }, p.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card divide-y", children: lista.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-8 text-center text-sm text-muted-foreground", children: "Nenhuma anotação." }) : lista.map((n) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-4 group", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3 mb-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold truncate", children: pacNome(n.pacienteId) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground", children: [
            n.autorNome,
            " · ",
            new Date(n.data).toLocaleString("pt-BR")
          ] })
        ] }),
        podeEditar(n) && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditing(n), className: "p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground", "aria-label": "Editar", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setConfirmDel(n), className: "p-2 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive", "aria-label": "Excluir", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm whitespace-pre-wrap", children: n.texto })
    ] }, n.id)) }),
    (creating || editing) && /* @__PURE__ */ jsxRuntimeExports.jsx(AnotacaoModal, { initial: editing, pacientes: pacientesVisiveis.map((p) => ({
      id: p.id,
      nome: p.nome
    })), onCancel: () => {
      setCreating(false);
      setEditing(null);
    }, onSave: (payload) => saveMut.mutate(payload), saving: saveMut.isPending }),
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
function AnotacaoModal({
  initial,
  pacientes,
  onCancel,
  onSave,
  saving
}) {
  const [pacienteId, setPacienteId] = reactExports.useState(initial?.pacienteId ?? pacientes[0]?.id ?? "");
  const [texto, setTexto] = reactExports.useState(initial?.texto ?? "");
  function submit() {
    if (!pacienteId || !texto.trim()) return;
    onSave({
      id: initial?.id ?? "",
      pacienteId,
      autor: initial?.autor ?? "",
      autorNome: initial?.autorNome ?? "",
      data: initial?.data ?? "",
      texto: texto.trim()
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4", onClick: onCancel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-lg rounded-2xl bg-card p-5 shadow-lg", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold", children: initial ? "Editar anotação" : "Nova anotação" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "p-1 rounded hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Paciente" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("select", { disabled: !!initial, value: pacienteId, onChange: (e) => setPacienteId(e.target.value), className: "w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-60", children: pacientes.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: p.id, children: p.nome }, p.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Anotação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("textarea", { value: texto, onChange: (e) => setTexto(e.target.value), rows: 6, className: "w-full rounded-md border bg-card p-3 text-sm outline-none focus:ring-2 focus:ring-ring", placeholder: "Escreva sua anotação..." })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onCancel, className: "rounded-md border px-4 py-2 text-sm hover:bg-accent", children: "Cancelar" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: submit, disabled: saving || !pacienteId || !texto.trim(), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
        " Salvar"
      ] })
    ] })
  ] }) });
}
export {
  AnotacoesPage as component
};
