/** Piezas compartidas del panel de administración. */
import type { ReactNode } from "react";

/** Campo de texto del panel (correo, título, nombre...). */
export const CAMPO = "min-h-13 box-border py-0 px-4.5 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink text-[16px]";
/** Etiqueta encima de un campo. */
export const ETIQUETA = "flex flex-col gap-2 text-[14px] font-semibold text-muted";
/** Tarjeta de sección del panel. */
export const SECCION =
  "p-5.5 rounded-[32px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF26] flex flex-col gap-4";
export const TITULO = "m-0 text-[22px] font-extrabold tracking-[-0.03em]";

/** Grupo de opciones (chips) con su título. */
export function Opciones({ titulo, aria, children }: { titulo: string; aria: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[14px] font-semibold text-muted">{titulo}</span>
      <div className="flex flex-wrap gap-2" role="group" aria-label={aria}>
        {children}
      </div>
    </div>
  );
}
