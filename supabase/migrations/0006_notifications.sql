-- Fase 1: tabela notifications — registo de cada notificação enviada ao
-- cliente (e-mail na Fase 9; WhatsApp/SMS futuramente, mesmo formato de
-- canal/mensagem/estado).

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,
  application_id uuid references public.credit_applications (id) on delete cascade,
  channel text not null,
  message text not null,
  status text not null,
  created_at timestamptz not null default now()
);

alter table public.notifications enable row level security;

create index notifications_client_id_idx on public.notifications (client_id);
