import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Perfil } from "@/types";

interface Session {
  perfil: Perfil;
  nome: string;
  usuario: string;
  funcionarioId?: string;
}

interface AuthCtx {
  session: Session | null;
  signIn: (s: Session) => void;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);
const KEY = "rosazul.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw));
    } catch {}
  }, []);

  const signIn = (s: Session) => {
    localStorage.setItem(KEY, JSON.stringify(s));
    setSession(s);
  };
  const signOut = () => {
    localStorage.removeItem(KEY);
    setSession(null);
  };

  return <Ctx.Provider value={{ session, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
