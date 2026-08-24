import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getServices } from "@/lib/data";
import { localizePath, mediaSrc } from "@/lib/utils";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";
import { StudioServicesGrid } from "@/components/content/StudioContentSlots";
import { studioContentEnabled } from "@/lib/studio-content";

export const metadata: Metadata = {
  title: "Services",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const lang = await getRequestLang();
  const services = await getServices(lang);

  return (
    <main className="content single-service">
      <ServiceHero
        title={t(lang, "Unsere Services für Sie", "Our Services for You")}
        ctaHref={localizePath("/team", lang)}
        ctaLabel={t(lang, "Mehr über uns", "More About Us")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { label: t(lang, "Services", "Services"), current: true },
        ]}
      />

      <section className="content-section">
        <div className="container content">
          {studioContentEnabled() ? (
            <StudioServicesGrid lang={lang} />
          ) : services.length > 0 ? (
            <div className="service-grid">
              {services.map((service) => (
                <article className="service-grid-card" key={service.id}>
                  {service.featuredImage && (
                    <img
                      src={mediaSrc(service.featuredImage.localPath, service.featuredImage.originalUrl)}
                      alt={service.title}
                    />
                  )}
                  <h3>{service.title}</h3>
                  <p>{service.excerpt}</p>
                  <Link className="read-more" href={localizePath(`/services/${service.slug}`, lang)}>
                    {t(lang, "Weiterlesen", "Read More")}
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <p>{t(lang, "Keine Services gefunden.", "No services found.")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
