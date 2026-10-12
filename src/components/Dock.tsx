"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { ESTILOS } from "@/lib/estilos";
import { useVio } from "@/lib/useVio";
import { IconAdmin, IconContacto, IconInicio, IconPlanes, IconVisuales } from "./icons";

const ITEMS: { href: string; label: string; Icon: ComponentType; soloAdmin?: boolean }[] = [
  { href: "/", label: "Inicio", Icon: IconInicio },
  { href: "/visuales", label: "Visuales", Icon: IconVisuales },
  { href: "/planes", label: "Planes", Icon: IconPlanes },
  { href: "/contacto", label: "Contacto", Icon: IconContacto },
  { href: "/admin", label: "Admin", Icon: IconAdmin, soloAdmin: true },
];

/** Menú principal: barra inferior en móvil, columna a la izquierda en escritorio. */
export function Dock() {
  const pathname = usePathname();
  const { isAdminUser } = useVio();
  return (
    <div className="dockwrap fixed left-0 right-0 bottom-[calc(34px_+_env(safe-area-inset-bottom))] z-50 py-0 px-4 flex justify-center pointer-events-none">
      <nav
        aria-label="Principal"
        className="dock pointer-events-auto max-w-full box-border flex items-center gap-1.5 p-1.75 rounded-full bg-[#0A1A22B3] border-[0.5px] border-solid border-[#FFFFFF14] backdrop-blur-[28px] backdrop-saturate-[180%] shadow-[inset_0_0.5px_0_#FFFFFF38]"
      >
        {ITEMS.filter((it) => !it.soloAdmin || isAdminUser).map(({ href, label, Icon }) => {
          const on = pathname === href;
          return (
            <Link key={href} href={href} aria-label={label} aria-current={on ? "page" : undefined} className={`press ${on ? ESTILOS.navOn : ESTILOS.navOff}`}>
              <span className={on ? ESTILOS.boxOn : ESTILOS.boxOff}>
                <Icon />
              </span>
              {on && <span className="navlabel">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
