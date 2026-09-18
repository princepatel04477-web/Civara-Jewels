import { NextRequest } from "next/server";

/**
 * Extracts and normalizes client IP address from request headers or socket.
 * Inspects standard proxy headers safely.
 */
export function getClientIP(request: Request | NextRequest): string {
  const headers = request.headers;

  // 1. Check Cloudflare / Vercel / CDN headers first
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return normalizeIP(cfConnectingIp.trim());

  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp) return normalizeIP(trueClientIp.trim());

  const xVercelForwardedFor = headers.get("x-vercel-forwarded-for");
  if (xVercelForwardedFor) {
    const firstIp = xVercelForwardedFor.split(",")[0].trim();
    if (firstIp) return normalizeIP(firstIp);
  }

  // 2. Check X-Forwarded-For (take the first IP in the chain)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0].trim();
    if (firstIp) return normalizeIP(firstIp);
  }

  // 3. Check X-Real-IP
  const xRealIp = headers.get("x-real-ip");
  if (xRealIp) return normalizeIP(xRealIp.trim());

  // 4. NextRequest specific IP
  if ("ip" in request && typeof (request as any).ip === "string" && (request as any).ip) {
    return normalizeIP((request as any).ip.trim());
  }

  // Default fallback in local environment
  return "127.0.0.1";
}

/**
 * Normalize IPv6 loopbacks and wrappers to IPv4 standard representation
 */
export function normalizeIP(ip: string): string {
  const clean = ip.trim().toLowerCase().split("%")[0]; // remove scope zone id if link-local e.g. %7
  if (clean === "::1" || clean === "::ffff:127.0.0.1" || clean === "localhost") {
    return "127.0.0.1";
  }
  if (clean.startsWith("::ffff:")) {
    return clean.replace("::ffff:", "");
  }
  return clean;
}

/**
 * Known seller IPs (e.g. 192.168.1.4 or 192.168.1.*) that must be strictly limited to the Seller Portal (/seller).
 * These IPs are completely blocked from viewing or authenticating into the master admin panel (/admin).
 */
export function isSellerIP(request: Request | NextRequest): boolean {
  const clientIp = getClientIP(request);
  const normalizedClientIp = normalizeIP(clientIp);

  const defaultSellerIps = ["192.168.1.4", "192.168.1"];
  const envSellerIps = (process.env.SELLER_ALLOWED_IPS || process.env.SELLER_IPS || "")
    .split(",")
    .map((ip) => normalizeIP(ip.trim()))
    .filter(Boolean);

  const allSellerIps = [...defaultSellerIps, ...envSellerIps];

  return (
    allSellerIps.includes(normalizedClientIp) ||
    allSellerIps.includes(clientIp) ||
    allSellerIps.some((sip) => normalizedClientIp.startsWith(sip) || clientIp.startsWith(sip))
  );
}

/**
 * Checks if request is from seller network either by client IP or seller cookie tag
 */
export function isSellerRequest(request: Request | NextRequest): boolean {
  // 1. Check cookie
  if ("cookies" in request && typeof (request as any).cookies?.get === "function") {
    const val = (request as any).cookies.get("civara_seller_network")?.value;
    if (val === "1" || val === "true") return true;
  }
  const rawCookies = request.headers.get("cookie") || "";
  if (rawCookies.includes("civara_seller_network=1") || rawCookies.includes("civara_seller_network=true")) {
    return true;
  }

  // 2. Check IP
  return isSellerIP(request);
}

/**
 * Check if the request comes from an allowed administrator IP
 */
export function isAdminIP(request: Request | NextRequest): boolean {
  // Hard block: Physical Seller network IPs (192.168.1.4) can NEVER have admin privileges
  if (isSellerIP(request)) {
    return false;
  }

  const clientIp = getClientIP(request);
  const normalizedClientIp = normalizeIP(clientIp);

  const defaultAllowed = [
    // User's Authorized Wi-Fi Network (from network configuration)
    "2405:201:200d:2822:a315:6410:f19b:8b6c",
    "2405:201:200d:2822:31b6:e295:2324:6eca",
    "2405:201:200d:2822",
    "2405:201:200d",
    "192.168.29.44",
    "192.168.29",
    "fe80::adb5:c64d:6728:c274",
    // User's Cloudflare WARP Network (active on machine)
    "2a09:bac1:36c0:28::243:9a",
    "2a09:bac1:36c0:28",
    "2a09:bac1:36c0",
    "2606:4700:110:8375:d5e8:d7a9:3599:ac8e",
    "2606:4700:110",
    "104.28.220.39",
    "104.28.220",
    "104.28",
    "172.16.0.2",
    "172.16.0",
    // Localhost loopback for internal server requests and local dev
    "127.0.0.1",
    "::1",
    "localhost",
  ].join(",");

  const rawAllowed = process.env.ADMIN_ALLOWED_IPS
    ? `${process.env.ADMIN_ALLOWED_IPS},${defaultAllowed}`
    : defaultAllowed;

  const allowedList = rawAllowed
    .split(",")
    .map((ip) => normalizeIP(ip.trim()))
    .filter(Boolean);

  // In local development, always allow localhost/loopback
  if (process.env.NODE_ENV === "development") {
    if (normalizedClientIp === "127.0.0.1") return true;
  }

  // Check wildcard
  if (allowedList.includes("*")) return true;

  // Direct exact match
  if (allowedList.includes(normalizedClientIp) || allowedList.includes(clientIp.toLowerCase())) {
    return true;
  }

  // Check subnet / prefix match (for IPv6 /64 blocks or IPv4 /24 subnets)
  for (const allowed of allowedList) {
    if (allowed.includes(":") && allowed.length >= 10) {
      // IPv6 prefix comparison (e.g. 2409:40c1:10da or 2409:40c1:10da:967c)
      if (normalizedClientIp.startsWith(allowed) || clientIp.toLowerCase().startsWith(allowed)) {
        return true;
      }
    } else if (allowed.includes(".") && allowed.split(".").length >= 3) {
      // IPv4 prefix comparison (e.g. 10.29.117)
      if (normalizedClientIp.startsWith(allowed) || clientIp.startsWith(allowed)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if the request has administrator access privileges (via IP, admin key, or admin pass cookie)
 */
export function hasAdminAccess(request: Request | NextRequest): boolean {
  // Hard block: Physical seller network (192.168.1.4) can never have admin access
  if (isSellerIP(request)) return false;

  // 1. Check Admin IP whitelist
  if (isAdminIP(request)) return true;

  // 2. Emergency owner query parameter fallback
  try {
    const url = new URL(request.url);
    if (url.searchParams.get("admin_key") === "civara_owner") {
      return true;
    }
  } catch {}

  // 3. Admin access pass cookie (granted when owner uses admin_key)
  if ("cookies" in request && typeof (request as any).cookies?.get === "function") {
    const val = (request as any).cookies.get("civara_admin_access")?.value;
    if (val === "1" || val === "true") return true;
  }
  const rawCookies = request.headers.get("cookie") || "";
  if (rawCookies.includes("civara_admin_access=1") || rawCookies.includes("civara_admin_access=true")) {
    return true;
  }

  return false;
}

