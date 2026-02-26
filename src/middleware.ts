import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight middleware - no Node.js crypto/auth (Edge compatible)
// Admin auth is enforced in admin/layout.tsx
export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get("authjs.session-token") ?? req.cookies.get("__Secure-authjs.session-token");
  const isLoggedIn = !!sessionCookie?.value;

  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
  const isLoginPage = req.nextUrl.pathname === "/login";
  const isApiAuth = req.nextUrl.pathname.startsWith("/api/auth");
  const isWebhook = req.nextUrl.pathname.startsWith("/api/webhooks");

  if (isApiAuth || isWebhook) {
    return NextResponse.next();
  }

  if (isAdminRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run on admin & login - avoids Edge loading Node modules (MongoDB/crypto) for main site
  matcher: ["/admin/:path*", "/login"],
};
