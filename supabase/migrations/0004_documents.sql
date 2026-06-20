-- Fase 1: tabela documents — referências aos ficheiros no Storage
-- (BI frente/verso e comprovativo de residência). O bucket privado e as
-- políticas de Storage são criados na Fase 5.

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.credit_applications (id) on delete cascade,
  client_id uuid not null references public.profiles (id) on delete cascade,
  doc_type public.document_type not null,
  residence_proof_type public.residence_proof,
  file_path text not null,
  uploaded_at timestamptz not null default now()
);

alter table public.documents enable row level security;

create index documents_application_id_idx on public.documents (application_id);
create index documents_client_id_idx on public.documents (client_id);
