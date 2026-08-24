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

export function trimWords(value: string, limit: number, more = "…"): string {
  const words = value.trim().split(/\s+/);
  return words.length > limit ? `${words.slice(0, limit).join(" ")}${more}` : value;
}

const BLOCK_TAGS =
  "address|article|aside|blockquote|details|dialog|dd|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hgroup|hr|li|main|nav|ol|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul";

/** Reproduce the paragraph and line-break formatting applied by WordPress the_content(). */
export function wpAutoP(value: string): string {
  let html = value.trim().replace(/\r\n?|\n/g, "\n");
  if (!html) return "";

  html = html
    .replace(/<br\s*\/?>\s*<br\s*\/?>/gi, "\n\n")
    .replace(new RegExp(`(<(?:${BLOCK_TAGS})(?:\\s[^>]*)?>)`, "gi"), "\n$1")
    .replace(new RegExp(`(</(?:${BLOCK_TAGS})>)`, "gi"), "$1\n")
    .replace(/\n{3,}/g, "\n\n");

  html = html
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      new RegExp(`^</?(?:${BLOCK_TAGS})(?:\\s|>|$)`, "i").test(block)
        ? block
        : `<p>${block.replace(/\n/g, "<br>\n")}</p>`,
    )
    .join("\n");

  return html
    .replace(new RegExp(`<p>\\s*(</?(?:${BLOCK_TAGS})(?:\\s[^>]*)?>)`, "gi"), "$1")
    .replace(new RegExp(`(</?(?:${BLOCK_TAGS})(?:\\s[^>]*)?>)\\s*</p>`, "gi"), "$1")
    .replace(new RegExp(`<br>\\s*(</?(?:${BLOCK_TAGS})(?:\\s[^>]*)?>)`, "gi"), "$1")
    .replace(new RegExp(`(</?(?:${BLOCK_TAGS})(?:\\s[^>]*)?>)\\s*<br>`, "gi"), "$1");
}
