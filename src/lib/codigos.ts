import { aleatorio } from "./dispositivo";

const ABC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** "vio-abcd-efgh" o "ABCDEFGH" → "VIOABCDEFGH" (11 caracteres). */
export function normCode(raw: string): string {
  let s = String(raw || "")
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");
  if (s.length === 8) s = "VIO" + s;
  return s;
}

/**
 * Huella del código: SHA-256 de "v-io:" + código normalizado, en hexadecimal.
 * Es lo único que se guarda en la base (igual que en supabase/schema.sql → canjear()).
 */
export async function hashCodigo(raw: string): Promise<string> {
  const s = normCode(raw);
  try {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode("v-io:" + s));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    // Sin crypto.subtle (http sin TLS): mismo respaldo que la versión anterior.
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return "x" + h.toString(16) + s.length;
  }
}

/** Código nuevo con el formato VIO-XXXX-XXXX. */
export function genCode(): string {
  const ch = Array.from(aleatorio(8))
    .map((n) => ABC[n % ABC.length])
    .join("");
  return "VIO-" + ch.slice(0, 4) + "-" + ch.slice(4);
}
