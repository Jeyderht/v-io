"use client";

import type { AdminTab } from "@/types";
import { CONFIGURADO } from "@/lib/config";
import { segmento } from "@/lib/estilos";
import { useVio, vio } from "@/lib/useVio";
import { catalogoReal, miembroActivo } from "@/lib/vistas";
import { AdminLogin } from "./AdminLogin";
import { TabMiembros } from "./TabMiembros";
import { TabPortada } from "./TabPortada";
import { TabVisuales } from "./TabVisuales";

const PESTANAS: { id: AdminTab; label: string }[] = [
  { id: "visuales", label: "Visuales" },
  { id: "miembros", label: "Miembros" },
  { id: "portada", label: "Portada" },
];

export function AdminView() {
  const e = useVio();
  const real = catalogoReal(e, miembroActivo(e));
  const now = e.ahora;
  const stats = [
    { value: String(real.length), label: "Visuales" },
    { value: String(real.filter((t) => t.premium).length), label: "Premium" },
    { value: String(e.members.filter((m) => Number(m.expira) > now).length), label: "Miembros activos" },
    { value: String(e.members.filter((m) => !(m.disps || []).length && Number(m.expira) > now).length), label: "Códigos sin usar" },
  ];
  return (
    <main className="page pagepad relative max-w-[980px] my-0 mx-auto pl-4 pr-4 pb-10 flex flex-col gap-4.5">
      <h1 className="my-0 mx-1 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,84px)] leading-[0.92] text-ink">Admin</h1>

      {!e.adminChecked && <p className="my-0 mx-1 text-[16px] text-muted">Verificando acceso…</p>}

      {!CONFIGURADO && (
        <div className="py-7 px-6 rounded-[30px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF14] flex flex-col gap-2">
          <strong className="text-[20px]">Falta conectar la base de datos</strong>
          <span className="text-[15px] leading-[1.5] text-muted">Configura las variables de Supabase (paso 3 de la guía) y vuelve a publicar la web.</span>
        </div>
      )}

      {CONFIGURADO && e.adminChecked && !e.isAdminUser && <AdminLogin />}

      {e.isAdminUser && (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-2.5">
            {stats.map((st) => (
              <div
                key={st.label}
                className="py-4.5 px-5 rounded-[24px] bg-[#FFFFFF0F] border-[0.5px] border-solid border-[#FFFFFF12] shadow-[inset_0_0.5px_0_#FFFFFF1F] flex flex-col gap-1"
              >
                <span className="text-[28px] font-bold tracking-[-0.03em]">{st.value}</span>
                <span className="text-[14px] text-muted">{st.label}</span>
              </div>
            ))}
          </div>

          <div
            className="self-start inline-flex gap-1 p-1.25 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF14] shadow-[inset_0_0.5px_0_#FFFFFF2E]"
            role="tablist"
            aria-label="Secciones de admin"
          >
            {PESTANAS.map((tb) => (
              <button
                key={tb.id}
                className={`press ${segmento(e.adminTab === tb.id)}`}
                type="button"
                role="tab"
                aria-selected={e.adminTab === tb.id}
                onClick={() => (tb.id === "portada" ? vio.abrirPortada() : vio.set({ adminTab: tb.id }))}
              >
                {tb.label}
              </button>
            ))}
          </div>

          <button
            className="press absolute top-11 right-4 min-h-10 py-2 px-3.5 rounded-full border-[0.5px] border-solid border-[#FFFFFF14] bg-[#FFFFFF0F] text-muted cursor-pointer text-[14px] font-semibold"
            type="button"
            onClick={() => void vio.adminLogout()}
          >
            Salir
          </button>
          {!!e.listMsg && (
            <span className="text-[14px] text-danger" role="status">
              {e.listMsg}
            </span>
          )}
          {e.adminTab === "visuales" && <TabVisuales />}
          {e.adminTab === "portada" && <TabPortada />}
          {e.adminTab === "miembros" && <TabMiembros />}
        </>
      )}
    </main>
  );
}
