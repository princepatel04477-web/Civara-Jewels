"use client";

import React, { useState } from "react";
import { PriceBreakdown } from "../../../lib/pricing/compute";
import { ChevronDown, Info, ShieldCheck } from "lucide-react";

interface PDPPriceBreakdownProps {
  breakdown: PriceBreakdown;
}

export function PDPPriceBreakdownComponent({ breakdown }: PDPPriceBreakdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!breakdown.isLive) {
    return null;
  }

  return (
    <div className="border border-[#E6DFD3] bg-[#FBF7F0] p-4 text-xs space-y-3 font-light">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between font-serif text-sm font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="inline-flex items-center gap-1.5">
          <Info className="w-4 h-4 text-[#9E7F3C]" /> Transparent Atelier Price Breakdown
        </span>
        <ChevronDown
          className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="pt-3 border-t border-[#E6DFD3] space-y-2.5">
          {breakdown.breakdownItems.map((item, idx) => {
            const isSubtotalOrTotal = item.label === "Subtotal" || item.label.startsWith("GST");
            return (
              <div
                key={idx}
                className={`flex justify-between items-center py-1 ${
                  isSubtotalOrTotal
                    ? "font-medium text-[#241F1B] border-t border-[#E6DFD3]/60 pt-2"
                    : "text-[#6E6459]"
                }`}
              >
                <span>{item.label}</span>
                <span className="font-mono text-[#241F1B] font-medium">{item.formattedINR}</span>
              </div>
            );
          })}

          <div className="pt-2 border-t border-[#C9A961]/40 flex justify-between items-center text-sm font-serif font-medium text-[#241F1B]">
            <span>Total Indicative Value</span>
            <span className="font-mono text-[#9E7F3C] font-semibold text-base">
              {breakdown.formattedTotalINR}
            </span>
          </div>

          <div className="pt-2 text-[10px] text-[#6E6459] leading-relaxed italic flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-[#9E7F3C] shrink-0" />
            <span>
              Indicative of today's 24K gold rate ({breakdown.formattedTotalINR}). Confirmed at the time of order booking.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
