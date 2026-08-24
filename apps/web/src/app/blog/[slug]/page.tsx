import type { Metadata } from "next";
import { getRequestLang } from "@/lib/lang";
import { getBlogPost } from "@/lib/data";
import { BlogPostView } from "@/components/BlogPostView";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lang = await getRequestLang();
  const post = await getBlogPost(slug, lang);
  return {
    title: post?.title || "Blog",
    alternates: { canonical: `/${slug}/` },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <BlogPostView slug={slug} />;
}
