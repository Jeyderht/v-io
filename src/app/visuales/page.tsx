import { VisualesView } from "@/components/VisualesView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina(
  "Visuales",
  "Catálogo de visuales para DJs, VJs, clubs y eventos: VJ loops, contenido LED, intros y temáticos. Resolume ready.",
  "/visuales",
);

export default function Page() {
  return <VisualesView />;
}
