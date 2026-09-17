import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";
import { isSellerIP, isAdminIP } from "./lib/auth/ip";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const isSellerPortal = pathname === "/seller" || pathname.startsWith("/seller/");
  const isAdminPortal = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login" || pathname === "/seller/login";
  const isLoginApi = pathname === "/api/admin/auth/login";
  const isFromSellerIP = isSellerIP(request);

  // 1. STRICT SELLER IP RESTRICTION: Seller IP (192.168.1.4) cannot view or access /admin
  if (isFromSellerIP) {
    if (isAdminPortal) {
      return NextResponse.redirect(new URL("/seller/login", request.url));
    }
    if (pathname.startsWith("/api/admin/") && !isLoginApi) {
      return NextResponse.json(
        { error: "Forbidden: Master admin endpoints are restricted from this IP address." },
        { status: 403 }
      );
    }
  }

  // Check Session Authentication
  const response = NextResponse.next();
  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);
  const userRole = session?.role || "admin";

  // 2. Allow Login Pages & Login API to load
  if (isLoginPage) {
    if (isAuthenticated) {
      // If already logged in, route to appropriate portal
      if (pathname === "/seller/login") {
        return NextResponse.redirect(new URL("/seller", request.url));
      }
      if (pathname === "/admin/login") {
        if (userRole === "seller") {
          return NextResponse.redirect(new URL("/seller", request.url));
        }
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return response;
  }

  if (isLoginApi) {
    return response;
  }

  // 3. Unauthenticated requests to protected portals MUST redirect to login
  if (!isAuthenticated) {
    if (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/seller/")) {
      return NextResponse.json(
        { error: "Unauthorized: Authentication required." },
        { status: 401 }
      );
    }

    if (isSellerPortal) {
      const loginUrl = new URL("/seller/login", request.url);
      if (pathname !== "/seller") {
        loginUrl.searchParams.set("next", pathname + search);
      }
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminPortal) {
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("next", pathname + search);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Role Isolation: Seller accounts cannot access /admin
  if (userRole === "seller" && isAdminPortal) {
    return NextResponse.redirect(new URL("/seller", request.url));
  }

  // 5. CSRF Protection for Mutating API requests
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
  matcher: [
    "/admin",
    "/admin/:path*",
    "/api/admin/:path*",
    "/seller",
    "/seller/:path*",
    "/api/seller/:path*",
  ],
};

