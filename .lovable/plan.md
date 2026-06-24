## Objetivo
Promover o usuário `m.sedeque59@gmail.com` ao perfil `diretor` no banco Supabase.

## Passos
1. Localizar o `id` em `auth.users` pelo email `m.sedeque59@gmail.com`.
2. Executar `UPDATE public.profiles SET perfil = 'diretor', ativo = true WHERE id = <user_id>`.
3. Confirmar com `SELECT id, email, perfil, ativo FROM public.profiles WHERE email = 'm.sedeque59@gmail.com'`.
4. Registrar a alteração na tabela `logs` (ação: "Perfil alterado", detalhe: "m.sedeque59@gmail.com → diretor").

## Execução
Via Supabase Management API usando o access token já fornecido (projeto `cllltdybhvqfpzaddtuc`). Nenhuma alteração de código da aplicação é necessária — apenas dados.

## Validação
Após o update, o usuário ao fazer login será redirecionado para a home de `diretor` e verá o menu completo (Usuários, Logs, etc.).
