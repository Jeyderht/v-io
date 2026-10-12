import { InicioView } from "@/components/InicioView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina("Visuales de club", "Visuales premium para clubs, DJs y eventos. Suscripción mensual o anual y visuales a medida.", "/", {
  title: { absolute: "V-IO · Visuales de club" },
});

export default function Page() {
  return <InicioView />;
}
