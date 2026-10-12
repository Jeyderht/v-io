import type { TipoArchivo, Visual } from "@/types";
import { getSupabase } from "./supabase";

interface FilaVisual {
  id: string;
  title: string;
  cat: string;
  len: string | null;
  premium: boolean | null;
  kind: string | null;
  drive_id: string | null;
  created_at: string;
}

function mapRow(r: FilaVisual): Visual {
  return {
    id: r.id,
    title: r.title,
    cat: r.cat,
    len: r.len || "",
    premium: r.premium !== false,
    driveId: r.drive_id || "",
    kind: r.kind || "video",
    createdAt: Date.parse(r.created_at) || 0,
  };
}

function sb() {
  const c = getSupabase();
  if (!c) throw new Error("Supabase no está configurado");
  return c;
}

/**
 * Catálogo según quién mira:
 * - admin: tabla completa;
 * - miembro: RPC catalogo_miembro (con enlaces premium, validado en el servidor);
 * - público: RPC catalogo (los premium llegan sin enlace de Drive).
 */
export async function cargarCatalogo(quien: { admin: boolean; codigo?: string | null; disp?: string }): Promise<Visual[]> {
  const c = sb();
  const res = quien.admin
    ? await c.from("visuales").select("*").order("created_at", { ascending: false })
    : quien.codigo
      ? await c.rpc("catalogo_miembro", { p_code: quien.codigo, p_disp: quien.disp })
      : await c.rpc("catalogo");
  if (res.error) throw res.error;
  return ((res.data as FilaVisual[] | null) || []).map(mapRow);
}

export async function publicarVisual(v: { title: string; cat: string; len: string; premium: boolean; kind: TipoArchivo; drive_id: string }): Promise<void> {
  const { error } = await sb().from("visuales").insert(v);
  if (error) throw error;
}

export async function cambiarPremium(id: string, premium: boolean): Promise<void> {
  const { error } = await sb().from("visuales").update({ premium }).eq("id", id);
  if (error) throw error;
}

export async function eliminarVisual(id: string): Promise<void> {
  const { error } = await sb().from("visuales").delete().eq("id", id);
  if (error) throw error;
}
