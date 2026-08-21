"use client";

import React, { useState, useEffect } from "react";
import { formatINR, computePrice, MetalRates, PricingProduct } from "../../../lib/pricing/compute";
import { updateMetalRates, getMetalRateHistory, MetalRateHistoryEntry, revertMetalRate } from "../../../lib/pricing/rates";
import { ShieldCheck, AlertTriangle, RefreshCw, Lock, ArrowUpRight, ArrowDownRight, RotateCcw, CheckCircle2 } from "lucide-react";

// Representative products for Live Preview
const PREVIEW_PRODUCTS: PricingProduct[] = [
  {
    id: "elara-solitaire",
    name: "Elara Solitaire Ring",
    metal: "gold",
    purity: 18,
    netWeightG: 4.8,
    grossWeightG: 5.2,
    wastagePercent: 8,
    makingCharge: { type: "per_gram", value: 1200 },
    stones: [{ type: "Natural Diamond", shape: "Round Solitaire", carat: 1.0, count: 1, flatValue: 42000, certified: true }],
    otherCharges: 1500,
    priceMode: "live",
  },
  {
    id: "nira-stacking-band",
    name: "Nira Stacking Band",
    metal: "gold",
    purity: 18,
    netWeightG: 3.2,
    grossWeightG: 3.2,
    wastagePercent: 5,
    makingCharge: { type: "per_gram", value: 950 },
    stones: [],
    otherCharges: 800,
    priceMode: "live",
  },
  {
    id: "vela-pendant",
    name: "Vela Star Pendant",
    metal: "gold",
    purity: 18,
    netWeightG: 5.5,
    grossWeightG: 5.8,
    wastagePercent: 7,
    makingCharge: { type: "per_gram", value: 1100 },
    stones: [{ type: "Diamond Pave", shape: "Round", carat: 0.35, count: 12, flatValue: 18000, certified: true }],
    otherCharges: 1200,
    priceMode: "live",
  },
];

