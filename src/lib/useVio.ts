"use client";

import { useSyncExternalStore } from "react";
import { vio, type Estado } from "./estado";

/** Estado global de la web (se vuelve a pintar cuando cambia). */
export function useVio(): Estado {
  return useSyncExternalStore(vio.subscribe, vio.get, vio.getInicial);
}

export { vio };
