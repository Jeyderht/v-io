"use client";

/* eslint-disable @next/next/no-img-element -- vista previa con imágenes configurables (Drive o URL externa) */
import type { LadoPortada, ModoPortada, PortadaCfg, TipoPortada } from "@/types";
import { chip, cx } from "@/lib/estilos";
import { heroView } from "@/lib/portada";
import { useVio, vio } from "@/lib/useVio";
import { ocultarImg } from "../VisualCard";
import { VideoPortada } from "../VideoPortada";
import { EstadoSubida, PortadaVideo } from "./PortadaVideo";
import { TITULO } from "./comunes";

type Numerico = { [K in keyof PortadaCfg]: PortadaCfg[K] extends number ? K : never }[keyof PortadaCfg];
type Texto = "d1" | "d2" | "m1" | "m2";

interface Grupo {
  /** Lado con selector Imagen / Video (el ajuste general no tiene) */
  lado?: LadoPortada;
  title: string;
  hint: string;
  links: { key: Texto; label: string; placeholder: string }[];
  modos: boolean;
  sliders: { key: Numerico; label: string; min: number; max: number; unit: string }[];
}

const TIPOS: [TipoPortada, string][] = [
  ["imagen", "Imagen"],
  ["video", "Video"],
];

const MODOS: [ModoPortada, string][] = [
  ["derecha", "Foto a la derecha"],
  ["completa", "Pantalla completa"],
];

function grupos(dr: PortadaCfg): Grupo[] {
  return [
    {
      lado: "d",
      title: "Escritorio",
      hint: 'Medida recomendada: 1920 × 1080 px (horizontal). Con "Foto a la derecha" también sirve una foto vertical de 1080 × 1350 px o más. Pega un enlace de Google Drive (compartido como "Cualquier persona con el enlace") o de una imagen.',
      links: [
        { key: "d1", label: "Imagen principal", placeholder: "Enlace de Drive o https://…jpg" },
        { key: "d2", label: "Segunda imagen (opcional, se alterna)", placeholder: "Déjalo vacío para usar una sola" },
      ],
      modos: true,
      sliders: [
        ...(dr.dMode === "completa" ? [] : [{ key: "dW" as const, label: "Ancho de la foto", min: 35, max: 100, unit: "%" }]),
        { key: "dX", label: "Encuadre horizontal", min: 0, max: 100, unit: "%" },
        { key: "dY", label: "Encuadre vertical", min: 0, max: 100, unit: "%" },
        { key: "dH", label: "Alto de la portada", min: 50, max: 100, unit: "% de pantalla" },
      ],
    },
    {
      lado: "m",
      title: "Móvil",
      hint: "Medida recomendada: 1080 × 1920 px (vertical 9:16). Si lo dejas vacío, se usan las imágenes de escritorio.",
      links: [
        { key: "m1", label: "Imagen principal móvil", placeholder: "Vacío = usa la de escritorio" },
        { key: "m2", label: "Segunda imagen móvil (opcional)", placeholder: "Déjalo vacío para usar una sola" },
      ],
      modos: false,
      sliders: [
        { key: "mX", label: "Encuadre horizontal", min: 0, max: 100, unit: "%" },
        { key: "mY", label: "Encuadre vertical", min: 0, max: 100, unit: "%" },
        { key: "mH", label: "Alto de la portada", min: 50, max: 100, unit: "% de pantalla" },
      ],
    },
    {
      title: "Ajuste general",
      hint: "Oscurece la foto o el video si los botones no se leen bien.",
      links: [],
      modos: false,
      sliders: [{ key: "dark", label: "Oscurecer fondo", min: 0, max: 70, unit: "%" }],
    },
  ];
}

