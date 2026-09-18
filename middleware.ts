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
  const adminKeyParam = searchParams.get("admin_key");
  const hasAccessPass = hasAdminAccess(request);
  const isFromSeller = !hasAccessPass && isSellerRequest(request);

  // Check Session Authentication first
  const response = NextResponse.next();

  // If valid admin_key provided, grant 30-day admin pass cookie and clear any seller cookies
  if (adminKeyParam === "civara_owner") {
    response.cookies.set("civara_admin_access", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });
    response.cookies.set("civara_seller_network", "", {
      path: "/",
      maxAge: 0,
      sameSite: "lax",
    });
  }

  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);
  const userRole = session?.role || "admin";

  // 1. STRICT IP BOUNDARY FOR MASTER ADMIN:
  // Only authorized admin IP (or owner emergency key) can see or access /admin and /api/admin/*
  // Anyone else (seller network, public visitors, unauthorized IPs):
  // - Admin portal UI (/admin, /admin/*) is completely hidden and redirected to /seller/login
  // - Admin APIs (/api/admin/*) return 403 Forbidden (except logout)
  if (isFromSeller || !hasAccessPass) {
    if (isAdminPortal) {
      return NextResponse.redirect(new URL("/seller/login", request.url));
    }
    if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth/logout") {
      return NextResponse.json(
        { error: "Forbidden: Master admin access restricted to authorized IP." },
        { status: 403 }
      );
    }
  }

  // 2. Allow Login Pages & Auth APIs to load
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

