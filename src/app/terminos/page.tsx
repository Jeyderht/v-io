import { LegalView } from "@/components/LegalView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina(
  "Términos y condiciones",
  "Términos de uso de la web y la suscripción a V-IO: pagos, código de acceso, dispositivos y cancelación.",
  "/terminos",
);

export default function Page() {
  return <LegalView doc="terminos" />;
}
