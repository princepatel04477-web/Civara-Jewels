"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DollarSign,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calculator,
  RefreshCw,
  ExternalLink,
  History,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

interface MetalRate {
  id: number;
  metal: string;
  purity: string;
  rate_inr: number;
  is_active: number;
  updated_at: string;
  updated_by: string;
}

interface RateHistoryItem {
  id: number;
  metal: string;
  purity: string;
  old_rate: number;
  new_rate: number;
  changed_at: string;
  changed_by: string;
}

export default function SellerDashboardPage() {
  const router = useRouter();
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [history, setHistory] = useState<RateHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [lastUpdatedMeta, setLastUpdatedMeta] = useState<any>(null);

  // Form State for Daily Rates
  const [rateInputs, setRateInputs] = useState<Record<string, string>>({
    "24 KT": "76500",
    "22 KT": "70150",
    "18 KT": "57375",
    "14 KT": "44625",
    "10 KT": "31875",
    "Silver": "28500",
  });

  // Benchmark 24K calculator state
  const [benchmark24K, setBenchmark24K] = useState<string>("76500");

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/seller/rates");
      if (res.status === 401) {
        router.push("/seller/login");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load rates");

      if (data.rates && Array.isArray(data.rates)) {
        setRates(data.rates);

        // Map rates into input state
        const initialMap: Record<string, string> = {};
        data.rates.forEach((r: MetalRate) => {
          initialMap[r.purity] = String(r.rate_inr);
        });

        setRateInputs((prev) => ({
          ...prev,
          ...initialMap,
        }));

        if (initialMap["24 KT"]) {
          setBenchmark24K(initialMap["24 KT"]);
        } else if (initialMap["22 KT"]) {
          // If 24K isn't in db, approximate 24K from 22K (22K / 0.916)
          const approx24 = Math.round(parseInt(initialMap["22 KT"], 10) / 0.9167);
          setBenchmark24K(String(approx24));
        }
      }

      if (data.history && Array.isArray(data.history)) {
        setHistory(data.history);
      }

      if (data.lastUpdated) {
        setLastUpdatedMeta(data.lastUpdated);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to connect to rates service.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  // Handler to update a single purity input
  const handleInputChange = (purity: string, value: string) => {
    // Only allow numbers
    const clean = value.replace(/[^0-9]/g, "");
    setRateInputs((prev) => ({
      ...prev,
      [purity]: clean,
    }));
  };

  // Auto-calculate 22K, 18K, 14K, 10K from 24K benchmark
  const handleAutoCalculateFrom24K = () => {
    const base = parseInt(benchmark24K, 10);
    if (isNaN(base) || base <= 0) {
      setErrorMessage("Please enter a valid 24 KT Gold rate to calculate.");
      return;
    }

    setRateInputs((prev) => ({
      ...prev,
      "24 KT": String(base),
      "22 KT": String(Math.round(base * (22 / 24))), // 91.67%
      "18 KT": String(Math.round(base * (18 / 24))), // 75.00%
      "14 KT": String(Math.round(base * (14 / 24))), // 58.33%
      "10 KT": String(Math.round(base * (10 / 24))), // 41.67%
    }));

    setSuccessMessage("Calculated 22K, 18K, 14K, and 10K based on 24K benchmark.");
    setTimeout(() => setSuccessMessage(""), 4000);
  };

  // Quick adjust buttons for benchmark
  const handleAdjustBenchmark = (delta: number) => {
    const current = parseInt(benchmark24K, 10) || 75000;
    const nextVal = Math.max(1000, current + delta);
    setBenchmark24K(String(nextVal));

    // Auto-update inputs with new benchmark
    setRateInputs((prev) => ({
      ...prev,
      "24 KT": String(nextVal),
      "22 KT": String(Math.round(nextVal * (22 / 24))),
      "18 KT": String(Math.round(nextVal * (18 / 24))),
      "14 KT": String(Math.round(nextVal * (14 / 24))),
      "10 KT": String(Math.round(nextVal * (10 / 24))),
    }));
  };

  // Submit all rates to backend
  const handlePublishRates = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const payload: { purity: string; rate_inr: number; metal: string }[] = [];

    const itemsToSave = [
      { purity: "24 KT", metal: "Gold" },
      { purity: "22 KT", metal: "Gold" },
      { purity: "18 KT", metal: "Gold" },
      { purity: "14 KT", metal: "Gold" },
      { purity: "10 KT", metal: "Gold" },
      { purity: "Silver", metal: "Silver" },
    ];

    for (const item of itemsToSave) {
      const val = parseInt(rateInputs[item.purity] || "0", 10);
      if (isNaN(val) || val <= 0) {
        setErrorMessage(`Please enter a valid positive rate for ${item.purity}.`);
        return;
      }
      payload.push({
        purity: item.purity,
        metal: item.metal,
        rate_inr: val,
      });
    }

    setIsPublishing(true);
    try {
      const res = await fetch("/api/seller/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rates: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to publish rates");

      setSuccessMessage("✓ Rates published successfully! All product prices on the live store are now updated.");
      if (data.rates) setRates(data.rates);
      if (data.history) setHistory(data.history);
      if (data.updatedAt) {
        setLastUpdatedMeta({
          at: data.updatedAt,
          by: data.updatedBy || "Seller",
        });
      }

      // Hide success message after 6 seconds
      setTimeout(() => setSuccessMessage(""), 6000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to publish rates to the store.");
    } finally {
      setIsPublishing(false);
    }
  };

  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header & Live Status Card */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#E6DFD3] pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#9E7F3C] font-semibold">
                Daily Bullion Pricing Desk
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-mono bg-emerald-50 text-emerald-700 px-2 py-0.5 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Online
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium text-[#241F1B]">
              Daily Gold Rate Update
            </h1>
            <p className="text-xs text-[#6E6459] font-light">
              Enter today&apos;s gold market rate. Any adjustment immediately recalculates product retail prices across the website.
            </p>
          </div>

          {/* Quick Date & Storefront Link */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-right sm:border-r border-[#E6DFD3] pr-4 hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider text-[#6E6459] block">Today</span>
              <span className="text-xs font-serif font-medium text-[#241F1B]">{todayFormatted}</span>
            </div>

            <Link
              href="/products/elara-solitaire"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#FAF7F0] hover:bg-[#E6DFD3] border border-[#C9A961] text-[#9E7F3C] px-3.5 py-2 text-xs font-medium transition-colors"
            >
              <span>Check Live Product</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Last Updated Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#6E6459] pt-1">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#9E7F3C]" />
            <span>
              Last Updated:{" "}
              <strong className="text-[#241F1B]">
                {lastUpdatedMeta?.at
                  ? new Date(lastUpdatedMeta.at).toLocaleString("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Today"}
              </strong>
              {lastUpdatedMeta?.by ? ` by ${lastUpdatedMeta.by}` : ""}
            </span>
          </div>

          <button
            type="button"
            onClick={fetchRates}
            disabled={isLoading}
            className="text-[11px] text-[#9E7F3C] hover:text-[#241F1B] inline-flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh Data
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-3 shadow-xs animate-fadeIn">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div className="font-medium">{successMessage}</div>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-3 shadow-xs animate-fadeIn">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <div className="font-medium">{errorMessage}</div>
        </div>
      )}

      {/* BENCHMARK QUICK CALCULATOR CARD */}
      <div className="bg-[#FAF7F0] border border-[#C9A961]/40 p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 text-[#9E7F3C]">
          <Calculator className="w-5 h-5" />
          <h2 className="font-serif text-lg font-medium text-[#241F1B]">
            Quick 24 KT Gold Benchmark Calculator
          </h2>
        </div>
        <p className="text-xs text-[#6E6459] max-w-2xl">
          Enter today&apos;s pure 24 Karat gold rate per 10 grams. Click <strong>&quot;Auto-Calculate&quot;</strong> to automatically compute standard hallmark rates for 22K (91.6%), 18K (75%), 14K (58.3%), and 10K (41.7%).
        </p>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          {/* Input field */}
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3.5 top-3 text-xs font-medium text-[#9E7F3C]">₹</span>
            <input
              type="text"
              value={benchmark24K}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, "");
                setBenchmark24K(val);
              }}
              placeholder="76500"
              className="w-full bg-[#FFFFFF] border border-[#E6DFD3] focus:border-[#9E7F3C] text-[#241F1B] font-mono text-base font-semibold pl-8 pr-16 py-2.5 focus:outline-none"
            />
            <span className="absolute right-3.5 top-3 text-[11px] text-[#6E6459] font-medium">/ 10g</span>
          </div>

          {/* Quick delta adjustment chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[-1000, -500, +500, +1000].map((delta) => (
              <button
                key={delta}
                type="button"
                onClick={() => handleAdjustBenchmark(delta)}
                className="px-2.5 py-2 text-xs font-mono font-medium border border-[#E6DFD3] bg-[#FFFFFF] hover:border-[#9E7F3C] text-[#6E6459] hover:text-[#241F1B] transition-colors cursor-pointer"
              >
                {delta > 0 ? `+₹${delta}` : `-₹${Math.abs(delta)}`}
              </button>
            ))}
          </div>

          {/* Calculate Button */}
          <button
            type="button"
            onClick={handleAutoCalculateFrom24K}
            className="bg-[#9E7F3C] hover:bg-[#886c32] text-[#FAF7F0] px-5 py-2.5 text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            Auto-Calculate
          </button>
        </div>
      </div>

      {/* DAILY RATES ENTRY FORM */}
      <form onSubmit={handlePublishRates} className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
          <div className="space-y-0.5">
            <h3 className="font-serif text-xl font-medium text-[#241F1B]">
              Today&apos;s Active Rate Schedule
            </h3>
            <span className="text-xs text-[#6E6459]">
              Review or customize rates below before publishing to the live store.
            </span>
          </div>
          <span className="text-[11px] text-[#6E6459] font-mono">
            Values quoted in INR (₹) per 10 Grams
          </span>
        </div>

        {/* 6 Purity Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              purity: "24 KT",
              name: "24K Fine Gold",
              subtitle: "99.9% Pure Gold Benchmark",
              accent: "border-amber-400 bg-amber-50/40",
            },
            {
              purity: "22 KT",
              name: "22K Traditional",
              subtitle: "916 Hallmark Standard",
              accent: "border-[#C9A961] bg-[#FAF7F0]",
            },
            {
              purity: "18 KT",
              name: "18K Fine Atelier",
              subtitle: "750 Hallmark (Primary Civara Jewellery)",
              accent: "border-[#241F1B] bg-[#FAF7F0] ring-1 ring-[#241F1B]/10",
              highlight: true,
            },
            {
              purity: "14 KT",
              name: "14K Everyday Fine",
              subtitle: "585 Hallmark Modern Jewellery",
              accent: "border-[#C9A961]/50 bg-[#FFFFFF]",
            },
            {
              purity: "10 KT",
              name: "10K Accessible Fine",
              subtitle: "417 Hallmark Durable Jewellery",
              accent: "border-[#E6DFD3] bg-[#FFFFFF]",
            },
            {
              purity: "Silver",
              name: "925 Sterling Silver",
              subtitle: "Pure Silver Bullion Rate",
              accent: "border-gray-300 bg-gray-50/40",
            },
          ].map((item) => {
            const rawValue = rateInputs[item.purity] || "0";
            const numVal = parseInt(rawValue, 10) || 0;
            const perGram = Math.round(numVal / 10);

            return (
              <div
                key={item.purity}
                className={`border p-5 space-y-3 transition-all ${item.accent} ${
                  item.highlight ? "shadow-md" : "shadow-xs"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif text-lg font-semibold text-[#241F1B]">
                        {item.purity}
                      </span>
                      {item.highlight && (
                        <span className="text-[9px] uppercase tracking-wider bg-[#241F1B] text-[#C9A961] font-semibold px-2 py-0.5">
                          Atelier Core
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-medium text-[#6E6459]">{item.name}</div>
                    <div className="text-[10px] text-[#6E6459]/80 font-light">{item.subtitle}</div>
                  </div>
                </div>

                {/* Rate Input Field */}
                <div className="space-y-1 pt-1">
                  <label className="block text-[10px] uppercase tracking-wider text-[#6E6459] font-medium">
                    Rate per 10g (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-xs font-bold text-[#9E7F3C]">₹</span>
                    <input
                      type="text"
                      value={rateInputs[item.purity] || ""}
                      onChange={(e) => handleInputChange(item.purity, e.target.value)}
                      placeholder="0"
                      required
                      className="w-full bg-[#FFFFFF] border border-[#E6DFD3] focus:border-[#241F1B] text-[#241F1B] font-mono text-base font-bold pl-7 pr-12 py-2 focus:outline-none"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] text-[#6E6459] font-mono">
                      /10g
                    </span>
                  </div>
                </div>

                {/* Live Per-Gram Helper */}
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E6DFD3]/70">
                  <span className="text-[#6E6459]">Equivalent per gram:</span>
                  <span className="font-mono font-semibold text-[#241F1B]">
                    ₹{perGram.toLocaleString("en-IN")}/g
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Sticky Publish Bar */}
        <div className="bg-[#241F1B] text-[#FBF7F0] p-6 border border-[#6E6459]/40 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
              <span className="font-serif text-base sm:text-lg font-medium text-[#FBF7F0]">
                Ready to Publish Today&apos;s Rates?
              </span>
            </div>
            <p className="text-xs text-[#E6DFD3]/80 font-light">
              Saving these rates will instantly update product prices on the live store and record an immutable entry in your audit ledger.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="submit"
              disabled={isPublishing}
              className="w-full sm:w-auto bg-[#C9A961] hover:bg-[#dfbc6f] text-[#241F1B] py-3.5 px-8 text-xs uppercase tracking-[0.2em] font-semibold transition-all cursor-pointer shadow-md disabled:opacity-50 shrink-0 text-center"
            >
              {isPublishing ? "Publishing to Store..." : "Publish Today's Rates"}
            </button>
          </div>
        </div>
      </form>

      {/* RATE CHANGE AUDIT HISTORY TABLE */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
          <div className="flex items-center gap-2 text-[#9E7F3C]">
            <History className="w-5 h-5" />
            <h3 className="font-serif text-lg font-medium text-[#241F1B]">
              Recent Rate Audit Trail
            </h3>
          </div>
          <span className="text-xs text-[#6E6459]">Last 15 Updates</span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#6E6459]">
            No previous rate updates recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E6DFD3] text-[#6E6459] uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Date &amp; Time</th>
                  <th className="py-3 px-2">Metal / Purity</th>
                  <th className="py-3 px-2">Previous Rate</th>
                  <th className="py-3 px-2">New Rate</th>
                  <th className="py-3 px-2">Change</th>
                  <th className="py-3 px-2">Updated By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]/60 font-mono">
                {history.map((h) => {
                  const diff = h.new_rate - h.old_rate;
                  return (
                    <tr key={h.id} className="hover:bg-[#FAF7F0] transition-colors">
                      <td className="py-2.5 px-2 text-[#6E6459]">
                        {new Date(h.changed_at).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                      <td className="py-2.5 px-2 font-serif text-[#241F1B] font-medium">
                        {h.purity} {h.metal}
                      </td>
                      <td className="py-2.5 px-2 text-[#6E6459]">
                        ₹{h.old_rate.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2.5 px-2 text-[#241F1B] font-semibold">
                        ₹{h.new_rate.toLocaleString("en-IN")}
                      </td>
                      <td className="py-2.5 px-2 font-semibold">
                        {diff > 0 ? (
                          <span className="text-emerald-700">▲ +₹{diff.toLocaleString("en-IN")}</span>
                        ) : diff < 0 ? (
                          <span className="text-rose-700">▼ -₹{Math.abs(diff).toLocaleString("en-IN")}</span>
                        ) : (
                          <span className="text-[#6E6459]">0</span>
                        )}
                      </td>
                      <td className="py-2.5 px-2 text-[#6E6459]">{h.changed_by}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