/** Admin → Portada: vista previa y ajustes de la portada (tabla ajustes). */
export function TabPortada() {
  const e = useVio();
  const dr = e.heroDraft || vio.heroCfg();
  const prev = heroView(dr, true);
  return (
    <>
      <section className="p-5.5 rounded-[32px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] flex flex-col gap-4.5">
        <div className="flex flex-col gap-1">
          <h2 className={TITULO}>Vista previa</h2>
          <span className="text-[14px] text-muted">Así se verá la portada. Los cambios se aplican al guardar.</span>
        </div>
        <div className="flex flex-wrap gap-3.5 items-end">
          <div className="flex-[1_1_320px] min-w-0 flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-muted">Escritorio</span>
            <div style={prev.dBox}>
              <img src={prev.d1} alt="" referrerPolicy="no-referrer" onError={ocultarImg} style={prev.d1Style} />
              {prev.hasD2 && <img src={prev.d2} alt="" referrerPolicy="no-referrer" onError={ocultarImg} style={prev.d2Style} />}
              {prev.dVideo && <VideoPortada src={prev.dVideo} poster={prev.d1} style={prev.d1Style} />}
              <div style={prev.dark} />
              <span className="absolute left-[8%] bottom-[12%] flex gap-1.5">
                <span className="w-13.5 h-3.5 rounded-full bg-ink" />
                <span className="w-11 h-3.5 rounded-full bg-[#00000066] border-[0.5px] border-solid border-[#FFFFFF40]" />
              </span>
            </div>
          </div>
          <div className="flex-[0_0_auto] flex flex-col gap-1.5">
            <span className="text-[13px] font-semibold text-muted">Móvil</span>
            <div style={prev.mBox}>
              <img src={prev.m1} alt="" referrerPolicy="no-referrer" onError={ocultarImg} style={prev.m1Style} />
              {prev.hasM2 && <img src={prev.m2} alt="" referrerPolicy="no-referrer" onError={ocultarImg} style={prev.m2Style} />}
              {prev.mVideo && <VideoPortada src={prev.mVideo} poster={prev.m1} style={prev.m1Style} />}
              <div style={prev.dark} />
              <span className="absolute left-0 right-0 bottom-[18%] flex gap-1 justify-center">
                <span className="w-9.5 h-2.5 rounded-full bg-ink" />
                <span className="w-8 h-2.5 rounded-full bg-[#00000066] border-[0.5px] border-solid border-[#FFFFFF40]" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {grupos(dr).map((g) => (
        <section key={g.title} className="p-5.5 rounded-[32px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className={TITULO}>{g.title}</h2>
            <span className="text-[14px] leading-[1.5] text-muted">{g.hint}</span>
          </div>
          {g.lado && (
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-muted">Tipo</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label={"Tipo de portada en " + g.title.toLowerCase()}>
                {TIPOS.map(([id, label]) => {
                  const clave = g.lado === "d" ? "dTipo" : "mTipo";
                  return (
                    <button
                      key={id}
                      className={`press ${chip(dr[clave] === id)}`}
                      type="button"
                      onClick={() => vio.setDraft(clave, id)}
                      aria-pressed={dr[clave] === id}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          {g.lado && dr[g.lado === "d" ? "dTipo" : "mTipo"] === "video" && <PortadaVideo lado={g.lado} cfg={dr} />}
          {g.lado && <EstadoSubida lado={g.lado} />}
          {(!g.lado || dr[g.lado === "d" ? "dTipo" : "mTipo"] !== "video") &&
            g.links.map((l) => (
              <label key={l.key} className="flex flex-col gap-2 text-[14px] font-semibold text-muted">
                {l.label}
                <input
                  className="min-h-13 box-border py-0 px-4.5 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink text-[15px]"
                  type="url"
                  inputMode="url"
                  value={dr[l.key] || ""}
                  onChange={(ev) => vio.setDraft(l.key, ev.target.value)}
                  placeholder={l.placeholder}
                  autoComplete="off"
                  spellCheck="false"
                />
              </label>
            ))}
          {g.modos && (
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-semibold text-muted">Diseño</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Diseño de escritorio">
                {MODOS.map(([id, label]) => (
                  <button
                    key={id}
                    className={`press ${chip(dr.dMode === id)}`}
                    type="button"
                    onClick={() => vio.setDraft("dMode", id)}
                    aria-pressed={dr.dMode === id}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
          {g.sliders.map((s) => (
            <label key={s.key} className="flex flex-col gap-1.5 text-[14px] font-semibold text-muted">
              <span className="flex justify-between gap-3">
                <span>{s.label}</span>
                <span className="text-ink">{dr[s.key] + s.unit}</span>
              </span>
              <input
                type="range"
                min={s.min}
                max={s.max}
                step="1"
                value={dr[s.key]}
                onChange={(ev) => vio.setDraft(s.key, Number(ev.target.value))}
                aria-label={s.label}
              />
            </label>
          ))}
        </section>
      ))}

      <div className="flex flex-wrap gap-2.5 items-center">
        <button
          className={cx(
            "press min-h-13 py-3 px-6.5 rounded-full border-0 cursor-pointer text-[16px] font-bold",
            e.heroSaving ? "bg-[#FFFFFF26] text-ink" : "bg-ink text-night",
          )}
          type="button"
          onClick={() => void vio.saveHero()}
        >
          {e.heroSaving ? "Guardando…" : "Guardar portada"}
        </button>
        <button
          className="press min-h-13 py-3 px-5 rounded-full border-[0.5px] border-solid border-[#FFFFFF1F] bg-transparent text-ink cursor-pointer text-[15px] font-semibold"
          type="button"
          onClick={vio.resetHero}
        >
          Restablecer original
        </button>
        {!!e.heroMsg && (
          <span role="status" className={cx("text-[14px] font-semibold", e.heroErr ? "text-danger" : "text-ok")}>
            {e.heroMsg}
          </span>
        )}
      </div>
    </>
  );
}
