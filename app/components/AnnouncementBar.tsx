"use client";

import React from "react";
import { useCurrency, CurrencyOption } from "../context/CurrencyContext";

export const AnnouncementBar = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="bg-[#171310] text-[#c9a45c] text-[9.5px] sm:text-[11px] tracking-[0.16em] sm:tracking-[0.26em] uppercase text-center py-2 px-3 sm:px-6 flex items-center justify-between gap-2">
      <div className="hidden sm:block w-24"></div>
      <div className="flex-1 text-center truncate">
        Pure. Precious. Perfect. — Complimentary insured shipping across India
      </div>
      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] tracking-wider text-[#bfb49c] shrink-0">
        <span className="opacity-65 hidden md:inline">Currency:</span>
        <select
          value={currency}
          onChange={(e) => setCurrency(e.target.value as CurrencyOption)}
          className="bg-transparent text-[#c9a45c] font-medium focus:outline-none cursor-pointer uppercase border-b border-[#3a332a] pb-0.5"
        >
          <option value="₹ INR" className="bg-[#171310] text-[#c9a45c]">₹ INR</option>
          <option value="$ USD" className="bg-[#171310] text-[#c9a45c]">$ USD</option>
          <option value="€ EUR" className="bg-[#171310] text-[#c9a45c]">€ EUR</option>
        </select>
      </div>
    </div>
  );
};
