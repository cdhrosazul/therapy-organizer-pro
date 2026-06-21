import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { u as useAuth, l as logo, h as homeFor } from "./router-D0wc9rb3.mjs";
import { s as supabase } from "./client-XPspV5Wt.mjs";
import { e as LoaderCircle, f as LogIn } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
function LoginPage() {
  const {
    signIn
  } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = reactExports.useState("");
  const [senha, setSenha] = reactExports.useState("");
  const [erro, setErro] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(false);
  async function handleLogin(e) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const {
      error
    } = await signIn(email.trim(), senha);
    setLoading(false);
    if (error) {
      setErro(error);
      return;
    }
    const {
      data
    } = await supabase.auth.getUser();
    if (!data.user) return;
    const {
      data: prof
    } = await supabase.from("profiles").select("perfil").eq("id", data.user.id).maybeSingle();
    const perfil = prof?.perfil ?? "administrativo";
    navigate({
      to: homeFor(perfil)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen grid lg:grid-cols-2 bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo.url, alt: "Centro de Desenvolvimento Humano Rosazul", className: "size-14 rounded-xl bg-white p-1" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-bold text-lg leading-tight whitespace-pre-line", children: "Centro de Desenvolvimento\nHumano Rosazul" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm opacity-80", children: "Sistema Desenvolvido por Nunes.Tech" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h2", { className: "text-4xl font-bold leading-tight", children: [
          "Tudo num só lugar.",
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "Simples. Visual. Seguro."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "opacity-90 max-w-md", children: "Substitua planilhas e fichas físicas por um sistema centralizado para agendar, atender e acompanhar seus pacientes." }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "space-y-2 text-sm opacity-90", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Dashboard com agenda do dia em tempo real" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Check-in rápido pela recepção" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Cadastro completo de pacientes e equipe" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: "• Controle de acesso por perfil" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs opacity-70", children: "© Centro de Desenvolvimento Humano Rosazul ·" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center p-6 lg:p-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "lg:hidden flex items-center justify-center mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo.url, alt: "Centro de Desenvolvimento Humano Rosazul", className: "size-16" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold mb-1", children: "Entrar no sistema" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mb-6", children: "Acesse com seu email e senha." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleLogin, className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", autoComplete: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: "Senha" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "password", autoComplete: "current-password", required: true, value: senha, onChange: (e) => setSenha(e.target.value), className: "w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring" })
        ] }),
        erro && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive", children: erro }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { type: "submit", disabled: loading, className: "w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60", children: [
          loading ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(LogIn, { className: "size-4" }),
          " Entrar"
        ] })
      ] })
    ] }) })
  ] });
}
export {
  LoginPage as component
};
