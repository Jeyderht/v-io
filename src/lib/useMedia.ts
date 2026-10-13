"use client";

import { useSyncExternalStore } from "react";

/** Misma condición que usa globals.css para mostrar la portada de escritorio (.hero-d). */
export const MQ_ESCRITORIO = "(min-width: 900px) and (min-aspect-ratio: 1/1)";
const MQ_MENOS_MOVIMIENTO = "(prefers-reduced-motion: reduce)";

/** ¿Se cumple la media query? (false en el HTML estático) */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (avisar) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", avisar);
      return () => mq.removeEventListener("change", avisar);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

interface Conexion extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}
const conexion = (): Conexion | undefined => (typeof navigator !== "undefined" ? (navigator as Navigator & { connection?: Conexion }).connection : undefined);

/** ¿Ahorro de datos activado o conexión lenta (2G/3G)? */
function conexionLenta(): boolean {
  const c = conexion();
  return !!c && (!!c.saveData || /(^|-)(2g|3g)$/.test(c.effectiveType || ""));
}

/**
 * ¿Se puede reproducir el video de portada?
 * No con movimiento reducido, ahorro de datos o conexión lenta: ahí se ve solo el póster.
 * En el HTML estático es false (el video se monta ya en el navegador).
 */
export function useVideoPermitido(): boolean {
  const menosMovimiento = useMediaQuery(MQ_MENOS_MOVIMIENTO);
  const lenta = useSyncExternalStore(
    (avisar) => {
      const c = conexion();
      c?.addEventListener?.("change", avisar);
      return () => c?.removeEventListener?.("change", avisar);
    },
    conexionLenta,
    () => true,
  );
  return !menosMovimiento && !lenta;
}
