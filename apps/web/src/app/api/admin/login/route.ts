import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { adminLoginSchema } from "@feboko/shared";
import { prisma } from "@/lib/db";
import { createSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = adminLoginSchema.parse(await request.json());
    const user = await prisma.adminUser.findUnique({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }
    const token = await createSessionToken(user.id);
    const res = NextResponse.json({ ok: true });
    res.cookies.set("feboko_admin", token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
