"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cx } from "@/lib/estilos";
import { IconCerrar } from "../icons";

/**
 * Fondo oscuro + ventana (role="dialog"). Clic fuera o Esc cierra.
 * Al abrir, el foco entra a la ventana; al cerrar, vuelve a donde estaba.
 */
export function Overlay({
  onClose,
  fondo,
  ventana,
  label,
  children,
}: {
  onClose: () => void;
  fondo: string;
  ventana: string;
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const cerrar = useRef(onClose);
  useEffect(() => {
    cerrar.current = onClose;
  });
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    ref.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") cerrar.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previo?.focus?.({ preventScroll: true });
    };
  }, []);
  return (
    <div className={fondo} onClick={onClose}>
      <div
        ref={ref}
        tabIndex={-1}
        className={cx(ventana, "outline-none")}
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

/** Hoja que sube desde abajo (Suscripción, Ingresar, Cotización). */
export const FONDO_HOJA = "fixed inset-0 bg-[#00000080] backdrop-blur-[6px] flex items-end justify-center p-3 [animation:fadeIn_.2s_ease_both]";
export const VENTANA_HOJA =
  "box-border rounded-[40px] px-6 pt-2.5 pb-6.5 bg-[#0A1A22F2] border-[0.5px] border-solid border-[#FFFFFF14] backdrop-blur-[30px] backdrop-saturate-[180%] shadow-[inset_0_0.5px_0_#FFFFFF33] flex flex-col [animation:sheetUp_.35s_cubic-bezier(.2,.8,.2,1)_both]";

/** Barrita superior de las hojas. */
export const Asa = () => <div className="w-10 h-1.25 rounded-full bg-[#FFFFFF40] self-center" aria-hidden="true" />;

/** Botón redondo ✕ de las hojas. */
export function BotonCerrar({ onClick, fijo = true }: { onClick: () => void; fijo?: boolean }) {
  return (
    <button
      className={cx(
        "press w-11 h-11 rounded-[50%] border-0 bg-[#FFFFFF1F] text-ink inline-flex items-center justify-center cursor-pointer",
        fijo && "shrink-0",
      )}
      type="button"
      onClick={onClick}
      aria-label="Cerrar"
    >
      <IconCerrar />
    </button>
  );
}

/** Campo de las hojas. */
export const CAMPO_HOJA = "min-h-13 box-border py-0 px-4.5 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink text-[16px]";
export const ETIQUETA_HOJA = "flex flex-col gap-2 text-[14px] font-semibold text-muted";
