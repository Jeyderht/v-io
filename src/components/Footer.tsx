"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useVio, vio } from "@/lib/useVio";
import { IconAMedida, IconExplorar, IconMensajes } from "./icons";

/** Pie de página: enlaces, métodos de pago, firma y "Volver arriba". */
export function Footer() {
  const { member } = useVio();
  const router = useRouter();
  const openLogin = () => vio.set({ loginOpen: true, loginErr: "" });
  const openQuote = () => vio.set({ quoteOpen: true });
  const verCategorias = () => {
    vio.set({ filtersOpen: true });
    router.push("/visuales");
  };
  const volverArriba = () => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      window.scrollTo(0, 0);
    }
  };
  return (
    <footer className="vfoot relative mt-14 px-3 pt-0 pb-32">
      <div className="max-w-[1200px] my-0 mx-auto box-border px-6.5 pt-9 pb-7.5 rounded-[36px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12] shadow-[inset_0_0.5px_0_#FFFFFF1F]">
        <div className="fgrid">
          <nav className="fcol" aria-label="Explorar">
            <h2 className="fhead">Explorar</h2>
            <Link className="flink" href="/visuales">
              Visuales
            </Link>
            <button className="flink inline-flex items-center gap-2" type="button" onClick={verCategorias}>
              <IconExplorar size={20} />
              Categorías
            </button>
            <button className="flink inline-flex items-center gap-2" type="button" onClick={openQuote}>
              <IconAMedida size={20} />
              Visuales a medida
            </button>
            <Link className="flink" href="/planes">
              Planes
            </Link>
          </nav>
          <nav className="fcol" aria-label="Tu cuenta">
            <h2 className="fhead">Tu cuenta</h2>
            <button className="flink" type="button" onClick={openLogin}>
              {member ? "Mi cuenta" : "Ingresar"}
            </button>
            <Link className="flink" href="/visuales">
              Mis visuales
            </Link>
            <Link className="flink inline-flex items-center gap-2" href="/contacto#preguntas">
              <IconMensajes size={20} />
              Preguntas frecuentes
            </Link>
            <Link className="flink" href="/contacto">
              Contacto
            </Link>
          </nav>
          <nav className="fcol" aria-label="Empezar">
            <h2 className="fhead">Empezar</h2>
            <Link className="flink" href="/planes">
              Elegir plan
            </Link>
            <button className="flink" type="button" onClick={openLogin}>
              Ingresar con código
            </button>
            <button className="flink inline-flex items-center gap-2" type="button" onClick={openQuote}>
              <IconAMedida size={20} />
              Cotizar a medida
            </button>
          </nav>
          <nav className="fcol" aria-label="Legal">
            <h2 className="fhead">Legal</h2>
            <Link className="flink" href="/licencia">
              Licencia de uso
            </Link>
            <Link className="flink" href="/terminos">
              Términos
            </Link>
            <Link className="flink" href="/privacidad">
              Privacidad
            </Link>
            <Link className="flink" href="/admin">
              Admin
            </Link>
          </nav>
        </div>
        <div className="mt-8.5 flex flex-col gap-4">
          <h2 className="fhead">Métodos de pago</h2>
          <div className="flex flex-wrap gap-2.5">
            <span className="fpay">
              <Image className="w-10.5 h-auto" src="/img/pagos/visa-mono.svg" alt="Visa" width={999} height={324} loading="eager" />
            </span>
            <span className="fpay">
              <Image className="h-7.5 w-auto" src="/img/pagos/yape-mono.svg" alt="Yape" width={282} height={355} loading="eager" />
            </span>
            <span className="fpay">
              <Image className="h-7 w-auto" src="/img/pagos/plin-mono.svg" alt="Plin" width={2000} height={1997} loading="eager" />
            </span>
          </div>
        </div>
        <div className="mx-0 mt-7.5 mb-5.5 h-[0.5px] bg-[#FFFFFF1F]" />
        <p className="mx-0 mt-0 mb-4.5 text-[15px] text-muted">© 2026 V-IO. Todos los derechos reservados.</p>
        <div className="flex flex-nowrap gap-3 items-center justify-between">
          <span className="fsign">
            Diseñado por
            <span className="fbrand">
              <Image src="/img/rckt-isotipo.svg" alt="" width={18} height={18} loading="eager" />
              Rckt Studio
            </span>
          </span>
          <button className="press ftop" type="button" onClick={volverArriba}>
            <span className="toplabel">Volver arriba</span>
            <span className="w-8 h-8 rounded-[50%] bg-ink text-night inline-flex items-center justify-center" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5.5 11.5L12 5l6.5 6.5" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
