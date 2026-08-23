"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Lang } from "@feboko/shared";

export function LanguageSwitcher({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const deParams = new URLSearchParams(searchParams.toString());
  deParams.delete("lang");
  const deQuery = deParams.toString();
  const deUrl = deQuery ? `${pathname}?${deQuery}` : pathname;

  const enParams = new URLSearchParams(searchParams.toString());
  enParams.set("lang", "en");
  const enUrl = `${pathname}?${enParams.toString()}`;

  return (
    <div className="language-switcher">
      <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
        <path
          d="M8.5 0.5C4.08 0.5 0.5 4.08 0.5 8.5C0.5 12.92 4.08 16.5 8.5 16.5C12.92 16.5 16.5 12.92 16.5 8.5C16.5 4.08 12.92 0.5 8.5 0.5ZM14.1 5.5H11.9C11.66 4.46 11.3 3.46 10.82 2.54C12.24 3.06 13.42 4.12 14.1 5.5ZM8.5 2.54C9.14 3.52 9.62 4.58 9.9 5.5H7.1C7.38 4.58 7.86 3.52 8.5 2.54ZM2.78 10.5C2.62 9.88 2.5 9.2 2.5 8.5C2.5 7.8 2.62 7.12 2.78 6.5H5.26C5.18 7.16 5.1 7.82 5.1 8.5C5.1 9.18 5.18 9.84 5.26 10.5H2.78ZM2.9 11.5H5.1C5.34 12.54 5.7 13.54 6.18 14.46C4.76 13.94 3.58 12.88 2.9 11.5ZM5.1 5.5H2.9C3.58 4.12 4.76 3.06 6.18 2.54C5.7 3.46 5.34 4.46 5.1 5.5ZM8.5 14.46C7.86 13.48 7.38 12.42 7.1 11.5H9.9C9.62 12.42 9.14 13.48 8.5 14.46ZM10.26 10.5H6.74C6.66 9.84 6.58 9.18 6.58 8.5C6.58 7.82 6.66 7.16 6.74 6.5H10.26C10.34 7.16 10.42 7.82 10.42 8.5C10.42 9.18 10.34 9.84 10.26 10.5ZM10.82 14.46C11.3 13.54 11.66 12.54 11.9 11.5H14.1C13.42 12.88 12.24 13.94 10.82 14.46ZM11.74 10.5C11.82 9.84 11.9 9.18 11.9 8.5C11.9 7.82 11.82 7.16 11.74 6.5H14.22C14.38 7.12 14.5 7.8 14.5 8.5C14.5 9.2 14.38 9.88 14.22 10.5H11.74Z"
          fill="black"
        />
      </svg>
      <Link href={deUrl} className={lang === "de" ? "lang-active" : ""}>DE</Link>
      <span className="separator"></span>
      <Link href={enUrl} className={lang === "en" ? "lang-active" : ""}>EN</Link>
    </div>
  );
}
