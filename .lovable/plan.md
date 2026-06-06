## Tela de cadastro de usuários (somente diretor)

Criar uma área no app onde o diretor pode criar novos usuários (email + senha + perfil + funcionário vinculado) sem precisar do painel Supabase.

### 1. Secret no Lovable Cloud
- Adicionar `SUPABASE_SERVICE_ROLE_KEY` via tool de secrets (pego pelo usuário em Supabase Dashboard → Project Settings → API → service_role key). Essa chave fica **só no servidor**, nunca no front.

### 2. Server function — `src/lib/admin-users.functions.ts`
- `createUser({ email, password, nome, perfil, funcionarioId? })`
  - Usa `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` (admin) carregado dentro do handler com `await import(...)`.
  - Valida com Zod (email, senha mín. 6, perfil ∈ enum).
  - **Guarda de autorização:** usa `requireSupabaseAuth` para pegar o `userId` do chamador, consulta `profiles` e rejeita se `perfil !== 'diretor'`.
  - `supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true })`.
  - `update profiles set nome, perfil, funcionario_id, ativo=true where id = <novo user>`.
  - Insere log em `logs`.
- `listAuthUsers()` (opcional) — lista usuários do Auth + join com `profiles` para a tela.
- `deleteUser(id)` / `toggleAtivo(id, ativo)` — também restritos a diretor.

### 3. Rota `/usuarios` — `src/routes/_authenticated/usuarios.tsx`
- Visível no menu **apenas se** `perfil === 'diretor'` (atualizar `AppShell` + `permissions.ts`).
- Lista usuários (nome, email, perfil, funcionário vinculado, ativo).
- Botão **"Novo usuário"** → dialog com: email, senha, nome, perfil (select: diretor/recepcao/terapeuta/administrativo), funcionário vinculado (select opcional, obrigatório se perfil = terapeuta).
- Ações por linha: ativar/desativar, redefinir senha (já existe via `resetPasswordForEmail`).

### 4. Ajustes auxiliares
- `src/services/index.ts`: substituir `saveUsuario` para chamar a server function `createUser` ao invés de inserir direto em `profiles` (que não cria o Auth user).
- `src/lib/permissions.ts`: adicionar permissão `gerenciar_usuarios` só para `diretor`.
- `AppShell`: item de menu "Usuários" condicional.

### Segurança
- Service role key **nunca** no client (só lida em `process.env` dentro do handler).
- Toda server function de admin verifica `perfil === 'diretor'` no banco antes de agir.
- Logs de auditoria em todas as operações.

### Fora do escopo
- Convite por email (magic link), 2FA, gestão de organizações.

### Ações suas após implementar
1. Quando eu pedir, colar a `SUPABASE_SERVICE_ROLE_KEY` no formulário seguro.
2. Logar como diretor (`m.sedeque59@gmail.com`) e criar os demais usuários pela tela.
