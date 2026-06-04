import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/pacientes/novo")({
  component: () => <Navigate to="/pacientes/$id" params={{ id: "novo" }} />,
});
