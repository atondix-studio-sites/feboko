import type { Metadata } from "next";
import Link from "next/link";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getSections, getTeamMembers, sectionText } from "@/lib/data";
import { localizePath, mediaSrc } from "@/lib/utils";
import { prisma } from "@/lib/db";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";
import { TeamCard, teamMemberKey } from "@/components/TeamCard";
import { StudioPeopleGrid } from "@/components/content/StudioContentSlots";
import { studioContentEnabled } from "@/lib/studio-content";

export const metadata: Metadata = {
  title: "Team Members",
  alternates: { canonical: "/team" },
};

async function sectionImage(pageKey: string, sectionKey: string) {
  const section = await prisma.siteSection.findUnique({
    where: { pageKey_sectionKey: { pageKey, sectionKey } },
  });
  if (!section?.imageId) return null;
  const media = await prisma.media.findUnique({ where: { id: section.imageId } });
  return mediaSrc(media?.localPath, media?.originalUrl);
}

export default async function TeamPage({
  searchParams,
}: {
  searchParams: Promise<{ active?: string }>;
}) {
  const lang = await getRequestLang();
  const { active } = await searchParams;
  const members = await getTeamMembers();
  const sections = await getSections("about");
  const sectionMap = Object.fromEntries(sections.map((s) => [s.sectionKey, s.data as Record<string, unknown>]));
  const get = (key: string, field: string) => sectionText(sectionMap[key], field, lang);

  const introImage = await sectionImage("about", "intro");
  const missionImage = await sectionImage("about", "mission");
  const visionImage = await sectionImage("about", "vision");

  const activeKey =
    active && members.some((m) => teamMemberKey(m) === active) ? active : null;

  return (
    <main className="content single-service">
      <ServiceHero
        title={t(lang, "Das FeBoKo Team", "The FeBoKo Team")}
        ctaHref={localizePath("/services", lang)}
        ctaLabel={t(lang, "Unsere Services", "Our Services")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { label: t(lang, "Team", "Team"), current: true },
        ]}
      />

      <section className="content-section">
        <div className="container content">
          <div className="column-flex-2 layout-about">
            <div className="column1 text">
              <h2 className="section-title">{get("intro", "title")}</h2>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("intro", "text") }} />
            </div>
            <div className="column2">
              {introImage ? (
                <img src={introImage} alt="Introduction FeBoKo" />
              ) : (
                <img src="/images/about.jpg" alt="Introduction FeBoKo" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <h2 className="section-title">{t(lang, "Treffen Sie unser Team", "Meet Our Team")}</h2>
          {studioContentEnabled() ? (
            <StudioPeopleGrid lang={lang} />
          ) : (
            <div className="team-grid">
              {members.map((member) => (
                <TeamCard key={member.id} member={member} lang={lang} activeKey={activeKey} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="column-flex-2 reverse layout-about">
            <div className="column1">
              {missionImage ? (
                <img src={missionImage} alt="Mission FeBoKo" />
              ) : (
                <img src="/images/mission.jpg" alt="Mission FeBoKo" />
              )}
            </div>
            <div className="column2 text">
              <h2 className="section-title">{get("mission", "title")}</h2>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("mission", "text") }} />
              <Link href={localizePath("/#contact", lang)} className="btn btn-primary">{get("mission", "cta")}</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="container content">
          <div className="column-flex-2 layout-about">
            <div className="column1 text">
              <h2 className="section-title">{get("vision", "title")}</h2>
              <p className="section-description" dangerouslySetInnerHTML={{ __html: get("vision", "text") }} />
            </div>
            <div className="column2">
              {visionImage ? (
                <img src={visionImage} alt="Vision FeBoKo" />
              ) : (
                <img src="/images/vision.jpg" alt="Vision FeBoKo" />
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
