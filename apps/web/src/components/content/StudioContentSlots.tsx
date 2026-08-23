import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";

/** Pattern row for `people` — cloned by atondix.js when content loads. */
export function StudioPeopleGrid({ lang }: { lang: Lang }) {
  return (
    <div className="team-grid" data-atondix-collection="people">
      <article className="team-grid-card" data-atondix-entry>
        <div className="team-photo-large-wrapper">
          <img className="team-photo-large" data-atondix-field="photo" alt="" src="/images/about.jpg" />
        </div>
        <div className="team-content">
          <div className="team-header">
            <img className="team-photo" data-atondix-field="photo" alt="" src="/images/about.jpg" />
            <div>
              <h3 data-atondix-field="name">{t(lang, "Teammitglied", "Team member")}</h3>
              <p className="position" data-atondix-field="role">
                {t(lang, "Funktion", "Role")}
              </p>
            </div>
            <div className="contact">
              <p data-atondix-field="email">info@feboko.com</p>
              <p data-atondix-field="phone">+49</p>
            </div>
          </div>
          <p className="about" data-atondix-field="bio">
            {t(lang, "Kurzprofil", "Short bio")}
          </p>
        </div>
      </article>
    </div>
  );
}

/** Pattern row for `services`. */
export function StudioServicesGrid({ lang }: { lang: Lang }) {
  return (
    <div className="service-grid" data-atondix-collection="services">
      <article className="service-grid-card" data-atondix-entry>
        <img data-atondix-field="image" alt="" src="/images/about.jpg" />
        <h3 data-atondix-field="title">{t(lang, "Leistung", "Service")}</h3>
        <p data-atondix-field="excerpt">{t(lang, "Kurzbeschreibung", "Summary")}</p>
        <span className="read-more">{t(lang, "Weiterlesen", "Read More")}</span>
      </article>
    </div>
  );
}

/** Carousel track pattern for homepage services strip. */
export function StudioServicesCarousel({ lang }: { lang: Lang }) {
  return (
    <div className="service-carousel-track" id="service-carousel-track" data-atondix-collection="services">
      <article className="service-grid-card service-card" data-atondix-entry>
        <img data-atondix-field="image" alt="" src="/images/about.jpg" />
        <h3 data-atondix-field="title">{t(lang, "Leistung", "Service")}</h3>
        <p data-atondix-field="excerpt">{t(lang, "Kurzbeschreibung", "Summary")}</p>
        <span className="read-more">{t(lang, "Weiterlesen", "Read More")}</span>
      </article>
    </div>
  );
}

/** Pattern row for `jobs`. */
export function StudioJobsGrid({ lang }: { lang: Lang }) {
  return (
    <div className="job-grid" data-atondix-collection="jobs">
      <article className="job-grid-card" data-atondix-entry>
        <div className="job-card-content">
          <div className="job-card-header">
            <h3 data-atondix-field="title">{t(lang, "Stelle", "Position")}</h3>
          </div>
          <div className="job-card__info-row">
            <span className="job-info-pill" data-atondix-field="location">
              {t(lang, "Ort", "Location")}
            </span>
            <span className="job-info-pill" data-atondix-field="type">
              {t(lang, "Art", "Type")}
            </span>
          </div>
          <div className="job-card__richtext" data-atondix-field="body" />
        </div>
      </article>
    </div>
  );
}

/** Pattern row for `news` (blog listing). */
export function StudioNewsGrid({ lang }: { lang: Lang }) {
  return (
    <div className="blog-grid" data-atondix-collection="news">
      <article className="blog-grid-card" data-atondix-entry>
        <div className="blog-card-image">
          <img data-atondix-field="image" alt="" src="/images/about.jpg" />
        </div>
        <div className="blog-card-body">
          <div className="blog-meta">
            <span className="blog-date" data-atondix-field="date">
              01.01.2026
            </span>
          </div>
          <h3 data-atondix-field="title">{t(lang, "Beitrag", "Article")}</h3>
          <span className="read-more">{t(lang, "Weiterlesen", "Read More")} →</span>
        </div>
      </article>
    </div>
  );
}

/** Partner logo strip on the homepage hero. */
export function StudioPartnersStrip() {
  return (
    <div className="partner-logos-scroll" data-atondix-collection="partners">
      <div data-atondix-entry className="partner-logo-slot">
        <img data-atondix-field="logo" alt="" src="/images/about.jpg" />
      </div>
    </div>
  );
}
