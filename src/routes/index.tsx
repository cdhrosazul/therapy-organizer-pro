import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { homeFor } from "@/lib/permissions";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { session } = useAuth();
  if (!session) return <Navigate to="/login" />;
  return <Navigate to={homeFor(session.perfil)} />;
}
