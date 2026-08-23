export type Lang = "de" | "en";

export function getLang(searchParams?: { lang?: string } | null): Lang {
  const lang = searchParams?.lang;
  return lang === "en" ? "en" : "de";
}

export function t(lang: Lang, de: string, en: string): string {
  return lang === "en" ? en : de;
}

export function localizeUrl(url: string, lang: Lang): string {
  if (lang !== "en") return url;
  if (!url.startsWith("/") && !url.includes("feboko.com")) return url;
  const separator = url.includes("?") ? "&" : "?";
  if (url.includes("lang=en")) return url;
  return `${url}${separator}lang=en`;
}

export function pickLang<T extends Record<string, unknown>>(
  lang: Lang,
  field: { de?: string | null; en?: string | null } | null | undefined,
  fallbackDe = "",
): string {
  if (!field) return fallbackDe;
  if (lang === "en" && field.en) return field.en;
  return field.de ?? fallbackDe;
}

export function sectionField(
  data: Record<string, unknown> | null | undefined,
  field: string,
  lang: Lang,
): string {
  if (!data || typeof data[field] !== "object") return "";
  const f = data[field] as { de?: string; en?: string };
  return pickLang(lang, f);
}

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://feboko.com";
