import Link from "next/link";

export const metadata = { title: "Página no encontrada", robots: { index: false } };

export default function NotFound() {
  return (
    <main className="page pagepad relative max-w-[780px] my-0 mx-auto pl-5 pr-5 pb-10 flex flex-col gap-6 items-start">
      <h1 className="m-0 font-extrabold tracking-[-0.04em] text-[length:clamp(36px,7vw,84px)] leading-[0.92] text-ink">Página no encontrada</h1>
      <p className="m-0 text-[17px] leading-[1.55] text-muted">La dirección no existe o cambió.</p>
      <Link
        className="press inline-flex items-center box-border min-h-12 py-3 px-5.5 rounded-full bg-ink text-night no-underline tracking-normal text-[15px] font-bold"
        href="/"
      >
        Ir al inicio
      </Link>
    </main>
  );
}
