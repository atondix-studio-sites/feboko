import Link from "next/link";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";
import { localizePath, mediaSrc } from "@/lib/utils";

type BlogCardPost = {
  slug: string;
  title: string;
  content?: string | null;
  publishedAt?: Date | null;
  featuredImage?: { localPath: string | null; originalUrl: string | null } | null;
};

function readingMinutes(content?: string | null): number {
  const words = (content ?? "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function formatDate(date?: Date | null): string {
  if (!date) return "";
  const d = new Date(date);
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const year = d.getUTCFullYear();
  return `${day}.${month}.${year}`;
}

function isoDate(date?: Date | null): string {
  if (!date) return "";
  return new Date(date).toISOString().slice(0, 10);
}

const calendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const clockIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export function BlogCard({ post, lang }: { post: BlogCardPost; lang: Lang }) {
  const href = localizePath(`/${post.slug}/`, lang);
  const mins = readingMinutes(post.content);

  return (
    <article className="blog-grid-card">
      {post.featuredImage && (
        <div className="blog-card-image">
          <img
            src={mediaSrc(post.featuredImage.localPath, post.featuredImage.originalUrl)}
            alt={post.title}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="blog-card-body">
        <div className="blog-meta">
          {post.publishedAt && (
            <span className="blog-date">
              {calendarIcon}
              <time dateTime={isoDate(post.publishedAt)}>{formatDate(post.publishedAt)}</time>
            </span>
          )}
          <span className="blog-reading-time">
            {clockIcon}
            {mins} {t(lang, "Min. Lesezeit", "min read")}
          </span>
        </div>
        <h3>{post.title}</h3>
        <Link
          className="read-more"
          href={href}
          aria-label={`${t(lang, "Weiterlesen", "Read More")}: ${post.title}`}
        >
          {t(lang, "Weiterlesen", "Read More")} <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
