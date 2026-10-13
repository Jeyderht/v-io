"use client";

import { PLANES } from "@/content/planes";
import { cx } from "@/lib/estilos";
import { waLink } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { IconFlecha, IconPlanes } from "../icons";
import { PeriodoToggle } from "../PlanCard";
import { Asa, BotonCerrar, CAMPO_HOJA, ETIQUETA_HOJA, FONDO_HOJA, Overlay, VENTANA_HOJA } from "./Sheet";

const CORREO_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Hoja de pago: plan elegido, periodo, correo y "Continuar al pago" por WhatsApp. */
export function SuscripcionSheet() {
  const e = useVio();
  const sp = PLANES.find((p) => p.id === e.sheetPlan);
  if (!sp) return null;
  const { annual, email } = e;
  const valido = CORREO_VALIDO.test(email);
  const cerrar = () => vio.set({ sheetPlan: null });
  const href = waLink("Hola V-IO, quiero el plan " + sp.name + " " + (annual ? "anual (" + sp.y + ")" : "mensual (" + sp.m + ")") + ". Mi correo: " + email);
  return (
    <Overlay onClose={cerrar} label="Suscripción" fondo={cx(FONDO_HOJA, "z-90")} ventana={cx(VENTANA_HOJA, "w-[min(520px,100%)] gap-4.5")}>
      <Asa />
      <div className="flex gap-4 items-center">
        <span className="w-14 h-14 shrink-0 rounded-[50%] bg-(--accent) inline-flex items-center justify-center text-white" aria-hidden="true">
          <IconPlanes size={26} />
        </span>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="font-extrabold tracking-[-0.04em] text-[22px]">{sp.name}</span>
          <span className="text-[15px] text-muted">
            {annual ? sp.y : sp.m} {annual ? "/ año" : "/ mes"}
          </span>
        </div>
        <BotonCerrar onClick={cerrar} fijo={false} />
      </div>
      <div
        className="flex gap-1 p-1.25 rounded-full bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12]"
        role="group"
        aria-label="Periodo de facturación"
      >
        <PeriodoToggle annual={annual} ancho />
      </div>
      <label className={ETIQUETA_HOJA} htmlFor="correo">
        Tu correo
        <input
          className={cx(CAMPO_HOJA, "font-medium")}
          id="correo"
          type="email"
          value={email}
          onChange={(ev) => vio.set({ email: ev.target.value })}
          placeholder="tu@correo.com"
          autoComplete="email"
        />
      </label>
      {e.emailTouched && !valido && (
        <span className="text-[14px] text-danger -mt-2" role="alert">
          Escribe un correo válido.
        </span>
      )}
      <a
        className={cx(
          "press flex items-center justify-center gap-2.5 min-h-15 box-border p-4.5 rounded-full no-underline text-[18px] font-bold",
          valido ? "bg-ink text-night" : "bg-[#FFFFFF26] text-ink",
        )}
        href={href}
        target="_blank"
        rel="noopener"
        onClick={(ev) => {
          if (!valido) {
            ev.preventDefault();
            vio.set({ emailTouched: true });
          }
        }}
      >
        Continuar al pago
        <IconFlecha size={18} />
      </a>
      <span className="text-[13px] text-dim text-center">Pagas por WhatsApp (tarjeta, Yape o transferencia) y te enviamos tu código de acceso</span>
      <button
        className="press self-center min-h-11 py-2 px-4 border-0 bg-transparent text-ink cursor-pointer text-[15px] font-semibold underline underline-offset-[4px]"
        type="button"
        onClick={() => vio.set({ sheetPlan: null, loginOpen: true, loginErr: "" })}
      >
        ¿Ya tienes código? Ingresar
      </button>
    </Overlay>
  );
}
