import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { AdminSessionData, sessionOptions } from "./lib/auth/session";
import { isSellerRequest, hasAdminAccess, hasSellerAccess } from "./lib/auth/ip";

export async function middleware(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;

  const isSellerPortal = pathname === "/seller" || pathname.startsWith("/seller/");
  const isAdminPortal = pathname === "/admin" || pathname.startsWith("/admin/");
  const isLoginPage = pathname === "/admin/login" || pathname === "/seller/login";
  const isAuthApi =
    pathname.startsWith("/api/admin/auth/") ||
    pathname.startsWith("/api/seller/auth/");
  const adminKeyParam = searchParams.get("admin_key");
  const sellerKeyParam = searchParams.get("seller_key");
  const hasAccessPass = hasAdminAccess(request);
  const hasSellerPass = hasSellerAccess(request);
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

  // If valid seller_key provided, grant 30-day seller pass cookie
  if (sellerKeyParam === "civara_seller") {
    response.cookies.set("civara_seller_access", "1", {
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      httpOnly: false,
      sameSite: "lax",
    });
  }

  const session = await getIronSession<AdminSessionData>(request.cookies as any, sessionOptions);
  const isAuthenticated = Boolean(session && session.isLoggedIn && session.userId);
  const userRole = session?.role || "admin";

  // 1. ALLOW LOGIN PAGES & AUTH APIs TO LOAD FREELY
  if (isLoginPage || isAuthApi) {
    if (isAuthenticated && isLoginPage) {
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

  // 2. STRICT IP BOUNDARY FOR MASTER ADMIN PORTAL (/admin and /api/admin/*)
  // Only authorized admin IP (or owner emergency key) can access /admin and /api/admin/*
  if (isAdminPortal || pathname.startsWith("/api/admin/")) {
    if (isFromSeller || !hasAccessPass) {
      if (isAdminPortal) {
        if (isFromSeller || userRole === "seller") {
          return NextResponse.redirect(new URL("/seller", request.url));
        }
        return NextResponse.redirect(new URL("/", request.url));
      }
      return NextResponse.json(
        { error: "Forbidden: Master admin access restricted to authorized IP." },
        { status: 403 }
      );
    }

    // Role Isolation: Seller accounts cannot access master admin
    if (userRole === "seller") {
      return NextResponse.redirect(new URL("/seller", request.url));
    }
  }

  // 3. UNAUTHENTICATED REQUESTS TO PROTECTED PORTALS MUST REDIRECT TO LOGIN
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

  // 4. CSRF Protection for Mutating API requests (Supporting Custom Domain & Vercel)
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

      // Normalize apex domains by stripping leading 'www.'
      const cleanOrigin = originDomain.replace(/^www\./, "");
      const cleanHost = hostDomain.replace(/^www\./, "");

      const isAllowed =
        cleanOrigin === cleanHost ||
        originDomain === hostDomain ||
        cleanOrigin === "civarajewels.com" ||
        cleanHost === "civarajewels.com" ||
        originDomain.endsWith(".civarajewels.com") ||
        hostDomain.endsWith(".civarajewels.com") ||
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

