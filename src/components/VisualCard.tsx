"use client";

/* eslint-disable @next/next/no-img-element -- miniaturas de Google Drive (externas) en export estático */
import type { SyntheticEvent } from "react";
import type { Tarjeta } from "@/types";
import { vio } from "@/lib/useVio";

/** Oculta una miniatura que no cargó (enlace privado, borrado...). */
export const ocultarImg = (e: SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.style.display = "none";
};

/** Miniatura de Drive de un visual (vacía para los de ejemplo). */
export const miniatura = (t: Tarjeta) => (t.real ? "https://drive.google.com/thumbnail?id=" + t.driveId + "&sz=w800" : "");

/** Tarjeta del catálogo. Si está bloqueada abre la suscripción; si no, la vista previa. */
export function VisualCard({ t }: { t: Tarjeta }) {
  const abrir = () => (t.locked ? vio.set({ sheetPlan: "pro", emailTouched: false }) : vio.set({ preview: t.key }));
  return (
    <article className="vcard flex flex-col gap-3.5 min-w-0">
      <button
        className="cover press relative block w-full p-0 border-0 cursor-pointer overflow-hidden aspect-[4/5] rounded-[28px] shadow-[inset_0_0_0_0.5px_#FFFFFF14] text-left"
        style={{ background: t.scene[0] }}
        type="button"
        onClick={abrir}
        aria-label={t.locked ? "Desbloquear " + t.title : "Ver preview de " + t.title}
      >
        <span aria-hidden="true" className={t.scene[1]} />
        <span aria-hidden="true" className={t.scene[2]} />
        {t.real && !!t.driveId && (
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src={miniatura(t)}
            alt=""
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={ocultarImg}
          />
        )}
        {t.locked && (
          <>
            <span className="absolute inset-0 bg-[#FFFFFF26] backdrop-blur-[22px]" aria-hidden="true" />
            <span
              className="absolute left-[50%] top-[58%] [transform:translate(-50%,-50%)] w-14 h-14 rounded-[50%] bg-[#FFFFFF2E] border-[0.5px] border-solid border-[#FFFFFF26] flex items-center justify-center"
              aria-hidden="true"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M7 10V8a5 5 0 0110 0v2h.5A1.5 1.5 0 0119 11.5v8a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 015 19.5v-8A1.5 1.5 0 016.5 10zm2 0h6V8a3 3 0 00-6 0z" />
              </svg>
            </span>
          </>
        )}
        <span className="absolute top-3 left-3 right-3 flex justify-between items-center gap-1.5">
          <span className="text-[13px] font-semibold text-[#FFFFFFCC] py-1.25 px-2.5 rounded-[10px] bg-[#00000040] border-[0.5px] border-solid border-[#FFFFFF14]">
            {t.premium ? "Premium" : "Gratis"}
          </span>
          {!!t.count && (
            <span className="inline-flex gap-1.5 items-center text-[14px] font-bold text-white py-1 px-3 rounded-full bg-[#FFFFFF2E] border-[0.5px] border-solid border-[#FFFFFF2E]">
              <svg aria-hidden="true" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round">
                <rect x="3" y="3" width="8" height="8" rx="2" />
                <rect x="13" y="3" width="8" height="8" rx="2" />
                <rect x="3" y="13" width="8" height="8" rx="2" />
                <rect x="13" y="13" width="8" height="8" rx="2" />
              </svg>
              {t.count}
            </span>
          )}
        </span>
      </button>
      <div className="flex flex-col gap-1.5 py-0 px-1.5">
        <span className="self-start text-[12px] font-semibold text-muted py-0.75 px-2 rounded-[8px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12]">
          {t.tag}
        </span>
        <h2 className="m-0 text-[length:clamp(18px,2vw,22px)] font-medium tracking-[-0.01em] text-ink">{t.title}</h2>
        <span className="text-[16px] font-bold text-muted">{t.len}</span>
      </div>
    </article>
  );
}