export default function AdminRatesPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [passError, setPassError] = useState(false);

  const [currentGoldRate, setCurrentGoldRate] = useState(72500);
  const [currentPlatinumRate, setCurrentPlatinumRate] = useState(32000);
  const [currentSilverRate, setCurrentSilverRate] = useState(86000);

  const [inputGoldRate, setInputGoldRate] = useState("72,500");
  const [inputPlatinumRate, setInputPlatinumRate] = useState("32,000");
  const [inputSilverRate, setInputSilverRate] = useState("86,000");

  const [showOptionalMetals, setShowOptionalMetals] = useState(false);
  const [showFatFingerGuard, setShowFatFingerGuard] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [history, setHistory] = useState<MetalRateHistoryEntry[]>([]);

  useEffect(() => {
    // Check local auth state
    const authed = sessionStorage.getItem("civara_admin_authed");
    if (authed === "true") {
      setIsAuthenticated(true);
    }
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const hist = await getMetalRateHistory();
    setHistory(hist);
    if (hist.length > 0) {
      const latest = hist[0];
      setCurrentGoldRate(latest.gold24kPer10g);
      setCurrentPlatinumRate(latest.platinumPer10g);
      setCurrentSilverRate(latest.silverPerKg);
      setInputGoldRate(formatINR(latest.gold24kPer10g).replace("₹", ""));
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "civara2026" || passcode === "admin123") {
      setIsAuthenticated(true);
      sessionStorage.setItem("civara_admin_authed", "true");
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const parseNumber = (val: string) => {
    return Number(val.replace(/,/g, "").replace(/₹/g, "").trim());
  };

  const newGoldNum = parseNumber(inputGoldRate) || currentGoldRate;
  const newPlatNum = parseNumber(inputPlatinumRate) || currentPlatinumRate;
  const newSilvNum = parseNumber(inputSilverRate) || currentSilverRate;

  const goldDeltaPercent = currentGoldRate > 0 ? ((newGoldNum - currentGoldRate) / currentGoldRate) * 100 : 0;
  const isLargeDelta = Math.abs(goldDeltaPercent) >= 5;

  const currentRatesObj: MetalRates = {
    gold24kPer10g: currentGoldRate,
    platinumPer10g: currentPlatinumRate,
    silverPerKg: currentSilverRate,
    updatedAt: new Date().toISOString(),
    updatedBy: "Admin",
  };

  const newRatesObj: MetalRates = {
    gold24kPer10g: newGoldNum,
    platinumPer10g: newPlatNum,
    silverPerKg: newSilvNum,
    updatedAt: new Date().toISOString(),
    updatedBy: "Admin",
  };

  const handlePreSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLargeDelta) {
      setShowFatFingerGuard(true);
    } else {
      commitUpdate();
    }
  };

  const commitUpdate = async () => {
    const res = await updateMetalRates(newGoldNum, newPlatNum, newSilvNum, "Atelier Admin");
    setCurrentGoldRate(newGoldNum);
    setCurrentPlatinumRate(newPlatNum);
    setCurrentSilverRate(newSilvNum);
    setShowFatFingerGuard(false);
    setSuccessMessage(`Rate updated. ${res.repricedCount} pieces repriced.`);
    loadHistory();
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  const handleRevert = async (id: string) => {
    const rates = await revertMetalRate(id);
    setCurrentGoldRate(rates.gold24kPer10g);
    setInputGoldRate(formatINR(rates.gold24kPer10g).replace("₹", ""));
    setSuccessMessage(`Rate reverted to ${formatINR(rates.gold24kPer10g)} / 10g.`);
    loadHistory();
    setTimeout(() => setSuccessMessage(""), 5000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF7F0] flex items-center justify-center p-6">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-[#FFFFFF] border border-[#E6DFD3] p-10 space-y-6 text-center specular-sweep shadow-sm">
          <div className="w-12 h-12 border border-[#C9A961] flex items-center justify-center mx-auto text-[#9E7F3C]">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h2 className="font-serif text-2xl font-medium text-[#241F1B]">Atelier Metal Rate Portal</h2>
            <p className="text-xs font-light text-[#6E6459]">Enter admin passcode to adjust daily 24K gold rates.</p>
          </div>
          <input
            type="password"
            placeholder="Enter Passcode (civara2026)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-4 py-3 text-center text-sm font-mono focus:outline-none focus:border-[#C9A961]"
          />
          {passError && <p className="text-xs text-red-600 font-mono">Invalid Passcode. Please try again.</p>}
          <button
            type="submit"
            className="w-full bg-[#241F1B] text-[#C9A961] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors"
          >
            Authenticate Portal
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-16 px-6 lg:px-20 max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E6DFD3] pb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Live Pricing Engine · Admin Portal
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Daily Metal Rate Control
          </h1>
        </div>
        <button
          onClick={() => {
            sessionStorage.removeItem("civara_admin_authed");
            setIsAuthenticated(false);
          }}
          className="text-xs uppercase tracking-[0.18em] text-[#6E6459] border-b border-[#6E6459] hover:text-[#241F1B] transition-colors"
        >
          Lock Portal
        </button>
      </div>

      {/* Success Banner */}
      {successMessage && (
        <div className="p-4 bg-[#F4EDE2] border border-[#C9A961] text-[#9E7F3C] text-xs font-medium uppercase tracking-[0.18em] flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" /> {successMessage}
        </div>
      )}

      {/* Main Entry Section */}
      <form onSubmit={handlePreSave} className="bg-[#FFFFFF] border border-[#E6DFD3] p-8 lg:p-12 space-y-8 specular-sweep shadow-sm">
        <div className="space-y-3">
          <label className="block text-xs uppercase tracking-[0.25em] text-[#9E7F3C] font-medium">
            Today's 24K Gold Rate (per 10g in INR)
          </label>
          <div className="relative max-w-xl">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 font-serif text-3xl text-[#9E7F3C] font-medium">₹</span>
            <input
              type="text"
              value={inputGoldRate}
              onChange={(e) => setInputGoldRate(e.target.value)}
              className="w-full bg-[#FBF7F0] border-2 border-[#C9A961] text-[#241F1B] pl-14 pr-6 py-5 font-serif text-4xl sm:text-5xl font-semibold tracking-tight focus:outline-none focus:border-[#9E7F3C]"
            />
          </div>
          <p className="text-xs font-light text-[#6E6459]">
            Current Rate: <span className="font-mono font-medium text-[#241F1B]">{formatINR(currentGoldRate)} / 10g</span>
            {goldDeltaPercent !== 0 && (
              <span className={`ml-2 inline-flex items-center font-mono ${goldDeltaPercent > 0 ? "text-amber-700" : "text-emerald-700"}`}>
                {goldDeltaPercent > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                {Math.abs(goldDeltaPercent).toFixed(2)}%
              </span>
            )}
          </p>
        </div>

        {/* Collapsible Optional Platinum & Silver Rates */}
        <div>
          <button
            type="button"
            onClick={() => setShowOptionalMetals(!showOptionalMetals)}
            className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] border-b border-[#9E7F3C] hover:text-[#241F1B] transition-colors"
          >
            {showOptionalMetals ? "- Hide Platinum & Silver Rates" : "+ Configure Platinum & Silver Rates"}
          </button>

          {showOptionalMetals && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6E6459]">Platinum Rate (per 10g)</label>
                <input
                  type="text"
                  value={inputPlatinumRate}
                  onChange={(e) => setInputPlatinumRate(e.target.value)}
                  className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] px-4 py-3 font-mono text-lg focus:outline-none focus:border-[#C9A961]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-[#6E6459]">Silver Rate (per 1kg)</label>
                <input
                  type="text"
                  value={inputSilverRate}
                  onChange={(e) => setInputSilverRate(e.target.value)}
                  className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] px-4 py-3 font-mono text-lg focus:outline-none focus:border-[#C9A961]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Preview Section */}
        <div className="pt-8 border-t border-[#E6DFD3] space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs uppercase tracking-[0.22em] text-[#9E7F3C] font-medium flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5" /> Live Preview (Impact Before Commit)
            </div>
            <span className="text-[11px] text-[#6E6459]">3 Sample Products Repricing</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PREVIEW_PRODUCTS.map((prod) => {
              const oldPrice = computePrice(prod, currentRatesObj);
              const newPrice = computePrice(prod, newRatesObj);
              return (
                <div key={prod.id} className="p-4 bg-[#FBF7F0] border border-[#E6DFD3] space-y-2">
                  <div className="font-serif text-sm font-medium text-[#241F1B]">{prod.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-[#6E6459]">{prod.purity}K Gold · {prod.netWeightG}g</div>
                  <div className="pt-2 flex items-baseline justify-between border-t border-[#E6DFD3]/60 font-mono text-sm">
                    <span className="line-through text-[#6E6459]">{oldPrice.formattedTotalINR}</span>
                    <span className="font-bold text-[#241F1B] text-base">{newPrice.formattedTotalINR}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-[#241F1B] text-[#C9A961] px-10 py-4 text-xs uppercase tracking-[0.24em] font-medium hover:bg-[#181412] transition-colors"
          >
            Update Rate
          </button>
        </div>
      </form>

      {/* Fat-Finger Guard Modal (Exceeds 5% change guard) */}
      {showFatFingerGuard && (
        <div className="fixed inset-0 z-50 bg-[#241F1B]/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#FFFFFF] border-2 border-[#C9A961] max-w-lg w-full p-8 space-y-6 text-center specular-sweep shadow-xl">
            <div className="w-12 h-12 border border-amber-600 bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-[#241F1B]">Large Rate Variation Warning</h3>
              <p className="text-xs font-light text-[#6E6459] leading-relaxed">
                The new 24K gold rate (<strong className="text-[#241F1B]">{formatINR(newGoldNum)}</strong>) represents a{" "}
                <strong className="text-amber-700">{Math.abs(goldDeltaPercent).toFixed(2)}% variation</strong> from current rate (
                {formatINR(currentGoldRate)}).
              </p>
            </div>
            <div className="p-4 bg-[#FBF7F0] border border-[#E6DFD3] text-xs font-mono text-[#241F1B]">
              Repricing 64 active catalogue creations by {goldDeltaPercent > 0 ? "+" : ""}{goldDeltaPercent.toFixed(2)}%.
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowFatFingerGuard(false)}
                className="border border-[#E6DFD3] text-[#6E6459] px-6 py-3 text-xs uppercase tracking-[0.18em] font-medium hover:border-[#241F1B] hover:text-[#241F1B]"
              >
                Cancel & Edit
              </button>
              <button
                onClick={commitUpdate}
                className="bg-[#241F1B] text-[#C9A961] px-8 py-3 text-xs uppercase tracking-[0.18em] font-medium hover:bg-[#181412]"
              >
                Confirm Rate Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Table (Last 30 Entries) */}
      <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-[#E6DFD3] pb-4">
          <h2 className="font-serif text-xl font-medium text-[#241F1B]">Metal Rate Audit Log</h2>
          <span className="text-xs font-mono text-[#6E6459]">Last 30 Adjustments</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-light">
            <thead>
              <tr className="border-b border-[#E6DFD3] text-[10px] uppercase tracking-[0.2em] text-[#9E7F3C]">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">24K Gold / 10g</th>
                <th className="py-3 px-4">Change Delta</th>
                <th className="py-3 px-4">Updated By</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60 font-mono">
              {history.map((entry) => (
                <tr key={entry.id} className="hover:bg-[#FBF7F0]/60 transition-colors">
                  <td className="py-3 px-4 text-[#6E6459]">
                    {new Date(entry.updatedAt).toLocaleString("en-IN")}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#241F1B]">
                    {formatINR(entry.gold24kPer10g)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={entry.deltaPercent >= 0 ? "text-amber-700" : "text-emerald-700"}>
                      {entry.deltaPercent >= 0 ? "+" : ""}{entry.deltaPercent}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[#6E6459]">{entry.updatedBy}</td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRevert(entry.id)}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-[#9E7F3C] hover:text-[#241F1B]"
                    >
                      <RotateCcw className="w-3 h-3" /> Revert
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
