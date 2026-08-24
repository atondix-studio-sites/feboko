import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import {
  getPartners,
  getSection,
  getSections,
  getServices,
  getSiteSettings,
  sectionText,
} from "@/lib/data";
import { boldUpToColon, formatQuote, localizePath, mediaSrc } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { INDIA_FEATURE_ICONS, WHY_FEATURE_ICONS } from "./FeatureIcons";
import { StudioPartnersStrip, StudioServicesCarousel } from "./content/StudioContentSlots";
import { studioContentEnabled } from "@/lib/studio-content";

async function sectionImage(sectionKey: string, pageKey = "frontpage") {
  const section = await getSection(pageKey, sectionKey);
  if (!section?.imageId) return null;
  const media = await prisma.media.findUnique({ where: { id: section.imageId } });
  return mediaSrc(media?.localPath, media?.originalUrl);
}

export async function HomePage({ lang }: { lang: Lang }) {
  const settings = await getSiteSettings();
  const sections = await getSections("frontpage");
  const sectionMap = Object.fromEntries(sections.map((s) => [s.sectionKey, s.data as Record<string, unknown>]));

  const get = (key: string, field: string) =>
    sectionText(sectionMap[key], field, lang);

  const services = await getServices(lang);
  const partners = await getPartners();

  const headerSrc =
    mediaSrc(settings?.headerImage?.localPath, settings?.headerImage?.originalUrl) ||
    "https://feboko.com/wp-content/uploads/2026/02/57989e_19690500288e4f70813207b87f90cbfemv2.avif";

  const aboutImage = await sectionImage("about");
  const teamImage = await sectionImage("team");
  const founder1Image = await sectionImage("founder1");
  const founder2Image = await sectionImage("founder2");

  return (
    <>
      <section className="hero-section">
        <div className="hero-overlay">
          <img src={headerSrc} alt="FeBoKo Consulting" />
          <div className="hero-gradient"></div>
        </div>
        <div className="hero-content container">
          <span className="hero-subtitle">
            <span className="orange">Your Journey</span>
            <span>Is Our</span>
            <span className="green">Destination</span>
          </span>
          <h1 className="hero-title">{get("hero", "title")}</h1>
          <a href="#contact" className="hero-cta">{get("hero", "cta")}</a>
        </div>
        <div className="partner-logos">
          {studioContentEnabled() ? (
            <StudioPartnersStrip />
          ) : (
            <div className="partner-logos-scroll">
              {[...partners, ...partners, ...partners].flatMap((p, i) =>
                p.logo
                  ? [
                      <img
                        key={`${p.id}-${i}`}
                        src={mediaSrc(p.logo.localPath, p.logo.originalUrl)}
                        alt={p.name}
                      />,
                    ]
                  : [],
              )}
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="column-flex-2 reverse layout-about">
            <div className="column1">
              {aboutImage ? (
                <img src={aboutImage} alt="About FeBoKo" />
              ) : (
                <img src="/images/about.jpg" alt="About FeBoKo" />
              )}
            </div>
            <div className="column2 text">
              <h2 className="section-title">{get("about", "title")}</h2>
              <p className="section-description">
                <strong>{get("about", "strong")}</strong>
                <span dangerouslySetInnerHTML={{ __html: get("about", "text") }} />
              </p>
              <a href="#contact" className="btn btn-primary">{get("about", "cta")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section bg-primary-very-light">
        <div className="container content">
          <div className="image-header">
            <div className="column1">
              <p className="section-subtitle">{get("team", "subtitle")}</p>
              <h2 className="section-title">{get("team", "title")}</h2>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("team", "text") }} />
              <Link href={localizePath("/team", lang)} className="btn btn-primary">{get("team", "cta")}</Link>
            </div>
            <div className="column2">
              {teamImage ? (
                <img src={teamImage} alt="Team" />
              ) : (
                <img src="/images/neverchangearunningteam.jpg" alt="Never change a running team" />
              )}
            </div>
          </div>
          <div className="column-flex-2 section-margin">
            <div className="column1">
              <div className="border-box">
                <h3>{get("team_arg1", "title")}</h3>
                <ul>
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg1", "li1")) }} />
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg1", "li2")) }} />
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg1", "li3")) }} />
                </ul>
              </div>
            </div>
            <div className="column2">
              <div className="border-box">
                <h3>{get("team_arg2", "title")}</h3>
                <ul>
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg2", "li1")) }} />
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg2", "li2")) }} />
                  <li dangerouslySetInnerHTML={{ __html: boldUpToColon(get("team_arg2", "li3")) }} />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quote-section bg-primary-light">
        <div className="container content">
          <img className="icon1" src="/icons/quote.svg" alt="" />
          <img className="icon2" src="/icons/quote.svg" alt="" />
          <p dangerouslySetInnerHTML={{ __html: formatQuote(get("quote", "text")) }} />
          <p className="author">{get("quote", "author")}</p>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="section-header">
            <div className="column1">
              <p className="section-subtitle">{get("why", "subtitle")}</p>
              <h2 className="section-title">{get("why", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("why", "text") }} />
              <Link href={localizePath("/team", lang)} className="btn-primary">{get("why", "cta")}</Link>
            </div>
          </div>
          <div className="feature-grid">
            {["why_arg1", "why_arg2", "why_arg3"].map((key, i) => (
              <div className="feature-card" key={key}>
                <div className="feature-header">
                  <div className="feature-icon">{WHY_FEATURE_ICONS[i]}</div>
                  <span className="feature-number">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="feature-title">{get(key, "title")}</h3>
                <p className="feature-description" dangerouslySetInnerHTML={{ __html: get(key, "text") }} />
              </div>
            ))}
          </div>
          <p className="section-footnote">{get("why", "bottom")}</p>
        </div>
      </section>

      <section className="content-section bg-primary-light">
        <div className="container content">
          <div className="section-header no-margin">
            <div className="column1">
              <p className="section-subtitle">{get("consult", "subtitle")}</p>
              <h2 className="section-title">{get("consult", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("consult", "text") }} />
              <a href="#contact" className="btn-primary">{get("consult", "cta")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section bg-primary-very-light">
        <div className="container content">
          <div className="section-header">
            <div className="column1">
              <p className="section-subtitle">{get("services", "subtitle")}</p>
              <h2 className="section-title">{get("services", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("services", "text") }} />
              <Link href={localizePath("/services", lang)} className="btn-primary">{get("services", "cta")}</Link>
            </div>
          </div>
        </div>
        <div className="service-carousel">
          <button className="service-carousel-arrow service-carousel-arrow--left" id="service-carousel-prev" type="button" aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
          <div className="service-carousel-viewport">
            {studioContentEnabled() ? (
              <StudioServicesCarousel lang={lang} />
            ) : (
              <div className="service-carousel-track" id="service-carousel-track">
                {services.map((service) => (
                  <article className="service-grid-card" key={service.id}>
                    {service.featuredImage && (
                      <img src={mediaSrc(service.featuredImage.localPath, service.featuredImage.originalUrl)} alt={service.title} />
                    )}
                    <h3>{service.title}</h3>
                    <p>{service.excerpt}</p>
                    <Link className="read-more" href={localizePath(`/services/${service.slug}`, lang)}>
                      {t(lang, "Weiterlesen", "Read More")}
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
          <button className="service-carousel-arrow service-carousel-arrow--right" id="service-carousel-next" type="button" aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6" fill="none" stroke="currentColor" strokeWidth="2" /></svg>
          </button>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="section-header">
            <div className="column1">
              <p className="section-subtitle">{get("india", "subtitle")}</p>
              <h2 className="section-title">{get("india", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("india", "text") }} />
              <Link href={localizePath("/team", lang)} className="btn-primary">{get("india", "cta")}</Link>
            </div>
          </div>
          <div className="feature-grid">
            {["india_arg1", "india_arg2", "india_arg3"].map((key, i) => (
              <div className="feature-card" key={key}>
                <div className="feature-header">
                  <div className="feature-icon">{INDIA_FEATURE_ICONS[i]}</div>
                  <span className="feature-number">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="feature-title">{get(key, "title")}</h3>
                <p className="feature-subtitle">{get(key, "subtitle")}</p>
                <p className="feature-description" dangerouslySetInnerHTML={{ __html: get(key, "text") }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="section-header">
            <div className="column1">
              <p className="section-subtitle">{get("founders", "subtitle")}</p>
              <h2 className="section-title">{get("founders", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("founders", "text") }} />
              <Link href={localizePath("/team", lang)} className="btn-primary">{get("founders", "cta")}</Link>
            </div>
          </div>
          <div className="founder-quotes">
            <FounderCard
              name="Philipp Kolb"
              title="Founder & Managing Director"
              image={founder1Image || "/images/founder1.jpg"}
              text={get("founders", "philipp")}
              lang={lang}
            />
            <FounderCard
              name="Matthias Feist"
              title="Founder & Managing Director"
              image={founder2Image || "/images/founder2.jpg"}
              text={get("founders", "Matthias")}
              lang={lang}
            />
          </div>
        </div>
      </section>
    </>
  );
}
import { FounderCard } from "./FounderCard";
