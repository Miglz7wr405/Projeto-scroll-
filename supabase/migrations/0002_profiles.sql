-- Fase 1: tabela profiles, que estende auth.users, e trigger que a popula
-- automaticamente quando um novo utilizador é criado no Supabase Auth.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null,
  phone text not null unique,
  email text,
  role public.user_role not null default 'cliente',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Os dados de cadastro (nome, telefone, e-mail real) chegam via
-- auth.users.raw_user_meta_data, preenchido pelo cliente Supabase no
-- momento do signUp (ver Fase 3 — autenticação do cliente).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    new.raw_user_meta_data ->> 'real_email'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
