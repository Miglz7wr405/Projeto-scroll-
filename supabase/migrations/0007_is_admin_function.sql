-- Fase 1: função is_admin(), usada pelas políticas de RLS.
--
-- SECURITY DEFINER + dono `postgres` faz esta função correr sem ficar
-- sujeita à própria RLS de `profiles`, evitando recursão infinita
-- (uma policy em `profiles` que chamasse uma query normal a `profiles`
-- voltaria a acionar a mesma policy).

create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

grant execute on function public.is_admin() to authenticated;
