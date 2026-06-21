// URL e anon key públicas do Supabase. Não são segredos: a anon key é
// protegida pelas políticas de RLS, e ambas precisam de chegar ao browser
// para o cliente funcionar. Fixas diretamente no código (em vez de lidas de
// variável de ambiente) porque configuração errada/corrompida no painel da
// hospedagem deixava o site sem inicializar.
export const SUPABASE_URL = "https://vgdcckqxvgyipqcmtarx.supabase.co";

export const SUPABASE_ANON_KEY = "sb_publishable_gqTA7-Q5NTt841W9uaU8JQ_ZxkaY9gf";
