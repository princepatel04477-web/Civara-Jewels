/**
 * Site configuration and base URL utilities for Civara Jewels.
 * Automatically respects the primary custom domain (civarajewels.com)
 * or any NEXT_PUBLIC_SITE_URL environment override.
 */

export const DEFAULT_SITE_URL = "https://civarajewels.com";

export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/+$/, "")}`;
  }
  return DEFAULT_SITE_URL;
}

export const SITE_URL = getSiteUrl();
