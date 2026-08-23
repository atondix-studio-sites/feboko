import type { Metadata } from "next";
import "./globals.css";
import { getRequestLang } from "@/lib/lang";
import { getNavItems, getServices } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClientBehaviors } from "@/components/ClientBehaviors";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://feboko.com"),
  title: {
    default: "FeBoKo Consulting",
    template: "%s | FeBoKo Consulting",
  },
  description: "Expert consulting for market entry in India",
  verification: { google: "q_8w_CFvSt6Jrdx2qk_kwga0MKt4_w3bV8ygDBDgmG0" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getRequestLang();
  const services = await getServices(lang);
  const footerFeboko = await getNavItems("footer-feboko");
  const footerLegal = await getNavItems("footer-legal");

  const menuServices = services.map((s) => ({
    slug: s.slug,
    title: s.title,
    megaMenuItems: s.megaMenuItems,
  }));

  return (
    <html lang={lang}>
      <body>
        <SiteHeader lang={lang} services={menuServices} />
        {children}
        <SiteFooter lang={lang} footerFeboko={footerFeboko} footerLegal={footerLegal} />
        <ClientBehaviors />
      </body>
    </html>
  );
}
