import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userId = await getAdminSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const sections = await prisma.siteSection.findMany();
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  const team = await prisma.teamMember.findMany({ orderBy: { sortOrder: "asc" } });
  const jobs = await prisma.job.findMany({ orderBy: { sortOrder: "asc" } });
  const partners = await prisma.partner.findMany({ orderBy: { sortOrder: "asc" } });
  const posts = await prisma.blogPost.findMany();
  const pages = await prisma.page.findMany();

  return NextResponse.json({ sections, services, team, jobs, partners, posts, pages });
}
