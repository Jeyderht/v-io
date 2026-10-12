"use client";

import { TIPOS_COTIZACION } from "@/content/catalogo";
import { PRECIO_A_MEDIDA } from "@/content/planes";
import { chip, cx } from "@/lib/estilos";
import { waLink } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { IconWhatsApp } from "../icons";
import { Asa, BotonCerrar, CAMPO_HOJA, ETIQUETA_HOJA, FONDO_HOJA, Overlay, VENTANA_HOJA } from "./Sheet";

/** Hoja "Visual a medida": arma el pedido y lo envía por WhatsApp. */
export function CotizacionSheet() {
  const e = useVio();
  if (!e.quoteOpen) return null;
  const cerrar = () => vio.set({ quoteOpen: false });
  const sel = TIPOS_COTIZACION.find((t) => t.id === e.qType) || TIPOS_COTIZACION[0];
  const mensaje =
    "Hola V-IO, quiero cotizar un visual a medida.\n" +
    "• Tipo: " +
    sel.label +
    "\n" +
    (e.qName ? "• Nombre / marca: " + e.qName + "\n" : "") +
    (e.qDate ? "• Fecha del evento: " + e.qDate + "\n" : "") +
    (e.qDetail ? "• Idea: " + e.qDetail : "");
  return (
    <Overlay
      onClose={cerrar}
      label="Cotizar visual a medida"
      fondo={cx(FONDO_HOJA, "z-90")}
      ventana={cx(VENTANA_HOJA, "w-[min(560px,100%)] max-h-[calc(100vh_-_24px)] overflow-y-auto gap-4")}
    >
      <Asa />
      <div className="flex gap-4 items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="font-extrabold tracking-[-0.04em] text-[22px]">Visual a medida</span>
          <span className="text-[15px] text-muted">Cuéntanos tu idea · desde {PRECIO_A_MEDIDA}</span>
        </div>
        <BotonCerrar onClick={cerrar} />
      </div>
      <div className="flex flex-wrap gap-2" role="group" aria-label="Tipo de visual">
        {TIPOS_COTIZACION.map((t) => (
          <button key={t.id} className={`press ${chip(t.id === sel.id)}`} type="button" onClick={() => vio.set({ qType: t.id })} aria-pressed={t.id === sel.id}>
            {t.label}
          </button>
        ))}
      </div>
      <label className={ETIQUETA_HOJA} htmlFor="q-nombre">
        Tu nombre o marca
        <input
          className={CAMPO_HOJA}
          id="q-nombre"
          type="text"
          value={e.qName}
          onChange={(ev) => vio.set({ qName: ev.target.value })}
          placeholder="DJ, club o productora"
          autoComplete="name"
        />
      </label>
      <label className={ETIQUETA_HOJA} htmlFor="q-fecha">
        Fecha del evento
        <input className={cx(CAMPO_HOJA, "scheme-dark")} id="q-fecha" type="date" value={e.qDate} onChange={(ev) => vio.set({ qDate: ev.target.value })} />
      </label>
      <label className={ETIQUETA_HOJA} htmlFor="q-detalle">
        Tu idea
        <textarea
          className="box-border py-3.5 px-4.5 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink text-[16px] resize-y"
          id="q-detalle"
          rows={3}
          value={e.qDetail}
          onChange={(ev) => vio.set({ qDetail: ev.target.value })}
          placeholder="Colores, estilo, medida de la pantalla, logo…"
        />
      </label>
      <a
        className="press flex items-center justify-center gap-2.5 min-h-14.5 box-border p-4 rounded-full no-underline text-[17px] font-bold bg-ink text-night"
        href={waLink(mensaje)}
        target="_blank"
        rel="noopener"
      >
        <IconWhatsApp size={20} />
        Enviar por WhatsApp
      </a>
      <span className="text-[13px] text-dim text-center">Te respondemos con una propuesta y el precio final</span>
    </Overlay>
  );
}
