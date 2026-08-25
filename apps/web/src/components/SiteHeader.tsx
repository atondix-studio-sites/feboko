"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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

function navItemClass(pathname: string, match: "home" | "prefix", hrefPath: string): string {
  const path = pathname.replace(/\/$/, "") || "/";
  const target = hrefPath.replace(/\/$/, "") || "/";

  if (match === "home") {
    return path === "/" ? "menu-item current-menu-item" : "menu-item";
  }

  if (path === target || path.startsWith(`${target}/`)) {
    return "menu-item current-menu-item";
  }

  return "menu-item";
}

export function SiteHeader({
  lang,
  services,
}: {
  lang: Lang;
  services: ServiceMenuItem[];
}) {
  const pathname = usePathname();
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
            <li className={navItemClass(pathname, "home", "/")}>
              <Link href={home} aria-current={pathname === "/" ? "page" : undefined}>
                {t(lang, "Home", "Home")}
              </Link>
            </li>
            <li
              className={`${navItemClass(pathname, "prefix", "/services")} menu-item-has-mega-menu`}
            >
              <Link
                href={localizePath("/services", lang)}
                className="mega-menu-trigger-link"
                aria-haspopup="true"
                aria-expanded="false"
                aria-current={
                  pathname === "/services" || pathname.startsWith("/services/")
                    ? "page"
                    : undefined
                }
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
                <span className="mega-menu-toggle-icon" aria-hidden="true">
                  ›
                </span>
              </button>
              <MegaMenuServices lang={lang} services={services} />
            </li>
            <li className={navItemClass(pathname, "prefix", "/team")}>
              <Link
                href={localizePath("/team", lang)}
                aria-current={pathname === "/team" || pathname.startsWith("/team/") ? "page" : undefined}
              >
                {t(lang, "Team", "Team")}
              </Link>
            </li>
            <li className={navItemClass(pathname, "prefix", "/karriere")}>
              <Link
                href={localizePath("/karriere", lang)}
                aria-current={
                  pathname === "/karriere" || pathname.startsWith("/karriere/") ? "page" : undefined
                }
              >
                {t(lang, "Karriere", "Careers")}
              </Link>
            </li>
            <li className={navItemClass(pathname, "prefix", "/blog")}>
              <Link
                href={localizePath("/blog", lang)}
                aria-current={pathname === "/blog" || pathname.startsWith("/blog/") ? "page" : undefined}
              >
                {t(lang, "Blog", "Blog")}
              </Link>
            </li>
          </ul>
        </nav>

        <LangSwitcherSlot lang={lang} />
      </div>
      <div className="mobile-menu-overlay"></div>
    </header>
  );
}
