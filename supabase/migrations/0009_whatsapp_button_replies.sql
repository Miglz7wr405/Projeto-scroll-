-- Fase 9 (WhatsApp): tabela para registar a resposta do cliente quando ele
-- toca num botão de resposta rápida ("quick reply") de uma mensagem do
-- WhatsApp. Mensagens enviadas continuam a ser registadas em
-- `notifications` (channel = 'whatsapp'); esta tabela guarda só o clique
-- recebido via webhook, para o admin poder ver a reação do cliente.

create table public.whatsapp_button_replies (
  id uuid primary key default gen_random_uuid(),
  client_id uuid references public.profiles (id) on delete cascade,
  phone text not null,
  button_id text not null,
  button_title text not null,
  wa_message_id text,
  created_at timestamptz not null default now()
);

alter table public.whatsapp_button_replies enable row level security;

create index whatsapp_button_replies_client_id_idx on public.whatsapp_button_replies (client_id);

-- Só o admin lê (cliente nunca precisa de ver isto pela app); inserts só via
-- service role (webhook roda em Edge Function com a service key).
create policy "admin le respostas whatsapp"
  on public.whatsapp_button_replies for select
  using (public.is_admin());
