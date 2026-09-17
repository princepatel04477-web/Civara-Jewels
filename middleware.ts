import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";
import { isSellerIP } from "./lib/auth/ip";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isLoginPage = pathname === "/admin/login" || pathname === "/seller/login";
  const isLoginApi = pathname === "/api/admin/auth/login";
  const isFromSellerIP = isSellerIP(request);

  // Check Session Authentication
  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);
  const userRole = session?.role || "admin";

  // 1. STRICT IP RESTRICTION: Seller IP (192.168.1.4) cannot view or access /admin
  if (isFromSellerIP) {
    if (pathname.startsWith("/admin")) {
      const target = isAuthenticated && userRole === "seller" ? "/seller" : "/seller/login";
      return NextResponse.redirect(new URL(target, request.url));
    }
    if (pathname.startsWith("/api/admin/") && !isLoginApi) {
      return NextResponse.json(
        { error: "Forbidden: Master admin endpoints are restricted from this IP address." },
        { status: 403 }
      );
    }
  }

  if (isLoginPage) {
    if (isAuthenticated) {
      const destination = userRole === "seller" ? "/seller" : "/admin";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return response;
  }

  if (isLoginApi) {
    return response;
  }

  // If not logged in, redirect to appropriate login page
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/seller/")) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required." },
        { status: 401 }
      );
    }

    const isSellerPath = pathname.startsWith("/seller");
    const loginUrl = new URL(isSellerPath ? "/seller/login" : "/admin/login", request.url);
    if (pathname !== "/admin" && pathname !== "/seller") {
      loginUrl.searchParams.set("next", pathname + search);
    }
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated as Seller, restrict access to /admin master routes
  if (userRole === "seller" && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/seller", request.url));
  }

  // CSRF Protection for Mutating API requests
  if (
    (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/seller/")) &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)
  ) {
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
  matcher: ["/admin/:path*", "/api/admin/:path*", "/seller/:path*", "/api/seller/:path*"],
};
