/** Configuración pública (variables NEXT_PUBLIC_*, se incrustan en el build). */
export const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").replace(/\/+$/, "");
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
/** ¿Hay Supabase? Si no, la web muestra el catálogo de ejemplo. */
export const CONFIGURADO = !!(SUPABASE_URL && SUPABASE_ANON_KEY);

/** WhatsApp con código de país, solo números (Perú = 51). */
export const WHATSAPP = (process.env.NEXT_PUBLIC_WHATSAPP ?? "").replace(/\D/g, "");
export const ACCENT = process.env.NEXT_PUBLIC_ACCENT || "#1CA9E5";

/** URL pública del sitio (para sitemap, robots y Open Graph). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://v-io.netlify.app").replace(/\/+$/, "");
