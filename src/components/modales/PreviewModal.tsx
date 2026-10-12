"use client";

import { cx } from "@/lib/estilos";
import { useVio, vio } from "@/lib/useVio";
import { catalogoVisible, miembroActivo } from "@/lib/vistas";
import { Overlay } from "./Sheet";

/** Vista previa de un visual (iframe de Drive o animación de ejemplo). */
export function PreviewModal() {
  const e = useVio();
  const member = miembroActivo(e);
  const pv = e.preview != null ? catalogoVisible(e, member).find((t) => t.key === e.preview) : undefined;
  if (!pv) return null;
  const cerrar = () => vio.set({ preview: null });
  const libre = pv.real && !pv.locked;
  return (
    <Overlay
      onClose={cerrar}
      label={pv.title}
      fondo="fixed inset-0 z-80 bg-[#00000099] backdrop-blur-[6px] flex items-center justify-center p-5 [animation:fadeIn_.25s_ease_both]"
      ventana="w-[min(820px,100%)] rounded-[40px] overflow-hidden bg-night border-[0.5px] border-solid border-[#FFFFFF14] [animation:sheetUp_.35s_cubic-bezier(.2,.8,.2,1)_both]"
    >
      <div className="relative overflow-hidden aspect-[16/9]" style={{ background: pv.real ? "#000000" : pv.scene[0] }}>
        {!pv.real && (
          <>
            <div aria-hidden="true" className={pv.scene[1]} />
            <div aria-hidden="true" className={pv.scene[2]} />
            <div className="absolute inset-0 bg-white [animation:strobe_2.8s_linear_infinite]" aria-hidden="true" />
            <span
              className="absolute left-[50%] top-[50%] [transform:translate(-50%,-50%)_rotate(-12deg)] font-extrabold tracking-[-0.04em] text-[length:clamp(28px,6vw,56px)] text-white opacity-[0.18] whitespace-nowrap"
              aria-hidden="true"
            >
              V-IO
            </span>
          </>
        )}
        {pv.real && (
          <iframe
            className="absolute inset-0 w-full h-full border-0 bg-black"
            src={"https://drive.google.com/file/d/" + pv.driveId + "/preview"}
            title={pv.title}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        )}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
          <span className="inline-flex gap-1.5 items-center text-[13px] font-bold text-white py-1.75 px-3 rounded-full bg-[#00000059] border-[0.5px] border-solid border-[#FFFFFF1A]">
            <span className="w-1.75 h-1.75 rounded-[50%] bg-[#50BFED] [animation:pulse_1s_ease-in-out_infinite]" aria-hidden="true" />
            Preview
          </span>
          <button
            className="press pointer-events-auto w-11 h-11 rounded-[50%] border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#00000059] text-white inline-flex items-center justify-center cursor-pointer"
            type="button"
            onClick={cerrar}
            aria-label="Cerrar"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      </div>
      <div className="py-5.5 px-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-[24px] font-bold">{pv.title}</span>
          <span className="text-[15px] text-muted">{pv.tag + (pv.len ? " · " + pv.len : "")}</span>
        </div>
        {!libre && !member && (
          <button
            className="press min-h-14 py-4 px-7 border-0 cursor-pointer rounded-full bg-ink text-night text-[17px] font-bold"
            type="button"
            onClick={() => vio.set({ preview: null, sheetPlan: "pro", emailTouched: false })}
          >
            Desbloquear 4K
          </button>
        )}
        {libre && (
          <a
            className={cx(
              "press inline-flex items-center gap-2.5 min-h-14 box-border py-4 px-7 rounded-full bg-ink text-night no-underline text-[17px] font-bold",
            )}
            href={"https://drive.google.com/uc?export=download&id=" + pv.driveId}
            download={pv.file || pv.title}
            target="_blank"
            rel="noopener"
          >
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 4v11.5M7.5 11L12 15.5 16.5 11" />
              <path d="M4 16.5v1.3A2.2 2.2 0 006.2 20h11.6a2.2 2.2 0 002.2-2.2v-1.3" />
            </svg>
            Descargar
          </a>
        )}
        {libre && (
          <a
            className="press inline-flex items-center gap-2 min-h-14 box-border py-4 px-5.5 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF1F] text-ink no-underline text-[16px] font-semibold"
            href={"https://drive.google.com/file/d/" + pv.driveId + "/view"}
            target="_blank"
            rel="noopener"
          >
            Abrir en Drive
          </a>
        )}
      </div>
    </Overlay>
  );
}
