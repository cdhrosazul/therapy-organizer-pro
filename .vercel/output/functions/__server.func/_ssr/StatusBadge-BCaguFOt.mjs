import { j as jsxRuntimeExports } from "../_libs/react.mjs";
const styles = {
  agendado: "bg-white text-foreground border-border",
  presente: "bg-success/15 text-success border-success/30",
  concluido: "bg-info/15 text-info border-info/30",
  faltou: "bg-destructive/15 text-destructive border-destructive/30"
};
const labels = {
  agendado: "Aguardando",
  presente: "Presente",
  concluido: "Concluído",
  faltou: "Faltou"
};
function StatusBadge({ status }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: `inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `mr-1.5 size-1.5 rounded-full ${status === "agendado" ? "bg-muted-foreground" : status === "presente" ? "bg-success" : status === "concluido" ? "bg-info" : "bg-destructive"}` }),
        labels[status]
      ]
    }
  );
}
export {
  StatusBadge as S
};
