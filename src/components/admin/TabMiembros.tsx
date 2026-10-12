"use client";

import { DURACIONES_ACCESO, dispositivosPlan, nombrePlan, PLANES } from "@/content/planes";
import type { CodigoNuevo } from "@/types";
import { btnGrande, chip, cx, ESTILOS } from "@/lib/estilos";
import { fmtDate } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { CAMPO, ETIQUETA, Opciones, SECCION, TITULO } from "./comunes";

/** Mensaje de WhatsApp que se envía al cliente con su código nuevo. */
function mensajeCodigo(nc: CodigoNuevo): string {
  const n = dispositivosPlan(nc.plan);
  return (
    "Hola " +
    nc.nombre +
    ", tu acceso V-IO " +
    nombrePlan(nc.plan) +
    " está activo hasta el " +
    fmtDate(nc.expira) +
    ".\n\nTu código: " +
    nc.code +
    "\n\nEntra a la web, toca el ícono de perfil e ingresa tu código. Funciona en " +
    n +
    (n === 1 ? " dispositivo" : " dispositivos") +
    "."
  );
}

/** Admin → Miembros: crear códigos de acceso y administrar clientes. */
export function TabMiembros() {
  const e = useVio();
  const now = e.ahora;
  const nc = e.newCode;
  const copiar = () => {
    try {
      navigator.clipboard.writeText(nc ? nc.code : "").then(
        () => vio.set({ copied: true }),
        () => {},
      );
    } catch {
      /* sin portapapeles */
    }
  };
  const filas = e.members.slice().sort((a, b) => (Number(b.creado) || 0) - (Number(a.creado) || 0));
  return (
    <>
      <section className={SECCION}>
        <div className="flex flex-col gap-1">
          <h2 className={TITULO}>Nuevo acceso</h2>
          <span className="text-[15px] text-muted">Cuando un cliente pague, créale su código. Se activa en 1, 2 o 5 dispositivos según su plan.</span>
        </div>
        <label className={ETIQUETA} htmlFor="m-nombre">
          Nombre del cliente
          <input
            className={CAMPO}
            id="m-nombre"
            type="text"
            value={e.mName}
            onChange={(ev) => vio.set({ mName: ev.target.value, memMsg: "" })}
            placeholder="DJ, club o productora"
            autoComplete="off"
          />
        </label>
        <label className={ETIQUETA} htmlFor="m-tel">
          WhatsApp del cliente (opcional)
          <input
            className={CAMPO}
            id="m-tel"
            type="tel"
            value={e.mTel}
            onChange={(ev) => vio.set({ mTel: ev.target.value })}
            placeholder="51 999 999 999"
            autoComplete="off"
          />
        </label>
        <Opciones titulo="Plan" aria="Plan">
          {PLANES.map((p) => (
            <button
              key={p.id}
              className={`press ${chip(e.mPlan === p.id)}`}
              type="button"
              onClick={() => vio.set({ mPlan: p.id })}
              aria-pressed={e.mPlan === p.id}
            >
              {p.name}
            </button>
          ))}
        </Opciones>
        <Opciones titulo="Duración del acceso" aria="Duración">
          {DURACIONES_ACCESO.map(([n, label]) => (
            <button key={n} className={`press ${chip(e.mMonths === n)}`} type="button" onClick={() => vio.set({ mMonths: n })} aria-pressed={e.mMonths === n}>
              {label}
            </button>
          ))}
        </Opciones>
        <button className={`press ${btnGrande(e.creating)}`} type="button" onClick={() => void vio.createMember()}>
          {e.creating ? "Creando…" : "Crear código de acceso"}
        </button>
        {!!e.memMsg && (
          <span className="text-[14px] text-danger" role="status">
            {e.memMsg}
          </span>
        )}
        {nc && (
          <div className="p-5 rounded-[24px] bg-ink text-night flex flex-col gap-3 [animation:fadeIn_.3s_ease_both]">
            <span className="text-[14px] font-semibold text-slate">
              Código de {nc.nombre} · {nombrePlan(nc.plan)} hasta {fmtDate(nc.expira)}
            </span>
            <strong className="text-[length:clamp(26px,6vw,36px)] font-extrabold tracking-[0.04em] tabular-nums">{nc.code}</strong>
            <div className="flex flex-wrap gap-2">
              <button
                className="press min-h-11.5 py-2.75 px-5 rounded-full border-0 bg-night text-ink cursor-pointer text-[15px] font-bold"
                type="button"
                onClick={copiar}
              >
                {e.copied ? "Copiado" : "Copiar código"}
              </button>
              <a
                className="press inline-flex items-center gap-2 min-h-11.5 box-border py-2.75 px-5 rounded-full bg-[#000F151A] text-night no-underline text-[15px] font-bold"
                href={"https://wa.me/" + (nc.tel || "") + "?text=" + encodeURIComponent(mensajeCodigo(nc))}
                target="_blank"
                rel="noopener"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 12a8 8 0 01-11.6 7.1L4 20.5l1.4-5.1A8 8 0 1121 12z" />
                </svg>
                Enviar por WhatsApp
              </a>
            </div>
            <span className="text-[13px] text-slate">Guárdalo ahora: por seguridad no se vuelve a mostrar.</span>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="mx-1 mt-2 mb-0 text-[22px] font-extrabold tracking-[-0.03em]">Miembros · {e.members.length}</h2>
        {e.members.length === 0 && <p className="my-0 mx-1 text-[15px] text-muted">Todavía no hay miembros.</p>}
        {filas.map((m) => {
          const activo = Number(m.expira) > now;
          const confirmando = e.confirmMem === m.id;
          const maxD = dispositivosPlan(m.plan);
          const nD = (m.disps || []).length;
          return (
            <div
              key={m.id}
              className="flex flex-wrap items-center gap-y-2.5 gap-x-3.5 pr-3.5 pl-4.5 pt-3.5 pb-3.5 rounded-[24px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12]"
            >
              <div className="flex-[1_1_180px] min-w-0 flex flex-col gap-0.75">
                <strong className="text-[16px] font-semibold">{m.nombre || "Sin nombre"}</strong>
                <span className="text-[13px] text-muted">
                  {nombrePlan(m.plan) +
                    " · " +
                    (activo ? "vence " : "venció ") +
                    fmtDate(Number(m.expira)) +
                    " · " +
                    nD +
                    " de " +
                    maxD +
                    (maxD === 1 ? " dispositivo" : " dispositivos")}
                </span>
              </div>
              <span className={cx("text-[13px] font-bold py-1.5 px-3 rounded-full", activo ? "bg-[#3BF0B426] text-ok" : "bg-[#FF4D5E26] text-danger")}>
                {activo ? "Activo" : "Vencido"}
              </span>
              {nD > 0 && (
                <button
                  className="press min-h-10 py-2 px-3.5 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-transparent text-ink cursor-pointer text-[14px] font-semibold"
                  type="button"
                  onClick={() => void vio.releaseMember(m)}
                >
                  Liberar dispositivos
                </button>
              )}
              <button
                className="press min-h-10 py-2 px-3.5 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF14] text-ink cursor-pointer text-[14px] font-semibold"
                type="button"
                onClick={() => void vio.renewMember(m)}
              >
                +1 mes
              </button>
              <button
                className={cx(
                  "press",
                  ESTILOS.smallBtn,
                  confirmando ? "border-0 bg-[#FF4D5E] text-white" : "border-[0.5px] border-solid border-[#FFFFFF14] bg-transparent text-danger",
                )}
                type="button"
                onClick={() => void vio.deleteMember(m)}
                aria-label={"Quitar acceso de " + (m.nombre || "miembro")}
              >
                {confirmando ? "¿Quitar acceso?" : "Quitar"}
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
}
