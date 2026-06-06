import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { homeFor } from "@/lib/permissions";
import logo from "@/assets/rosazul-logo.jpg.asset.json";
import { LogIn, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Centro de Desenvolvimento Humano Rosazul" }] }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);
    setLoading(true);
    const { error } = await signIn(email.trim(), senha);
    setLoading(false);
    if (error) {
      setErro(error);
      return;
    }
    // Após signIn, buscar perfil para redirecionar
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    const { data: prof } = await supabase
      .from("profiles")
      .select("perfil")
      .eq("id", data.user.id)
      .maybeSingle();
    const perfil = (prof?.perfil ?? "administrativo") as Parameters<typeof homeFor>[0];
    navigate({ to: homeFor(perfil) });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="Centro de Desenvolvimento Humano Rosazul" className="size-14 rounded-xl bg-white p-1" />
          <div>
            <p className="font-bold text-lg leading-tight whitespace-pre-line">{"Centro de Desenvolvimento\nHumano Rosazul"}</p>
            <p className="text-sm opacity-80">Sistema Desenvolvido por Nunes.Tech</p>
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-bold leading-tight">Tudo num só lugar.<br />Simples. Visual. Seguro.</h2>
          <p className="opacity-90 max-w-md">
            Substitua planilhas e fichas físicas por um sistema centralizado para agendar, atender e acompanhar seus pacientes.
          </p>
          <ul className="space-y-2 text-sm opacity-90">
            <li>• Dashboard com agenda do dia em tempo real</li>
            <li>• Check-in rápido pela recepção</li>
            <li>• Cadastro completo de pacientes e equipe</li>
            <li>• Controle de acesso por perfil</li>
          </ul>
        </div>
        <p className="text-xs opacity-70">© Centro de Desenvolvimento Humano Rosazul ·</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src={logo.url} alt="Centro de Desenvolvimento Humano Rosazul" className="size-16" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Entrar no sistema</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Acesse com seu email e senha.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Senha</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {erro && (
              <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : <LogIn className="size-4" />} Entrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
