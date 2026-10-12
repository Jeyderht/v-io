"use client";

import type { Plan } from "@/types";
import { ESTILOS, segmento } from "@/lib/estilos";
import { vio } from "@/lib/useVio";

/** Tarjeta de un plan en la página Planes. */
export function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  return (
    <article className={plan.featured ? ESTILOS.cardHot : ESTILOS.card}>
      <div className="flex gap-3 items-center justify-between">
        <h2 className="m-0 font-extrabold tracking-[-0.04em] text-[24px] text-ink">{plan.name}</h2>
        {plan.featured && <span className="text-[13px] font-bold text-night bg-ink rounded-full py-1.75 px-3">Más elegido</span>}
      </div>
      <p className="m-0 text-[15px] text-muted">{plan.desc}</p>
      <div className="flex gap-2 items-baseline">
        <span className="text-[44px] font-bold tracking-[-0.03em]">{annual ? plan.y : plan.m}</span>
        <span className="text-[15px] text-muted">{annual ? "/ año" : "/ mes"}</span>
      </div>
      <ul className="m-0 px-0 pt-4.5 pb-0 list-none flex flex-col gap-3 grow [border-top:0.5px_solid_#FFFFFF12]">
        {plan.features.map((f) => (
          <li key={f} className="flex gap-3 items-center text-[16px]">
            <span className="w-5.5 h-5.5 shrink-0 rounded-[50%] bg-[#FFFFFF1F] inline-flex items-center justify-center" aria-hidden="true">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F7F9FF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
      <button
        className={`press ${plan.featured ? ESTILOS.ctaHot : ESTILOS.cta}`}
        type="button"
        onClick={() => vio.set({ sheetPlan: plan.id, emailTouched: false })}
      >
        {plan.cta}
      </button>
    </article>
  );
}

/** Selector Mensual / Anual (en la página Planes y en la hoja de pago). */
export function PeriodoToggle({ annual, ancho = false }: { annual: boolean; ancho?: boolean }) {
  const extra = ancho ? " flex-1" : "";
  return (
    <>
      <button className={`press ${segmento(!annual)}${extra}`} type="button" onClick={() => vio.set({ annual: false })} aria-pressed={!annual}>
        Mensual
      </button>
      <button className={`press ${segmento(annual)}${extra}`} type="button" onClick={() => vio.set({ annual: true })} aria-pressed={annual}>
        Anual · 2 meses gratis
      </button>
    </>
  );
}
