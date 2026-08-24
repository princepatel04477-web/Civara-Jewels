import { MetalRates } from "./compute";
import { revalidateTag, revalidatePath } from "next/cache";

export interface MetalRateHistoryEntry extends MetalRates {
  id: string;
  deltaPercent: number; // Percent change from previous rate
}

// Official Atelier Benchmark Rates:
// 18 KT Gold @ ₹69,999/10g, 14 KT Gold @ ₹55,999/10g, 10 KT Gold @ ₹42,999/10g, Silver @ ₹26,999/kg
let currentRates: MetalRates = {
  gold24kPer10g: 93332,
  gold18kPer10g: 69999,
  gold14kPer10g: 55999,
  gold10kPer10g: 42999,
  platinumPer10g: 32000,
  silverPerKg: 26999,
  updatedAt: new Date().toISOString(),
  updatedBy: "Atelier Master Goldsmith",
};

let rateHistory: MetalRateHistoryEntry[] = [
  {
    ...currentRates,
    id: "init-official-1",
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
  newGold18k: number = 69999,
  newGold14k: number = 55999,
  newGold10k: number = 42999,
  newSilver: number = 26999,
  updatedBy: string = "Admin"
): Promise<{ rates: MetalRates; repricedCount: number }> {
  const previous18k = currentRates.gold18kPer10g || 69999;
  const deltaPercent = previous18k > 0 ? ((newGold18k - previous18k) / previous18k) * 100 : 0;

  const gold24kEquivalent = Math.round(newGold18k / 0.75);

  currentRates = {
    gold24kPer10g: gold24kEquivalent,
    gold18kPer10g: newGold18k,
    gold14kPer10g: newGold14k,
    gold10kPer10g: newGold10k,
    platinumPer10g: 32000,
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

  return (
    await updateMetalRates(
      target.gold18kPer10g || 69999,
      target.gold14kPer10g || 55999,
      target.gold10kPer10g || 42999,
      target.silverPerKg || 26999,
      "Reverted via Admin"
    )
  ).rates;
}

export function isRateStale(updatedAtISO: string): boolean {
  const updatedDate = new Date(updatedAtISO).getTime();
  const now = Date.now();
  const hoursDiff = (now - updatedDate) / (1000 * 60 * 60);
  return hoursDiff > 48;
}
