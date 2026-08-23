import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "de";
  const response = NextResponse.next();
  response.headers.set("x-feboko-lang", lang);
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|media|images|fonts|icons|api).*)"],
};
