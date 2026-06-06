# Plano: liberar 'Confirmar chegada' para o diretor

O botão não muda o status porque as inserções em `presencas` provavelmente falham por RLS, e os erros são engolidos sem feedback. Diretor (e demais perfis com acesso ao Check-in) precisa poder inserir/atualizar presenças.

## 1. RLS de `presencas` (migration)
Garantir que diretor, administrativo e recepcao possam ler, inserir e atualizar registros de presenca:

- Helper `public.tem_perfil(_user uuid, _perfis text[])` (SECURITY DEFINER) que consulta `profiles.perfil` para evitar recursão.
- Em `public.presencas`:
  - habilitar RLS (idempotente)
  - policy SELECT: autenticado com perfil em (diretor, administrativo, recepcao, terapeuta)
  - policy INSERT/UPDATE: autenticado com perfil em (diretor, administrativo, recepcao)
- GRANTs em `presencas` para `authenticated` e `service_role`.

## 2. Propagar erros no serviço (`src/services/index.ts`)
Em `checkinPaciente`, capturar `error` de cada `update`/`insert` e dar `throw` — hoje são ignorados, escondendo erros de RLS.

## 3. Feedback no UI (`src/routes/checkin.tsx`)
Envolver `handleCheckin` em `try/catch`:
- sucesso: `toast.success(\`\${n} sessão(ões) confirmada(s)\`)`
- erro: `toast.error(e.message)` (mostra o motivo real caso ainda haja problema de permissão)

## Detalhes técnicos
Migration (resumo):
```sql
create or replace function public.tem_perfil(_user uuid, _perfis text[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = _user and ativo = true and perfil = any(_perfis)
  )
$$;

alter table public.presencas enable row level security;
drop policy if exists "presencas_select" on public.presencas;
create policy "presencas_select" on public.presencas for select to authenticated
  using (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao','terapeuta']));
drop policy if exists "presencas_insert" on public.presencas;
create policy "presencas_insert" on public.presencas for insert to authenticated
  with check (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao']));
drop policy if exists "presencas_update" on public.presencas;
create policy "presencas_update" on public.presencas for update to authenticated
  using (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao']));

grant select, insert, update on public.presencas to authenticated;
grant all on public.presencas to service_role;
```

Sem alterações em outras telas/permissões.
