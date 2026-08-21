import React from "react";
import { formatINR } from "../../../lib/pricing/compute";
import { isRateStale } from "../../../lib/pricing/rates";
import { Clock, ShieldCheck } from "lucide-react";

interface RateNoticeLineProps {
  gold24kRate: number;
  updatedAt: string;
  className?: string;
}

export function RateNoticeLine({ gold24kRate, updatedAt, className = "" }: RateNoticeLineProps) {
  const stale = isRateStale(updatedAt);
  const formattedDate = new Date(updatedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className={`text-[11px] font-mono text-[#6E6459] flex flex-wrap items-center gap-2 ${className}`}>
      <span className="inline-flex items-center gap-1 font-medium text-[#9E7F3C]">
        <ShieldCheck className="w-3.5 h-3.5" /> 24K Gold Rate:
      </span>
      <span className="text-[#241F1B] font-semibold">{formatINR(gold24kRate)} / 10g</span>
      <span className="text-[#E6DFD3]">·</span>
      <span className="inline-flex items-center gap-1">
        <Clock className="w-3 h-3 text-[#6E6459]" /> Updated {formattedDate}
      </span>
      {stale && (
        <span className="text-[#9E7F3C] font-medium bg-[#F4EDE2] px-2 py-0.5 border border-[#E6DFD3]">
          Indicative (rate &gt; 48h)
        </span>
      )}
    </div>
  );
}
