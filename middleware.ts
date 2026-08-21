import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";
import { isAdminIP } from "./lib/auth/ip";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. Strict IP Security Boundary:
  // If the visitor's IP is not in the allowed admin list, completely obscure the admin route.
  // Return standard 404 Not Found so unauthorized visitors see no trace of an admin panel.
  const isIpAllowed = isAdminIP(request);

  if (!isIpAllowed) {
    if (pathname.startsWith("/api/admin/")) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Rewrite to standard 404 Not Found page
    return NextResponse.rewrite(new URL("/_not-found", request.url), { status: 404 });
  }

  // Allow login endpoints without active session
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/auth/login";

  // 2. Second Security Layer: Session Verification
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

  // 3. Unauthenticated requests from authorized IPs go to login
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

  // 4. CSRF Protection for Mutating API requests
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
