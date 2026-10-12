"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { FAQ } from "@/content/faq";
import { nombrePlan, PRECIO_A_MEDIDA } from "@/content/planes";
import { cx } from "@/lib/estilos";
import { fmtDate, waLink } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { miembroActivo } from "@/lib/vistas";
import { IconEstrella, IconFlecha, IconTicket, IconUsuario, IconWhatsApp } from "./icons";

const tarjeta =
  "press flex items-center gap-4.5 py-5.5 px-6 rounded-[30px] cursor-pointer text-left text-ink bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF26]";
const icono = "w-13 h-13 shrink-0 rounded-[50%] bg-[#FFFFFF1A] text-aqua inline-flex items-center justify-center";

function Contenido({ icon, titulo, sub }: { icon: ReactNode; titulo: string; sub: string }) {
  return (
    <>
      <span className={icono} aria-hidden="true">
        {icon}
      </span>
      <span className="flex flex-col gap-0.5 flex-1 min-w-0">
        <strong className="text-[19px] font-bold">{titulo}</strong>
        <span className="text-[15px] text-muted">{sub}</span>
      </span>
      <IconFlecha />
    </>
  );
}

export function ContactoView() {
  const e = useVio();
  const member = miembroActivo(e);
  return (
    <main className="page pagepad relative max-w-[780px] my-0 mx-auto pl-5 pr-5 pb-10 flex flex-col gap-6">
      <h1 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,84px)] leading-[0.92] text-ink">Contacto</h1>
      <p className="m-0 text-[17px] leading-[1.55] text-muted">Escríbenos para planes, pagos o visuales a medida.</p>
      <a
        className="press flex items-center gap-4.5 py-5.5 px-6 rounded-[30px] no-underline bg-ink text-night"
        href={waLink("Hola V-IO, tengo una consulta.")}
        target="_blank"
        rel="noopener"
      >
        <span className="w-13 h-13 shrink-0 rounded-[50%] bg-night text-ink inline-flex items-center justify-center" aria-hidden="true">
          <IconWhatsApp />
        </span>
        <span className="flex flex-col gap-0.5 flex-1 min-w-0">
          <strong className="text-[19px] font-bold">WhatsApp</strong>
          <span className="text-[15px] text-slate">Respuesta directa con nuestro equipo</span>
        </span>
        <IconFlecha />
      </a>
      <button className={tarjeta} type="button" onClick={() => vio.set({ quoteOpen: true })}>
        <Contenido icon={<IconEstrella />} titulo="Cotizar visual a medida" sub={"Logos, intros, LED y shows · desde " + PRECIO_A_MEDIDA} />
      </button>
      <Link className={cx(tarjeta, "no-underline tracking-normal")} href="/planes">
        <Contenido icon={<IconTicket />} titulo="Ver planes" sub="Suscripción mensual o anual" />
      </Link>
      <button className={tarjeta} type="button" onClick={() => vio.set({ loginOpen: true, loginErr: "" })}>
        <Contenido
          icon={<IconUsuario size={24} />}
          titulo={member ? "Mi cuenta" : "Ingresar con mi código"}
          sub={member ? nombrePlan(member.plan) + " activo hasta el " + fmtDate(member.expira) : "Accede a todo el catálogo premium"}
        />
      </button>

      <h2 className="mx-0 mt-4 mb-0 font-extrabold tracking-[-0.03em] text-[24px] text-ink">Preguntas frecuentes</h2>
      <div className="rounded-[28px] overflow-hidden bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12] shadow-[inset_0_0.5px_0_#FFFFFF26]">
        {FAQ.map((f, i) => (
          <details key={f.q} className={cx("py-4 px-5.5", i > 0 && "[border-top:0.5px_solid_#FFFFFF0F]")}>
            <summary className="min-h-11 text-[17px] font-semibold flex justify-between gap-4 items-center">
              {f.q}
              <svg
                className="chev shrink-0"
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#7F93A6"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 6l6 6-6 6" />
              </svg>
            </summary>
            <p className="mx-0 mt-1.5 mb-1 text-[15px] leading-[1.6] text-muted">{f.a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
