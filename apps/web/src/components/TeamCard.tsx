import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import { localizePath, mediaSrc } from "@/lib/utils";

type TeamMember = {
  id: string;
  wpId?: number | null;
  name: string;
  position?: string | null;
  email?: string | null;
  phone?: string | null;
  aboutDe?: string | null;
  aboutEn?: string | null;
  image?: { localPath: string | null; originalUrl: string | null } | null;
};

export function teamMemberKey(member: TeamMember): string {
  return String(member.wpId ?? member.id);
}

export function TeamCard({
  member,
  lang,
  activeKey,
}: {
  member: TeamMember;
  lang: Lang;
  activeKey?: string | null;
}) {
  const about = lang === "en" ? member.aboutEn : member.aboutDe;
  const memberKey = teamMemberKey(member);
  const isActive = activeKey === memberKey;
  const teamUrl = localizePath("/team", lang);
  const toggleHref = isActive ? teamUrl : `${teamUrl}?active=${memberKey}`;

  return (
    <article className={`team-grid-card${isActive ? " active" : ""}`} data-team-id={memberKey}>
      {member.image && (
        <div className="team-photo-large-wrapper">
          <img
            className="team-photo-large"
            src={mediaSrc(member.image.localPath, member.image.originalUrl)}
            alt={member.name}
          />
        </div>
      )}
      <div className="team-content">
        <div className="team-header">
          {member.image && (
            <img
              className="team-photo"
              src={mediaSrc(member.image.localPath, member.image.originalUrl)}
              alt={member.name}
            />
          )}
          <div>
            <h3>{member.name}</h3>
            {member.position && <p className="position">{member.position}</p>}
          </div>
          <div className="contact">
            {member.email && <p>{member.email}</p>}
            {member.phone && <p>{member.phone}</p>}
          </div>
        </div>
        {about && <p className="about">{about}</p>}
        <Link className="read-more" href={toggleHref} data-team-id={memberKey}>
          {t(lang, "Weiterlesen", "Read More")}
        </Link>
      </div>
    </article>
  );
}
