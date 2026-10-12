import type { Miembro, PlanId } from "@/types";
import { addMonths } from "./formato";
import { getSupabase } from "./supabase";

function sb() {
  const c = getSupabase();
  if (!c) throw new Error("Supabase no está configurado");
  return c;
}

export type ResultadoCanje = { ok: true; nombre: string; plan: string; expira: number } | { ok: false; error: "invalido" | "vencido" | "otro" | string };

/**
 * Activa un código en este dispositivo (RPC canjear). El servidor aplica el
 * límite de dispositivos del plan (1, 2 o 5) y el vencimiento.
 */
export async function canjear(code: string, disp: string): Promise<ResultadoCanje> {
  const { data, error } = await sb().rpc("canjear", { p_code: code, p_disp: disp });
  if (error) throw error;
  const r = (data || {}) as { ok?: boolean; error?: string; nombre?: string; plan?: string; expira?: string };
  if (r.ok) return { ok: true, nombre: r.nombre || "", plan: r.plan || "pro", expira: Date.parse(r.expira || "") };
  return { ok: false, error: r.error || "invalido" };
}

interface FilaMiembro {
  id: string;
  nombre: string;
  plan: string;
  expira: string;
  disps: string[] | null;
  usado: string | null;
  creado: string;
}

export async function cargarMiembros(): Promise<Miembro[]> {
  const { data, error } = await sb().from("miembros").select("id,nombre,plan,expira,disps,usado,creado").order("creado", { ascending: false });
  if (error) throw error;
  return ((data as FilaMiembro[] | null) || []).map((m) => ({
    id: m.id,
    nombre: m.nombre,
    plan: m.plan,
    expira: Date.parse(m.expira),
    disps: m.disps || [],
    usado: m.usado,
    creado: Date.parse(m.creado),
  }));
}

/** Crea el acceso. Solo se guarda la huella del código (code_hash). */
export async function crearMiembro(m: { nombre: string; plan: PlanId; expira: number; code_hash: string }): Promise<void> {
  const { error } = await sb()
    .from("miembros")
    .insert({ nombre: m.nombre, plan: m.plan, expira: new Date(m.expira).toISOString(), code_hash: m.code_hash });
  if (error) throw error;
}

/** +1 mes desde el vencimiento (o desde hoy si ya venció). */
export async function renovarMiembro(m: Miembro): Promise<void> {
  const base = Math.max(Number(m.expira) || 0, Date.now());
  const { error } = await sb()
    .from("miembros")
    .update({ expira: new Date(addMonths(base, 1)).toISOString() })
    .eq("id", m.id);
  if (error) throw error;
}

/** Libera todos sus dispositivos (el cliente cambió de equipo). */
export async function liberarDispositivos(m: Miembro): Promise<void> {
  const { error } = await sb().from("miembros").update({ disps: [], usado: null }).eq("id", m.id);
  if (error) throw error;
}

export async function quitarMiembro(m: Miembro): Promise<void> {
  const { error } = await sb().from("miembros").delete().eq("id", m.id);
  if (error) throw error;
}
