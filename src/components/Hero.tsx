"use client";

/* eslint-disable @next/next/no-img-element -- imágenes de portada configurables (Drive o URL externa) con estilos propios; next/image no aporta en export estático */
import Link from "next/link";
import type { CSSProperties } from "react";
import { nombrePlan } from "@/content/planes";
import { cx } from "@/lib/estilos";
import { heroView, PORTADA_DEFECTO } from "@/lib/portada";
import { useVio, vio } from "@/lib/useVio";
import { MQ_ESCRITORIO, useMediaQuery, useVideoPermitido } from "@/lib/useMedia";
import { miembroActivo } from "@/lib/vistas";
import { IconCuenta, IconFlecha } from "./icons";
import { VideoPortada } from "./VideoPortada";

/**
 * Portada a pantalla completa: imágenes o video, administrables desde Admin → Portada.
 * Solo se monta el video del formato visible (escritorio o móvil), y nunca con movimiento
 * reducido, ahorro de datos o conexión lenta: ahí queda el póster.
 */
export function Hero() {
  const e = useVio();
  const member = miembroActivo(e);
  const hero = heroView({ ...PORTADA_DEFECTO, ...(e.heroSaved || {}) }, false);
  const openPro = () => vio.set({ sheetPlan: "pro", emailTouched: false });
  const escritorio = useMediaQuery(MQ_ESCRITORIO);
  const permitido = useVideoPermitido();
  const video = permitido ? (escritorio ? hero.dVideo : hero.mVideo) : "";
  return (
    <section className="herofull relative min-h-130 box-border" style={{ "--hd": hero.hd, "--hm": hero.hm } as CSSProperties}>
      <div className="herostage relative w-full h-full overflow-hidden">
        <img className="hero-d" src={hero.d1} alt="" aria-hidden="true" referrerPolicy="no-referrer" style={hero.d1Style} />
        {hero.hasD2 && <img className="hero-d" src={hero.d2} alt="" aria-hidden="true" referrerPolicy="no-referrer" style={hero.d2Style} />}
        <img className="hero-m" src={hero.m1} alt="" aria-hidden="true" referrerPolicy="no-referrer" style={hero.m1Style} />
        {hero.hasM2 && <img className="hero-m" src={hero.m2} alt="" aria-hidden="true" referrerPolicy="no-referrer" style={hero.m2Style} />}
        {video && (
          <VideoPortada
            src={video}
            poster={escritorio ? hero.d1 : hero.m1}
            className={escritorio ? "hero-d" : "hero-m"}
            style={escritorio ? hero.d1Style : hero.m1Style}
          />
        )}
        <div aria-hidden="true" style={hero.dark} />
        <div className="absolute top-5.5 left-6 right-6 z-2 flex justify-between items-center">
          <span className="font-bold text-[26px] tracking-[-0.02em] leading-[1] text-ink">V-IO</span>
          <div className="flex gap-2 items-center">
            <button
              className={cx(
                "press w-11 h-11 rounded-[50%] inline-flex items-center justify-center cursor-pointer backdrop-blur-[20px]",
                member ? "border-0 bg-ink text-night" : "border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF1F] text-white",
              )}
              type="button"
              onClick={() => vio.set({ loginOpen: true, loginErr: "" })}
              aria-label={member ? "Mi cuenta" : "Ingresar"}
            >
              <IconCuenta size={20} />
            </button>
            <button
              className="press min-h-11 py-2.5 px-4.5 rounded-full border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF1F] text-white cursor-pointer text-[15px] font-semibold backdrop-blur-[20px]"
              type="button"
              onClick={openPro}
            >
              {member ? nombrePlan(member.plan) + " activo" : "PRO"}
            </button>
          </div>
        </div>
        <div className="herocontent absolute inset-0 flex flex-col items-center justify-end gap-5.5 px-5 pt-6 pb-[calc(160px_+_env(safe-area-inset-bottom))] text-center">
          <h1 className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)] m-0">V-IO · Visuales de club</h1>
          <div className="flex flex-wrap gap-2.5 justify-center [animation:rise_1s_.3s_ease_both]">
            <button
              className="press flex items-center justify-center gap-2 min-h-11.5 py-2.75 px-5.5 border-0 cursor-pointer rounded-full bg-ink text-night text-[15px] font-bold"
              type="button"
              onClick={openPro}
            >
              PRO Access
              <IconFlecha />
            </button>
            <Link
              href="/visuales"
              className="press inline-flex items-center justify-center box-border no-underline tracking-normal min-h-11.5 py-2.75 px-5.5 rounded-full bg-[#00000066] border-[0.5px] border-solid border-[#FFFFFF40] text-white cursor-pointer text-[15px] font-semibold backdrop-blur-[20px] shadow-[inset_0_0.5px_0_#FFFFFF40]"
            >
              Ver visuales
            </Link>
          </div>
        </div>
        <div className="playerbar absolute left-[50%] w-35 -ml-17.5 flex flex-col [animation:rise_1s_.45s_ease_both]">
          <div className="h-1 rounded-full bg-[#FFFFFF33] relative" aria-hidden="true">
            <div className="absolute left-0 top-0 bottom-0 rounded-full bg-[#FFFFFFCC] [animation:prog_7s_linear_infinite]" />
          </div>
        </div>
      </div>
    </section>
  );
}
