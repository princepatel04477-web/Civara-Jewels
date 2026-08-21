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
 * Check if the request comes from an allowed administrator IP
 */
export function isAdminIP(request: Request | NextRequest): boolean {
  const clientIp = getClientIP(request);
  const normalizedClientIp = normalizeIP(clientIp);

  const defaultAllowed =
    "127.0.0.1,::1,localhost,192.168.29.44,10.209.18.108,2409:40c1:10bc:ca57:e5b9:7768:d3ab:c4ea,2409:40c1:10bc:ca57,fe80::adb5:c64d:6728:c274";

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
    if (allowed.includes(":") && allowed.length >= 14) {
      // IPv6 prefix comparison (e.g. 2409:40c1:10bc:ca57)
      if (normalizedClientIp.startsWith(allowed) || clientIp.toLowerCase().startsWith(allowed)) {
        return true;
      }
    }
  }

  return false;
}
