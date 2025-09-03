import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that should only be accessible when NOT authenticated
const authPages = ["/users/login", "/users/signup"];

// Routes that require authentication (simple prefix match)
const protectedPrefixes = ["/users/profile"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip Next internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cookie = req.cookies.get("currentUser")?.value;
  const isAuthenticated = !!cookie;

  // If user is authenticated, prevent visiting auth pages
  if (isAuthenticated && authPages.includes(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = "/posts";
    return NextResponse.redirect(url);
  }

  // If user is not authenticated and tries to access protected route -> redirect to login
  if (!isAuthenticated && protectedPrefixes.some((p) => pathname.startsWith(p))) {
    const url = req.nextUrl.clone();
    url.pathname = "/users/login";
    // include original path so you can optionally redirect back after login
    url.searchParams.set("fallbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware to all routes except Next internals and the API
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
