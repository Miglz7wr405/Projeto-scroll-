-- Fase 1: tabela status_history — auditoria de cada mudança de estado
-- de um pedido de microcrédito.

create table public.status_history (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.credit_applications (id) on delete cascade,
  old_status public.application_status,
  new_status public.application_status not null,
  changed_by uuid references public.profiles (id),
  note text,
  created_at timestamptz not null default now()
);

alter table public.status_history enable row level security;

create index status_history_application_id_idx on public.status_history (application_id);
