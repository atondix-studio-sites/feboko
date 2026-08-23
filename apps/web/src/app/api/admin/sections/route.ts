import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userId = await getAdminSession();
  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  return NextResponse.json({ authenticated: true, email: user?.email });
}

export async function POST(request: Request) {
  const userId = await getAdminSession();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { pageKey, sectionKey, data } = await request.json();
  await prisma.siteSection.upsert({
    where: { pageKey_sectionKey: { pageKey, sectionKey } },
    create: { pageKey, sectionKey, data },
    update: { data },
  });
  return NextResponse.json({ ok: true });
}
