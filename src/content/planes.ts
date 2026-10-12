import type { Plan, PlanId } from "@/types";

/** Precio "desde" de los visuales a medida */
export const PRECIO_A_MEDIDA = "S/ 350";

/**
 * Planes de suscripción. m = precio mensual, y = precio anual.
 * Si cambias "dispositivos", cámbialo también en supabase/schema.sql (función max_disp).
 */
export const PLANES: Plan[] = [
  {
    id: "dj",
    name: "DJ / VJ",
    desc: "Para DJs y VJs.",
    m: "S/ 39",
    y: "S/ 390",
    dispositivos: 1,
    features: ["Todo el catálogo", "1 dispositivo", "Licencia para tus sets"],
    cta: "Elegir",
  },
  {
    id: "pro",
    name: "PRO",
    featured: true,
    desc: "Para clubs y eventos.",
    m: "S/ 89",
    y: "S/ 890",
    dispositivos: 2,
    features: ["Todo el catálogo", "2 dispositivos", "Licencia para clubs y eventos"],
    cta: "PRO Access",
  },
  {
    id: "prod",
    name: "Productora",
    desc: "Para equipos y venues.",
    m: "S/ 249",
    y: "S/ 2,490",
    dispositivos: 5,
    features: ["Todo el catálogo", "5 dispositivos", "Licencia para venues y productoras"],
    cta: "Elegir",
  },
];

/** Duraciones al crear un acceso en Admin → Miembros: [meses, texto] */
export const DURACIONES_ACCESO: [number, string][] = [
  [1, "1 mes"],
  [3, "3 meses"],
  [12, "1 año"],
];

/** Nombre visible del plan ("PRO" si el id no existe, igual que antes). */
export function nombrePlan(id: string | undefined | null): string {
  return PLANES.find((p) => p.id === id)?.name ?? "PRO";
}

/** Dispositivos que incluye un plan (1 si el id no existe). */
export function dispositivosPlan(id: string | undefined | null): number {
  return PLANES.find((p) => p.id === id)?.dispositivos ?? 1;
}

export function esPlan(id: string): id is PlanId {
  return PLANES.some((p) => p.id === id);
}
