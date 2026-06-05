type Status = "agendado" | "presente" | "concluido" | "faltou";

const styles: Record<Status, string> = {
  agendado: "bg-white text-foreground border-border",
  presente: "bg-success/15 text-success border-success/30",
  concluido: "bg-info/15 text-info border-info/30",
  faltou: "bg-destructive/15 text-destructive border-destructive/30",
};

const labels: Record<Status, string> = {
  agendado: "Aguardando",
  presente: "Presente",
  concluido: "Concluído",
  faltou: "Faltou",
};

export function StatusBadge({ status }: { status: Status }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${styles[status]}`}
    >
      <span className={`mr-1.5 size-1.5 rounded-full ${
        status === "agendado" ? "bg-muted-foreground" :
        status === "presente" ? "bg-success" :
        status === "concluido" ? "bg-info" : "bg-destructive"
      }`} />
      {labels[status]}
    </span>
  );
}
