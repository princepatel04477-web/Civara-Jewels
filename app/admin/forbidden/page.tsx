import React from "react";
import Link from "next/link";
import { ShieldAlert, ArrowLeft } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen bg-[#241F1B] text-[#FAF7F0] flex items-center justify-center p-6 font-sans">
      <div className="max-w-md w-full text-center space-y-6 bg-[#181412] p-8 sm:p-10 border border-[#6E6459]/40 shadow-2xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#241F1B] border border-[#C9A961]/40 flex items-center justify-center text-[#C9A961]">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#C9A961] font-medium">
            403 Forbidden
          </div>
          <h1 className="font-serif text-3xl font-medium text-[#FBF7F0]">
            Restricted Atelier Console
          </h1>
          <p className="text-xs text-[#E6DFD3]/80 leading-relaxed pt-1">
            Access to the Civara Atelier administrative console is strictly restricted to authorized workstations and whitelisted IP networks.
          </p>
        </div>

        <div className="pt-4 border-t border-[#6E6459]/30">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#C9A961] text-[#241F1B] px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#9E7F3C] hover:text-[#FBF7F0] transition-colors rounded-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
