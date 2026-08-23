import { prisma } from "./db";
import type { Lang } from "@feboko/shared";
import { sectionField } from "@feboko/shared";

export async function getSiteSettings() {
  return prisma.siteSettings.findUnique({ where: { id: "default" }, include: { headerImage: true } });
}

export async function getSection(pageKey: string, sectionKey: string) {
  return prisma.siteSection.findUnique({
    where: { pageKey_sectionKey: { pageKey, sectionKey } },
  });
}

export async function getSections(pageKey: string) {
  return prisma.siteSection.findMany({ where: { pageKey } });
}

export function sectionText(
  data: Record<string, unknown> | null | undefined,
  field: string,
  lang: Lang,
): string {
  return sectionField(data as Record<string, unknown>, field, lang);
}

export async function getServices(lang: Lang) {
  return prisma.service.findMany({
    where: { language: lang },
    orderBy: { sortOrder: "asc" },
    include: { featuredImage: true },
  });
}

export async function getService(slug: string, lang: Lang) {
  return prisma.service.findFirst({
    where: { slug, language: lang },
    include: { featuredImage: true },
  });
}

export async function getTeamMembers() {
  return prisma.teamMember.findMany({
    orderBy: { sortOrder: "asc" },
    include: { image: true },
  });
}

export async function getJobs() {
  return prisma.job.findMany({ orderBy: { sortOrder: "asc" } });
}

export async function getPartners() {
  return prisma.partner.findMany({
    orderBy: { sortOrder: "asc" },
    include: { logo: true },
  });
}

export async function getBlogPosts(lang: Lang) {
  return prisma.blogPost.findMany({
    where: { language: lang },
    orderBy: { publishedAt: "desc" },
    include: { featuredImage: true },
  });
}

export async function getBlogPost(slug: string, lang: Lang) {
  return prisma.blogPost.findFirst({
    where: { slug, language: lang },
    include: { featuredImage: true },
  });
}

export async function getRelatedBlogPosts(lang: Lang, excludeId: string, limit = 2) {
  return prisma.blogPost.findMany({
    where: { language: lang, id: { not: excludeId } },
    orderBy: { publishedAt: "desc" },
    take: limit,
    include: { featuredImage: true },
  });
}

export async function getPage(slug: string) {
  return prisma.page.findUnique({ where: { slug } });
}

export async function getNavItems(menuKey: string) {
  return prisma.navMenuItem.findMany({
    where: { menuKey },
    orderBy: { sortOrder: "asc" },
  });
}
