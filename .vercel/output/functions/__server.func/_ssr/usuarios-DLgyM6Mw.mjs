import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { u as useRouter } from "../_libs/tanstack__react-router.mjs";
import { m as isRedirect } from "../_libs/tanstack__router-core.mjs";
import { a as createServerFn, T as TSS_SERVER_FUNCTION, b as getServerFnById } from "./server-BZvcqNow.mjs";
import { l as listFuncionarios } from "./index-Dl77HIym.mjs";
import { u as useAuth, P as PageHeader, a as PERFIL_LABEL } from "./router-D0wc9rb3.mjs";
import "../_libs/seroval.mjs";
import { P as Plus, K as KeyRound, d as Power, T as Trash2, X } from "../_libs/lucide-react.mjs";
import { o as objectType, b as booleanType, s as stringType, e as enumType } from "../_libs/zod.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "node:stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
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
function useServerFn(serverFn) {
  const router = useRouter();
  return reactExports.useCallback(async (...args) => {
    try {
      const res = await serverFn(...args);
      if (isRedirect(res)) throw res;
      return res;
    } catch (err) {
      if (isRedirect(err)) {
        err.options._fromLocation = router.stores.location.get();
        return router.navigate(router.resolveRedirect(err).options);
      }
      throw err;
    }
  }, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
  const url = "/_serverFn/" + functionId;
  const serverFnMeta = { id: functionId };
  const fn = async (...args) => {
    return (await getServerFnById(functionId))(...args);
  };
  return Object.assign(fn, {
    url,
    serverFnMeta,
    [TSS_SERVER_FUNCTION]: true
  });
};
const PerfilEnum = enumType(["diretor", "administrativo", "recepcao", "terapeuta"]);
const CreateUserSchema = objectType({
  email: stringType().trim().email().max(255),
  password: stringType().min(6).max(72),
  nome: stringType().trim().min(1).max(120),
  perfil: PerfilEnum,
  funcionarioId: stringType().uuid().nullable().optional()
});
const UpdateUserSchema = objectType({
  id: stringType().uuid(),
  nome: stringType().trim().min(1).max(120).optional(),
  perfil: PerfilEnum.optional(),
  funcionarioId: stringType().uuid().nullable().optional(),
  ativo: booleanType().optional()
});
const ResetSchema = objectType({
  id: stringType().uuid(),
  password: stringType().min(6).max(72)
});
const DeleteSchema = objectType({
  id: stringType().uuid()
});
const listUsersAdmin = createServerFn({
  method: "POST"
}).handler(createSsrRpc("958965a0fb05a98a6f1030cfadf8abc7795fbc2d4c9ee85416a448f0b89bf98a"));
const createUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => CreateUserSchema.parse(d)).handler(createSsrRpc("2b7d27e7b84eddf8b46ae96c7c943d63abf364d20bd994daaf98681487e97458"));
const updateUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => UpdateUserSchema.parse(d)).handler(createSsrRpc("1488ab94b720d23d643ff391ad38a7cf995eb4e8a7b4f8b667f182ee3d2a6b89"));
const resetUserPasswordAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => ResetSchema.parse(d)).handler(createSsrRpc("cbed3bc001639f3386c930d864651db0def7d2649be88f64adc927b681c1c0b9"));
const deleteUserAdmin = createServerFn({
  method: "POST"
}).inputValidator((d) => DeleteSchema.parse(d)).handler(createSsrRpc("b038b7038b64255b64730d00c779b1e888cf7dc5f301274ff8e5fecae8ec0084"));
function UsuariosPage() {
  const qc = useQueryClient();
  const {
    session
  } = useAuth();
  const listFn = useServerFn(listUsersAdmin);
  const createFn = useServerFn(createUserAdmin);
  const updateFn = useServerFn(updateUserAdmin);
  const resetFn = useServerFn(resetUserPasswordAdmin);
  const deleteFn = useServerFn(deleteUserAdmin);
  const q = useQuery({
    queryKey: ["usuarios-admin"],
    queryFn: () => listFn(),
    enabled: session?.perfil === "diretor"
  });
  const funcs = useQuery({
    queryKey: ["funcionarios"],
    queryFn: listFuncionarios
  });
  const [novo, setNovo] = reactExports.useState(null);
  const [resetFor, setResetFor] = reactExports.useState(null);
  const [resetPwd, setResetPwd] = reactExports.useState("");
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["usuarios-admin"]
  });
  const createM = useMutation({
    mutationFn: (input) => createFn({
      data: {
        email: input.email,
        password: input.password,
        nome: input.nome,
        perfil: input.perfil,
        funcionarioId: input.funcionarioId || null
      }
    }),
    onSuccess: () => {
      invalidate();
      setNovo(null);
    }
  });
  const toggleM = useMutation({
    mutationFn: (u) => updateFn({
      data: {
        id: u.id,
        ativo: !u.ativo
      }
    }),
    onSuccess: invalidate
  });
  const deleteM = useMutation({
    mutationFn: (id) => deleteFn({
      data: {
        id
      }
    }),
    onSuccess: invalidate
  });
  const resetM = useMutation({
    mutationFn: (input) => resetFn({
      data: input
    }),
    onSuccess: () => {
      setResetFor(null);
      setResetPwd("");
    }
  });
  if (session?.perfil !== "diretor") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Usuários" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card p-6 text-sm text-muted-foreground", children: "Apenas o Diretor pode acessar a gestão de usuários." })
    ] });
  }
  const lista = q.data ?? [];
  const funcionarios = funcs.data ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: "Usuários", description: "Crie, ative/desative e redefina senhas dos usuários do sistema.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setNovo({
      email: "",
      password: "",
      nome: "",
      perfil: "recepcao",
      funcionarioId: ""
    }), className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "size-4" }),
      " Novo usuário"
    ] }) }),
    q.isLoading && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "Carregando…" }),
    q.error && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive", children: q.error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-card overflow-hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "bg-muted/40 text-left", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Nome" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Email" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Perfil" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3", children: "Status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "p-3 text-right", children: "Ações" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("tbody", { className: "divide-y", children: [
        lista.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "hover:bg-accent/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 font-medium", children: u.nome || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3 text-muted-foreground", children: u.usuario }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex rounded-full bg-primary-soft text-primary px-2 py-0.5 text-xs font-medium", children: PERFIL_LABEL[u.perfil] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "p-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs ${u.ativo ? "text-success" : "text-muted-foreground"}`, children: u.ativo ? "Ativo" : "Inativo" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("td", { className: "p-3 text-right space-x-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setResetFor({
              id: u.id,
              email: u.usuario
            }), className: "inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(KeyRound, { className: "size-3" }),
              " Senha"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => toggleM.mutate({
              id: u.id,
              ativo: u.ativo
            }), disabled: u.id === session.userId, className: "inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 hover:bg-accent disabled:opacity-40", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Power, { className: "size-3" }),
              " ",
              u.ativo ? "Desativar" : "Ativar"
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
              if (confirm(`Excluir usuário ${u.usuario}?`)) deleteM.mutate(u.id);
            }, disabled: u.id === session.userId, className: "inline-flex items-center gap-1 text-xs rounded-md border border-destructive/40 text-destructive px-2 py-1 hover:bg-destructive/10 disabled:opacity-40", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-3" }) })
          ] })
        ] }, u.id)),
        !q.isLoading && lista.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 5, className: "p-6 text-center text-muted-foreground text-sm", children: "Nenhum usuário." }) })
      ] })
    ] }) }),
    novo && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: "Novo usuário", onClose: () => setNovo(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nome", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: novo.nome, onChange: (e) => setNovo({
          ...novo,
          nome: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Email", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "email", className: inp, value: novo.email, onChange: (e) => setNovo({
          ...novo,
          email: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Senha (mín. 6)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inp, value: novo.password, onChange: (e) => setNovo({
          ...novo,
          password: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Perfil", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inp, value: novo.perfil, onChange: (e) => setNovo({
          ...novo,
          perfil: e.target.value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "diretor", children: "Diretor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "administrativo", children: "Administrativo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "recepcao", children: "Recepção" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "terapeuta", children: "Terapeuta" })
        ] }) }),
        novo.perfil === "terapeuta" && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Funcionário vinculado (terapeuta)", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inp, value: novo.funcionarioId, onChange: (e) => setNovo({
          ...novo,
          funcionarioId: e.target.value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— selecione —" }),
          funcionarios.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: f.id, children: f.nome }, f.id))
        ] }) }),
        createM.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: createM.error.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-5 py-4 border-t bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setNovo(null), className: "rounded-md border px-3 py-2 text-sm", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: createM.isPending, onClick: () => createM.mutate(novo), className: "rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60", children: createM.isPending ? "Criando…" : "Criar" })
      ] })
    ] }),
    resetFor && /* @__PURE__ */ jsxRuntimeExports.jsxs(Modal, { title: `Redefinir senha — ${resetFor.email}`, onClose: () => setResetFor(null), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5 space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Nova senha (mín. 6)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "text", className: inp, value: resetPwd, onChange: (e) => setResetPwd(e.target.value) }) }),
        resetM.error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: resetM.error.message })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-end gap-2 px-5 py-4 border-t bg-muted/30", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setResetFor(null), className: "rounded-md border px-3 py-2 text-sm", children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { disabled: resetM.isPending || resetPwd.length < 6, onClick: () => resetM.mutate({
          id: resetFor.id,
          password: resetPwd
        }), className: "rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold disabled:opacity-60", children: resetM.isPending ? "Salvando…" : "Salvar" })
      ] })
    ] })
  ] });
}
const inp = "w-full h-10 rounded-md border bg-card px-3 text-sm";
function Field({
  label,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: label }),
    children
  ] });
}
function Modal({
  title,
  onClose,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4", onClick: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-card rounded-2xl border w-full max-w-md shadow-xl", onClick: (e) => e.stopPropagation(), children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between px-5 py-4 border-b", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: onClose, className: "p-2 rounded hover:bg-accent", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
    ] }),
    children
  ] }) });
}
export {
  UsuariosPage as component
};
