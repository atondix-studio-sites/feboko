import { getRequestLang } from "@/lib/lang";
import { HomePage } from "@/components/HomePage";

export default async function Page() {
  const lang = await getRequestLang();
  return <HomePage lang={lang} />;
}
