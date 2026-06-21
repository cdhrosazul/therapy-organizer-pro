import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { p as removePaciente, j as buscarPacientes } from "./index-Dl77HIym.mjs";
import { P as PageHeader } from "./router-D0wc9rb3.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BN-TPJM-.mjs";
import { P as Plus, j as Search, n as ChevronRight, T as Trash2 } from "../_libs/lucide-react.mjs";
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
function PacientesList() {
  const [termo, setTermo] = reactExports.useState("");
  const [confirm, setConfirm] = reactExports.useState(null);
  const navigate = useNavigate();
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["pacientes:buscar", termo],
    queryFn: () => buscarPacientes(termo)
  });
  const lista = q.data ?? [];
  const del = useMutation({
    mutationFn: (id) => removePaciente(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["pacientes:buscar"]
      });
      qc.invalidateQueries({
        queryKey: ["pacientes"]
      });
      qc.invalidateQueries({
        queryKey: ["atendimentos"]
      });
      setConfirm(null);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Pacientes", description: "Cadastro centralizado, busca rápida por nome.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/pacientes/$id",
      params: {
        id: "novo"
      }
    }), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " Novo paciente"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 border-b", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-md", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { placeholder: "Buscar por nome…", value: termo, onChange: (e) => setTermo(e.target.value), className: "w-full h-11 rounded-lg border bg-card pl-10 pr-3 text-sm" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "divide-y", children: [
        lista.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "p-8 text-center text-sm text-muted-foreground", children: "Nenhum paciente." }),
        lista.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/pacientes/$id", params: {
            id: p.id
          }, className: "flex items-center gap-4 p-4 pr-20 hover:bg-accent/40 transition-colors", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-10 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-sm", children: p.nome.split(" ").map((n) => n[0]).slice(0, 2).join("") }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium truncate", children: p.nome }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-xs text-muted-foreground truncate", children: [
                p.convenio,
                " · ",
                p.terapias.join(", ")
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4 text-muted-foreground" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `Excluir ${p.nome}`, onClick: (e) => {
            e.preventDefault();
            e.stopPropagation();
            setConfirm({
              id: p.id,
              nome: p.nome
            });
          }, className: "absolute right-12 top-1/2 -translate-y-1/2 p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) })
        ] }, p.id))
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirm, onOpenChange: (o) => !o && setConfirm(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Excluir ",
          confirm?.nome,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação remove o paciente e todos os horários fixos vinculados. Não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => confirm && del.mutate(confirm.id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
export {
  PacientesList as component
};
