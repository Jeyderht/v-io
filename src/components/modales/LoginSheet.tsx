"use client";

import { useRouter } from "next/navigation";
import { nombrePlan } from "@/content/planes";
import { btnGrande, cx } from "@/lib/estilos";
import { fmtDate } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { miembroActivo } from "@/lib/vistas";
import { IconAdmin, IconUsuario } from "../icons";
import { Asa, BotonCerrar, ETIQUETA_HOJA, FONDO_HOJA, Overlay, VENTANA_HOJA } from "./Sheet";

/** Hoja "Ingresar" (código de acceso) o "Mi cuenta" si ya hay sesión. */
export function LoginSheet() {
  const e = useVio();
  const router = useRouter();
  if (!e.loginOpen) return null;
  const member = miembroActivo(e);
  const cerrar = () => vio.set({ loginOpen: false });
  const ir = (ruta: string) => {
    vio.set({ loginOpen: false });
    router.push(ruta);
  };
  const titulo = member ? "Mi cuenta" : "Ingresar";
  return (
    <Overlay onClose={cerrar} label={titulo} fondo={cx(FONDO_HOJA, "z-95")} ventana={cx(VENTANA_HOJA, "w-[min(480px,100%)] gap-4.5")}>
      <Asa />
      <div className="flex gap-4 items-center">
        <span className="w-14 h-14 shrink-0 rounded-[50%] bg-(--accent) inline-flex items-center justify-center text-white" aria-hidden="true">
          <IconUsuario size={26} />
        </span>
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <span className="font-extrabold tracking-[-0.04em] text-[22px]">{titulo}</span>
          <span className="text-[15px] text-muted">{member ? member.nombre || "Miembro V-IO" : "Accede con tu código PRO"}</span>
        </div>
        <BotonCerrar onClick={cerrar} />
      </div>

      {member && (
        <>
          <div className="py-4.5 px-5 rounded-[24px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF14] flex flex-col gap-2.5">
            <div className="flex justify-between gap-3 text-[15px]">
              <span className="text-muted">Plan</span>
              <strong>{nombrePlan(member.plan)}</strong>
            </div>
            <div className="flex justify-between gap-3 text-[15px] [border-top:0.5px_solid_#FFFFFF12] pt-2.5">
              <span className="text-muted">Activo hasta</span>
              <strong>{fmtDate(member.expira)}</strong>
            </div>
          </div>
          <button
            className="press flex items-center justify-center gap-2.5 min-h-14.5 p-4 border-0 rounded-full cursor-pointer text-[17px] font-bold bg-ink text-night"
            type="button"
            onClick={() => ir("/visuales")}
          >
            Ir a mis visuales
          </button>
          <button
            className="press min-h-12 p-3 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink cursor-pointer text-[15px] font-semibold"
            type="button"
            onClick={vio.logout}
          >
            Cerrar sesión
          </button>
        </>
      )}

      {e.isAdminUser && (
        <button
          className="press flex items-center justify-center gap-2.5 min-h-13 p-3 rounded-full border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF14] text-ink cursor-pointer text-[16px] font-bold"
          type="button"
          onClick={() => ir("/admin")}
        >
          <IconAdmin size={20} />
          Panel de administración
        </button>
      )}

      {!member && (
        <>
          <label className={ETIQUETA_HOJA} htmlFor="codigo">
            Código de acceso
            <input
              className="min-h-14 box-border py-0 px-4.5 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink text-[20px] font-semibold tracking-[0.06em] uppercase"
              id="codigo"
              type="text"
              value={e.code}
              onChange={(ev) => vio.set({ code: ev.target.value, loginErr: "" })}
              onKeyDown={(ev) => {
                if (ev.key === "Enter") void vio.verify(vio.get().code, false);
              }}
              placeholder="VIO-XXXX-XXXX"
              autoComplete="one-time-code"
              autoCapitalize="characters"
              spellCheck="false"
            />
          </label>
          {!!e.loginErr && (
            <span className="text-[14px] text-danger -mt-2" role="alert">
              {e.loginErr}
            </span>
          )}
          <button
            className={`press ${btnGrande(e.loginBusy)}`}
            type="button"
            onClick={() => {
              if (!vio.get().loginBusy) void vio.verify(vio.get().code, false);
            }}
          >
            {e.loginBusy ? "Verificando…" : "Entrar"}
          </button>
          <span className="text-[13px] text-dim text-center">Tu código es personal: funciona en los dispositivos que incluye tu plan</span>
          <button
            className="press self-center min-h-11 py-2 px-4 border-0 bg-transparent text-ink cursor-pointer text-[15px] font-semibold underline underline-offset-[4px]"
            type="button"
            onClick={() => ir("/planes")}
          >
            ¿No tienes código? Ver planes
          </button>
          <button
            className="press self-center inline-flex items-center gap-2 min-h-11 py-2 px-4 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0A] text-muted cursor-pointer text-[14px] font-semibold"
            type="button"
            onClick={() => ir("/admin")}
          >
            <IconAdmin size={16} strokeWidth="1.8" />
            Ingresar como administrador
          </button>
        </>
      )}
    </Overlay>
  );
}
