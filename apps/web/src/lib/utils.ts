import type { Lang } from "@feboko/shared";

export type LangParams = { lang?: string };

export function resolveLang(searchParams?: LangParams | null): Lang {
  return searchParams?.lang === "en" ? "en" : "de";
}

export function localizePath(path: string, lang: Lang): string {
  if (lang !== "en") return path;
  if (path.includes("lang=en")) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}lang=en`;
}

export function mediaSrc(localPath?: string | null, originalUrl?: string | null): string {
  if (localPath) return localPath;
  if (originalUrl) return originalUrl;
  return "";
}

export function boldUpToColon(text: string): string {
  const parts = text.split(":");
  if (parts.length > 1) {
    return `<strong>${parts[0]}</strong>:${parts.slice(1).join(":")}`;
  }
  return `<strong>${text}</strong>`;
}

export function formatQuote(text: string): string {
  return text.replace(/\[(.*?)\]/g, "<strong>$1</strong>");
}
