import { AdminView } from "@/components/admin/AdminView";
import { metaPagina } from "@/lib/seo";

export const metadata = metaPagina("Admin", "Panel de administración de V-IO.", "/admin", { robots: { index: false, follow: false } });

export default function Page() {
  return <AdminView />;
}
