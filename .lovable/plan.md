## Causa da tela em branco

A rota `src/routes/pacientes.novo.tsx` faz `<Navigate to="/pacientes/$id" params={{ id: "novo" }} />`. O TanStack Router considera o segmento literal `/pacientes/novo` mais específico que `/pacientes/$id`, então o `Navigate` cai de volta na mesma rota → loop infinito → React não renderiza nada → tela branca. O aviso de `postMessage` no console é do script do Lovable, não está relacionado.

## Correção

1. **Apagar** `src/routes/pacientes.novo.tsx` (rota redundante que causa o loop).
2. **Ajustar** `src/routes/pacientes.index.tsx`: trocar `navigate({ to: "/pacientes/novo" })` por `navigate({ to: "/pacientes/$id", params: { id: "novo" } })` no botão "Novo paciente".

A rota `pacientes.$id.tsx` já trata `id === "novo"` como cadastro novo (estado `empty`, sem `getPaciente`), então o formulário abre normalmente.

Sem mudanças em banco/SQL/serviços.