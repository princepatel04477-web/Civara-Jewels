"use client";

import React, { useState } from "react";
import { formatINR } from "../../../lib/pricing/compute";
import { ChevronDown, Info, ShieldCheck } from "lucide-react";

interface PriceBreakdownProps {
  metalLabel?: string;
  metalAmount: number;
  diamondLabel?: string;
  diamondAmount: number;
  makingCharges: number;
  gstAmount: number;
  totalAmount: number;
  metalPurityLabel?: string;
  metalRate?: number;
  rateUnit?: string;
  gold18kRate?: number; // backwards compatibility
  updatedAt?: string;
}

export const PriceBreakdown: React.FC<PriceBreakdownProps> = ({
  metalLabel = "Metal (18k Recycled Gold, 3.40g)",
  metalAmount = 30450,
  diamondLabel = "Diamonds (1.25ct, G-H/VS1 Certified)",
  diamondAmount = 32000,
  makingCharges = 4800,
  gstAmount = 2017,
  totalAmount = 69267,
  metalPurityLabel = "18K Gold Rate:",
  metalRate,
  rateUnit = "/ 10g",
  gold18kRate,
  updatedAt = "Live Atelier Benchmark",
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const activeRate = metalRate ?? gold18kRate ?? 69999;

  return (
    <div className="w-full bg-[#FAF7F0] border border-[#E6DFD3] p-4 sm:p-5 space-y-3 font-sans text-xs">
      {/* Header Button with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-serif text-sm sm:text-base font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-2">
          <Info className="w-4 h-4 text-[#9E7F3C]" /> Transparent Price Arithmetic
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dynamic Metal Benchmark Rate Line */}
      <div className="min-h-[22px] flex items-center justify-between text-[11px] text-[#6E6459] border-b border-[#E6DFD3]/60 pb-2">
        <span className="inline-flex items-center gap-1.5 font-medium text-[#9E7F3C]">
          <ShieldCheck className="w-3.5 h-3.5" /> {metalPurityLabel}
        </span>
        <span className="font-serif font-medium text-[#241F1B] text-xs sm:text-sm">
          {formatINR(activeRate)} {rateUnit} <span className="font-sans text-[10px] text-[#6E6459] font-normal">({updatedAt})</span>
        </span>
      </div>

      {/* 4-Row Breakdown */}
      {isOpen && (
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex justify-between items-center py-1 text-[#6E6459]">
            <span>{metalLabel}</span>
            <span className="font-serif text-[#241F1B] text-sm tabular-nums text-right">
              {formatINR(metalAmount)}
            </span>
          </div>

          {diamondAmount > 0 && (
            <div className="flex justify-between items-center py-1 text-[#6E6459]">
              <span>{diamondLabel}</span>
              <span className="font-serif text-[#241F1B] text-sm tabular-nums text-right">
                {formatINR(diamondAmount)}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-1 text-[#6E6459]">
            <span>Atelier Making Charges</span>
            <span className="font-serif text-[#241F1B] text-sm tabular-nums text-right">
              {formatINR(makingCharges)}
            </span>
          </div>

          <div className="flex justify-between items-center py-1 text-[#6E6459] border-b border-[#E6DFD3]/60 pb-2">
            <span>GST (3% Indian Standard)</span>
            <span className="font-serif text-[#241F1B] text-sm tabular-nums text-right">
              {formatINR(gstAmount)}
            </span>
          </div>

          {/* Total Line */}
          <div className="pt-2 flex justify-between items-center font-serif text-base sm:text-lg font-medium text-[#241F1B]">
            <span>Total Atelier Value</span>
            <span className="text-[#9E7F3C] font-semibold tabular-nums text-right">
              {formatINR(totalAmount)}
            </span>
          </div>

          <p className="text-[10px] text-[#6E6459] pt-1 leading-relaxed">
            * Rate confirmed at order booking. Certified BIS hallmark and independent laboratory report included.
          </p>
        </div>
      )}
    </div>
  );
};
