"use client";

import { useEffect } from "react";
import type { Lang } from "@feboko/shared";
import { t } from "@feboko/shared";

export function BlogToc({ lang }: { lang: Lang }) {
  useEffect(() => {
    const articleBody = document.getElementById("article-body");
    const tocNav = document.getElementById("toc-nav");
    const sidebar = document.getElementById("toc-sidebar");
    if (!articleBody || !tocNav) return;

    const headings = articleBody.querySelectorAll("h2, h3, h4");
    if (headings.length === 0) {
      if (sidebar) sidebar.style.display = "none";
      return;
    }

    tocNav.innerHTML = "";
    headings.forEach((heading, index) => {
      if (!heading.id) heading.id = `toc-heading-${index}`;
      const level = heading.tagName.toLowerCase();
      const link = document.createElement("a");
      link.href = `#${heading.id}`;
      link.textContent = heading.textContent ?? "";
      link.className = `toc-link toc-${level}`;
      tocNav.appendChild(link);
    });

    const tocLinks = tocNav.querySelectorAll("a");
    const onScroll = () => {
      let current: Element | null = headings[0];
      headings.forEach((heading) => {
        if (heading.getBoundingClientRect().top <= 120) current = heading;
      });
      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${current?.id}`);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [lang]);

  return (
    <div className="service-sidebar toc-sidebar" id="toc-sidebar">
      <h3>{t(lang, "Inhaltsverzeichnis", "Table of Contents")}</h3>
      <nav id="toc-nav" className="toc-nav" />
    </div>
  );
}
