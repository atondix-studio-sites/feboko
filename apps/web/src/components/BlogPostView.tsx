import { notFound } from "next/navigation";
import { t } from "@feboko/shared";
import { getRequestLang } from "@/lib/lang";
import { getBlogPost, getRelatedBlogPosts } from "@/lib/data";
import { localizePath, mediaSrc, wpAutoP } from "@/lib/utils";
import { Breadcrumbs, ServiceHero } from "@/components/PageChrome";
import { BlogCard } from "@/components/BlogCard";
import { BlogToc } from "@/components/BlogToc";

export async function BlogPostView({ slug }: { slug: string }) {
  const lang = await getRequestLang();
  const post = await getBlogPost(slug, lang);
  if (!post) notFound();
  const related = await getRelatedBlogPosts(lang, post.id, 2);

  return (
    <main className="content single-service">
      <ServiceHero
        title={post.title}
        ctaHref={localizePath("/blog", lang)}
        ctaLabel={t(lang, "Alle Artikel entdecken", "Discover All Articles")}
      />

      <Breadcrumbs
        items={[
          { href: localizePath("/", lang), label: "Home" },
          { href: localizePath("/blog", lang), label: "Blog" },
          { label: post.title, current: true },
        ]}
      />

      <section className="container content service-layout">
        <BlogToc lang={lang} />

        <div className="service-content">
          <div className="service-intro">
            {post.featuredImage && (
              <div className="intro-image-large">
                <img
                  src={mediaSrc(post.featuredImage.localPath, post.featuredImage.originalUrl)}
                  alt={post.title}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
          </div>

          <div className="service-body content no-padding-top" id="article-body" dangerouslySetInnerHTML={{ __html: wpAutoP(post.content || "") }} />

          <hr />

          {related.length > 0 && (
            <div className="service-next">
              <h2>{t(lang, "Weiterlesen", "Continue Reading")}</h2>
              <div className="blog-grid">
                {related.map((item) => <BlogCard key={item.id} post={item} lang={lang} />)}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
