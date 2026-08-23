import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const userId = await getAdminSession();
  if (!userId) return NextResponse.json({ authenticated: false }, { status: 401 });
  const user = await prisma.adminUser.findUnique({ where: { id: userId } });
  return NextResponse.json({ authenticated: true, email: user?.email });
}
