import { put, list } from "@vercel/blob";
import fs from "fs";
import path from "path";
import { getDataDir } from "./client";

const DELETED_SLUGS_FILE = "civara-data/deleted-slugs.json";
const METAL_RATES_FILE = "civara-data/metal-rates.json";

// In-memory caches for zero-latency synchronous access
let cachedDeletedSlugs: Set<string> = new Set();
let lastDeletedSlugsFetch = 0;
let hasLoadedFromDiskOrCloud = false;

function getLocalFilePath(filename: string): string {
  const baseName = path.basename(filename);
  return path.join(getDataDir(), baseName);
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Returns current set of deleted product slugs synchronously (from in-memory cache)
 */
export function getDeletedSlugsSync(): Set<string> {
  if (!hasLoadedFromDiskOrCloud) {
    try {
      const localPath = getLocalFilePath(DELETED_SLUGS_FILE);
      if (fs.existsSync(localPath)) {
        const raw = fs.readFileSync(localPath, "utf-8");
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          cachedDeletedSlugs = new Set(list.map((s: any) => String(s).toLowerCase().trim()));
        }
      }
    } catch {
      // ignore
    }
    hasLoadedFromDiskOrCloud = true;
  }
  return cachedDeletedSlugs;
}

/**
 * Loads deleted slugs from Vercel Blob or local disk, updating cache
 */
export async function getDeletedSlugs(): Promise<Set<string>> {
  const now = Date.now();
  // Revalidate from cloud every 10 seconds
  if (hasLoadedFromDiskOrCloud && now - lastDeletedSlugsFetch < 10000) {
    return cachedDeletedSlugs;
  }

  // 1. Try Vercel Blob if token is available
  if (hasBlobToken()) {
    try {
      const { blobs } = await list({ prefix: DELETED_SLUGS_FILE, limit: 1 });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: "no-store" });
        if (res.ok) {
          const list: string[] = await res.json();
          if (Array.isArray(list)) {
            cachedDeletedSlugs = new Set(list.map((s: any) => String(s).toLowerCase().trim()));
            lastDeletedSlugsFetch = now;
            hasLoadedFromDiskOrCloud = true;
            return cachedDeletedSlugs;
          }
        }
      }
    } catch (err) {
      console.warn("[CloudSync] Failed to fetch deleted slugs from Blob:", err);
    }
  }

  // 2. Fallback to local disk
  try {
    const localPath = getLocalFilePath(DELETED_SLUGS_FILE);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, "utf-8");
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        cachedDeletedSlugs = new Set(list.map((s: any) => String(s).toLowerCase().trim()));
      }
    }
  } catch {
    // ignore
  }

  hasLoadedFromDiskOrCloud = true;
  lastDeletedSlugsFetch = now;
  return cachedDeletedSlugs;
}

/**
 * Marks a product slug as permanently deleted across all cloud serverless instances
 */
export async function recordDeletedSlug(slug: string): Promise<void> {
  if (!slug) return;
  const cleanSlug = slug.toLowerCase().trim();
  cachedDeletedSlugs.add(cleanSlug);

  const array = Array.from(cachedDeletedSlugs);
  const jsonStr = JSON.stringify(array);

  // 1. Save locally
  try {
    const localPath = getLocalFilePath(DELETED_SLUGS_FILE);
    fs.writeFileSync(localPath, jsonStr, "utf-8");
  } catch {
    // ignore
  }

  // 2. Save to Vercel Blob
  if (hasBlobToken()) {
    try {
      await put(DELETED_SLUGS_FILE, jsonStr, {
        access: "public",
        addRandomSuffix: false,
      });
    } catch (err) {
      console.error("[CloudSync] Failed to persist deleted slug to Vercel Blob:", err);
    }
  }
}

/**
 * Saves current metal rates to Vercel Blob so they stay synced across all instances
 */
export async function saveRatesToCloud(rates: any[]): Promise<void> {
  const jsonStr = JSON.stringify(rates);
  try {
    const localPath = getLocalFilePath(METAL_RATES_FILE);
    fs.writeFileSync(localPath, jsonStr, "utf-8");
  } catch {
    // ignore
  }

  if (hasBlobToken()) {
    try {
      await put(METAL_RATES_FILE, jsonStr, {
        access: "public",
        addRandomSuffix: false,
      });
    } catch (err) {
      console.warn("[CloudSync] Failed to persist rates to Vercel Blob:", err);
    }
  }
}

/**
 * Fetches latest metal rates from Vercel Blob if available
 */
export async function getRatesFromCloud(): Promise<any[] | null> {
  if (hasBlobToken()) {
    try {
      const { blobs } = await list({ prefix: METAL_RATES_FILE, limit: 1 });
      if (blobs.length > 0) {
        const res = await fetch(blobs[0].url, { cache: "no-store" });
        if (res.ok) {
          const rates = await res.json();
          if (Array.isArray(rates)) return rates;
        }
      }
    } catch {
      // ignore
    }
  }

  try {
    const localPath = getLocalFilePath(METAL_RATES_FILE);
    if (fs.existsSync(localPath)) {
      const raw = fs.readFileSync(localPath, "utf-8");
      const rates = JSON.parse(raw);
      if (Array.isArray(rates)) return rates;
    }
  } catch {
    // ignore
  }

  return null;
}
