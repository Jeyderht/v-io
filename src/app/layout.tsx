import type { Metadata, Viewport } from "next";
import { DM_Sans } from "next/font/google";
import { Shell } from "@/components/Shell";
import { SITE_URL } from "@/lib/config";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], axes: ["opsz"], display: "swap" });

const DESCRIPCION = "Visuales premium para clubs, DJs y eventos. Suscripción mensual o anual y visuales a medida.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "V-IO · Visuales de club", template: "%s · V-IO" },
  description: DESCRIPCION,
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: "V-IO",
    title: "V-IO · Visuales de club",
    description: "Visuales premium para clubs, DJs y eventos.",
    images: [{ url: "/img/hero-1.jpg", alt: "V-IO · Visuales de club" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es">
      <body>
        <Shell fuente={dmSans.className}>{children}</Shell>
      </body>
    </html>
  );
}
