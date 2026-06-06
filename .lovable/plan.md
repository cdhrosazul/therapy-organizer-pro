## Aba "Anotações" (por paciente)

Sistema de anotações vinculadas a pacientes, com aba global listando todas e edição também dentro da ficha do paciente.

### Acesso por perfil
- Visível no menu lateral para: **Diretor, Terapeuta, Recepção**
- Oculto para: Administrativo
- Terapeuta vê apenas anotações dos pacientes que atende (filtro por `terapeutaId` nos atendimentos fixos).
- Diretor e Recepção veem todas.

### Tela global `/anotacoes`
- Lista de anotações (mais recentes primeiro) com: paciente, autor, data, trecho do texto.
- Filtro por paciente (combobox) e busca textual.
- Botão "Nova anotação" → modal com seleção de paciente + textarea.
- Clicar em uma anotação abre modal de edição (autor original ou Diretor pode editar/excluir).

### Na ficha do paciente `/pacientes/$id`
- Nova seção "Anotações" abaixo dos dados, listando as anotações daquele paciente.
- Campo rápido para adicionar nova anotação.
- Cada item mostra autor + data + texto, com ações editar/excluir conforme permissão.

### Modelo de dados (mock em memória, padrão do projeto)
Novo tipo em `src/types/index.ts`:
```ts
interface Anotacao {
  id: string;
  pacienteId: string;
  autor: string;     // usuario.usuario do logado
  autorNome: string;
  data: string;      // ISO
  texto: string;
}
```
Mock inicial em `src/mocks/data.ts` (algumas amostras).

### Serviços (`src/services/index.ts`)
- `listAnotacoes(filtro?: { pacienteId?, terapeutaId? })`
- `saveAnotacao(a, usuario)` (cria/edita + log)
- `removeAnotacao(id, usuario)` (+ log)
- `removePaciente` já existente: passa a remover também as anotações do paciente.

### Rotas e navegação
- Novo arquivo `src/routes/anotacoes.tsx`.
- `src/lib/permissions.ts`: adicionar item `{ to: "/anotacoes", label: "Anotações", icon: "notebook-pen" }` em `diretor`, `terapeuta` e `recepcao`.
- `AppShell.tsx`: mapear o ícone novo (lucide `NotebookPen`).

### Fora de escopo
- Anexos em anotações.
- Anotações privadas/visibilidade granular além do filtro por perfil acima.
- Histórico de edições.
