import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import { localizePath } from "@/lib/utils";
import { MegaMenuServices } from "./MegaMenuServices";
import { LangSwitcherSlot } from "./ClientBehaviors";

type ServiceMenuItem = {
  slug: string;
  title: string;
  megaMenuItems: string | null;
};

export function SiteHeader({
  lang,
  services,
}: {
  lang: Lang;
  services: ServiceMenuItem[];
}) {
  const home = localizePath("/", lang);

  return (
    <header className="site-header">
      <div className="container">
        <div className="site-logo">
          <Link href={home}>
            <img src="/images/logo.svg" alt="FeBoKo Consulting" width={161} height={65} />
          </Link>
        </div>

        <button
          className="hamburger-toggle"
          aria-label="Toggle navigation"
          aria-expanded="false"
          type="button"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav className="nav-container" aria-label="Primary">
          <ul className="main-navigation">
            <li className="menu-item">
              <Link href={home}>{t(lang, "Home", "Home")}</Link>
            </li>
            <li className="menu-item menu-item-has-mega-menu">
              <Link
                href={localizePath("/services", lang)}
                className="mega-menu-trigger-link"
                aria-haspopup="true"
              >
                {t(lang, "Services", "Services")}
              </Link>
              <button
                className="mega-menu-toggle"
                type="button"
                aria-expanded="false"
                aria-controls="mega-menu-panel"
                aria-label={t(lang, "Servicebereich öffnen", "Open services menu")}
              >
                {t(lang, "Services", "Services")}
                <span className="mega-menu-toggle-icon" aria-hidden="true">›</span>
              </button>
              <MegaMenuServices lang={lang} services={services} />
            </li>
            <li className="menu-item">
              <Link href={localizePath("/team", lang)}>{t(lang, "Team", "Team")}</Link>
            </li>
            <li className="menu-item">
              <Link href="/karriere">{t(lang, "Karriere", "Careers")}</Link>
            </li>
            <li className="menu-item">
              <Link href={localizePath("/blog", lang)}>{t(lang, "Blog", "Blog")}</Link>
            </li>
          </ul>
        </nav>

        <LangSwitcherSlot lang={lang} />
      </div>
      <div className="mobile-menu-overlay"></div>
    </header>
  );
}
