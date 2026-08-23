import Link from "next/link";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { localizePath } from "@/lib/utils";

export default async function NotFound() {
  const lang = await getRequestLang();
  return (
    <main className="page-404 content">
      <div className="container">
        <h1>404</h1>
        <p>{t(lang, "Seite nicht gefunden", "Page not found")}</p>
        <div className="page-actions">
          <Link href={localizePath("/", lang)} className="btn-primary">
            {t(lang, "Zur Homepage", "To Homepage")}
          </Link>
        </div>
      </div>
    </main>
  );
}
