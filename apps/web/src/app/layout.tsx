import type { Metadata } from "next";
import "./globals.css";
import { getRequestLang } from "@/lib/lang";
import { getNavItems, getServices, getSiteSettings } from "@/lib/data";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ClientBehaviors } from "@/components/ClientBehaviors";
import { StudioSdk } from "@/components/StudioSdk";

const descriptions = {
  de: "FeBoKo Consulting begleitet europäische Unternehmen beim Markteintritt in Indien – von Marktanalyse und Gründung bis Recht, Steuern, Finance und Umsetzung.",
  en: "FeBoKo Consulting supports European companies entering India—from market analysis and company formation to legal, tax, finance and operational delivery.",
};

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getRequestLang();
  const description = descriptions[lang];

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://feboko.com"),
    title: {
      default: "FeBoKo Consulting",
      template: "%s – FeBoKo Consulting",
    },
    description,
    icons: {
      icon: [
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-300x300.png", sizes: "300x300", type: "image/png" },
      ],
      shortcut: "/favicon-32x32.png",
      apple: [{ url: "/favicon-300x300.png", sizes: "300x300", type: "image/png" }],
    },
    openGraph: {
      type: "website",
      siteName: "FeBoKo Consulting",
      description,
      locale: lang === "en" ? "en_GB" : "de_DE",
      alternateLocale: lang === "en" ? ["de_DE"] : ["en_GB"],
    },
    twitter: {
      card: "summary",
      description,
    },
    robots: { "max-image-preview": "large" },
    verification: { google: "q_8w_CFvSt6Jrdx2qk_kwga0MKt4_w3bV8ygDBDgmG0" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getRequestLang();
  const services = await getServices(lang);
  const siteSettings = await getSiteSettings();
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
        <SiteFooter
          lang={lang}
          footerFeboko={footerFeboko}
          footerLegal={footerLegal}
          contactEmail={siteSettings?.contactEmail}
          contactPhone={siteSettings?.contactPhone}
          linkedinUrl={siteSettings?.linkedinUrl}
        />
        <ClientBehaviors />
        <StudioSdk />
      </body>
    </html>
  );
}
