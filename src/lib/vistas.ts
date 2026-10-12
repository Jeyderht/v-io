/** Cálculos derivados del estado (antes en renderVals). */
import { CATEGORIAS, ESCENAS, FILTROS, VISUALES_DEMO } from "@/content/catalogo";
import type { Sesion, Tarjeta } from "@/types";
import { CONFIGURADO } from "./config";
import type { Estado } from "./estado";

/** Sesión del cliente solo si sigue vigente. */
export function miembroActivo(e: Estado): Sesion | null {
  return e.member && e.member.expira > e.ahora ? e.member : null;
}

const etiqueta: Record<string, string> = Object.fromEntries(CATEGORIAS.map((c) => [c.id, c.label]));
const hashId = (id: string) =>
  Math.abs(
    String(id)
      .split("")
      .reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7),
  );

/** Visuales guardados en Supabase, más nuevos primero. */
export function catalogoReal(e: Estado, member: Sesion | null): Tarjeta[] {
  return (e.items || [])
    .slice()
    .sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
    .map((d) => {
      const premium = d.premium !== false;
      return {
        key: d.id,
        id: d.id,
        title: d.title || "Sin título",
        tag: etiqueta[d.cat] || "VJ loops",
        type: d.cat || "vj",
        count: "",
        len: d.len || "",
        scene: ESCENAS[hashId(d.id) % ESCENAS.length],
        real: true,
        premium,
        locked: premium && !member,
        driveId: d.driveId || "",
        kind: d.kind === "image" ? "image" : "video",
        file: d.title || "visual",
      };
    });
}

/** Catálogo de ejemplo (sin Supabase). Los 4 primeros son gratis. */
export function catalogoDemo(member: Sesion | null): Tarjeta[] {
  return VISUALES_DEMO.map((t, i) => ({ ...t, key: "d" + i, scene: ESCENAS[i], real: false, premium: i >= 4, locked: i >= 4 && !member }));
}

/** Todo lo que se puede mostrar (real si hay; si no, el de ejemplo). */
export function catalogoVisible(e: Estado, member: Sesion | null): Tarjeta[] {
  const real = catalogoReal(e, member);
  return real.length ? real : catalogoDemo(member);
}

/** Minúsculas y sin tildes, para buscar. */
const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

/**
 * Tarjetas de la página Visuales con filtro y búsqueda aplicados.
 * Con Supabase conectado nunca se muestran las de ejemplo: si aún no hay
 * visuales, la página dice "Nuevos visuales muy pronto" (catalogSoon).
 */
export function tarjetasVisuales(e: Estado, member: Sesion | null) {
  const q = norm(e.query.trim());
  let tracks = catalogoVisible(e, member)
    .filter((t) => e.filter === "all" || t.type === e.filter)
    .filter((t) => !q || norm(t.title + " " + t.tag).includes(q));
  if (!CONFIGURADO) return { tracks, noTracks: tracks.length === 0, catalogSoon: false };
  const soon = Array.isArray(e.items) && e.items.length === 0;
  tracks = tracks.filter((t) => t.real);
  return { tracks, noTracks: !soon && Array.isArray(e.items) && tracks.length === 0, catalogSoon: soon };
}

export const etiquetaFiltro = (id: string) => FILTROS.find((f) => f.id === id)?.label ?? "";
