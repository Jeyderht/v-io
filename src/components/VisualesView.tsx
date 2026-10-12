"use client";

import { FILTROS } from "@/content/catalogo";
import { nombrePlan } from "@/content/planes";
import { chip, cx } from "@/lib/estilos";
import { useVio, vio } from "@/lib/useVio";
import { etiquetaFiltro, miembroActivo, tarjetasVisuales } from "@/lib/vistas";
import { IconCerrar, IconUsuario } from "./icons";
import { VisualCard } from "./VisualCard";

export function VisualesView() {
  const e = useVio();
  const member = miembroActivo(e);
  const { tracks, noTracks, catalogSoon } = tarjetasVisuales(e, member);
  return (
    <main className="page pagepad relative max-w-[1280px] my-0 mx-auto pl-3 pr-3 pb-10 flex flex-col gap-4">
      <div className="flex justify-between items-end gap-3 mx-2 mt-0 mb-2">
        <h1 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,84px)] leading-[0.92] text-ink">Visuales</h1>
        <button
          className={cx(
            "press shrink-0 inline-flex items-center gap-2 min-h-11 py-2.5 px-4 rounded-full cursor-pointer text-[15px] font-semibold",
            member ? "border-0 bg-ink text-night" : "border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF14] text-ink",
          )}
          type="button"
          onClick={() => vio.set({ loginOpen: true, loginErr: "" })}
        >
          <IconUsuario size={18} strokeWidth="1.8" />
          {member ? nombrePlan(member.plan) + " activo" : "Ingresar"}
        </button>
      </div>

      {/* Búsqueda */}
      <label
        className="flex items-center gap-2.5 pr-2 pl-4.5 pt-0 pb-0 min-h-13 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF14] backdrop-blur-[24px] shadow-[inset_0_0.5px_0_#FFFFFF26] cursor-text"
        htmlFor="buscar-v"
      >
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9DB0C2" strokeWidth="1.8" strokeLinecap="round">
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="M15.8 15.8l4.7 4.7" />
        </svg>
        <span className="absolute w-px h-px overflow-hidden [clip:rect(0_0_0_0)]">Buscar visuales</span>
        <input
          className="flex-1 min-w-0 h-12 border-0 outline-none bg-transparent text-ink text-[17px]"
          id="buscar-v"
          type="search"
          value={e.query}
          onChange={(ev) => vio.set({ query: ev.target.value })}
          placeholder="Buscar visuales"
          autoComplete="off"
        />
        {e.query.length > 0 && (
          <button
            className="press w-9 h-9 shrink-0 rounded-[50%] border-0 cursor-pointer bg-[#FFFFFF26] text-ink inline-flex items-center justify-center"
            type="button"
            onClick={() => vio.set({ query: "" })}
            aria-label="Borrar búsqueda"
          >
            <IconCerrar size={11} />
          </button>
        )}
      </label>

      {catalogSoon && (
        <div className="py-11 px-6 rounded-[28px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12] text-center flex flex-col gap-2.5 items-center">
          <span className="text-[20px] font-bold">Nuevos visuales muy pronto</span>
          <span className="text-[15px] text-muted">Estamos cargando el catálogo. Mientras tanto, cotiza un visual a medida.</span>
          <button
            className="press mt-1.5 min-h-11 py-2.5 px-5 rounded-full border-0 bg-ink text-night text-[15px] font-bold cursor-pointer"
            type="button"
            onClick={() => vio.set({ quoteOpen: true })}
          >
            Cotizar a medida
          </button>
        </div>
      )}
      {noTracks && (
        <div className="py-10 px-6 rounded-[28px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12] text-center flex flex-col gap-3.5 items-center">
          <span className="text-[18px] font-bold">Sin resultados</span>
          <button
            className="press min-h-11 py-2.5 px-5 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF14] text-ink text-[15px] font-semibold cursor-pointer"
            type="button"
            onClick={() => vio.set({ query: "", filter: "all" })}
          >
            Ver todo
          </button>
        </div>
      )}

      {/* Filtros */}
      <div className="sticky top-3 z-30 rounded-[30px] bg-[#FFFFFF1F] border-[0.5px] border-solid border-[#FFFFFF1A] backdrop-blur-[28px] backdrop-saturate-[180%] shadow-[inset_0_0.5px_0_#FFFFFF4D] overflow-hidden">
        <button
          className="press w-full min-h-16 flex items-center justify-between gap-3 pr-5.5 pl-6.5 pt-0 pb-0 border-0 bg-transparent text-white cursor-pointer text-[20px] font-semibold"
          type="button"
          onClick={() => vio.set({ filtersOpen: !e.filtersOpen })}
          aria-expanded={e.filtersOpen}
        >
          <span>
            Filtros <span className="text-[15px] font-medium text-[#FFFFFFB3]">{e.filter === "all" ? "" : "· " + etiquetaFiltro(e.filter)}</span>
          </span>
          <svg
            aria-hidden="true"
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            className={cx("[transition:transform_.3s_ease]", e.filtersOpen ? "[transform:rotate(45deg)]" : "[transform:rotate(0deg)]")}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        {e.filtersOpen && (
          <div className="flex flex-wrap gap-2 px-4.5 pt-0 pb-4.5 [animation:fadeIn_.25s_ease_both]" role="group" aria-label="Filtrar visuales">
            {FILTROS.map((f) => (
              <button
                key={f.id}
                className={`press ${chip(e.filter === f.id)}`}
                type="button"
                onClick={() => vio.set({ filter: f.id })}
                aria-pressed={e.filter === f.id}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-y-7 gap-x-3.5 pt-2">
        {tracks.map((t) => (
          <VisualCard key={t.key} t={t} />
        ))}
      </div>
    </main>
  );
}
