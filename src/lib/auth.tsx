import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Perfil } from "@/types";
import { supabase } from "@/integrations/supabase/client";

interface Session {
  perfil: Perfil;
  nome: string;
  usuario: string; // email
  userId: string;
  funcionarioId?: string;
}

interface AuthCtx {
  session: Session | null;
  loading: boolean;
  signIn: (email: string, senha: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

async function loadProfile(userId: string, email: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("nome, perfil, funcionario_id, ativo")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) return null;
  if (!data.ativo) return null;
  return {
    perfil: data.perfil as Perfil,
    nome: data.nome ?? email,
    usuario: email,
    userId,
    funcionarioId: data.funcionario_id ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  const signIn = async (email: string, senha: string) => {
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

  return <Ctx.Provider value={{ session, loading, signIn, signOut }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
