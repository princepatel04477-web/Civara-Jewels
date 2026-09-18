import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";
import { isSellerRequest, hasAdminAccess } from "./lib/auth/ip";

export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  const isSellerPortal = pathname === "/seller" || pathname.startsWith("/seller/");
  const isAdminPortal = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login" || pathname === "/seller/login";
  const isAuthApi =
    pathname.startsWith("/api/admin/auth/") ||
    pathname.startsWith("/api/seller/auth/");
  const isFromSeller = isSellerRequest(request);
  const adminKeyParam = searchParams.get("admin_key");
  const hasAccessPass = hasAdminAccess(request);

  // Check Session Authentication first
  const response = NextResponse.next();

  // If valid admin_key provided, grant 30-day admin pass cookie
  if (adminKeyParam === "civara_owner") {
    response.cookies.set("civara_admin_access", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });
  }

  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);
  const userRole = session?.role || "admin";

  // 1. STRICT SELLER RESTRICTION: Seller network (192.168.1.4) cannot view or access /admin
  if (isFromSeller && (!isAuthenticated || userRole === "seller")) {
    if (isAdminPortal) {
      return NextResponse.redirect(new URL("/seller/login", request.url));
    }
    // Block master admin endpoints, but never block authentication operations (login, logout, session)
    if (pathname.startsWith("/api/admin/") && !isAuthApi) {
      return NextResponse.json(
        { error: "Forbidden: Master admin endpoints are restricted from this network." },
        { status: 403 }
      );
    }
  }

  // 2. Unauthenticated access to /admin/login:
  // If not from authorized admin IP / pass, redirect to /seller/login so admin portal is invisible
  if (pathname === "/admin/login") {
    if (!isAuthenticated && !hasAccessPass) {
      return NextResponse.redirect(new URL("/seller/login", request.url));
    }
  }

  // 3. Allow Login Pages & Auth APIs to load
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

  if (isAuthApi) {
    return response;
  }

  // 4. Unauthenticated requests to protected portals MUST redirect to login
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
      if (isFromSeller || !hasAccessPass) {
        return NextResponse.redirect(new URL("/seller/login", request.url));
      }
      const loginUrl = new URL("/admin/login", request.url);
      if (pathname !== "/admin") {
        loginUrl.searchParams.set("next", pathname + search);
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  // 5. Role Isolation: Seller accounts cannot access /admin
  if (userRole === "seller" && isAdminPortal) {
    return NextResponse.redirect(new URL("/seller", request.url));
  }

  // 5. CSRF Protection for Mutating API requests
  if (
    (pathname.startsWith("/api/admin/") || pathname.startsWith("/api/seller/")) &&
    ["POST", "PATCH", "PUT", "DELETE"].includes(request.method)
  ) {
    const origin = request.headers.get("origin");
    const forwardedHost = request.headers.get("x-forwarded-host");
    const host = forwardedHost || request.headers.get("host");
    if (origin && host) {
      const originDomain = origin.replace(/^https?:\/\//, "").split(":")[0].toLowerCase();
      const hostDomain = host.split(":")[0].toLowerCase();

      const isAllowed =
        originDomain === hostDomain ||
        (originDomain.endsWith(".vercel.app") && hostDomain.endsWith(".vercel.app")) ||
        originDomain === "localhost" ||
        originDomain === "127.0.0.1";

      if (!isAllowed) {
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

