import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@feboko/shared";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = SITE_URL.replace(/\/$/, "");
  const services = await prisma.service.findMany();
  const posts = await prisma.blogPost.findMany();
  const pages = await prisma.page.findMany();

  const entries: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/services`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/team`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/karriere`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/impressum`, changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const s of services) {
    entries.push({
      url: `${base}/services/${s.slug}${s.language === "en" ? "?lang=en" : ""}`,
      changeFrequency: "monthly",
      priority: 0.7,
    });
  }
  for (const p of posts) {
    entries.push({
      url: `${base}/blog/${p.slug}${p.language === "en" ? "?lang=en" : ""}`,
      changeFrequency: "monthly",
      priority: 0.6,
    });
  }

  return entries;
}
