"use client";

import React, { useTransition } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { FACETS } from "../../../lib/taxonomy";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

export function FilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const activeMetal = searchParams.get("metal") || "";
  const activePurity = searchParams.get("purity") || "";
  const activeStone = searchParams.get("stone") || "";
  const activeOccasion = searchParams.get("occasion") || "";
  const activeSort = searchParams.get("sort") || "featured";

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    });
  };

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(activeMetal || activePurity || activeStone || activeOccasion || activeSort !== "featured");

  return (
    <nav aria-label="Product filter and sorting controls" className="sticky top-[73px] z-30 bg-[#FBF7F0]/95 backdrop-blur-md border-y border-[#E6DFD3] transition-all">
      <div className="max-w-7xl mx-auto px-6 lg:px-20 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Left Filter Facets */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="inline-flex items-center gap-1.5 text-[#9E7F3C] font-medium uppercase tracking-[0.2em] mr-2">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Facets
          </div>

          {/* Metal Selector */}
          <select
            value={activeMetal}
            onChange={(e) => updateParam("metal", e.target.value)}
            className="bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-3 py-1.5 text-xs font-light focus:outline-none focus:border-[#C9A961] cursor-pointer hover:border-[#9E7F3C] transition-colors"
          >
            <option value="">Metal (All)</option>
            {FACETS.metals.map((m) => (
              <option key={m.slug} value={m.slug}>
                {m.label}
              </option>
            ))}
          </select>

          {/* Purity Selector */}
          <select
            value={activePurity}
            onChange={(e) => updateParam("purity", e.target.value)}
            className="bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-3 py-1.5 text-xs font-light focus:outline-none focus:border-[#C9A961] cursor-pointer hover:border-[#9E7F3C] transition-colors"
          >
            <option value="">Purity (All)</option>
            {FACETS.purities.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.label}
              </option>
            ))}
          </select>

          {/* Stone Selector */}
          <select
            value={activeStone}
            onChange={(e) => updateParam("stone", e.target.value)}
            className="bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-3 py-1.5 text-xs font-light focus:outline-none focus:border-[#C9A961] cursor-pointer hover:border-[#9E7F3C] transition-colors"
          >
            <option value="">Stone (All)</option>
            {FACETS.stones.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>

          {/* Occasion Selector */}
          <select
            value={activeOccasion}
            onChange={(e) => updateParam("occasion", e.target.value)}
            className="bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-3 py-1.5 text-xs font-light focus:outline-none focus:border-[#C9A961] cursor-pointer hover:border-[#9E7F3C] transition-colors"
          >
            <option value="">Occasion (All)</option>
            {FACETS.occasions.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-[#9E7F3C] border-b border-[#9E7F3C] ml-2 hover:text-[#241F1B] hover:border-[#241F1B] transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear Filters
            </button>
          )}
        </div>

        {/* Right Sort Controls */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">Sort:</span>
          <select
            value={activeSort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="bg-[#F4EDE2] border border-[#E6DFD3] text-[#241F1B] px-3 py-1.5 text-xs font-medium focus:outline-none focus:border-[#C9A961] cursor-pointer hover:border-[#9E7F3C] transition-colors"
          >
            {FACETS.sorts.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
}
