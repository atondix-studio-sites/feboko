import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || "change-me");

export async function createSessionToken(userId: string) {
  return await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifySessionToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload.userId as string;
}

export async function getAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("feboko_admin")?.value;
  if (!token) return null;
  try {
    const userId = await verifySessionToken(token);
    return userId;
  } catch {
    return null;
  }
}
