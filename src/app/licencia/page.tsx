import { LegalView } from "@/components/LegalView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina(
  "Licencia de uso",
  "Qué puedes hacer con los visuales de V-IO según tu plan: alcance, usos permitidos y no permitidos.",
  "/licencia",
);

export default function Page() {
  return <LegalView doc="licencia" />;
}
