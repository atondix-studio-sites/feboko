import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getPage } from "@/lib/data";
import { localizePath } from "@/lib/utils";

const LEGAL_SLUGS = ["impressum", "datenschutz", "nutzungsbedingungen"];

export default async function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!LEGAL_SLUGS.includes(slug)) notFound();

  const lang = await getRequestLang();
  const page = await getPage(slug);
  if (!page) notFound();

  const title = lang === "en" ? page.titleEn || page.titleDe : page.titleDe || page.titleEn;
  const content = lang === "en" ? page.contentEn || page.contentDe : page.contentDe || page.contentEn;

  return (
    <main className="content single-service">
      <section className="service-hero container-small">
        <h1 className="page-title">{title}</h1>
        <Link className="btn-primary" href={localizePath("/", lang)}>
          {t(lang, "Zurück zur Homepage", "Back to Homepage")}
        </Link>
      </section>
      <section className="container-small breadcrumbs">
        <Link href={localizePath("/", lang)}>Home</Link>
        <span>›</span>
        <span className="current">{title}</span>
      </section>
      <section className="container-small content">
        <div className="service-content">
          <div className="service-body content no-padding-top" dangerouslySetInnerHTML={{ __html: content || "" }} />
        </div>
      </section>
    </main>
  );
}
