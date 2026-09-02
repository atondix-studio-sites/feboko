"use client";

import type { Lang } from "@feboko/shared";

export function FounderCard({
  name,
  title,
  image,
  text,
  lang,
}: {
  name: string;
  title: string;
  image: string;
  text: string;
  lang: Lang;
}) {
  return (
    <div className="founder-card">
      <div className="founder-card-header">
        <div className="founder-card-avatar">
          <img className="founder-avatar-img" src={image} alt={name} loading="lazy" decoding="async" />
        </div>
        <div className="founder-card-info">
          <h3 className="founder-card-name">{name}</h3>
          <p className="founder-card-title">{title}</p>
        </div>
      </div>
      <div className="founder-card-body">
        <p className="founder-card-text" dangerouslySetInnerHTML={{ __html: text }} />
      </div>
      <button
        className="founder-card-toggle"
        type="button"
        aria-expanded={false}
        onClick={(e) => {
          const button = e.currentTarget as HTMLButtonElement;
          const card = button.closest(".founder-card");
          const expanded = card?.classList.toggle("is-expanded") ?? false;
          button.setAttribute("aria-expanded", String(expanded));
        }}
      >
        <span className="toggle-more">{lang === "en" ? "Show more" : "Mehr anzeigen"}</span>
        <span className="toggle-less">{lang === "en" ? "Show less" : "Weniger anzeigen"}</span>
      </button>
    </div>
  );
}
