import { ContactoView } from "@/components/ContactoView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina("Contacto", "Escríbenos por WhatsApp para planes, pagos o visuales a medida. Preguntas frecuentes de V-IO.", "/contacto");

export default function Page() {
  return <ContactoView />;
}
