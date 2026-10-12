import Link from "next/link";
import type { DocLegalId } from "@/types";
import { textosLegales } from "@/content/legales";
import { WHATSAPP } from "@/lib/config";
import { cx } from "@/lib/estilos";
import { waLink } from "@/lib/formato";

const RUTAS: Record<DocLegalId, string> = { licencia: "/licencia", terminos: "/terminos", privacidad: "/privacidad" };

/** Página legal (Licencia, Términos o Privacidad). Se genera estática en el build. */
export function LegalView({ doc }: { doc: DocLegalId }) {
  const docs = textosLegales("WhatsApp +" + WHATSAPP);
  const cur = docs[doc];
  return (
    <main className="page pagepad relative max-w-[760px] my-0 mx-auto pl-5 pr-5 pb-10 flex flex-col gap-5.5">
      <nav
        className="self-start inline-flex flex-wrap gap-1 p-1.25 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF14]"
        aria-label="Documentos legales"
      >
        {(Object.keys(docs) as DocLegalId[]).map((k) => (
          <Link
            key={k}
            href={RUTAS[k]}
            aria-current={k === doc ? "page" : undefined}
            className={cx(
              "press inline-flex items-center justify-center box-border no-underline tracking-normal shrink-0 border-0 cursor-pointer text-[15px] font-semibold py-2.5 px-4.5 min-h-11 rounded-full",
              k === doc ? "bg-white text-night" : "bg-transparent text-lavender",
            )}
          >
            {docs[k].label}
          </Link>
        ))}
      </nav>
      <h1 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,72px)] leading-[0.95] text-ink">{cur.title}</h1>
      <span className="text-[14px] text-dim">Última actualización: {cur.date}</span>
      <p className="m-0 text-[17px] leading-[1.6] text-[#C9D4E0]">{cur.intro}</p>
      {cur.sections.map((sec) => (
        <section key={sec.h} className="py-5.5 px-6 rounded-[26px] bg-[#FFFFFF0A] border-[0.5px] border-solid border-[#FFFFFF12] flex flex-col gap-2.5">
          <h2 className="m-0 text-[19px] font-bold tracking-[-0.02em]">{sec.h}</h2>
          {sec.ps.map((para) => (
            <p key={para} className="m-0 text-[15px] leading-[1.65] text-muted">
              {para}
            </p>
          ))}
        </section>
      ))}
      <a
        className="press self-start inline-flex items-center gap-2 min-h-12 box-border py-3 px-5 rounded-full bg-[#FFFFFF14] border-[0.5px] border-solid border-[#FFFFFF1F] text-ink no-underline text-[15px] font-semibold"
        href={waLink("Hola V-IO, tengo una consulta.")}
        target="_blank"
        rel="noopener"
      >
        ¿Dudas? Escríbenos por WhatsApp
      </a>
    </main>
  );
}
