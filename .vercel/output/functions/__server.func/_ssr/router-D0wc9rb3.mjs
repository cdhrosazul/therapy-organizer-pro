import { b as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent, d as useNavigate, e as useLocation, O as Outlet, L as Link } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { s as supabase } from "./client-XPspV5Wt.mjs";
import { X, M as Menu, L as LogOut, N as NotebookPen, S as ScrollText, a as Shield, I as IdCard, U as Users, C as CircleCheck, b as Calendar, c as LayoutDashboard } from "../_libs/lucide-react.mjs";
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
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
const appCss = "/assets/styles-CxZNAq0h.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const Ctx = reactExports.createContext(null);
async function loadProfile(userId, email) {
  const { data, error } = await supabase.from("profiles").select("nome, perfil, funcionario_id, ativo").eq("id", userId).maybeSingle();
  if (error || !data) return null;
  if (!data.ativo) return null;
  return {
    perfil: data.perfil,
    nome: data.nome ?? email,
    usuario: email,
    userId,
    funcionarioId: data.funcionario_id ?? void 0
  };
}
function AuthProvider({ children }) {
  const [session, setSession] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  reactExports.useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      if (s?.user && mounted) {
        const prof = await loadProfile(s.user.id, s.user.email ?? "");
        if (mounted) setSession(prof);
      }
      if (mounted) setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      if (s?.user) {
        const prof = await loadProfile(s.user.id, s.user.email ?? "");
        setSession(prof);
      } else {
        setSession(null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  const signIn = async (email, senha) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: senha });
    if (error) return { error: error.message };
    if (data.user) {
      const prof = await loadProfile(data.user.id, data.user.email ?? "");
      if (!prof) {
        await supabase.auth.signOut();
        return { error: "Usuário sem perfil ativo. Contate o diretor." };
      }
      setSession(prof);
    }
    return { error: null };
  };
  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Ctx.Provider, { value: { session, loading, signIn, signOut }, children });
}
function useAuth() {
  const ctx = reactExports.useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
const PERFIL_LABEL = {
  diretor: "Diretor",
  administrativo: "Administrativo",
  recepcao: "Recepção",
  terapeuta: "Terapeuta"
};
function menusFor(perfil) {
  switch (perfil) {
    case "diretor":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
        { to: "/anotacoes", label: "Anotações", icon: "notebook-pen" },
        { to: "/funcionarios", label: "Funcionários", icon: "id-badge" },
        { to: "/usuarios", label: "Usuários", icon: "shield" },
        { to: "/logs", label: "Logs", icon: "scroll" }
      ];
    case "administrativo":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
        { to: "/funcionarios", label: "Funcionários", icon: "id-badge" },
        { to: "/logs", label: "Logs", icon: "scroll" }
      ];
    case "recepcao":
      return [
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
        { to: "/anotacoes", label: "Anotações", icon: "notebook-pen" }
      ];
    case "terapeuta":
      return [
        { to: "/minha-agenda", label: "Minha Agenda", icon: "calendar" },
        { to: "/anotacoes", label: "Anotações", icon: "notebook-pen" }
      ];
  }
}
function homeFor(perfil) {
  if (perfil === "terapeuta") return "/minha-agenda";
  if (perfil === "recepcao") return "/checkin";
  return "/dashboard";
}
function podeEditarAgenda(perfil) {
  return perfil !== "terapeuta";
}
const url = "/__l5e/assets-v1/32906847-5b94-4ccc-9aee-fe1850154308/rosazul-logo.jpg";
const logo = {
  url
};
const ICONS = {
  "layout-dashboard": LayoutDashboard,
  calendar: Calendar,
  "check-circle": CircleCheck,
  users: Users,
  "id-badge": IdCard,
  shield: Shield,
  scroll: ScrollText,
  "notebook-pen": NotebookPen
};
function AppShell() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobile, setOpenMobile] = reactExports.useState(false);
  if (!session) {
    if (location.pathname !== "/login") {
      queueMicrotask(() => navigate({ to: "/login" }));
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {});
  }
  const menus = menusFor(session.perfil);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "hidden lg:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { menus, onNavigate: () => {
    } }) }),
    openMobile && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "lg:hidden fixed inset-0 z-40 flex", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 bg-black/40", onClick: () => setOpenMobile(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "relative z-50 w-72 bg-sidebar text-sidebar-foreground flex flex-col", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => setOpenMobile(false),
            className: "absolute top-3 right-3 p-2 rounded-md hover:bg-sidebar-accent",
            "aria-label": "Fechar menu",
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-5" })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SidebarContent, { menus, onNavigate: () => setOpenMobile(false) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 flex-1 flex-col", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 lg:px-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              className: "lg:hidden p-2 rounded-md hover:bg-accent",
              onClick: () => setOpenMobile(true),
              "aria-label": "Abrir menu",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { className: "size-5" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden sm:block", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Bem-vindo(a)" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: session.nome })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary", children: PERFIL_LABEL[session.perfil] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              onClick: () => {
                signOut();
                navigate({ to: "/login" });
              },
              className: "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(LogOut, { className: "size-4" }),
                " Sair"
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "flex-1 p-4 lg:p-8 min-w-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) })
    ] })
  ] });
}
function SidebarContent({
  menus,
  onNavigate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-5 py-5 border-b border-sidebar-border", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: logo.url, alt: "Centro de Desenvolvimento Humano Rosazul", className: "size-10 rounded-md object-contain bg-white" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-bold leading-tight whitespace-pre-line", children: "Centro de Desenvolvimento\nHumano Rosazul" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Nunes.tech" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex-1 overflow-y-auto p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: menus.map((m) => {
      const Icon = ICONS[m.icon] ?? LayoutDashboard;
      return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: m.to,
          onClick: onNavigate,
          className: "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
          activeProps: { className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "size-5" }),
            m.label
          ]
        }
      ) }, m.to);
    }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4 text-[11px] text-muted-foreground border-t border-sidebar-border", children: "v1.0" })
  ] });
}
function PageHeader({
  title,
  description,
  actions
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-2xl font-bold tracking-tight", children: title }),
      description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground mt-1", children: description })
    ] }),
    actions && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-2", children: actions })
  ] });
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold", children: "Página não encontrada" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "A página que você procura não existe ou foi movida." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      "a",
      {
        href: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
        children: "Ir para o início"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight", children: "Algo deu errado" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Tente novamente ou volte para o início." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
          children: "Tentar novamente"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent",
          children: "Início"
        }
      )
    ] })
  ] }) });
}
const Route$d = createRootRouteWithContext()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Centro de Desenvolvimento Humano Rosazul — Nunes.tech" },
      { name: "description", content: "Sistema interno de gestão administrativa da clínica Centro de Desenvolvimento Humano Rosazul." },
      { property: "og:title", content: "Centro de Desenvolvimento Humano Rosazul — Nunes.tech" },
      { name: "twitter:title", content: "Centro de Desenvolvimento Humano Rosazul — Nunes.tech" },
      { property: "og:description", content: "Sistema interno de gestão administrativa da clínica Centro de Desenvolvimento Humano Rosazul." },
      { name: "twitter:description", content: "Sistema interno de gestão administrativa da clínica Centro de Desenvolvimento Humano Rosazul." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2202168a-d243-42e0-8458-d20cb7b70304/id-preview-d5e42018--e2d135b5-8722-49ba-95aa-de1e7351e75b.lovable.app-1780785324487.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/2202168a-d243-42e0-8458-d20cb7b70304/id-preview-d5e42018--e2d135b5-8722-49ba-95aa-de1e7351e75b.lovable.app-1780785324487.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" }
    ],
    links: [{ rel: "stylesheet", href: appCss }]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "pt-BR", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$d.useRouteContext();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(QueryClientProvider, { client: queryClient, children: /* @__PURE__ */ jsxRuntimeExports.jsx(AuthProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, {}) }) });
}
const $$splitComponentImporter$c = () => import("./usuarios-DLgyM6Mw.mjs");
const Route$c = createFileRoute("/usuarios")({
  head: () => ({
    meta: [{
      title: "Usuários — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$c, "component")
});
const $$splitComponentImporter$b = () => import("./minha-agenda-Cs0VYo5X.mjs");
const Route$b = createFileRoute("/minha-agenda")({
  head: () => ({
    meta: [{
      title: "Minha agenda — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$b, "component")
});
const $$splitComponentImporter$a = () => import("./logs-D7CvVjKt.mjs");
const Route$a = createFileRoute("/logs")({
  head: () => ({
    meta: [{
      title: "Logs — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$a, "component")
});
const $$splitComponentImporter$9 = () => import("./login-ClGVnarf.mjs");
const Route$9 = createFileRoute("/login")({
  head: () => ({
    meta: [{
      title: "Entrar — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
const $$splitComponentImporter$8 = () => import("./dashboard-CIGKOC1x.mjs");
const Route$8 = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{
      title: "Dashboard — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
const $$splitComponentImporter$7 = () => import("./checkin-B3Jp0Tz6.mjs");
const Route$7 = createFileRoute("/checkin")({
  head: () => ({
    meta: [{
      title: "Check-in — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
const $$splitComponentImporter$6 = () => import("./anotacoes-5pCKpvwg.mjs");
const Route$6 = createFileRoute("/anotacoes")({
  head: () => ({
    meta: [{
      title: "Anotações — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
const $$splitComponentImporter$5 = () => import("./agenda-DV3i2_pD.mjs");
const Route$5 = createFileRoute("/agenda")({
  head: () => ({
    meta: [{
      title: "Agenda — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
const $$splitComponentImporter$4 = () => import("./index-DGWhSfx2.mjs");
const Route$4 = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./pacientes.index-C3s6Cx1e.mjs");
const Route$3 = createFileRoute("/pacientes/")({
  head: () => ({
    meta: [{
      title: "Pacientes — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./funcionarios.index-Bemd-M5x.mjs");
const Route$2 = createFileRoute("/funcionarios/")({
  head: () => ({
    meta: [{
      title: "Funcionários — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./pacientes._id-F-bK8zds.mjs");
const Route$1 = createFileRoute("/pacientes/$id")({
  head: () => ({
    meta: [{
      title: "Paciente — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./funcionarios._id-CggCfJOM.mjs");
const Route = createFileRoute("/funcionarios/$id")({
  head: () => ({
    meta: [{
      title: "Funcionário — Centro de Desenvolvimento Humano Rosazul"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const UsuariosRoute = Route$c.update({
  id: "/usuarios",
  path: "/usuarios",
  getParentRoute: () => Route$d
});
const MinhaAgendaRoute = Route$b.update({
  id: "/minha-agenda",
  path: "/minha-agenda",
  getParentRoute: () => Route$d
});
const LogsRoute = Route$a.update({
  id: "/logs",
  path: "/logs",
  getParentRoute: () => Route$d
});
const LoginRoute = Route$9.update({
  id: "/login",
  path: "/login",
  getParentRoute: () => Route$d
});
const DashboardRoute = Route$8.update({
  id: "/dashboard",
  path: "/dashboard",
  getParentRoute: () => Route$d
});
const CheckinRoute = Route$7.update({
  id: "/checkin",
  path: "/checkin",
  getParentRoute: () => Route$d
});
const AnotacoesRoute = Route$6.update({
  id: "/anotacoes",
  path: "/anotacoes",
  getParentRoute: () => Route$d
});
const AgendaRoute = Route$5.update({
  id: "/agenda",
  path: "/agenda",
  getParentRoute: () => Route$d
});
const IndexRoute = Route$4.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$d
});
const PacientesIndexRoute = Route$3.update({
  id: "/pacientes/",
  path: "/pacientes/",
  getParentRoute: () => Route$d
});
const FuncionariosIndexRoute = Route$2.update({
  id: "/funcionarios/",
  path: "/funcionarios/",
  getParentRoute: () => Route$d
});
const PacientesIdRoute = Route$1.update({
  id: "/pacientes/$id",
  path: "/pacientes/$id",
  getParentRoute: () => Route$d
});
const FuncionariosIdRoute = Route.update({
  id: "/funcionarios/$id",
  path: "/funcionarios/$id",
  getParentRoute: () => Route$d
});
const rootRouteChildren = {
  IndexRoute,
  AgendaRoute,
  AnotacoesRoute,
  CheckinRoute,
  DashboardRoute,
  LoginRoute,
  LogsRoute,
  MinhaAgendaRoute,
  UsuariosRoute,
  FuncionariosIdRoute,
  PacientesIdRoute,
  FuncionariosIndexRoute,
  PacientesIndexRoute
};
const routeTree = Route$d._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  PageHeader as P,
  Route$1 as R,
  PERFIL_LABEL as a,
  Route as b,
  homeFor as h,
  logo as l,
  podeEditarAgenda as p,
  router as r,
  useAuth as u
};
