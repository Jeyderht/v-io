import { PlanesView } from "@/components/PlanesView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina(
  "Planes",
  "Planes de suscripción DJ / VJ, PRO y Productora: todo el catálogo de visuales en soles, mensual o anual.",
  "/planes",
);

export default function Page() {
  return <PlanesView />;
}
