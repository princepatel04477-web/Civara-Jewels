"use client";

const WISHLIST_KEY = "civara_wishlist_ids";

export function getWishlistIds(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleWishlistId(id: string): boolean {
  if (typeof window === "undefined") return false;
  const current = getWishlistIds();
  const exists = current.includes(id);
  const updated = exists ? current.filter((item) => item !== id) : [...current, id];
  try {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("wishlist-updated"));
  } catch {}
  return !exists;
}

export function isInWishlist(id: string): boolean {
  return getWishlistIds().includes(id);
}
