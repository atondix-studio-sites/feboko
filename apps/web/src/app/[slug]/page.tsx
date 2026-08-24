import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getBlogPost, getPage } from "@/lib/data";
import { localizePath, wpAutoP } from "@/lib/utils";
import { BlogPostView } from "@/components/BlogPostView";

const LEGAL_SLUGS = ["impressum", "datenschutz", "nutzungsbedingungen"];

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getRequestLang();
  if (!LEGAL_SLUGS.includes(slug)) {
    const post = await getBlogPost(slug, lang);
    if (!post) return { title: "Page not found" };
    return {
      title: post.title,
      alternates: { canonical: `/${slug}/` },
    };
  }
  const page = await getPage(slug);
  const title = lang === "en" ? page?.titleEn || page?.titleDe : page?.titleDe || page?.titleEn;
  return {
    title: title || "FeBoKo Consulting",
    alternates: { canonical: `/${slug}/` },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!LEGAL_SLUGS.includes(slug)) return <BlogPostView slug={slug} />;

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
          <div className="service-body content no-padding-top" dangerouslySetInnerHTML={{ __html: wpAutoP(content || "") }} />
        </div>
      </section>
    </main>
  );
}
