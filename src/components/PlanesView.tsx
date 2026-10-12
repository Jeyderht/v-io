"use client";

import { PLANES, PRECIO_A_MEDIDA } from "@/content/planes";
import { useVio, vio } from "@/lib/useVio";
import { PeriodoToggle, PlanCard } from "./PlanCard";

export function PlanesView() {
  const { annual } = useVio();
  return (
    <main className="page pagepad relative max-w-[1200px] my-0 mx-auto pl-5 pr-5 pb-10 flex flex-col gap-7 items-center">
      <h1 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,84px)] leading-[0.92] text-ink text-center">Tu acceso</h1>
      <div
        className="inline-flex gap-1 p-1.25 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF14] backdrop-blur-[24px] shadow-[inset_0_0.5px_0_#FFFFFF2E]"
        role="group"
        aria-label="Periodo de facturación"
      >
        <PeriodoToggle annual={annual} />
      </div>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-3.5 items-stretch">
        {PLANES.map((plan) => (
          <PlanCard key={plan.id} plan={plan} annual={annual} />
        ))}
      </div>
      <div className="w-full box-border flex flex-wrap gap-y-4 gap-x-6 items-center justify-between py-6.5 px-7.5 rounded-[34px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF26]">
        <div className="flex flex-col gap-1">
          <strong className="font-extrabold tracking-[-0.03em] text-[22px]">Visuales a medida</strong>
          <span className="text-[15px] text-muted">Logos animados, intros, LED y shows completos · desde {PRECIO_A_MEDIDA}</span>
        </div>
        <button
          className="press min-h-12 py-3 px-5.5 border-0 cursor-pointer rounded-full bg-ink text-night text-[15px] font-bold"
          type="button"
          onClick={() => vio.set({ quoteOpen: true })}
        >
          Cotizar
        </button>
      </div>
      <p className="m-0 text-[14px] text-dim text-center">Precios en soles · Pago con tarjeta, Yape o transferencia · Cancela cuando quieras</p>
      <button
        className="press min-h-11 py-2.5 px-4.5 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink cursor-pointer text-[15px] font-semibold"
        type="button"
        onClick={() => vio.set({ loginOpen: true, loginErr: "" })}
      >
        ¿Ya tienes código? Ingresar
      </button>
    </main>
  );
}
