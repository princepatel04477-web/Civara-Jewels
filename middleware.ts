import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/auth/login";

  // Check Session Authentication
  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);

  if (isLoginPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return response;
  }

  if (isLoginApi) {
    return response;
  }

  // If not logged in, redirect to login page
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator authentication required." },
        { status: 401 }
      );
    }

    const loginUrl = new URL("/admin/login", request.url);
    if (pathname !== "/admin") {
      loginUrl.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // CSRF Protection for Mutating API requests
  if (pathname.startsWith("/api/admin/") && ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && host) {
      const originHost = origin.replace(/^https?:\/\//, "");
      if (originHost !== host) {
        return NextResponse.json({ error: "CSRF verification failed" }, { status: 403 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
