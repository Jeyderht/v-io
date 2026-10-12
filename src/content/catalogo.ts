import type { CategoriaId, Escena, FiltroId } from "@/types";

/** Categorías del catálogo (el id se guarda en la base de datos: no lo cambies) */
export const CATEGORIAS: { id: CategoriaId; label: string }[] = [
  { id: "vj", label: "VJ loops" },
  { id: "led", label: "LED" },
  { id: "intro", label: "Intros DJ" },
  { id: "tema", label: "Temáticos" },
];
export const FILTROS: { id: FiltroId; label: string }[] = [{ id: "all", label: "Todos" }, ...CATEGORIAS];

/** Tipos de visual en el formulario "Cotizar a medida" */
export const TIPOS_COTIZACION = [
  { id: "logo", label: "Logo animado / intro" },
  { id: "led", label: "Contenido LED" },
  { id: "evento", label: "Visuales para evento" },
  { id: "show", label: "Show completo" },
] as const;

/**
 * Catálogo de ejemplo: se muestra solo si no hay Supabase configurado.
 * Los 4 primeros son gratis y el resto premium.
 */
export const VISUALES_DEMO = [
  { title: "Neón Líquido", tag: "VJ loops", type: "vj", count: "12", len: "0:30 loop" },
  { title: "Cosmic Night", tag: "LED", type: "led", count: "8", len: "0:45 loop" },
  { title: "Entrada Headliner", tag: "Intros DJ", type: "intro", count: "6", len: "0:20 min" },
  { title: "Noche Neón", tag: "Temáticos", type: "tema", count: "10", len: "1:00 loop" },
  { title: "Láser Grid", tag: "LED", type: "led", count: "9", len: "0:30 loop" },
  { title: "Año Nuevo", tag: "Temáticos", type: "tema", count: "5", len: "1:00 min" },
  { title: "Jungla Ácida", tag: "VJ loops", type: "vj", count: "14", len: "0:40 loop" },
  { title: "Drop Countdown", tag: "Intros DJ", type: "intro", count: "4", len: "0:15 min" },
];

/** Fondos animados de las tarjetas: [color de fondo, forma A, forma B] */
export const ESCENAS: Escena[] = [
  [
    "#0B1D3F",
    "absolute w-[90%] h-[60%] left-[-20%] bottom-[10%] rounded-[50%] bg-[#6F8AD5] blur-[26px] [animation:drift_8s_ease-in-out_infinite_alternate]",
    "absolute w-[70%] h-[50%] right-[-15%] bottom-0 rounded-[50%] bg-[#1CA9E5] blur-[18px] [animation:drift2_6s_ease-in-out_infinite_alternate]",
  ],
  [
    "#0E2A5C",
    "absolute w-[120%] h-[60%] left-[-10%] top-[-15%] rounded-[50%] bg-aqua blur-[30px] [animation:drift_7s_ease-in-out_infinite_alternate]",
    "absolute w-0.75 h-[80%] left-[50%] top-[-6%] origin-[top_center] bg-white [animation:sweep_3s_ease-in-out_infinite_alternate]",
  ],
  [
    "#07070C",
    "absolute w-[80%] h-[80%] left-[10%] top-0 rounded-[50%] bg-aqua blur-[30px] [animation:drift2_9s_ease-in-out_infinite_alternate]",
    "absolute w-[60%] h-[40%] right-[-10%] top-[40%] rounded-[50%] bg-[#1CA9E5] blur-[20px] [animation:drift_5s_ease-in-out_infinite_alternate]",
  ],
  [
    "#1B2350",
    "absolute w-[70%] h-[70%] left-[15%] top-[5%] rounded-[50%] bg-[#6F8AD5] blur-[28px] [animation:drift_6s_ease-in-out_infinite_alternate]",
    "absolute w-full h-[26%] left-0 top-[46%] bg-[#50BFED] opacity-[0.55] blur-[16px] [animation:drift2_4s_ease-in-out_infinite_alternate]",
  ],
  [
    "#06121F",
    "absolute w-0.75 h-[130%] left-[50%] top-[-15%] origin-[top_center] bg-aqua [animation:sweep_2.6s_ease-in-out_infinite_alternate]",
    "absolute w-0.75 h-[130%] left-[50%] top-[-15%] origin-[top_center] bg-aqua [animation:sweep2_3.4s_ease-in-out_infinite_alternate]",
  ],
  [
    "#00303C",
    "absolute w-[90%] h-[70%] left-[5%] top-[8%] rounded-[50%] bg-[#1CA9E5] blur-[30px] [animation:drift2_7s_ease-in-out_infinite_alternate]",
    "absolute w-[46%] h-[36%] left-[27%] top-[22%] rounded-[50%] bg-mist blur-[14px] [animation:drift_3.5s_ease-in-out_infinite_alternate]",
  ],
  [
    "#001E28",
    "absolute w-[80%] h-[60%] left-[-10%] top-[20%] rounded-[50%] bg-[#50BFED] blur-[28px] [animation:drift_7s_ease-in-out_infinite_alternate]",
    "absolute w-[50%] h-[50%] right-[-5%] top-[5%] rounded-[50%] bg-[#E8F5FF] blur-[24px] [animation:drift2_5s_ease-in-out_infinite_alternate]",
  ],
  [
    "#0B1230",
    "absolute w-0.75 h-[130%] left-[50%] top-[-15%] origin-[top_center] bg-[#6F8AD5] [animation:sweep2_2.8s_ease-in-out_infinite_alternate]",
    "absolute w-[70%] h-[50%] left-[15%] bottom-[-10%] rounded-[50%] bg-[#6F8AD5] blur-[26px] [animation:drift_6s_ease-in-out_infinite_alternate]",
  ],
];
