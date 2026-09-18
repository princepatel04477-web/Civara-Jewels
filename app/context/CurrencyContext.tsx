"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Product } from "../../lib/catalog";
import { extractPurityFromMetalOption } from "../../lib/pricing/compute";

export type CurrencyOption = "₹ INR" | "$ USD" | "€ EUR";

export const CATALOG_BASELINE_18K_RATE = 69999;
export const CATALOG_BASELINE_SILVER_RATE = 26999;

export const DEFAULT_RATES_MAP: Record<string, number> = {
  "24 KT": 93332,
  "22 KT": 85554,
  "18 KT": 69999,
  "16 KT": 62221,
  "14 KT": 55999,
  "10 KT": 42999,
  "Silver": 26999,
};

export function lookupRate(ratesMap: Record<string, number>, purityKarat: number, isSilver: boolean): number {
  if (isSilver) return ratesMap["Silver"] || ratesMap["SILVER"] || 26999;
  return (
    ratesMap[`${purityKarat} KT`] ||
    ratesMap[`${purityKarat}KT`] ||
    ratesMap[`${purityKarat}K`] ||
    ratesMap[`${purityKarat} K`] ||
    (purityKarat === 18 ? 69999 : purityKarat === 14 ? 55999 : purityKarat === 10 ? 42999 : 69999)
  );
}

interface CurrencyContextType {
  currency: CurrencyOption;
  setCurrency: (c: CurrencyOption) => void;
  formatPrice: (inr: number) => string;
  ratesMap: Record<string, number>;
  getLiveProductPrice: (
    product: Product,
    selectedMetal?: string,
    diamondType?: "Natural Diamond" | "Lab Grown Diamond"
  ) => number;
  refreshRates: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "₹ INR",
  setCurrency: () => {},
  formatPrice: (inr) => `₹${inr.toLocaleString("en-IN")}`,
  ratesMap: DEFAULT_RATES_MAP,
  getLiveProductPrice: (p) => p.priceINR,
  refreshRates: async () => {},
});

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyOption>("₹ INR");
  const [ratesMap, setRatesMap] = useState<Record<string, number>>(DEFAULT_RATES_MAP);

  const fetchRates = useCallback(async () => {
    try {
      const res = await fetch("/api/public/metal-rates", {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.rates)) {
          const map: Record<string, number> = { ...DEFAULT_RATES_MAP };
          data.rates.forEach((r: any) => {
            if (r.purity && r.rate_inr) {
              map[r.purity] = r.rate_inr;
            }
          });
          setRatesMap(map);
        }
      }
    } catch {
      // Keep defaults on network error
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const getLiveProductPrice = useCallback(
    (
      product: Product,
      selectedMetal?: string,
      diamondType: "Natural Diamond" | "Lab Grown Diamond" = "Natural Diamond"
    ): number => {
      if (!product || !product.priceINR) return 0;

      const netWeight = product.netWeightG || 3.4;
      const metalToUse = selectedMetal || product.metalOptions?.[0] || "18K Yellow Gold";
      const purityInfo = extractPurityFromMetalOption(metalToUse);

      const activeRate = lookupRate(ratesMap, purityInfo.purityKarat, purityInfo.isSilver);

      // Baseline 18K metal cost with 3% GST when catalog basePrice was fixed
      const baselineMetal18k = netWeight * (CATALOG_BASELINE_18K_RATE / 10);
      const baselineMetalWithGst = baselineMetal18k * 1.03;

      // Base non-metal (craftsmanship, certification, diamonds, settings)
      const baseNonMetalWithGst = Math.max(0, product.priceINR - baselineMetalWithGst);

      // Current metal cost at today's seller rate with 3% GST
      const currentMetalCost = netWeight * (activeRate / (purityInfo.isSilver ? 1000 : 10));
      const currentMetalWithGst = currentMetalCost * 1.03;

      // Diamond adjustment (Natural vs Lab Grown)
      const isGoldOnly = product.stoneType && product.stoneType.toLowerCase().includes("gold only");
      const estimatedMaking = Math.max(3000, 4800);
      const rawDiamondComponent = isGoldOnly ? 0 : Math.max(0, baseNonMetalWithGst - estimatedMaking);

      const naturalRate = ratesMap["Natural Diamond (Per Carat)"] || 85000;
      const labRate = ratesMap["Lab Grown Diamond (Per Carat)"] || 28000;
      const dynamicRatio = naturalRate > 0 ? (labRate / naturalRate) : 0.65;

      const diamondMultiplier = diamondType === "Lab Grown Diamond" ? dynamicRatio : 1.0;
      const activeDiamondComponent = Math.round(rawDiamondComponent * diamondMultiplier);
      const activeMaking = Math.max(3000, baseNonMetalWithGst - rawDiamondComponent);

      const totalNonMetal = activeMaking + activeDiamondComponent;
      const dynamicTotal = Math.round(totalNonMetal + currentMetalWithGst);

      return Math.max(dynamicTotal, 5000);
    },
    [ratesMap]
  );

  const formatPrice = (inr: number): string => {
    const config = {
      "₹ INR": { symbol: "₹", rate: 1, locale: "en-IN" },
      "$ USD": { symbol: "$", rate: 1 / 84, locale: "en-US" },
      "€ EUR": { symbol: "€", rate: 1 / 91, locale: "de-DE" },
    }[currency];

    const converted = Math.round(inr * config.rate);
    return `${config.symbol}${converted.toLocaleString(config.locale)}`;
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        ratesMap,
        getLiveProductPrice,
        refreshRates: fetchRates,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => useContext(CurrencyContext);
