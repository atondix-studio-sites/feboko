import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getService, getServices } from "@/lib/data";
import { localizePath, mediaSrc } from "@/lib/utils";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getRequestLang();
  const service = await getService(slug, lang);
  if (!service) notFound();
  const allServices = await getServices(lang);

  const currentIndex = allServices.findIndex((s) => s.id === service.id);
  const nextServices =
    currentIndex >= 0 && allServices.length > 0
      ? Array.from({ length: Math.min(3, allServices.length) }, (_, i) => {
          const idx = (currentIndex + i + 1) % allServices.length;
          return allServices[idx];
        })
      : [];

  return (
    <main className="content single-service">
      <ServiceHero
        title={`${t(lang, "Service", "Service")}: ${service.title}`}
        ctaHref={localizePath("/services", lang)}
        ctaLabel={t(lang, "Alle Services entdecken", "Discover All Services")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { href: localizePath("/services", lang), label: t(lang, "Services", "Services") },
          { label: service.title, current: true },
        ]}
      />

      <section className="container content service-layout">
        <div className="service-sidebar">
          <h3>{t(lang, "Unsere Services", "Our Services")}</h3>
          {allServices.map((s) => (
            <Link
              key={s.id}
              href={localizePath(`/services/${s.slug}`, lang)}
              className={s.slug === slug ? "current" : undefined}
            >
              {s.title}
            </Link>
          ))}
        </div>

        <div className="service-content">
          <div className="service-intro">
            <div className="intro-text">
              {service.secondHeading && <h2 className="service-second-heading">{service.secondHeading}</h2>}
              {service.excerpt && <div className="lead">{service.excerpt}</div>}
            </div>
            {service.featuredImage && (
              <div className="intro-image">
                <img
                  src={mediaSrc(service.featuredImage.localPath, service.featuredImage.originalUrl)}
                  alt={service.title}
                />
              </div>
            )}
          </div>

          <hr className="small" />

          <div className="service-body content" dangerouslySetInnerHTML={{ __html: service.content || "" }} />

          <hr />

          {nextServices.length > 0 && (
            <div className="service-next">
              <h2>{t(lang, "Weiterlesen", "Continue Reading")}</h2>
              <div className="service-cards">
                {nextServices.map((next) => (
                  <article className="service-card" key={next.id}>
                    {next.featuredImage && (
                      <div className="card-image">
                        <img
                          src={mediaSrc(next.featuredImage.localPath, next.featuredImage.originalUrl)}
                          alt={next.title}
                        />
                      </div>
                    )}
                    <h3>{next.title}</h3>
                    <p>{next.excerpt}</p>
                    <Link href={localizePath(`/services/${next.slug}`, lang)} className="read-more">
                      {t(lang, "Weiterlesen", "Read More")} →
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
