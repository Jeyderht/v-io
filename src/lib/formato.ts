import { WHATSAPP } from "./config";

export function fmtDate(ms: number): string {
  try {
    return new Date(ms).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric" });
  } catch {
    return "";
  }
}

export function addMonths(base: number, n: number): number {
  const d = new Date(base);
  d.setMonth(d.getMonth() + n);
  return d.getTime();
}

/** Enlace de WhatsApp al número de V-IO con un mensaje. */
export function waLink(msg: string): string {
  return "https://wa.me/" + (WHATSAPP || "51") + "?text=" + encodeURIComponent(msg);
}

/** Id de un archivo de Google Drive a partir de su enlace ('' si no lo reconoce). */
export function parseDrive(url: string): string {
  const u = String(url || "").trim();
  const m = u.match(/\/d\/([a-zA-Z0-9_-]{20,})/) || u.match(/[?&]id=([a-zA-Z0-9_-]{20,})/);
  if (m) return m[1];
  if (/^[a-zA-Z0-9_-]{25,}$/.test(u)) return u;
  return "";
}
