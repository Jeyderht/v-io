import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { CONFIGURADO, SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

let cliente: SupabaseClient | null = null;

/**
 * Cliente de Supabase (solo en el navegador; null si no está configurado).
 * La sesión del admin la guarda supabase-js en localStorage y la renueva sola.
 */
export function getSupabase(): SupabaseClient | null {
  if (!CONFIGURADO || typeof window === "undefined") return null;
  cliente ??= createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
  });
  return cliente;
}
