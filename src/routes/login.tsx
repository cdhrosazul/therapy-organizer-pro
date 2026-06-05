import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { homeFor, PERFIL_LABEL } from "@/lib/permissions";
import type { Perfil } from "@/types";
import logo from "@/assets/rosazul-logo.jpg.asset.json";
import { LogIn } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — Centro De Desenvolvimento Humano Rosazul" }] }),
  component: LoginPage,
});

const perfis: { perfil: Perfil; nome: string; usuario: string; funcionarioId?: string }[] = [
  { perfil: "diretor", nome: "Carlos Diretor", usuario: "diretor" },
  { perfil: "administrativo", nome: "Beatriz Administrativo", usuario: "admin", funcionarioId: "f6" },
  { perfil: "recepcao", nome: "Recepção", usuario: "recepcao", funcionarioId: "f6" },
  { perfil: "terapeuta", nome: "Ana Carolina (Psicologia)", usuario: "ana.psi", funcionarioId: "f1" },
];

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("diretor");
  const [senha, setSenha] = useState("demo");
  const [perfil, setPerfil] = useState<Perfil>("diretor");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const dados = perfis.find((p) => p.perfil === perfil)!;
    signIn({ perfil: dados.perfil, nome: dados.nome, usuario: dados.usuario, funcionarioId: dados.funcionarioId });
    navigate({ to: homeFor(dados.perfil) });
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-primary to-primary/70 text-primary-foreground">
        <div className="flex items-center gap-3">
          <img src={logo.url} alt="Centro De Desenvolvimento Humano Rosazul" className="size-14 rounded-xl bg-white p-1" />
          <div>
            <p className="font-bold text-lg leading-tight">Centro De Desenvolvimento Humano Rosazul</p>
            <p className="text-sm opacity-80">Gestão Clínica Integrada</p>
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
        <p className="text-xs opacity-70">© Centro De Desenvolvimento Humano Rosazul · Demonstração Front-end</p>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <img src={logo.url} alt="Centro De Desenvolvimento Humano Rosazul" className="size-16" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Entrar no sistema</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Selecione um perfil de demonstração para acessar.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Usuário</label>
              <input
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Senha</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="w-full h-11 rounded-lg border bg-card px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Perfil de demonstração</label>
              <div className="grid grid-cols-2 gap-2">
                {(["diretor", "administrativo", "recepcao", "terapeuta"] as Perfil[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setPerfil(p);
                      const dados = perfis.find((x) => x.perfil === p)!;
                      setUsuario(dados.usuario);
                    }}
                    className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                      perfil === p
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {PERFIL_LABEL[p]}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <LogIn className="size-4" /> Entrar
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Demonstração — qualquer senha funciona.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
