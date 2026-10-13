import type { CSSProperties } from "react";
import type { LadoPortada, PortadaCfg } from "@/types";
import { parseDrive } from "./formato";
import { getSupabase } from "./supabase";

/**
 * PORTADA (valores originales)
 * Lo que se usa mientras no se guarde nada en Admin → Portada,
 * y lo que carga el botón "Restablecer original".
 * d = escritorio, m = móvil (vacío = usa las de escritorio).
 * dMode: 'derecha' (foto a la derecha) o 'completa' (pantalla completa).
 * dW = ancho %, dX/dY y mX/mY = encuadre %, dH/mH = alto %, dark = oscurecer %.
 * dTipo/mTipo: 'imagen' o 'video' (dVideo/mVideo y dPoster/mPoster son URLs del bucket "portada").
 */
export const PORTADA_DEFECTO: PortadaCfg = {
  d1: "img/hero-1.jpg",
  d2: "img/hero-2.jpg",
  dMode: "derecha",
  dW: 62,
  dX: 50,
  dY: 18,
  dH: 100,
  m1: "",
  m2: "",
  mX: 55,
  mY: 25,
  mH: 100,
  dark: 0,
  dTipo: "imagen",
  dVideo: "",
  dPoster: "",
  mTipo: "imagen",
  mVideo: "",
  mPoster: "",
};

/** Enlace de Google Drive → enlace directo a la imagen; "img/…" → "/img/…"; otra URL se usa tal cual. */
export function imgSrc(raw: string | undefined): string {
  const u = String(raw || "").trim();
  if (!u) return "";
  const id = parseDrive(u);
  if (id && /drive\.google|docs\.google|^[a-zA-Z0-9_-]{25,}$/.test(u)) return "https://lh3.googleusercontent.com/d/" + id + "=w2400";
  if (!/^([a-z]+:|\/)/i.test(u)) return "/" + u; // rutas relativas de la web (las páginas ya no están todas en "/")
  return u;
}

export interface VistaPortada {
  /** Imágenes de escritorio (si hay video: su póster) */
  d1: string;
  d2: string;
  hasD2: boolean;
  /** Imágenes de móvil (si hay video: su póster) */
  m1: string;
  m2: string;
  hasM2: boolean;
  d1Style: CSSProperties;
  d2Style: CSSProperties;
  m1Style: CSSProperties;
  m2Style: CSSProperties;
  /** Video de escritorio y de móvil ('' = sin video). El móvil puede heredar el de escritorio. */
  dVideo: string;
  mVideo: string;
  /** Alto en % de pantalla (escritorio / móvil) */
  hd: number;
  hm: number;
  dark: CSSProperties;
  dBox?: CSSProperties;
  mBox?: CSSProperties;
}

const num = (x: unknown, d: number) => (isFinite(Number(x)) ? Number(x) : d);
const KENBURNS = "kenburns 16s ease-in-out infinite alternate";
const XFADE = "xfade 14s ease-in-out infinite";

/** Estilos de la portada a partir de una configuración (preview = también las cajas de la vista previa). */
export function heroView(c: Partial<PortadaCfg>, preview: boolean): VistaPortada {
  // Escritorio: imagen(es) o video con su póster
  const dImg1 = imgSrc(c.d1) || "/img/hero-1.jpg";
  const dImg2 = imgSrc(c.d2);
  const dVideo = c.dTipo === "video" && c.dVideo ? c.dVideo : "";
  const d1 = dVideo ? imgSrc(c.dPoster) || dImg1 : dImg1;
  const d2 = dVideo ? "" : dImg2;

  // Móvil: su video, sus imágenes o, si no tiene nada propio, lo de escritorio
  let m1: string, m2: string, mVideo: string;
  if (c.mTipo === "video" && c.mVideo) {
    mVideo = c.mVideo;
    m1 = imgSrc(c.mPoster) || imgSrc(c.m1) || d1;
    m2 = "";
  } else if (c.m1) {
    mVideo = "";
    m1 = imgSrc(c.m1);
    m2 = imgSrc(c.m2);
  } else {
    mVideo = dVideo;
    m1 = d1;
    m2 = d2;
  }

  const anim = (i: number, two: boolean) => (two && i !== 0 ? XFADE : KENBURNS);
  const base: CSSProperties = { position: "absolute", top: 0, bottom: 0, height: "100%", objectFit: "cover" };
  const mask = "linear-gradient(to right, transparent 0%, #000 32%)";
  const dStyle = (i: number): CSSProperties => ({
    ...base,
    objectPosition: num(c.dX, 50) + "% " + num(c.dY, 18) + "%",
    ...(c.dMode === "completa" ? { left: 0, width: "100%" } : { left: "auto", right: 0, width: num(c.dW, 62) + "%", WebkitMaskImage: mask, maskImage: mask }),
    animation: anim(i, !!d2),
  });
  const mStyle = (i: number): CSSProperties => ({
    ...base,
    left: 0,
    width: "100%",
    objectPosition: num(c.mX, 55) + "% " + num(c.mY, 25) + "%",
    animation: anim(i, !!m2),
  });
  const hd = Math.max(50, Math.min(100, num(c.dH, 100)));
  const hm = Math.max(50, Math.min(100, num(c.mH, 100)));
  const v: VistaPortada = {
    d1,
    d2,
    hasD2: !!d2,
    m1,
    m2,
    hasM2: !!m2,
    d1Style: dStyle(0),
    d2Style: dStyle(1),
    m1Style: mStyle(0),
    m2Style: mStyle(1),
    dVideo,
    mVideo,
    hd,
    hm,
    dark: { position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(0,0,0," + Math.max(0, Math.min(70, num(c.dark, 0))) / 100 + ")" },
  };
  if (preview) {
    const box: CSSProperties = {
      position: "relative",
      overflow: "hidden",
      borderRadius: 16,
      border: "0.5px solid #FFFFFF1F",
      background: "radial-gradient(ellipse 80% 90% at 72% 35%, #00245A 0%, #000C22 55%, #00040C 100%)",
    };
    v.dBox = { ...box, width: "100%", aspectRatio: "16 / " + Math.round(((9 * hd) / 100) * 10) / 10 };
    v.mBox = { ...box, width: 150, aspectRatio: "9 / " + Math.round(((19.5 * hm) / 100) * 10) / 10 };
  }
  return v;
}

/** Portada guardada (tabla ajustes, clave 'portada'); null si no hay o falla. */
export async function cargarPortada(): Promise<Partial<PortadaCfg> | null> {
  const sb = getSupabase();
  if (!sb) return null;
  const { data, error } = await sb.from("ajustes").select("valor").eq("clave", "portada").limit(1);
  if (error || !data || !data[0]) return null;
  return (data[0] as { valor: Partial<PortadaCfg> | null }).valor;
}

/** Guarda (crea o reemplaza) la portada. */
export async function guardarPortada(valor: PortadaCfg): Promise<void> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase no está configurado");
  const { error } = await sb.from("ajustes").upsert({ clave: "portada", valor }, { onConflict: "clave" });
  if (error) throw error;
}

