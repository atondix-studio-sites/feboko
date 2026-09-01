import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import { anchorSlug, localizePath } from "@/lib/utils";

const EXCLUDED = [
  "unsere schwerpunkte",
  "unsere stärken",
  "our focus areas",
  "our strengths",
  "our strenghts",
];

type ServiceMenuItem = {
  slug: string;
  title: string;
  megaMenuItems: string | null;
};

export function MegaMenuServices({
  lang,
  services,
}: {
  lang: Lang;
  services: ServiceMenuItem[];
}) {
  const items = services.map((s) => {
    const subservices = (s.megaMenuItems ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l && !EXCLUDED.includes(l.toLowerCase()));
    return { ...s, subservices };
  });

  if (!items.length) return null;

  const archiveUrl = localizePath("/services", lang);

  return (
    <div
      className="mega-menu-panel"
      id="mega-menu-panel"
      role="region"
      aria-label={t(lang, "Services", "Services")}
      aria-hidden="true"
    >
      <div className="mega-menu-inner container">
        <nav
          className="mega-menu-categories"
          lang={lang}
          aria-label={t(lang, "Service-Kategorien", "Service categories")}
        >
          {items.map((item, index) => {
            const serviceUrl = localizePath(`/services/${item.slug}`, lang);
            return (
              <div className="mega-menu-category-wrapper" key={item.slug}>
                <Link
                  href={serviceUrl}
                  className={`mega-menu-category${index === 0 ? " is-active" : ""}${item.subservices.length ? " has-sub" : ""}`}
                  data-mega-index={index}
                  aria-current={index === 0 ? "true" : undefined}
                >
                  {item.title}
                  <span className="mega-menu-category-arrow" aria-hidden="true">›</span>
                </Link>
                {item.subservices.length > 0 && (
                  <ul className="mega-menu-category-mobile-sub" aria-label={item.title}>
                    {item.subservices.map((label) => (
                      <li key={label}>
                        <Link href={`${serviceUrl}#${anchorSlug(label)}`}>{label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>

        <div className="mega-menu-subservices">
          {items.map((item, index) => {
            const serviceUrl = localizePath(`/services/${item.slug}`, lang);
            return (
              <div
                className={`mega-menu-subservice-list${index === 0 ? " is-visible" : ""}`}
                data-mega-list={index}
                key={item.slug}
                aria-hidden={index === 0 ? "false" : "true"}
              >
                <div className="mega-menu-subservice-header">
                  <Link href={archiveUrl} className="mega-menu-overview-link">
                    {t(lang, "Alle Leistungen im Überblick", "All services overview")} →
                  </Link>
                </div>
                <ul className="mega-menu-links">
                  {item.subservices.length > 0 ? (
                    item.subservices.map((label) => (
                      <li key={label}>
                        <Link href={`${serviceUrl}#${anchorSlug(label)}`}>{label}</Link>
                      </li>
                    ))
                  ) : (
                    <li className="mega-menu-subservice-empty">
                      <Link href={serviceUrl}>{item.title}</Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <aside
          className="mega-menu-advantage"
          aria-label={t(lang, "Der FeBoKo-Vorsprung", "The FeBoKo Advantage")}
        >
          <h3 className="mega-menu-advantage-title">
            {t(lang, "Der FeBoKo-Vorsprung", "The FeBoKo Advantage")}
          </h3>
          <div className="mega-menu-advantage-content">
            <p>
              {t(
                lang,
                "Wir begleiten mittelständische Unternehmen bei der Transformation. Mit Praxiserfahrung und strategischem Weitblick schaffen wir messbare Ergebnisse.",
                "We support medium-sized companies in their transformation. With practical experience and strategic vision, we create measurable results.",
              )}
            </p>
          </div>
          <Link href={localizePath("/#contact", lang)} className="mega-menu-advantage-cta">
            {t(lang, "Kostenloses Erstgespräch", "Free consultation")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
