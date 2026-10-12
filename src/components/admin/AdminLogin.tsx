"use client";

import { btnGrande } from "@/lib/estilos";
import { useVio, vio } from "@/lib/useVio";
import { CAMPO, ETIQUETA } from "./comunes";

/** Ingreso del administrador (Supabase Auth con correo y contraseña). */
export function AdminLogin() {
  const e = useVio();
  return (
    <section className="p-6 rounded-[32px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF26] flex flex-col gap-4 max-w-[480px]">
      <div className="flex flex-col gap-1">
        <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.03em]">Ingreso de administrador</h2>
        <span className="text-[15px] text-muted">Solo para el equipo de V-IO.</span>
      </div>
      <label className={ETIQUETA} htmlFor="a-email">
        Correo
        <input
          className={CAMPO}
          id="a-email"
          type="email"
          value={e.aEmail}
          onChange={(ev) => vio.set({ aEmail: ev.target.value, aErr: "" })}
          autoComplete="username"
        />
      </label>
      <label className={ETIQUETA} htmlFor="a-pass">
        Contraseña
        <input
          className={CAMPO}
          id="a-pass"
          type="password"
          value={e.aPass}
          onChange={(ev) => vio.set({ aPass: ev.target.value, aErr: "" })}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") void vio.adminLogin();
          }}
          autoComplete="current-password"
        />
      </label>
      <button className={`press ${btnGrande(e.aBusy)}`} type="button" onClick={() => void vio.adminLogin()}>
        {e.aBusy ? "Entrando…" : "Entrar como admin"}
      </button>
      {!!e.aErr && (
        <span className="text-[14px] text-danger text-center" role="alert">
          {e.aErr}
        </span>
      )}
    </section>
  );
}
