/**
 * Clases de Tailwind que cambian según el estado (activo / inactivo, ocupado...).
 * Las clases fijas están directamente en cada componente.
 */

/** Une clases ignorando las vacías. */
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(" ");

const seg = "shrink-0 border-0 cursor-pointer text-[15px] font-semibold py-2.75 px-5 min-h-11 rounded-full [transition:all_.25s_ease]";
const big = "flex items-center justify-center gap-2.5 min-h-14.5 p-4 border-0 rounded-full text-[17px] font-bold";
const cta = "flex items-center justify-center w-full min-h-14 cursor-pointer text-[17px] font-bold py-4 px-6 rounded-full";
const card = "p-7.5 rounded-[34px] border-[0.5px] border-solid flex flex-col gap-4.5";

export const ESTILOS = {
  // menú
  navOn:
    "no-underline box-border tracking-normal h-11.5 inline-flex items-center gap-2 pr-4.5 pl-1.25 py-0 rounded-full bg-[#FFFFFF2E] border-[0.5px] border-solid border-[#FFFFFF1A] shadow-[inset_0_0.5px_0_#FFFFFF40] text-white cursor-pointer text-[15px] font-semibold whitespace-nowrap [transition:all_.3s_cubic-bezier(.2,.8,.2,1)]",
  navOff:
    "no-underline box-border tracking-normal h-11.5 w-11.5 inline-flex items-center justify-center p-0 rounded-full border border-solid border-transparent bg-transparent text-muted cursor-pointer [transition:all_.3s_cubic-bezier(.2,.8,.2,1)]",
  boxOn: "w-9 h-9 rounded-[50%] bg-white text-night inline-flex items-center justify-center",
  boxOff: "w-9 h-9 rounded-[50%] inline-flex items-center justify-center",
  // segmentos y chips
  segOn: `${seg} bg-white text-night`,
  segOff: `${seg} bg-transparent text-lavender`,
  chipOff:
    "shrink-0 cursor-pointer text-[15px] font-semibold py-2.75 px-5 min-h-11 rounded-full [transition:all_.25s_ease] bg-[#FFFFFF14] text-mist border-[0.5px] border-solid border-[#FFFFFF14]",
  // botones
  smallBtn: "min-h-10 py-2 px-3.5 rounded-full cursor-pointer text-[14px] font-semibold shrink-0",
  btnHot: `${big} cursor-pointer bg-ink text-night`,
  btnBusy: `${big} bg-[#FFFFFF26] text-ink cursor-progress`,
  // tarjetas de planes
  card: `${card} bg-[#FFFFFF0F] border-[#FFFFFF12] shadow-[inset_0_0.5px_0_#FFFFFF26]`,
  cardHot: `${card} bg-[#FFFFFF1A] border-[#FFFFFF33] shadow-[inset_0_0.5px_0_#FFFFFF4D]`,
  cta: `${cta} bg-[#FFFFFF1A] border-[0.5px] border-solid border-[#FFFFFF14] text-ink`,
  ctaHot: `${cta} border-0 bg-ink text-night`,
} as const;

/** Botón grande (Entrar, Crear código, Publicar...) según esté ocupado. */
export const btnGrande = (ocupado: boolean) => (ocupado ? ESTILOS.btnBusy : ESTILOS.btnHot);
/** Segmento / chip seleccionable. */
export const segmento = (activo: boolean) => (activo ? ESTILOS.segOn : ESTILOS.segOff);
export const chip = (activo: boolean) => (activo ? ESTILOS.segOn : ESTILOS.chipOff);

/** Icono de papelera del botón "Eliminar" de Admin → Visuales. */
export const FONDO_PAPELERA =
  '#FFFFFF0F url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2718%27 height=%2718%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27%23FF8A95%27 stroke-width=%271.8%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3E%3Cpath d=%27M4.5 6.5h15M9.5 6.5V4.8a.8.8 0 01.8-.8h3.4a.8.8 0 01.8.8v1.7M6.5 6.5l.8 12.2a1.6 1.6 0 001.6 1.5h6.2a1.6 1.6 0 001.6-1.5l.8-12.2%27/%3E%3C/svg%3E") center / 18px no-repeat';
