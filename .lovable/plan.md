## Conectar o app ao seu Supabase externo

Você vai usar seu próprio projeto Supabase (cllltdybhvqfpzaddtuc) como banco + autenticação. Como esse projeto não está sob gestão do Lovable Cloud, **você precisará rodar o SQL fornecido no seu Supabase Dashboard** e configurar o provedor Email no Auth.

### 1. Configuração do client

- `bun add @supabase/supabase-js`
- Criar `.env` com:
  - `VITE_SUPABASE_URL=https://cllltdybhvqfpzaddtuc.supabase.co`
  - `VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_2lbE1mzXqTwJ0s4Irm1lEA_kS6Vi6g4`
- `src/integrations/supabase/client.ts`: client browser com persistência em localStorage.
- `src/integrations/supabase/types.ts`: tipagens das tabelas.

### 2. SQL para você rodar no Supabase (entregue como bloco copiável no chat)

Tabelas espelhando os tipos atuais (`src/types/index.ts`):

```text
profiles(id uuid PK -> auth.users, nome, perfil app_role, funcionario_id, ativo)
app_role enum: 'diretor' | 'terapeuta' | 'recepcao' | 'administrativo'
funcionarios(id, nome, cargo, especialidade, ativo, ...)
pacientes(id, nome, responsavel, telefone, observacoes, ativo, ...)
atendimentos(id, paciente_id, terapeuta_id, dia_semana, hora, duracao, sala)
presencas(id, atendimento_id, data, status)
anotacoes(id, paciente_id, autor uuid, autor_nome, data timestamptz, texto)
logs(id, data, usuario, acao, detalhe)
```

Função `has_role(uuid, app_role)` SECURITY DEFINER + RLS:
- **diretor / recepcao**: SELECT/INSERT/UPDATE/DELETE em tudo.
- **terapeuta**: SELECT em pacientes/atendimentos/presencas/anotações **apenas dos pacientes que atende** (subquery em `atendimentos.terapeuta_id = auth.uid()`); INSERT/UPDATE/DELETE em anotações cujo `autor = auth.uid()`; UPDATE em presenças de seus atendimentos.
- **administrativo**: sem acesso às tabelas clínicas (não vê menu nem dados).
- Cada tabela recebe `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated` + `GRANT ALL ... TO service_role` (sem `anon`).
- Trigger `on_auth_user_created` que insere linha em `profiles` no signup.

### 3. Auth

- Substituir `src/lib/auth.tsx` (hoje mock) por versão real:
  - `signIn(email, senha)` via `supabase.auth.signInWithPassword`.
  - `onAuthStateChange` mantendo sessão; carrega `profiles` para obter `perfil` e `funcionarioId`.
  - `signOut` real.
- `src/routes/login.tsx`: trocar campo "usuário" por "email"; mensagens de erro do Supabase.
- `src/lib/permissions.ts` continua usando o `perfil` vindo de `profiles`.
- Como criar o primeiro diretor: instrução no chat para você criar o usuário no Supabase Dashboard e rodar um UPDATE em `profiles` setando `perfil='diretor'`.

### 4. Migrar `src/services/index.ts` para Supabase

Reescrever cada função mantendo a mesma assinatura para não quebrar telas:

- `listPacientes/getPaciente/buscarPacientes/savePaciente/removePaciente` → `from('pacientes')`.
- `listFuncionarios/getFuncionario/saveFuncionario/removeFuncionario` → `from('funcionarios')`.
- `listAtendimentos/saveAtendimento/removeAtendimento` → `from('atendimentos')` com filtros server-side.
- `listPresencas/registrarPresenca/checkinPaciente` → `from('presencas')` com upsert por `(atendimento_id, data)`.
- `listAnotacoes/saveAnotacao/removeAnotacao` → `from('anotacoes')`.
- `listLogs` → `from('logs') order by data desc`.
- `pushLog`: insert em `logs` usando `auth.uid()` e nome do profile.
- `listUsuarios/saveUsuario/redefinirSenha`: tela passa a gerenciar `profiles` (papel/ativo). Criação de novos logins fica fora de escopo nesta etapa (precisa service role); botão "Novo usuário" abrirá instrução para criar via Dashboard. `redefinirSenha` chama `supabase.auth.resetPasswordForEmail`.
- Remover `src/mocks/data.ts` ou deixar apenas como referência (não importado).

Adaptação de nomes: snake_case no banco ↔ camelCase no front via mappers locais nas funções de service.

### 5. Mapeamento de papéis × RLS (resumo)

| Recurso | diretor | recepcao | terapeuta | administrativo |
|---|---|---|---|---|
| pacientes | RW total | RW total | R só dos que atende | — |
| funcionarios | RW total | R | R próprio | — |
| atendimentos | RW total | RW total | R próprios | — |
| presencas | RW total | RW total | RW próprios | — |
| anotacoes | RW total | RW total | RW próprias + R dos pacientes que atende | — |
| logs | R total | R total | — | — |
| profiles | RW total | R | R próprio | R próprio |

### 6. Verificação

- Após você rodar o SQL e criar 1 usuário diretor, login → CRUD em pacientes e anotações → conferir RLS logando como terapeuta de teste.
- `bunx tsc --noEmit` deve passar.

### Fora de escopo
- Storage de arquivos, realtime, edge functions.
- Migração de dados do mock para o banco (começa vazio).
- Tela de criação de novos usuários (fica via Dashboard nesta etapa).
- Reset de senha com página `/reset-password` (pode ser adicionado depois).

### Aviso de segurança
A chave publishable que você compartilhou no chat **não é secreta** (é a anon/publishable do Supabase, segura para front). Mas evite colar a `service_role` aqui — essa sim é sensível.
