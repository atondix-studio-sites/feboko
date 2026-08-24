import type { Metadata } from "next";
import { getRequestLang } from "@/lib/lang";
import { HomePage } from "@/components/HomePage";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default async function Page() {
  const lang = await getRequestLang();
  return <HomePage lang={lang} />;
}
