-- Fase 1: tabela credit_applications — o pedido de microcrédito em si.

create table public.credit_applications (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.profiles (id) on delete cascade,

  -- dados pessoais
  full_name text not null,
  birth_date date not null,
  document_number text not null,
  phone text not null,
  neighborhood text not null,
  city text not null,
  full_address text not null,

  -- dados profissionais
  occupation text not null,
  workplace_name text,
  work_type public.work_type not null,
  monthly_income numeric(12, 2) not null check (monthly_income >= 0),

  -- dados do empréstimo
  amount_requested numeric(12, 2) not null check (amount_requested > 0),
  loan_reason text not null,
  desired_term text not null,

  -- análise
  status public.application_status not null default 'em_analise',
  admin_notes text,
  approved_amount numeric(12, 2) check (approved_amount >= 0),
  reviewed_by uuid references public.profiles (id),
  reviewed_at timestamptz,

  created_at timestamptz not null default now()
);

alter table public.credit_applications enable row level security;

create index credit_applications_client_id_idx on public.credit_applications (client_id);
create index credit_applications_status_idx on public.credit_applications (status);
create index credit_applications_created_at_idx on public.credit_applications (created_at desc);
