-- Fase 1: tipos enumerados usados pelas tabelas do sistema de microcrédito.

create type public.user_role as enum ('cliente', 'admin');

create type public.work_type as enum ('formal', 'informal', 'negocio_proprio');

create type public.application_status as enum (
  'em_analise',
  'pendente_info',
  'aprovado',
  'rejeitado',
  'pago',
  'finalizado'
);

create type public.document_type as enum (
  'bi_frente',
  'bi_verso',
  'comprovativo_residencia'
);

create type public.residence_proof as enum (
  'declaracao_bairro',
  'talao_energia',
  'talao_agua',
  'outro'
);
