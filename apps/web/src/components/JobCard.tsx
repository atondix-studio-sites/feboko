import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";

const TYPE_MAP: Record<string, { de: string; en: string }> = {
  fulltime: { de: "Vollzeit", en: "Full-Time" },
  parttime: { de: "Teilzeit", en: "Part-Time" },
  freelance: { de: "Freelance", en: "Freelance" },
  internship: { de: "Praktikum", en: "Internship" },
};

type Job = {
  id: string;
  wpId?: number | null;
  title: string;
  location?: string | null;
  type?: string | null;
  departmentDe?: string | null;
  departmentEn?: string | null;
  deadline?: string | null;
  summaryDe?: string | null;
  summaryEn?: string | null;
  descriptionDe?: string | null;
  descriptionEn?: string | null;
  requirementsDe?: string | null;
  requirementsEn?: string | null;
  contactEmail?: string | null;
};

export function jobKey(job: Job): string {
  return String(job.wpId ?? job.id);
}

function formatDeadline(deadline?: string | null): string {
  if (!deadline) return "";
  const d = new Date(deadline);
  if (Number.isNaN(d.getTime())) return deadline;
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

const locationIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const calendarIcon = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

export function JobCard({ job, lang }: { job: Job; lang: Lang }) {
  const department = lang === "en" ? job.departmentEn : job.departmentDe;
  const summary = lang === "en" ? job.summaryEn : job.summaryDe;
  const description = lang === "en" ? job.descriptionEn : job.descriptionDe;
  const requirements = lang === "en" ? job.requirementsEn : job.requirementsDe;
  const typeLabel = job.type ? TYPE_MAP[job.type]?.[lang] : "";
  const key = jobKey(job);
  const applyHref = job.contactEmail
    ? `mailto:${job.contactEmail}?subject=${encodeURIComponent(t(lang, "Bewerbung: ", "Application: ") + job.title)}`
    : "#contact";

  return (
    <article className="job-grid-card" data-job-id={key}>
      <div className="job-card-content">
        <div className="job-card-header">
          <div className="job-card__meta">
            {department && <span className="job-tag job-tag--dept">{department}</span>}
            {typeLabel && <span className="job-tag job-tag--type">{typeLabel}</span>}
          </div>
          <h3>{job.title}</h3>
        </div>

        <div className="job-card__info-row">
          {job.location && (
            <span className="job-info-pill">
              {locationIcon}
              {job.location}
            </span>
          )}
          {job.deadline && (
            <span className="job-info-pill">
              {calendarIcon}
              {t(lang, "Bis", "Deadline")}: {formatDeadline(job.deadline)}
            </span>
          )}
        </div>

        {summary && <p className="job-summary">{summary}</p>}

        <div className="job-card-details">
          {description && (
            <div className="job-card__section">
              <h4 className="job-card__section-heading">{t(lang, "Deine Aufgaben", "Responsibilities")}</h4>
              <div className="job-card__richtext" dangerouslySetInnerHTML={{ __html: description }} />
            </div>
          )}
          {requirements && (
            <div className="job-card__section">
              <h4 className="job-card__section-heading">{t(lang, "Das bringst du mit", "Requirements")}</h4>
              <div className="job-card__richtext" dangerouslySetInnerHTML={{ __html: requirements }} />
            </div>
          )}
          <div className="job-card__apply">
            <a className="job-close-btn" href="#" data-job-id={key}>
              {t(lang, "Schließen", "Close")}
            </a>
            <a href={applyHref} className="btn-primary">
              {t(lang, "Jetzt bewerben", "Apply Now")}
            </a>
            {job.contactEmail && (
              <span className="job-card__apply-note">
                {t(lang, "oder schreib uns direkt:", "or contact us directly:")}
                <a href={`mailto:${job.contactEmail}`}>{job.contactEmail}</a>
              </span>
            )}
          </div>
        </div>

        <a className="read-more" href="#" data-job-id={key}>
          {t(lang, "Weiterlesen", "Read More")}
        </a>
      </div>
    </article>
  );
}
