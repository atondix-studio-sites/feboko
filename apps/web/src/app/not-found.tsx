import Link from "next/link";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { localizePath } from "@/lib/utils";

export default async function NotFound() {
  const lang = await getRequestLang();
  return (
    <main className="page-404">
      <div className="container content">
        <section className="page-404-hero">
          <h1 className="page-title">{t(lang, "Hoppla – Seite nicht gefunden", "Oops – Page not found")}</h1>
          <p className="page-subtitle">{t(lang, "Wir können die von Ihnen gesuchte Seite nicht finden.", "We can't find the page you were looking for.")}</p>
          <div className="page-actions">
            <Link href={localizePath("/", lang)} className="btn-primary">
              {t(lang, "Zur Startseite", "Go to Homepage")}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
