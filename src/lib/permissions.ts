import type { Perfil } from "@/types";

export interface MenuItem {
  to: string;
  label: string;
  icon: string;
}

export const PERFIL_LABEL: Record<Perfil, string> = {
  diretor: "Diretor",
  administrativo: "Administrativo",
  recepcao: "Recepção",
  terapeuta: "Terapeuta",
};

export function menusFor(perfil: Perfil): MenuItem[] {
  switch (perfil) {
    case "diretor":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
        { to: "/funcionarios", label: "Funcionários", icon: "id-badge" },
        { to: "/usuarios", label: "Usuários", icon: "shield" },
        { to: "/logs", label: "Logs", icon: "scroll" },
      ];
    case "administrativo":
      return [
        { to: "/dashboard", label: "Dashboard", icon: "layout-dashboard" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
        { to: "/funcionarios", label: "Funcionários", icon: "id-badge" },
        { to: "/logs", label: "Logs", icon: "scroll" },
      ];
    case "recepcao":
      return [
        { to: "/checkin", label: "Check-in", icon: "check-circle" },
        { to: "/agenda", label: "Agenda", icon: "calendar" },
        { to: "/pacientes", label: "Pacientes", icon: "users" },
      ];
    case "terapeuta":
      return [
        { to: "/minha-agenda", label: "Minha Agenda", icon: "calendar" },
      ];
  }
}

export function homeFor(perfil: Perfil): string {
  if (perfil === "terapeuta") return "/minha-agenda";
  if (perfil === "recepcao") return "/checkin";
  return "/dashboard";
}

export function podeEditarAgenda(perfil: Perfil): boolean {
  return perfil !== "terapeuta";
}
