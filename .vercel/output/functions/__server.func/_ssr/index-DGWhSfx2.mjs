import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { N as Navigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, h as homeFor } from "./router-D0wc9rb3.mjs";
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
import "../_libs/tanstack__react-query.mjs";
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
import "../_libs/lucide-react.mjs";
function Index() {
  const {
    session
  } = useAuth();
  if (!session) return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: "/login" });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Navigate, { to: homeFor(session.perfil) });
}
export {
  Index as component
};
