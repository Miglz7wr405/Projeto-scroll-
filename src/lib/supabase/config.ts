// URL e anon key públicas do Supabase. Não são segredos: a anon key é
// protegida pelas políticas de RLS, e ambas precisam de chegar ao browser
// para o cliente funcionar. Mantidas como fallback fixo porque variáveis
// NEXT_PUBLIC_* só são inlined no build, e falhas de configuração no painel
// de hospedagem (variável ausente/mal copiada) deixavam o site sem inicializar.
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://vgdcckqxvgyipqcmtarx.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_gqTA7-Q5NTt841W9uaU8JQ_ZxkaY9gf";
