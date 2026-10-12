import type { Metadata } from "next";

/** Rutas públicas del sitio (para el sitemap). */
export const RUTAS_PUBLICAS = ["/", "/visuales", "/planes", "/contacto", "/licencia", "/terminos", "/privacidad"] as const;

/** Metadata de una página: título, descripción, URL canónica y Open Graph. */
export function metaPagina(titulo: string, descripcion: string, ruta: string, extra: Metadata = {}): Metadata {
  return {
    title: titulo,
    description: descripcion,
    alternates: { canonical: ruta },
    openGraph: {
      type: "website",
      locale: "es_PE",
      siteName: "V-IO",
      title: titulo + " · V-IO",
      description: descripcion,
      url: ruta,
      images: [{ url: "/img/hero-1.jpg", alt: "V-IO · Visuales de club" }],
    },
    ...extra,
  };
}
