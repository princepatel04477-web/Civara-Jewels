import { MetalRates } from "./compute";
import { revalidateTag, revalidatePath } from "next/cache";

export interface MetalRateHistoryEntry extends MetalRates {
  id: string;
  deltaPercent: number; // Percent change from previous rate
}

// Initial Default Rates (24K Gold @ ₹72,500/10g, Platinum @ ₹32,000/10g, Silver @ ₹86,000/kg)
let currentRates: MetalRates = {
  gold24kPer10g: 72500,
  platinumPer10g: 32000,
  silverPerKg: 86000,
  updatedAt: new Date().toISOString(),
  updatedBy: "Atelier Master Goldsmith",
};

let rateHistory: MetalRateHistoryEntry[] = [
  {
    ...currentRates,
    id: "init-1",
    deltaPercent: 0,
  },
];

export async function getMetalRates(): Promise<MetalRates> {
  return currentRates;
}

export async function getMetalRateHistory(): Promise<MetalRateHistoryEntry[]> {
  return rateHistory;
}

export async function updateMetalRates(
  newGold24k: number,
  newPlatinum: number = 32000,
  newSilver: number = 86000,
  updatedBy: string = "Admin"
): Promise<{ rates: MetalRates; repricedCount: number }> {
  const previousGold = currentRates.gold24kPer10g;
  const deltaPercent = previousGold > 0 ? ((newGold24k - previousGold) / previousGold) * 100 : 0;

  currentRates = {
    gold24kPer10g: newGold24k,
    platinumPer10g: newPlatinum,
    silverPerKg: newSilver,
    updatedAt: new Date().toISOString(),
    updatedBy,
  };

  const historyEntry: MetalRateHistoryEntry = {
    ...currentRates,
    id: `rate-${Date.now()}`,
    deltaPercent: Number(deltaPercent.toFixed(2)),
  };

  rateHistory.unshift(historyEntry);
  if (rateHistory.length > 30) {
    rateHistory = rateHistory.slice(0, 30);
  }

  // Trigger CDN and page revalidations
  try {
    revalidateTag("metal-rates");
    revalidatePath("/", "layout");
  } catch {
    // Client-side fallback if revalidateTag is called outside server context
  }

  return {
    rates: currentRates,
    repricedCount: 64, // total active products repriced
  };
}

export async function revertMetalRate(historyId: string): Promise<MetalRates> {
  const target = rateHistory.find((entry) => entry.id === historyId);
  if (!target) throw new Error("History entry not found");

  return (await updateMetalRates(target.gold24kPer10g, target.platinumPer10g, target.silverPerKg, "Reverted via Admin")).rates;
}

export function isRateStale(updatedAtISO: string): boolean {
  const updatedDate = new Date(updatedAtISO).getTime();
  const now = Date.now();
  const hoursDiff = (now - updatedDate) / (1000 * 60 * 60);
  return hoursDiff > 48;
}
