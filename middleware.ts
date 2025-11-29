import { NextRequest, NextResponse } from "next/server";

// Paths that require authentication - exclude calendar viewing
const protectedPaths = [
  "/c/[^/]+/[0-9]+$", // Individual day pages like /c/abc/1
  "/c/[^/]+/populate.*", // Populate pages
  "/c/[^/]+/chance.*", // Chance pages
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow viewing calendar grid pages /c/:calendarId without login
  const isCalendarGridView = /^\/c\/[^/]+$/.test(pathname);
  if (isCalendarGridView) {
    return NextResponse.next();
  }

  // Check if path requires authentication
  const isProtected = protectedPaths.some((pattern) => {
    const regex = new RegExp(pattern);
    return regex.test(pathname);
  });

  if (!isProtected) return NextResponse.next();

  const session = req.cookies.get("session_token")?.value;
  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/c/:path*"],
};
