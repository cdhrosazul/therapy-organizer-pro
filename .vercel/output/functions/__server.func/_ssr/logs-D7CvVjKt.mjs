import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as formatDataHora, c as listLogs } from "./index-Dl77HIym.mjs";
import { P as PageHeader } from "./router-D0wc9rb3.mjs";
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
function LogsPage() {
  const q = useQuery({
    queryKey: ["logs"],
    queryFn: listLogs
  });
  const lista = q.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Logs do sistema", description: "Auditoria de ações importantes." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Quando" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Usuário" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Ação" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Detalhe" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { className: "divide-y", children: lista.map((l) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-accent/40", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground whitespace-nowrap", children: formatDataHora(l.data) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: l.usuario }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium", children: l.acao }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: l.detalhe })
      ] }, l.id)) })
    ] }) })
  ] });
}
export {
  LogsPage as component
};
