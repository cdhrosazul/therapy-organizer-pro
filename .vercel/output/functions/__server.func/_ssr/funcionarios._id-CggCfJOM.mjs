import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { w as getFuncionario, x as calcularIdade, y as saveFuncionario, t as removeFuncionario } from "./index-Dl77HIym.mjs";
import { b as Route, P as PageHeader } from "./router-D0wc9rb3.mjs";
import { e as especialidades } from "./data-CC6vuQ0w.mjs";
import { A as AlertDialog, a as AlertDialogContent, b as AlertDialogHeader, c as AlertDialogTitle, d as AlertDialogDescription, e as AlertDialogFooter, f as AlertDialogCancel, g as AlertDialogAction } from "./alert-dialog-BN-TPJM-.mjs";
import { o as ArrowLeft, T as Trash2, m as Save, q as Upload, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
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
const empty = {
  id: "",
  nome: "",
  dataNascimento: "",
  cpf: "",
  rg: "",
  endereco: "",
  telefone: "",
  cargo: "",
  especialidade: void 0,
  salario: 0,
  escala: "Seg-Sex",
  horarioEntrada: "08:00",
  horarioSaida: "17:00",
  status: "ativo",
  documentos: []
};
function FuncForm() {
  const {
    id
  } = Route.useParams();
  const navigate = useNavigate();
  const isNew = id === "novo";
  const [f, setF] = reactExports.useState(empty);
  const [tab, setTab] = reactExports.useState("dados");
  const [confirmDel, setConfirmDel] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (isNew) {
      setF(empty);
      return;
    }
    getFuncionario(id).then((res) => res && setF(res));
  }, [id, isNew]);
  async function handleSave() {
    await saveFuncionario(f);
    navigate({
      to: "/funcionarios"
    });
  }
  async function handleDelete() {
    await removeFuncionario(f.id);
    navigate({
      to: "/funcionarios"
    });
  }
  function handleFiles(tipo, files) {
    if (!files) return;
    const novos = Array.from(files).map((file) => ({
      id: Math.random().toString(36).slice(2),
      tipo,
      nomeArquivo: file.name,
      tamanho: file.size,
      criadoEm: (/* @__PURE__ */ new Date()).toISOString()
    }));
    setF((prev) => ({
      ...prev,
      documentos: [...prev.documentos, ...novos]
    }));
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => navigate({
      to: "/funcionarios"
    }), className: "text-sm text-muted-foreground hover:text-foreground mb-3 inline-flex items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "size-4" }),
      " Voltar"
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { title: isNew ? "Novo funcionário" : f.nome || "Funcionário", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      !isNew && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setConfirmDel(true), className: "inline-flex items-center gap-2 rounded-md border border-destructive/30 px-4 py-2 text-sm font-semibold text-destructive hover:bg-destructive/10", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "size-4" }),
        " Excluir"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: handleSave, className: "inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Save, { className: "size-4" }),
        " Salvar"
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 border-b px-4 pt-3", children: ["dados", "documentos"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setTab(t), className: `px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`, children: t === "dados" ? "Dados" : "Documentos" }, t)) }),
      tab === "dados" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-6 grid md:grid-cols-2 gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Nome completo", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.nome, onChange: (e) => setF({
          ...f,
          nome: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Data de nascimento", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "date", className: inp, value: f.dataNascimento, onChange: (e) => setF({
          ...f,
          dataNascimento: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Idade", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: `${inp} bg-muted`, readOnly: true, value: f.dataNascimento ? `${calcularIdade(f.dataNascimento)} anos` : "" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "CPF", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.cpf, onChange: (e) => setF({
          ...f,
          cpf: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "RG", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.rg, onChange: (e) => setF({
          ...f,
          rg: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Telefone", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.telefone, onChange: (e) => setF({
          ...f,
          telefone: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Endereço", full: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.endereco, onChange: (e) => setF({
          ...f,
          endereco: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Cargo", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.cargo, onChange: (e) => setF({
          ...f,
          cargo: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Especialidade", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inp, value: f.especialidade ?? "", onChange: (e) => setF({
          ...f,
          especialidade: e.target.value || void 0
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "", children: "— Nenhuma —" }),
          especialidades.map((esp) => /* @__PURE__ */ jsxRuntimeExports.jsx("option", { children: esp }, esp))
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Salário (R$)", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "number", className: inp, value: f.salario, onChange: (e) => setF({
          ...f,
          salario: Number(e.target.value)
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Escala", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { className: inp, value: f.escala, onChange: (e) => setF({
          ...f,
          escala: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Horário entrada", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", className: inp, value: f.horarioEntrada, onChange: (e) => setF({
          ...f,
          horarioEntrada: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Horário saída", children: /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "time", className: inp, value: f.horarioSaida, onChange: (e) => setF({
          ...f,
          horarioSaida: e.target.value
        }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(F, { label: "Status", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("select", { className: inp, value: f.status, onChange: (e) => setF({
          ...f,
          status: e.target.value
        }), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ativo", children: "Ativo" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "ferias", children: "Férias" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("option", { value: "inativo", children: "Inativo" })
        ] }) })
      ] }),
      tab === "documentos" && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-6 space-y-5", children: ["RG", "CPF", "Comprovante de residência", "Diploma", "Certificados", "Contrato de trabalho", "Currículo", "Foto"].map((tipo) => {
        const docs = f.documentos.filter((d) => d.tipo === tipo);
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-semibold", children: tipo }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "inline-flex items-center gap-1 text-xs rounded-md border px-2 py-1 cursor-pointer hover:bg-accent", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "size-3" }),
              " Enviar",
              /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "file", accept: ".pdf,.jpg,.jpeg,.png", multiple: true, className: "hidden", onChange: (e) => handleFiles(tipo, e.target.files) })
            ] })
          ] }),
          docs.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xs text-muted-foreground", children: "Nenhum arquivo." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: docs.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between rounded border px-3 py-2 text-sm", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: d.nomeArquivo }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setF((prev) => ({
              ...prev,
              documentos: prev.documentos.filter((x) => x.id !== d.id)
            })), className: "text-muted-foreground hover:text-destructive", children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }) })
          ] }, d.id)) })
        ] }, tipo);
      }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialog, { open: confirmDel, onOpenChange: setConfirmDel, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogContent, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogHeader, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogTitle, { children: [
          "Excluir ",
          f.nome,
          "?"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogDescription, { children: "Esta ação remove o funcionário e todos os horários fixos em que ele é terapeuta. Não pode ser desfeita." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(AlertDialogFooter, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogCancel, { children: "Cancelar" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", children: "Excluir" })
      ] })
    ] }) })
  ] });
}
const inp = "w-full h-10 rounded-md border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
function F({
  label,
  children,
  full
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: full ? "md:col-span-2" : "", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "text-sm font-medium mb-1.5 block", children: label }),
    children
  ] });
}
export {
  FuncForm as component
};
