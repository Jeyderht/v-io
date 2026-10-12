"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";
import { ACCENT } from "@/lib/config";
import { vio } from "@/lib/useVio";
import { Dock } from "./Dock";
import { Footer } from "./Footer";
import { CotizacionSheet } from "./modales/CotizacionSheet";
import { LoginSheet } from "./modales/LoginSheet";
import { PreviewModal } from "./modales/PreviewModal";
import { SuscripcionSheet } from "./modales/SuscripcionSheet";

/**
 * Marco de todas las páginas: fondo con brillo, menú, pie y ventanas.
 * Al montarse carga los datos (sesión de admin, código del cliente, catálogo, portada).
 */
export function Shell({ fuente, children }: { fuente: string; children: ReactNode }) {
  useEffect(() => {
    void vio.iniciar();
  }, []);
  return (
    <div
      className={`shell ${fuente} relative overflow-hidden bg-black text-ink tracking-[-0.01em] antialiased min-h-screen`}
      style={{ "--accent": ACCENT } as CSSProperties}
    >
      <div
        className="absolute w-225 h-225 left-[50%] top-50 -ml-112.5 rounded-[50%] bg-(--accent) blur-[160px] [animation:breathe_9s_ease-in-out_infinite]"
        aria-hidden="true"
      />
      <Dock />
      {children}
      <Footer />
      <PreviewModal />
      <SuscripcionSheet />
      <LoginSheet />
      <CotizacionSheet />
    </div>
  );
}
