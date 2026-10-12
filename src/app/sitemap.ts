import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { RUTAS_PUBLICAS } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return RUTAS_PUBLICAS.map((ruta) => ({
    url: SITE_URL + (ruta === "/" ? "" : ruta),
    changeFrequency: ruta === "/visuales" ? "weekly" : "monthly",
    priority: ruta === "/" ? 1 : 0.7,
  }));
}
