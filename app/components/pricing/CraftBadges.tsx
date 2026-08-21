import React from "react";
import { ShieldCheck, Award, Clock, Sparkles, Truck, Lock } from "lucide-react";

interface CraftBadgesProps {
  purity?: number | string;
  hasDiamonds?: boolean;
  className?: string;
}

export function CraftBadges({ purity = 18, hasDiamonds = true, className = "" }: CraftBadgesProps) {
  const hallmarkCode = purity === 22 || purity === "22" ? "BIS 916 Hallmark" : "BIS 750 Hallmark";

  return (
    <div className={`grid grid-cols-2 gap-3 p-4 bg-[#FBF7F0] border border-[#E6DFD3] text-xs ${className}`}>
      {/* BIS Hallmark */}
      <div className="flex items-center gap-2.5 p-2 bg-[#FFFFFF] border border-[#E6DFD3]/80">
        <div className="w-7 h-7 rounded-full border border-[#C9A961] flex items-center justify-center text-[#9E7F3C] shrink-0 bg-[#FBF7F0]">
          <Award className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-serif font-medium text-[#241F1B] leading-tight">{hallmarkCode}</div>
          <div className="text-[10px] text-[#6E6459] font-light">100% Pure Certified Gold</div>
        </div>
      </div>

      {/* IGI/GIA Diamond Certification */}
      {hasDiamonds && (
        <div className="flex items-center gap-2.5 p-2 bg-[#FFFFFF] border border-[#E6DFD3]/80">
          <div className="w-7 h-7 rounded-full border border-[#C9A961] flex items-center justify-center text-[#9E7F3C] shrink-0 bg-[#FBF7F0]">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="font-serif font-medium text-[#241F1B] leading-tight">IGI / GIA Certified</div>
            <div className="text-[10px] text-[#6E6459] font-light">Natural & Conflict-Free</div>
          </div>
        </div>
      )}

      {/* Made-to-Order Lead Time */}
      <div className="flex items-center gap-2.5 p-2 bg-[#FFFFFF] border border-[#E6DFD3]/80">
        <div className="w-7 h-7 rounded-full border border-[#C9A961] flex items-center justify-center text-[#9E7F3C] shrink-0 bg-[#FBF7F0]">
          <Clock className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-serif font-medium text-[#241F1B] leading-tight">Made-to-Order (3–4 Wks)</div>
          <div className="text-[10px] text-[#6E6459] font-light">Handcrafted for You</div>
        </div>
      </div>

      {/* Lifetime Service & Transit Insurance */}
      <div className="flex items-center gap-2.5 p-2 bg-[#FFFFFF] border border-[#E6DFD3]/80">
        <div className="w-7 h-7 rounded-full border border-[#C9A961] flex items-center justify-center text-[#9E7F3C] shrink-0 bg-[#FBF7F0]">
          <Truck className="w-3.5 h-3.5" />
        </div>
        <div>
          <div className="font-serif font-medium text-[#241F1B] leading-tight">Insured Express Transit</div>
          <div className="text-[10px] text-[#6E6459] font-light">Complimentary Pan-India</div>
        </div>
      </div>
    </div>
  );
}
