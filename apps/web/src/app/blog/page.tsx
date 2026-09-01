import type { Metadata } from "next";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getBlogPosts } from "@/lib/data";
import { localizePath } from "@/lib/utils";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";
import { BlogCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const lang = await getRequestLang();
  const posts = await getBlogPosts(lang);

  return (
    <main className="content single-service">
      <ServiceHero
        title={t(lang, "FeBoKo Consulting Blog", "FeBoKo Consulting Blog")}
        ctaHref={localizePath("/team", lang)}
        ctaLabel={t(lang, "Mehr über uns", "More About Us")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { label: t(lang, "Blog", "Blog"), current: true },
        ]}
      />

      <section className="content-section">
        <div className="container content">
          {posts.length > 0 ? (
            <div className="blog-grid">
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} lang={lang} />
              ))}
            </div>
          ) : (
            <p>{t(lang, "Keine Artikel gefunden.", "No articles found.")}</p>
          )}
        </div>
      </section>
    </main>
  );
}
