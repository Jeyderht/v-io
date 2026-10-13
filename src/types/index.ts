/** Tipos compartidos de V-IO. */

export type PlanId = "dj" | "pro" | "prod";
export type CategoriaId = "vj" | "led" | "intro" | "tema";
export type FiltroId = CategoriaId | "all";
export type TipoArchivo = "video" | "image";
export type DocLegalId = "licencia" | "terminos" | "privacidad";
export type AdminTab = "visuales" | "miembros" | "portada";

export interface Plan {
  id: PlanId;
  name: string;
  desc: string;
  /** Precio mensual */
  m: string;
  /** Precio anual */
  y: string;
  dispositivos: number;
  features: string[];
  cta: string;
  featured?: boolean;
}

export interface Pregunta {
  q: string;
  a: string;
}

export interface SeccionLegal {
  h: string;
  ps: string[];
}
export interface DocLegal {
  label: string;
  title: string;
  date: string;
  intro: string;
  sections: SeccionLegal[];
}

/** Fondo animado de una tarjeta: [color de fondo, clases forma A, clases forma B] */
export type Escena = [string, string, string];

/** Fila de la tabla visuales ya normalizada (lo que devuelve lib/catalogo.ts). */
export interface Visual {
  id: string;
  title: string;
  cat: string;
  len: string;
  premium: boolean;
  driveId: string;
  kind: string;
  createdAt: number;
}

/** Visual listo para pintar (real o de ejemplo). */
export interface Tarjeta {
  key: string;
  id?: string;
  title: string;
  tag: string;
  type: string;
  count: string;
  len: string;
  scene: Escena;
  real: boolean;
  premium: boolean;
  locked: boolean;
  driveId?: string;
  kind?: TipoArchivo;
  file?: string;
}

export interface Miembro {
  id: string;
  nombre: string;
  plan: PlanId | string;
  expira: number;
  disps: string[];
  usado: string | null;
  creado: number;
}

/** Sesión de cliente activa (código canjeado). */
export interface Sesion {
  nombre: string;
  plan: PlanId | string;
  expira: number;
}

export interface CodigoNuevo {
  code: string;
  nombre: string;
  plan: PlanId;
  tel: string;
  expira: number;
}

export type ModoPortada = "derecha" | "completa";
export type TipoPortada = "imagen" | "video";
/** Lado de la portada: d = escritorio, m = móvil */
export type LadoPortada = "d" | "m";

/** Configuración de la portada (tabla ajustes, clave 'portada'). */
export interface PortadaCfg {
  d1: string;
  d2: string;
  dMode: ModoPortada;
  dW: number;
  dX: number;
  dY: number;
  dH: number;
  m1: string;
  m2: string;
  mX: number;
  mY: number;
  mH: number;
  dark: number;
  /** Escritorio: imagen o video (URLs públicas del bucket "portada") */
  dTipo: TipoPortada;
  dVideo: string;
  dPoster: string;
  /** Móvil: imagen o video. Sin video propio usa el de escritorio (o su imagen). */
  mTipo: TipoPortada;
  mVideo: string;
  mPoster: string;
}
