import { headers } from "next/headers";
import type { Lang } from "@feboko/shared";

export async function getRequestLang(): Promise<Lang> {
  const h = await headers();
  return h.get("x-feboko-lang") === "en" ? "en" : "de";
}
