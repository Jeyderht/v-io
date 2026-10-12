import { LegalView } from "@/components/LegalView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina(
  "Política de privacidad",
  "Cómo V-IO trata tus datos personales conforme a la Ley N.° 29733 de Protección de Datos Personales del Perú.",
  "/privacidad",
);

export default function Page() {
  return <LegalView doc="privacidad" />;
}
