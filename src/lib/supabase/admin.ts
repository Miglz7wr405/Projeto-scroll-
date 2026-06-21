import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { SUPABASE_URL } from "./config";

/**
 * Cliente com SUPABASE_SERVICE_ROLE_KEY — ignora RLS.
 * Usar apenas em rotas de servidor/edge functions (ex.: gerar URLs assinadas,
 * promover utilizador a admin). Nunca importar em componentes de cliente.
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
