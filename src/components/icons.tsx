/** Íconos SVG de la web (trazos de 24×24). Todos son decorativos (aria-hidden). */
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

function Svg({ size = 24, children, ...p }: P) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" {...p}>
      {children}
    </svg>
  );
}

export const IconInicio = (p: P) => (
  <Svg size={22} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.8 10.2L12 3.6l8.2 6.6V19a1.8 1.8 0 01-1.8 1.8h-3.6v-5.6a1 1 0 00-1-1h-3.6a1 1 0 00-1 1v5.6H5.6A1.8 1.8 0 013.8 19z" />
  </Svg>
);
export const IconVisuales = (p: P) => (
  <Svg size={22} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="2" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="2" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="2" />
  </Svg>
);
export const IconPlanes = (p: P) => (
  <Svg size={22} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4.4 5.5h15.2a1.9 1.9 0 011.9 1.9V9.6a2.4 2.4 0 000 4.8v2.2a1.9 1.9 0 01-1.9 1.9H4.4a1.9 1.9 0 01-1.9-1.9v-2.2a2.4 2.4 0 000-4.8V7.4a1.9 1.9 0 011.9-1.9z" />
    <path d="M15 6v12" strokeDasharray="1.6 2.2" />
  </Svg>
);
export const IconContacto = (p: P) => (
  <Svg size={22} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3.8c4.7 0 8.5 3.2 8.5 7.3s-3.8 7.3-8.5 7.3c-.9 0-1.8-.1-2.6-.3l-3.6 1.8c-.4.2-.9-.2-.7-.6l.9-2.7C4.4 15.3 3.5 13.3 3.5 11.1c0-4.1 3.8-7.3 8.5-7.3z" />
  </Svg>
);
export const IconAdmin = (p: P) => (
  <Svg size={22} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M3.5 7h9.2M17.3 7h3.2M3.5 17h3.2M11.3 17h9.2" />
    <circle cx="15" cy="7" r="2.3" />
    <circle cx="9" cy="17" r="2.3" />
  </Svg>
);
export const IconUsuario = (p: P) => (
  <Svg size={20} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <circle cx="12" cy="8.2" r="3.8" />
    <path d="M4.8 20.2c.9-3.6 3.8-5.6 7.2-5.6s6.3 2 7.2 5.6" />
  </Svg>
);
/** Flecha → de los botones principales */
export const IconFlecha = (p: P) => (
  <Svg size={20} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Svg>
);
/** × de los botones Cerrar */
export const IconCerrar = (p: P) => (
  <Svg size={12} strokeWidth="3" strokeLinecap="round" {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Svg>
);
export const IconWhatsApp = (p: P) => (
  <Svg size={24} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-5.1A8 8 0 1121 12z" />
  </Svg>
);
export const IconEstrella = (p: P) => (
  <Svg size={24} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M12 3l2.4 5.2L20 9l-4 4 1 5.6L12 16l-5 2.6L8 13 4 9l5.6-.8z" />
  </Svg>
);
/** Ticket (planes) usado en tarjetas y hojas */
export const IconTicket = (p: P) => (
  <Svg size={24} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4.5 6h15A1.5 1.5 0 0121 7.5V10a2 2 0 000 4v2.5a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5V14a2 2 0 000-4V7.5A1.5 1.5 0 014.5 6z" />
  </Svg>
);
