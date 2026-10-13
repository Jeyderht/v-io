"use client";

import { useState, type CSSProperties } from "react";

/** Asegura la reproducción automática (silenciado) apenas el video entra al DOM. */
const reproducir = (el: HTMLVideoElement | null) => {
  if (!el) return;
  el.muted = true;
  el.play().catch(() => {
    /* si el navegador no deja reproducir, queda el póster */
  });
};

/**
 * Video de portada en bucle y silenciado. Se dibuja encima del póster (una <img> con
 * el mismo estilo), así que si el video no carga se desmonta y queda el póster.
 */
export function VideoPortada({ src, poster, className, style }: { src: string; poster: string; className?: string; style: CSSProperties }) {
  const [fallo, setFallo] = useState<string | null>(null);
  if (!src || fallo === src) return null;
  return (
    <video
      key={src}
      ref={reproducir}
      className={className}
      src={src}
      poster={poster || undefined}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      style={style}
      onError={() => setFallo(src)}
    />
  );
}
