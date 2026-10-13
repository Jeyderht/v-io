"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, ReactNode } from "react";
import { cx, ESTILOS } from "@/lib/estilos";
import { useVio, vio } from "@/lib/useVio";
import { miembroActivo } from "@/lib/vistas";
import { IconAdmin, IconContacto, IconCuenta, IconInicio, IconPlanes, IconVisuales } from "./icons";

const RUTAS: { href: string; label: string; Icon: ComponentType }[] = [
  { href: "/", label: "Inicio", Icon: IconInicio },
  { href: "/visuales", label: "Visuales", Icon: IconVisuales },
  { href: "/planes", label: "Planes", Icon: IconPlanes },
  { href: "/contacto", label: "Contacto", Icon: IconContacto },
];

/**
 * Menú principal: barra inferior en móvil, columna a la izquierda en escritorio.
 * En pantallas de 420 px o menos se compacta para que entren los 5 ítems (6 con Admin).
 */
export function Dock() {
  const pathname = usePathname();
  const e = useVio();
  const cuentaLabel = miembroActivo(e) ? "Mi cuenta" : "Ingresar";
  // Con 6 ítems (admin), en pantallas angostas el activo muestra solo el ícono
  const seis = e.isAdminUser;

  const contenido = (on: boolean, label: string, Icon: ComponentType): ReactNode => (
    <>
      <span className={cx(on ? ESTILOS.boxOn : ESTILOS.boxOff, "max-[420px]:w-8.5 max-[420px]:h-8.5")}>
        <Icon />
      </span>
      {on && <span className={cx("navlabel", seis && "max-[420px]:hidden")}>{label}</span>}
    </>
  );
  const clases = (on: boolean) =>
    cx(
      "press",
      on ? ESTILOS.navOn : ESTILOS.navOff,
      "max-[420px]:h-10.5",
      on ? (seis ? "max-[420px]:w-10.5 max-[420px]:p-0 max-[420px]:justify-center" : "max-[420px]:pl-1 max-[420px]:pr-3.5") : "max-[420px]:w-10.5",
    );

  return (
    <div className="dockwrap fixed left-0 right-0 bottom-[calc(34px_+_env(safe-area-inset-bottom))] z-50 py-0 px-4 max-[420px]:px-2.5 flex justify-center pointer-events-none">
      <nav
        aria-label="Principal"
        className="dock pointer-events-auto max-w-full box-border flex items-center gap-1.5 p-1.75 max-[420px]:gap-0.5 max-[420px]:p-1.25 rounded-full bg-[#0A1A22B3] border-[0.5px] border-solid border-[#FFFFFF14] backdrop-blur-[28px] backdrop-saturate-[180%] shadow-[inset_0_0.5px_0_#FFFFFF38]"
      >
        {RUTAS.map(({ href, label, Icon }) => {
          const on = pathname === href && !e.loginOpen;
          return (
            <Link key={href} href={href} aria-label={label} aria-current={pathname === href ? "page" : undefined} className={clases(on)}>
              {contenido(on, label, Icon)}
            </Link>
          );
        })}
        <button
          type="button"
          aria-label={cuentaLabel}
          aria-haspopup="dialog"
          aria-expanded={e.loginOpen}
          onClick={() => vio.set({ loginOpen: true, loginErr: "" })}
          className={clases(e.loginOpen)}
        >
          {contenido(e.loginOpen, cuentaLabel, IconCuenta)}
        </button>
        {e.isAdminUser && (
          <Link
            href="/admin"
            aria-label="Admin"
            aria-current={pathname === "/admin" ? "page" : undefined}
            className={clases(pathname === "/admin" && !e.loginOpen)}
          >
            {contenido(pathname === "/admin" && !e.loginOpen, "Admin", IconAdmin)}
          </Link>
        )}
      </nav>
    </div>
  );
}
