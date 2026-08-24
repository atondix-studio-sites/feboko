import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getJobs, getSections, sectionText } from "@/lib/data";
import { localizePath, mediaSrc } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";
import { JobCard } from "@/components/JobCard";
import { StudioJobsGrid } from "@/components/content/StudioContentSlots";
import { studioContentEnabled } from "@/lib/studio-content";

export const metadata: Metadata = {
  title: "Jobs",
  alternates: { canonical: "/karriere" },
};

async function careerImage() {
  const section = await prisma.siteSection.findUnique({
    where: { pageKey_sectionKey: { pageKey: "career", sectionKey: "about" } },
  });
  if (!section?.imageId) return null;
  const media = await prisma.media.findUnique({ where: { id: section.imageId } });
  return mediaSrc(media?.localPath, media?.originalUrl);
}

export default async function KarrierePage() {
  const lang = await getRequestLang();
  const jobs = await getJobs();
  const sections = await getSections("career");
  const sectionMap = Object.fromEntries(sections.map((s) => [s.sectionKey, s.data as Record<string, unknown>]));
  const get = (key: string, field: string) => sectionText(sectionMap[key], field, lang);
  const aboutImage = await careerImage();

  return (
    <main className="content single-service">
      <ServiceHero
        title={t(lang, "Starte deine Karriere bei FeBoKo", "Start your career at FeBoKo")}
        ctaHref={localizePath("/team", lang)}
        ctaLabel={t(lang, "Mehr über uns", "More About Us")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { label: t(lang, "Karriere", "Careers"), current: true },
        ]}
      />

      <section className="content-section">
        <div className="container content">
          <div className="column-flex-2 layout-about">
            <div className="column1 text">
              <h2 className="section-title">{get("about", "title")}</h2>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("about", "text") }} />
            </div>
            <div className="column2">
              {aboutImage ? <img src={aboutImage} alt="" /> : <img src="/images/about.jpg" alt="" />}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section bg-primary-light">
        <div className="container content">
          <div className="section-header no-margin">
            <div className="column1">
              <p className="section-subtitle">{get("initiative", "subtitle")}</p>
              <h2 className="section-title">{get("initiative", "title")}</h2>
            </div>
            <div className="column2">
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("initiative", "text") }} />
              <a href={get("initiative", "cta_link") || "#contact"} className="btn-primary">{get("initiative", "cta")}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          {studioContentEnabled() ? (
            <StudioJobsGrid lang={lang} />
          ) : jobs.length > 0 ? (
            <div className="job-grid">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} lang={lang} />
              ))}
            </div>
          ) : (
            <p>{t(lang, "Aktuell haben wir keine offenen Job-Positionen.", "We currently do not have any open job positions.")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
