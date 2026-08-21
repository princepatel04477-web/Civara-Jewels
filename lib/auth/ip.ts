import { NextRequest } from "next/server";

/**
 * Extracts and normalizes client IP address from request headers or socket.
 * Inspects standard proxy headers safely.
 */
export function getClientIP(request: Request | NextRequest): string {
  const headers = request.headers;

  // 1. Check Cloudflare / CDN headers first
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return normalizeIP(cfConnectingIp.trim());

  const trueClientIp = headers.get("true-client-ip");
  if (trueClientIp) return normalizeIP(trueClientIp.trim());

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
  const clean = ip.trim().toLowerCase();
  if (clean === "::1" || clean === "::ffff:127.0.0.1" || clean === "localhost") {
    return "127.0.0.1";
  }
  if (clean.startsWith("::ffff:")) {
    return clean.replace("::ffff:", "");
  }
  return clean;
}

/**
 * Check if the request comes from an allowed administrator IP
 */
export function isAdminIP(request: Request | NextRequest): boolean {
  const clientIp = getClientIP(request);
  const normalizedClientIp = normalizeIP(clientIp);

  const rawAllowed = process.env.ADMIN_ALLOWED_IPS || "127.0.0.1,::1,localhost,192.168.29.44";
  const allowedList = rawAllowed
    .split(",")
    .map((ip) => normalizeIP(ip.trim()))
    .filter(Boolean);

  // In local development, always allow localhost/loopback
  if (process.env.NODE_ENV === "development") {
    if (normalizedClientIp === "127.0.0.1") return true;
  }

  return (
    allowedList.includes(normalizedClientIp) ||
    allowedList.includes(clientIp.toLowerCase()) ||
    allowedList.includes("*")
  );
}
