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
// Prevent repeated cloud warm calls within the same lambda instance
let hasWarmedFromCloud = false;

function getLocalFilePath(filename: string): string {
  const baseName = path.basename(filename);
  return path.join(getDataDir(), baseName);
}

function hasBlobToken(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

/**
 * Synchronously warms the in-memory deleted-slugs cache from Vercel Blob.
 * Uses Node child_process to perform a blocking HTTP request during synchronous DB seeding.
 * This prevents cold-start lambda instances from re-seeding previously deleted products.
 */
export function warmDeletedSlugsFromBlobSync(): void {
  if (hasWarmedFromCloud) return;
  if (!hasBlobToken()) {
    hasWarmedFromCloud = true;
    return;
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN!;

  try {
    const { execFileSync } = require("child_process") as typeof import("child_process");

    // Step 1: List blobs with the deleted-slugs prefix via Vercel Blob REST API
    const listScript = `
const https = require('https');
const url = 'https://blob.vercel-storage.com?prefix=${encodeURIComponent(DELETED_SLUGS_FILE)}&limit=1';
const req = https.get(url, { headers: { Authorization: 'Bearer ${token}' } }, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => process.stdout.write(d));
});
req.on('error', () => process.exit(1));
req.setTimeout(4000, () => process.exit(1));
`;

    const listRaw = execFileSync(process.execPath, ["-e", listScript], {
      timeout: 5000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }) as string;

    if (!listRaw || !listRaw.trim()) {
      hasWarmedFromCloud = true;
      return;
    }

    const listData = JSON.parse(listRaw);
    const blobs: Array<{ url: string }> = listData.blobs || [];
    if (blobs.length === 0) {
      console.log("[CloudSync] No deleted-slugs blob found, starting fresh.");
      hasWarmedFromCloud = true;
      return;
    }

    // Step 2: Fetch the actual blob contents
    const fileUrl = blobs[0].url;
    const fetchScript = `
const mod = require('${fileUrl.startsWith("https") ? "https" : "http"}');
mod.get(${JSON.stringify(fileUrl)}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => process.stdout.write(d));
}).on('error', () => process.exit(1)).setTimeout(4000, () => process.exit(1));
`;

    const fileRaw = execFileSync(process.execPath, ["-e", fetchScript], {
      timeout: 5000,
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }) as string;

    if (!fileRaw || !fileRaw.trim()) {
      hasWarmedFromCloud = true;
      return;
    }

    const slugList = JSON.parse(fileRaw);
    if (Array.isArray(slugList)) {
      cachedDeletedSlugs = new Set(slugList.map((s: any) => String(s).toLowerCase().trim()));
      hasLoadedFromDiskOrCloud = true;
      lastDeletedSlugsFetch = Date.now();
      console.log(`[CloudSync] Warmed ${cachedDeletedSlugs.size} deleted slugs from Vercel Blob (sync).`);
    }
  } catch (err) {
    console.warn("[CloudSync] warmDeletedSlugsFromBlobSync failed (non-fatal):", err);
  }

  hasWarmedFromCloud = true;
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
