"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, FileCheck, ChevronRight, X, ExternalLink } from "lucide-react";
import Image from "next/image";

interface CertificationStripProps {
  hallmark?: string;
  lab?: "GIA" | "IGI" | "GIA & IGI" | "Atelier Certified";
  certNumber?: string;
  productName?: string;
}

export const CertificationStrip: React.FC<CertificationStripProps> = ({
  hallmark = "BIS 750 (18K)",
  lab = "GIA",
  certNumber = "GIA-24891048",
  productName = "Elara Solitaire Ring",
}) => {
  const [modalContent, setModalContent] = useState<"hallmark" | "cert" | "policy" | null>(null);

  return (
    <div className="w-full border-t border-b border-[#E6DFD3] divide-y divide-[#E6DFD3]/60 bg-[#FAF7F0]/40 text-xs">
      {/* Row 1: Hallmark */}
      <button
        type="button"
        onClick={() => setModalContent("hallmark")}
        className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-[#F4EDE2]/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <Award className="w-4 h-4 text-[#9E7F3C] shrink-0" />
          <span className="font-serif text-sm font-medium text-[#241F1B]">
            Hallmarked 18k Recycled Gold
          </span>
          <span className="hidden sm:inline text-[11px] text-[#6E6459]">({hallmark})</span>
        </div>
        <span className="text-[11px] text-[#9E7F3C] group-hover:underline inline-flex items-center gap-0.5">
          View Hallmark details <ChevronRight className="w-3 h-3" />
        </span>
      </button>

      {/* Row 2: Diamond Certificate */}
      <button
        type="button"
        onClick={() => setModalContent("cert")}
        className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-[#F4EDE2]/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <FileCheck className="w-4 h-4 text-[#9E7F3C] shrink-0" />
          <span className="font-serif text-sm font-medium text-[#241F1B]">
            {lab} Certified Natural Diamonds
          </span>
          <span className="hidden sm:inline text-[11px] text-[#6E6459]">({certNumber})</span>
        </div>
        <span className="text-[11px] text-[#9E7F3C] group-hover:underline inline-flex items-center gap-0.5">
          View Certificate scan <ChevronRight className="w-3 h-3" />
        </span>
      </button>

      {/* Row 3: Lifetime Service */}
      <button
        type="button"
        onClick={() => setModalContent("policy")}
        className="w-full py-3.5 px-3 flex items-center justify-between hover:bg-[#F4EDE2]/50 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-4 h-4 text-[#9E7F3C] shrink-0" />
          <span className="font-serif text-sm font-medium text-[#241F1B]">
            Lifetime Atelier Care & Inspection
          </span>
        </div>
        <span className="text-[11px] text-[#9E7F3C] group-hover:underline inline-flex items-center gap-0.5">
          View Atelier policy <ChevronRight className="w-3 h-3" />
        </span>
      </button>

      {/* Detail Modal */}
      {modalContent && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181412]/75 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#C9A961]/40 p-6 sm:p-8 shadow-2xl text-[#241F1B] space-y-4">
            <button
              onClick={() => setModalContent(null)}
              className="absolute top-4 right-4 p-2 text-[#6E6459] hover:text-[#241F1B]"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {modalContent === "hallmark" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                  Official Purity Certification
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
                  BIS 750 Hallmark Standards
                </h3>
                <p className="text-xs font-light text-[#6E6459] leading-relaxed">
                  Every creation is assayed and laser-inscribed by the Bureau of Indian Standards (BIS). The hallmark confirms exact 75.0% pure gold content (18-karat) crafted exclusively from RJC-certified recycled precious metals.
                </p>
                <div className="border border-[#E6DFD3] bg-[#F4EDE2]/50 p-4 text-xs space-y-1">
                  <div className="font-medium text-[#241F1B]">Assay Inscription: BIS 750 · CIVARA · RJC</div>
                  <div className="text-[11px] text-[#6E6459]">Verified at BIS Diamond & Precious Metal Assaying Authority, Surat</div>
                </div>
              </div>
            )}

            {modalContent === "cert" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                  Independent Gemmological Report
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
                  {lab} Grading Report ({certNumber})
                </h3>
                <p className="text-xs font-light text-[#6E6459] leading-relaxed">
                  This {productName} is accompanied by an original, laminated grading report issued by the Gemological Institute of America (GIA) or International Gemological Institute (IGI).
                </p>
                <div className="border border-[#E6DFD3] bg-[#F4EDE2]/50 p-4 space-y-2 text-xs">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div><strong>Cut:</strong> Excellent</div>
                    <div><strong>Color:</strong> E-F (Colorless)</div>
                    <div><strong>Clarity:</strong> VVS1 / VS1</div>
                    <div><strong>Fluorescence:</strong> None</div>
                  </div>
                </div>
              </div>
            )}

            {modalContent === "policy" && (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                  Atelier Guarantee
                </div>
                <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
                  Lifetime Care & Free Resizing
                </h3>
                <div className="space-y-2 text-xs font-light text-[#6E6459] leading-relaxed">
                  <p>• <strong>Free 1st-Year Resizing:</strong> One complimentary ring resizing within 12 months of delivery.</p>
                  <p>• <strong>Annual Inspection & Ultrasonic Cleaning:</strong> Free lifetime prong check, cleaning, and repolishing.</p>
                  <p>• <strong>Buyback & Upgrade Guarantee:</strong> 100% gold value and 90% diamond value exchange privilege.</p>
                </div>
              </div>
            )}

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setModalContent(null)}
                className="w-full bg-[#241F1B] text-[#C9A961] py-3 text-xs uppercase tracking-[0.2em] rounded-full hover:bg-[#181412]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
