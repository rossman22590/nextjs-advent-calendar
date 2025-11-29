import { NextRequest, NextResponse } from "next/server";

const protectedPaths = ["/c", "/c/", "/c/", "/c/[^/]+", "/c/[^/]+/.*"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedPaths.some((pattern) => {
    const regex = new RegExp(`^${pattern}$`);
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
