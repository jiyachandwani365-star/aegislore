import { NextResponse, type NextRequest } from "next/server";

const sessionCookieNames = ["authjs.session-token", "__Secure-authjs.session-token"];

export function middleware(request: NextRequest) {
  const hasSessionCookie = sessionCookieNames.some((name) => request.cookies.has(name));

  if (!hasSessionCookie) {
    const signInUrl = new URL("/sign-in", request.url);
    signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/health-check/:path*",
    "/scam-check/:path*",
    "/notifications/:path*",
    "/profile/:path*",
    "/settings/:path*"
  ]
};