/* =========================================================
   Videos y pósters (Supabase Storage, bucket público "portada")
   ========================================================= */
export const BUCKET_PORTADA = "portada";
const MB = 1024 * 1024;
/** Límite del bucket */
export const MAX_ARCHIVO = 15 * MB;
/** Peso recomendado del video (escritorio / móvil): por encima se avisa, pero se permite */
export const VIDEO_RECOMENDADO: Record<LadoPortada, number> = { d: 4 * MB, m: 3 * MB };
export const TIPOS_VIDEO = ["video/mp4", "video/webm"];
export const TIPOS_POSTER = ["image/jpeg", "image/png", "image/webp"];
export const NOMBRE_LADO: Record<LadoPortada, string> = { d: "escritorio", m: "movil" };

export const enMB = (bytes: number) => (bytes / MB).toFixed(1).replace(".", ",") + " MB";

/** Sube un archivo y devuelve su URL pública. */
export async function subirArchivoPortada(ruta: string, archivo: Blob, tipo: string): Promise<string> {
  const sb = getSupabase();
  if (!sb) throw new Error("Supabase no está configurado");
  const bucket = sb.storage.from(BUCKET_PORTADA);
  const { error } = await bucket.upload(ruta, archivo, { contentType: tipo, cacheControl: "31536000", upsert: false });
  if (error) throw error;
  return bucket.getPublicUrl(ruta).data.publicUrl;
}

/** Ruta dentro del bucket a partir de su URL pública (null si no es de este bucket). */
export function rutaEnBucket(url: string): string | null {
  const marca = "/storage/v1/object/public/" + BUCKET_PORTADA + "/";
  const i = url ? url.indexOf(marca) : -1;
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length).split("?")[0]) : null;
}

/** Borra archivos del bucket a partir de sus URLs públicas (ignora las que no son del bucket). */
export async function borrarArchivosPortada(urls: string[]): Promise<void> {
  const sb = getSupabase();
  const rutas = urls.map(rutaEnBucket).filter((r): r is string => !!r);
  if (!sb || !rutas.length) return;
  const { error } = await sb.storage.from(BUCKET_PORTADA).remove(rutas);
  if (error) throw error;
}

/**
 * Póster automático: toma un cuadro del video (a ~10 % de su duración, máx. 1 s)
 * y lo devuelve como JPG (máx. 1920 px de ancho).
 */
export function generarPoster(video: File): Promise<Blob> {
  return new Promise((resolver, rechazar) => {
    const url = URL.createObjectURL(video);
    const v = document.createElement("video");
    let listo = false;
    const terminar = (error: Error | null, blob?: Blob) => {
      if (listo) return;
      listo = true;
      clearTimeout(reloj);
      URL.revokeObjectURL(url);
      v.removeAttribute("src");
      if (error || !blob) rechazar(error || new Error("No se pudo crear la imagen"));
      else resolver(blob);
    };
    const reloj = setTimeout(() => terminar(new Error("El video tardó demasiado en abrirse")), 20000);
    v.muted = true;
    v.playsInline = true;
    v.preload = "auto";
    v.onerror = () => terminar(new Error("El navegador no puede leer este video"));
    v.onloadedmetadata = () => {
      const dur = isFinite(v.duration) ? v.duration : 0;
      v.currentTime = Math.min(1, dur * 0.1) || 0.1;
    };
    v.onseeked = () => {
      if (!v.videoWidth || !v.videoHeight) return terminar(new Error("El video no tiene imagen"));
      const escala = Math.min(1, 1920 / v.videoWidth);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(v.videoWidth * escala);
      canvas.height = Math.round(v.videoHeight * escala);
      const ctx = canvas.getContext("2d");
      if (!ctx) return terminar(new Error("Canvas no disponible"));
      ctx.drawImage(v, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((b) => terminar(null, b || undefined), "image/jpeg", 0.82);
    };
    v.src = url;
  });
}
