"use client";

/* eslint-disable @next/next/no-img-element -- miniaturas de Google Drive (externas) en export estático */
import { useSyncExternalStore } from "react";
import { CATEGORIAS } from "@/content/catalogo";
import { btnGrande, chip, cx, ESTILOS, FONDO_PAPELERA } from "@/lib/estilos";
import { parseDrive } from "@/lib/formato";
import { useVio, vio } from "@/lib/useVio";
import { catalogoReal, miembroActivo } from "@/lib/vistas";
import { miniatura, ocultarImg } from "../VisualCard";
import { CAMPO, ETIQUETA, Opciones, SECCION, TITULO } from "./comunes";

const TIPOS = [
  { id: "video", label: "Video" },
  { id: "image", label: "Imagen" },
] as const;

/** ¿El navegador permite leer el portapapeles? (solo se sabe en el cliente) */
const sinSuscripcion = () => () => {};
const puedePegar = () => typeof navigator !== "undefined" && !!navigator.clipboard?.readText;

/** Admin → Visuales: publicar por enlace de Drive y administrar el catálogo. */
export function TabVisuales() {
  const e = useVio();
  const canPaste = useSyncExternalStore(sinSuscripcion, puedePegar, () => false);
  const real = catalogoReal(e, miembroActivo(e));
  const driveId = parseDrive(e.driveUrl);
  const estadoEnlace = !e.driveUrl ? "vacio" : driveId ? "ok" : "mal";
  const prem = e.upPremium;

  const pegar = () => {
    navigator.clipboard.readText().then(
      (t) => vio.set({ driveUrl: (t || "").trim(), upMsg: "" }),
      () => {},
    );
  };

  return (
    <>
      <section className={SECCION}>
        <h2 className={TITULO}>Subir visual</h2>
        <label className={ETIQUETA} htmlFor="adm-drive">
          Enlace de Google Drive
          <span
            className={cx(
              "flex items-center gap-2.5 min-h-14 box-border pr-2 pl-4 pt-0 pb-0 rounded-[18px] border border-solid bg-[#FFFFFF0F]",
              { vacio: "border-[#FFFFFF14]", ok: "border-[#7FF5CC66]", mal: "border-[#FF8A9566]" }[estadoEnlace],
            )}
          >
            <svg
              aria-hidden="true"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#F7F9FF"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 14a4 4 0 005.7 0l3.3-3.3a4 4 0 00-5.7-5.7l-1.2 1.2" />
              <path d="M14 10a4 4 0 00-5.7 0L5 13.3a4 4 0 005.7 5.7l1.2-1.2" />
            </svg>
            <input
              className="flex-1 min-w-0 h-13 border-0 outline-none bg-transparent text-ink text-[16px]"
              id="adm-drive"
              type="url"
              inputMode="url"
              value={e.driveUrl}
              onChange={(ev) => vio.set({ driveUrl: ev.target.value, upMsg: "" })}
              placeholder="https://drive.google.com/file/d/…"
              autoComplete="off"
              spellCheck="false"
            />
            {canPaste && (
              <button
                className="press shrink-0 min-h-10 py-2 px-3.5 rounded-full border-0 bg-[#FFFFFF1F] text-ink cursor-pointer text-[14px] font-semibold"
                type="button"
                onClick={pegar}
              >
                Pegar
              </button>
            )}
          </span>
        </label>
        <span className={cx("text-[13px] leading-[1.5] -mt-1.5", { vacio: "text-dim", ok: "text-ok", mal: "text-danger" }[estadoEnlace])}>
          {
            {
              vacio: 'En Drive: Compartir → Acceso general → "Cualquier persona con el enlace" → Copiar enlace.',
              ok: 'Enlace válido ✓  Recuerda que esté compartido como "Cualquier persona con el enlace".',
              mal: "No reconozco ese enlace. Debe ser de un archivo (no de una carpeta).",
            }[estadoEnlace]
          }
        </span>
        <Opciones titulo="Tipo" aria="Tipo de archivo">
          {TIPOS.map((k) => (
            <button
              key={k.id}
              className={`press ${chip(e.upKind === k.id)}`}
              type="button"
              onClick={() => vio.set({ upKind: k.id })}
              aria-pressed={e.upKind === k.id}
            >
              {k.label}
            </button>
          ))}
        </Opciones>
        <label className={ETIQUETA} htmlFor="adm-title">
          Título
          <input
            className={CAMPO}
            id="adm-title"
            type="text"
            value={e.upTitle}
            onChange={(ev) => vio.set({ upTitle: ev.target.value })}
            placeholder="Ej. Neón líquido"
            autoComplete="off"
          />
        </label>
        <Opciones titulo="Categoría" aria="Categoría">
          {CATEGORIAS.map((c) => (
            <button
              key={c.id}
              className={`press ${chip(e.upCat === c.id)}`}
              type="button"
              onClick={() => vio.set({ upCat: c.id })}
              aria-pressed={e.upCat === c.id}
            >
              {c.label}
            </button>
          ))}
        </Opciones>
        <div className="flex flex-wrap gap-3 items-end">
          <label className={cx("flex-[1_1_180px]", ETIQUETA)} htmlFor="adm-len">
            Duración
            <input
              className={CAMPO}
              id="adm-len"
              type="text"
              value={e.upLen}
              onChange={(ev) => vio.set({ upLen: ev.target.value })}
              placeholder="0:30 loop"
              autoComplete="off"
            />
          </label>
          <button
            className="press flex-[1_1_180px] min-h-13 flex items-center justify-between gap-3 pr-2.5 pl-4.5 pt-0 pb-0 rounded-[18px] border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-ink cursor-pointer text-[16px] font-semibold"
            type="button"
            role="switch"
            aria-checked={prem}
            onClick={() => vio.set({ upPremium: !prem })}
          >
            <span>{prem ? "Premium (solo miembros)" : "Gratis (visible para todos)"}</span>
            <span
              aria-hidden="true"
              className={cx("relative w-12.75 h-7.75 shrink-0 rounded-full [transition:background_.25s_ease]", prem ? "bg-[#34C759]" : "bg-[#FFFFFF29]")}
            >
              <span
                className={cx(
                  "absolute top-0.5 w-6.75 h-6.75 rounded-[50%] bg-white [transition:left_.25s_cubic-bezier(.2,.8,.2,1)]",
                  prem ? "left-5.5" : "left-0.5",
                )}
              />
            </span>
          </button>
        </div>
        <button className={`press ${btnGrande(e.uploading)}`} type="button" onClick={() => void vio.doUpload()}>
          {e.uploading ? "Guardando…" : "Publicar visual"}
        </button>
        {!!e.upMsg && (
          <span role="status" className={cx("text-[14px] font-semibold text-center", e.upErr ? "text-danger" : "text-ok")}>
            {e.upMsg}
          </span>
        )}
      </section>

      <section className="flex flex-col gap-2.5">
        <h2 className="mx-1 mt-2 mb-0 text-[22px] font-extrabold tracking-[-0.03em]">Catálogo · {real.length}</h2>
        {real.length === 0 && <p className="my-0 mx-1 text-[15px] text-muted">Aún no subes visuales. Mientras tanto la web muestra ejemplos.</p>}
        {real.map((t) => {
          const confirmando = e.confirmDel === t.id;
          return (
            <div
              key={t.key}
              className="flex items-center gap-3.5 pr-3 pl-2.5 pt-2.5 pb-2.5 rounded-[24px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12]"
            >
              <span className="relative w-16 h-16 shrink-0 rounded-[16px] overflow-hidden bg-night" aria-hidden="true">
                <img className="w-full h-full object-cover" src={miniatura(t)} alt="" loading="lazy" referrerPolicy="no-referrer" onError={ocultarImg} />
              </span>
              <div className="flex-1 min-w-0 flex flex-col gap-0.75">
                <strong className="text-[16px] font-semibold overflow-hidden text-ellipsis whitespace-nowrap">{t.title}</strong>
                <span className="text-[13px] text-muted overflow-hidden text-ellipsis whitespace-nowrap">
                  {t.tag + (t.len ? " · " + t.len : "") + " · " + (t.kind === "video" ? "Video" : "Imagen") + " · Drive"}
                </span>
              </div>
              <button
                className={cx(
                  "press",
                  ESTILOS.smallBtn,
                  t.premium ? "border-0 bg-ink text-night" : "border-[0.5px] border-solid border-[#FFFFFF1F] bg-[#FFFFFF14] text-ink",
                )}
                type="button"
                onClick={() => void vio.togglePremItem(t)}
                aria-label={"Cambiar a " + (t.premium ? "gratis" : "premium") + ": " + t.title}
              >
                {t.premium ? "Premium" : "Gratis"}
              </button>
              <button
                className={cx(
                  "press",
                  confirmando
                    ? cx(ESTILOS.smallBtn, "border-0 bg-[#FF4D5E] text-white")
                    : "w-10 h-10 shrink-0 rounded-[50%] border-[0.5px] border-solid border-[#FFFFFF14] cursor-pointer",
                )}
                style={confirmando ? undefined : { background: FONDO_PAPELERA }}
                type="button"
                onClick={() => void vio.deleteItem(t.id ?? "")}
                aria-label={"Eliminar " + t.title}
              >
                {confirmando ? "¿Eliminar?" : ""}
              </button>
            </div>
          );
        })}
      </section>
    </>
  );
}
