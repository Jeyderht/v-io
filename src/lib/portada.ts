import type { CSSProperties } from "react";
import type { PortadaCfg } from "@/types";
import { parseDrive } from "./formato";
import { getSupabase } from "./supabase";

/**
 * PORTADA (valores originales)
 * Lo que se usa mientras no se guarde nada en Admin → Portada,
 * y lo que carga el botón "Restablecer original".
 * d = escritorio, m = móvil (vacío = usa las de escritorio).
 * dMode: 'derecha' (foto a la derecha) o 'completa' (pantalla completa).
 * dW = ancho %, dX/dY y mX/mY = encuadre %, dH/mH = alto %, dark = oscurecer %.
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
  d1: string;
  d2: string;
  hasD2: boolean;
  m1: string;
  m2: string;
  hasM2: boolean;
  d1Style: CSSProperties;
  d2Style: CSSProperties;
  m1Style: CSSProperties;
  m2Style: CSSProperties;
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
  const d1 = imgSrc(c.d1) || "/img/hero-1.jpg";
  const d2 = imgSrc(c.d2);
  const m1 = imgSrc(c.m1) || d1;
  const m2 = c.m1 ? imgSrc(c.m2) : d2;
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
