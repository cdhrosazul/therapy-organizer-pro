import { Link, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { menusFor, PERFIL_LABEL } from "@/lib/permissions";
import logo from "@/assets/rosazul-logo.jpg.asset.json";
import {
  LayoutDashboard,
  Calendar,
  CheckCircle2,
  Users,
  IdCard,
  Shield,
  ScrollText,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "layout-dashboard": LayoutDashboard,
  calendar: Calendar,
  "check-circle": CheckCircle2,
  users: Users,
  "id-badge": IdCard,
  shield: Shield,
  scroll: ScrollText,
};

export function AppShell() {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [openMobile, setOpenMobile] = useState(false);

  if (!session) {
    // Render outlet anyway so /login can show
    if (location.pathname !== "/login") {
      // redirect on next tick to avoid setState during render
      queueMicrotask(() => navigate({ to: "/login" }));
    }
    return <Outlet />;
  }

  const menus = menusFor(session.perfil);

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground">
        <SidebarContent menus={menus} onNavigate={() => {}} />
      </aside>

      {/* Sidebar mobile */}
      {openMobile && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setOpenMobile(false)} />
          <aside className="relative z-50 w-72 bg-sidebar text-sidebar-foreground flex flex-col">
            <button
              onClick={() => setOpenMobile(false)}
              className="absolute top-3 right-3 p-2 rounded-md hover:bg-sidebar-accent"
              aria-label="Fechar menu"
            >
              <X className="size-5" />
            </button>
            <SidebarContent menus={menus} onNavigate={() => setOpenMobile(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b bg-card px-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-accent"
              onClick={() => setOpenMobile(true)}
              aria-label="Abrir menu"
            >
              <Menu className="size-5" />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs text-muted-foreground">Bem-vindo(a)</p>
              <p className="text-sm font-semibold">{session.nome}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              {PERFIL_LABEL[session.perfil]}
            </span>
            <button
              onClick={() => {
                signOut();
                navigate({ to: "/login" });
              }}
              className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-accent"
            >
              <LogOut className="size-4" /> Sair
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SidebarContent({
  menus,
  onNavigate,
}: {
  menus: { to: string; label: string; icon: string }[];
  onNavigate: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <img src={logo.url} alt="Centro de Desenvolvimento Humano Rosazul" className="size-10 rounded-md object-contain bg-white" />
        <div>
          <p className="text-[10px] font-bold leading-tight whitespace-pre-line">
            {"Centro de Desenvolvimento\nHumano Rosazul"}
          </p>
          <p className="text-xs text-muted-foreground">Nunes.tech</p>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        <ul className="space-y-1">
          {menus.map((m) => {
            const Icon = ICONS[m.icon] ?? LayoutDashboard;
            return (
              <li key={m.to}>
                <Link
                  to={m.to}
                  onClick={onNavigate}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
                  activeProps={{ className: "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground" }}
                >
                  <Icon className="size-5" />
                  {m.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 text-[11px] text-muted-foreground border-t border-sidebar-border">
        v1.0
      </div>
    </>
  );
}

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
