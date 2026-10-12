"use client";

import { PRECIO_A_MEDIDA } from "@/content/planes";
import { vio } from "@/lib/useVio";
import { Hero } from "./Hero";
import { IconFlecha } from "./icons";

const MARQUESINA = ["VJ loops", "LED walls", "4K", "Resolume ready", "Intros DJ", "Licencia eventos"];

const paso = "p-7.5 rounded-[32px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12] shadow-[inset_0_0.5px_0_#FFFFFF26] flex flex-col gap-4";
const pasoIcono = "w-13 h-13 rounded-[50%] inline-flex items-center justify-center bg-[#FFFFFF1A]";
const pasoTitulo = "font-extrabold tracking-[-0.04em] text-[26px]";
const servicio = "p-5 rounded-[24px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12] flex flex-col gap-3";
const servicioTitulo = "text-[16px] font-semibold leading-[1.3]";

export function InicioView() {
  const openPro = () => vio.set({ sheetPlan: "pro", emailTouched: false });
  const openQuote = () => vio.set({ quoteOpen: true });
  return (
    <main className="page relative">
      <Hero />

      {/* Marquesina */}
      <div
        className="relative overflow-hidden [border-top:0.5px_solid_#FFFFFF12] [border-bottom:0.5px_solid_#FFFFFF12] bg-[#FFFFFF08] py-5.5 px-0 mx-0 mt-16 mb-24"
        aria-hidden="true"
      >
        <div className="flex w-max gap-12 [animation:marquee_28s_linear_infinite] font-extrabold tracking-[-0.04em] text-[length:clamp(24px,3.2vw,40px)] text-ink whitespace-nowrap">
          {[0, 1].flatMap((vuelta) =>
            MARQUESINA.flatMap((txt) => [
              <span key={`${vuelta}-${txt}`}>{txt}</span>,
              <span key={`${vuelta}-${txt}-✦`} className="text-(--accent)">
                ✦
              </span>,
            ]),
          )}
        </div>
      </div>

      {/* Cómo funciona */}
      <section className="relative max-w-[1200px] my-0 mx-auto px-5 pt-0 pb-24">
        <ol className="m-0 p-0 list-none grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">
          <li className={paso}>
            <span className={pasoIcono}>
              <svg
                aria-hidden="true"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F7F9FF"
                strokeWidth="1.9"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <path d="M4.5 6h15A1.5 1.5 0 0121 7.5V10a2 2 0 000 4v2.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5V14a2 2 0 000-4V7.5A1.5 1.5 0 014.5 6z" />
                <path d="M14.5 6.5v11" strokeDasharray="2 2.2" />
              </svg>
            </span>
            <strong className={pasoTitulo}>Suscríbete</strong>
          </li>
          <li className={paso}>
            <span className={pasoIcono}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F9FF" strokeWidth="1.9" strokeLinejoin="round">
                <rect x="3" y="3" width="8" height="8" rx="2.2" />
                <rect x="13" y="3" width="8" height="8" rx="2.2" />
                <rect x="3" y="13" width="8" height="8" rx="2.2" />
                <rect x="13" y="13" width="8" height="8" rx="2.2" />
                <path d="M16 15.6v2.8l2.4-1.4z" fill="#F7F9FF" />
              </svg>
            </span>
            <strong className={pasoTitulo}>Descarga</strong>
          </li>
          <li className={paso}>
            <span className={pasoIcono}>
              <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F7F9FF" strokeWidth="1.9" strokeLinecap="round">
                <rect x="2.5" y="8" width="19" height="10" rx="3" />
                <circle cx="15.5" cy="13" r="2.8" />
                <path d="M6 11.5h3M6 14.5h3M15.5 8V4.5M12 5l1.5 2M19 5l-1.5 2" />
              </svg>
            </span>
            <strong className={pasoTitulo}>Proyecta</strong>
          </li>
        </ol>
      </section>

      {/* Visuales a medida */}
      <section className="relative max-w-[1200px] my-0 mx-auto px-5 pt-0 pb-24">
        <div className="relative overflow-hidden rounded-[40px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF26] p-[clamp(28px,5vw,56px)] flex flex-wrap gap-9 items-center">
          <div className="absolute w-130 h-130 -right-40 -top-50 rounded-[50%] bg-[#6F8AD5] opacity-[0.35] blur-[120px]" aria-hidden="true" />
          <div className="relative flex-[1_1_340px] min-w-0 flex flex-col gap-4.5 items-start">
            <span className="text-[13px] font-bold text-aqua">Servicio a medida</span>
            <h2 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(32px,5vw,64px)] leading-[0.95] text-ink">Visuales a medida</h2>
            <p className="m-0 text-[17px] leading-[1.55] text-muted max-w-[440px]">
              Creamos visuales únicos para tu marca, artista o evento. Listos para proyectar.
            </p>
            <div className="flex flex-wrap gap-3.5 items-center">
              <button
                className="press flex items-center gap-2 min-h-12 py-3 px-5.5 border-0 cursor-pointer rounded-full bg-ink text-night text-[15px] font-bold"
                type="button"
                onClick={openQuote}
              >
                Cotizar mi visual
                <IconFlecha size={18} />
              </button>
              <span className="text-[15px] text-muted">
                Desde <strong className="text-ink">{PRECIO_A_MEDIDA}</strong>
              </span>
            </div>
          </div>
          <ul className="relative flex-[1_1_380px] min-w-0 m-0 p-0 list-none grid grid-cols-[repeat(2,minmax(0,1fr))] gap-2.5">
            <li className={servicio}>
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#86D3D8"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 3l2.4 5.2L20 9l-4 4 1 5.6L12 16l-5 2.6L8 13 4 9l5.6-.8z" />
              </svg>
              <strong className={servicioTitulo}>Logo animado e intros</strong>
            </li>
            <li className={servicio}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#86D3D8" strokeWidth="1.9" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="12" rx="2.5" />
                <path d="M7 8h.01M10 8h.01M13 8h.01M16 8h.01M7 12h.01M10 12h.01M13 12h.01M16 12h.01M12 16v3.5M8 20h8" />
              </svg>
              <strong className={servicioTitulo}>LED de cualquier medida</strong>
            </li>
            <li className={servicio}>
              <svg
                aria-hidden="true"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#86D3D8"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="5" width="18" height="16" rx="3" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
              <strong className={servicioTitulo}>Visuales para tu evento</strong>
            </li>
            <li className={servicio}>
              <svg aria-hidden="true" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#86D3D8" strokeWidth="1.9" strokeLinecap="round">
                <path d="M3 12v0M7 8.5v7M11 4.5v15M15 7.5v9M19 10v4" />
              </svg>
              <strong className={servicioTitulo}>Show sincronizado al set</strong>
            </li>
          </ul>
        </div>
      </section>

      {/* Llamado final */}
      <section className="relative max-w-[1200px] my-0 mx-auto px-5 pt-0 pb-16">
        <div className="py-[clamp(40px,7vw,88px)] px-6 rounded-[44px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF33] flex flex-col gap-8 items-center text-center relative overflow-hidden">
          <div
            className="absolute w-140 h-140 left-[50%] top-[50%] mr-0 -ml-70 -mt-70 mb-0 rounded-[50%] bg-(--accent) blur-[100px] [animation:breathe_6s_ease-in-out_infinite]"
            aria-hidden="true"
          />
          <h2 className="relative m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(32px,6vw,84px)] leading-[0.95] text-ink max-w-[900px]">
            Enciende la pantalla
          </h2>
          <button
            className="press relative flex items-center justify-center gap-2.5 w-[min(480px,100%)] min-h-16 p-5 border-0 cursor-pointer rounded-full bg-ink text-night text-[19px] font-bold"
            type="button"
            onClick={openPro}
          >
            PRO Access
            <IconFlecha />
          </button>
        </div>
      </section>
    </main>
  );
}
