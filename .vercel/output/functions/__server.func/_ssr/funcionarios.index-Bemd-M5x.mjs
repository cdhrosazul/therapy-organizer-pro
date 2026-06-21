import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate, L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { q as formatBRL, t as removeFuncionario, l as listFuncionarios } from "./index-Dl77HIym.mjs";
import { P as PageHeader } from "./router-D0wc9rb3.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BN-TPJM-.mjs";
import { P as Plus, T as Trash2, n as ChevronRight } from "../_libs/lucide-react.mjs";
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
function FuncList() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [confirm, setConfirm] = reactExports.useState(null);
  const q = useQuery({
    queryKey: ["funcionarios"],
    queryFn: listFuncionarios
  });
  const lista = q.data ?? [];
  const del = useMutation({
    mutationFn: (id) => removeFuncionario(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["funcionarios"]
      });
      qc.invalidateQueries({
        queryKey: ["atendimentos"]
      });
      qc.invalidateQueries({
        queryKey: ["usuarios"]
      });
      setConfirm(null);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Funcionários", description: "Equipe administrativa e clínica.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/funcionarios/$id",
      params: {
        id: "novo"
      }
    }), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " Novo funcionário"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "text-left", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Cargo" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Escala" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Salário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 font-semibold", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: lista.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "group hover:bg-accent/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "size-9 rounded-full bg-primary-soft text-primary flex items-center justify-center font-bold text-xs", children: f.nome.split(" ").map((n) => n[0]).slice(0, 2).join("") }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-medium", children: f.nome }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: f.especialidade ?? "—" })
          ] })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: f.cargo }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-muted-foreground", children: [
          f.escala,
          " · ",
          f.horarioEntrada,
          "–",
          f.horarioSaida
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: formatBRL(f.salario) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${f.status === "ativo" ? "bg-success/15 text-success" : f.status === "ferias" ? "bg-warning/20 text-warning-foreground" : "bg-muted text-muted-foreground"}`, children: f.status }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { type: "button", "aria-label": `Excluir ${f.nome}`, onClick: () => setConfirm({
            id: f.id,
            nome: f.nome
          }), className: "p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/funcionarios/$id", params: {
            id: f.id
          }, className: "text-primary text-sm font-medium hover:underline inline-flex items-center gap-1", children: [
            "Abrir ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "size-4" })
          ] })
        ] }) })
      ] }, f.id)) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: !!confirm, onOpenChange: (o) => !o && setConfirm(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Excluir ",
          confirm?.nome,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação remove o funcionário e todos os horários fixos em que ele é terapeuta. Não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: () => confirm && del.mutate(confirm.id), className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
export {
  FuncList as component
};
