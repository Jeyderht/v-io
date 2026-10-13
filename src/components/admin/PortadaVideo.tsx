"use client";

import { useRef } from "react";
import type { LadoPortada, PortadaCfg } from "@/types";
import { cx } from "@/lib/estilos";
import { rutaEnBucket, TIPOS_POSTER, TIPOS_VIDEO } from "@/lib/portada";
import { useVio, vio } from "@/lib/useVio";

const BOTON =
  "press inline-flex items-center gap-2 min-h-11 py-2.5 px-4.5 rounded-full cursor-pointer text-[15px] font-semibold disabled:opacity-50 disabled:cursor-not-allowed";

const nombreArchivo = (url: string) => rutaEnBucket(url) || url.split("/").pop() || url;

/** Admin → Portada: subir, reemplazar o quitar el video de escritorio o de móvil, y su póster. */
export function PortadaVideo({ lado, cfg }: { lado: LadoPortada; cfg: PortadaCfg }) {
  const e = useVio();
  const s = e.portadaSubida[lado];
  const video = lado === "d" ? cfg.dVideo : cfg.mVideo;
  const poster = lado === "d" ? cfg.dPoster : cfg.mPoster;
  const inputVideo = useRef<HTMLInputElement>(null);
  const inputPoster = useRef<HTMLInputElement>(null);
  const id = lado === "d" ? "escritorio" : "movil";

  const elegido = (ev: React.ChangeEvent<HTMLInputElement>, fn: (lado: LadoPortada, f: File) => Promise<void>) => {
    const f = ev.target.files?.[0];
    ev.target.value = ""; // permite volver a elegir el mismo archivo
    if (f) void fn(lado, f);
  };

  return (
    <div className="flex flex-col gap-3">
      <span className="text-[14px] leading-[1.5] text-muted">
        MP4 o WebM, hasta 15 MB (ideal: menos de {lado === "d" ? "4 MB" : "3 MB"}). Se publica apenas termina de subir. El póster (la imagen que se ve mientras
        carga) se crea solo con un cuadro del video.
        {lado === "m" && " Si no subes un video para móvil, se usa el de escritorio (o su imagen)."}
      </span>

      {video ? (
        <div className="flex flex-col gap-1 text-[13px] text-muted">
          <span>
            Video: <span className="text-ink">{nombreArchivo(video)}</span>
          </span>
          <span>
            Póster: <span className="text-ink">{poster ? nombreArchivo(poster) : "sin póster"}</span>
          </span>
        </div>
      ) : (
        <span className="text-[13px] text-muted">Todavía no hay video {lado === "d" ? "de escritorio" : "para móvil"}.</span>
      )}

      <div className="flex flex-wrap gap-2">
        <button className={cx(BOTON, "border-0 bg-ink text-night")} type="button" disabled={s.ocupado} onClick={() => inputVideo.current?.click()}>
          {video ? "Reemplazar video" : "Subir video"}
        </button>
        {video && (
          <button
            className={cx(BOTON, "border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF14] text-ink")}
            type="button"
            disabled={s.ocupado}
            onClick={() => inputPoster.current?.click()}
          >
            Cambiar póster
          </button>
        )}
        {video && (
          <button
            className={cx(BOTON, "border-[0.5px] border-solid border-[#FFFFFF14] bg-transparent text-danger")}
            type="button"
            disabled={s.ocupado}
            onClick={() => void vio.quitarVideoPortada(lado)}
          >
            Quitar video
          </button>
        )}
        <input
          ref={inputVideo}
          id={"video-" + id}
          type="file"
          accept={TIPOS_VIDEO.join(",")}
          className="hidden"
          onChange={(ev) => elegido(ev, vio.subirVideoPortada)}
          aria-label={"Video de " + id}
        />
        <input
          ref={inputPoster}
          id={"poster-" + id}
          type="file"
          accept={TIPOS_POSTER.join(",")}
          className="hidden"
          onChange={(ev) => elegido(ev, vio.subirPosterPortada)}
          aria-label={"Póster de " + id}
        />
      </div>
    </div>
  );
}

/** Estado de la subida (progreso, avisos, errores). Se muestra aunque el lado vuelva a "Imagen". */
export function EstadoSubida({ lado }: { lado: LadoPortada }) {
  const s = useVio().portadaSubida[lado];
  if (!s.ocupado && !s.aviso && !s.error && !s.ok) return null;
  return (
    <div className="flex flex-col gap-2">
      {s.ocupado && (
        <div className="flex flex-col gap-2" role="status" aria-live="polite">
          <span className="text-[14px] font-semibold text-ink">{s.fase}</span>
          <div className="relative h-1.5 rounded-full bg-[#FFFFFF1A] overflow-hidden" aria-hidden="true">
            <div className="absolute top-0 bottom-0 w-2/5 rounded-full bg-ink [animation:cargando_1.2s_ease-in-out_infinite]" />
          </div>
        </div>
      )}
      {!!s.aviso && <span className="text-[14px] leading-[1.5] text-[#FFD38A]">{s.aviso}</span>}
      {!!s.error && (
        <span className="text-[14px] leading-[1.5] font-semibold text-danger" role="alert">
          {s.error}
        </span>
      )}
      {!!s.ok && !s.ocupado && (
        <span className="text-[14px] font-semibold text-ok" role="status">
          {s.ok}
        </span>
      )}
    </div>
  );
}
