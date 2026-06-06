## Corrigir migration de RLS de `presencas`

`profiles.perfil` é o enum `app_role`. O helper precisa receber `app_role[]` (não `text[]`) e as policies precisam passar o array com cast `::app_role[]`.

Vou regravar `/mnt/documents/migration_presencas_rls.sql` com:

```sql
create or replace function public.tem_perfil(_user uuid, _perfis app_role[])
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = _user
      and coalesce(ativo, true) = true
      and perfil = any(_perfis)
  )
$$;

alter table public.presencas enable row level security;

drop policy if exists "presencas_select" on public.presencas;
create policy "presencas_select" on public.presencas
  for select to authenticated
  using (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao','terapeuta']::app_role[]));

drop policy if exists "presencas_insert" on public.presencas;
create policy "presencas_insert" on public.presencas
  for insert to authenticated
  with check (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao']::app_role[]));

drop policy if exists "presencas_update" on public.presencas;
create policy "presencas_update" on public.presencas
  for update to authenticated
  using (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao']::app_role[]))
  with check (public.tem_perfil(auth.uid(),
    array['diretor','administrativo','recepcao']::app_role[]));

grant select, insert, update on public.presencas to authenticated;
grant all on public.presencas to service_role;
```

Sem outras alterações.
