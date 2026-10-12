import { getSupabase } from "./supabase";

/** ¿La sesión actual es de un administrador? (RPC es_admin del esquema) */
export async function esAdmin(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data, error } = await sb.rpc("es_admin");
  return !error && !!data;
}

/** ¿Hay una sesión de Supabase guardada en este navegador? */
export async function haySesion(): Promise<boolean> {
  const sb = getSupabase();
  if (!sb) return false;
  const { data } = await sb.auth.getSession();
  return !!data.session;
}

/** Login del admin con correo y contraseña. Devuelve un mensaje de error o null. */
export async function iniciarSesion(email: string, password: string): Promise<string | null> {
  const sb = getSupabase();
  if (!sb) return "No se pudo iniciar sesión.";
  try {
    const { error } = await sb.auth.signInWithPassword({ email, password });
    if (!error) return null;
    return error.status === 400 ? "Correo o contraseña incorrectos." : "No se pudo iniciar sesión.";
  } catch {
    return "No se pudo iniciar sesión.";
  }
}

/** Cierra la sesión solo en este navegador. */
export async function cerrarSesion(): Promise<void> {
  const sb = getSupabase();
  if (!sb) return;
  try {
    await sb.auth.signOut({ scope: "local" });
  } catch {
    /* la sesión local se descarta igual */
  }
}

/** Avisa cuando la sesión se pierde (por ejemplo, si no se pudo renovar). */
export function alCerrarSesion(fn: () => void): () => void {
  const sb = getSupabase();
  if (!sb) return () => {};
  const { data } = sb.auth.onAuthStateChange((evento) => {
    if (evento === "SIGNED_OUT") fn();
  });
  return () => data.subscription.unsubscribe();
}
