"use client";

import React, { useState } from "react";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageSlot } from "../components/ImageSlot";
import { ShieldCheck, Award, CheckCircle } from "lucide-react";

export default function CertificationPage() {
  const [activeGrade, setActiveGrade] = useState<number>(0);

  const clarityGrades = [
    { grade: "FL / IF", title: "Flawless / Internally Flawless", desc: "No inclusions visible under 10x magnification." },
    { grade: "VVS1 - VVS2", title: "Very Very Slightly Included", desc: "Microscopic inclusions extremely difficult to observe." },
    { grade: "VS1 - VS2", title: "Very Slightly Included", desc: "Civara Baseline — Minor inclusions invisible to the naked eye." },
    { grade: "SI1 - SI2", title: "Slightly Included", desc: "Noticeable inclusions under magnification." },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Proven Provenance
          </div>
          <LineReveal
            as="h1"
            text="Hallmarking & Certification"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Every Civara creation is certified by recognized independent authorities for metal purity and diamond optical grading.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 lg:px-20 py-16 space-y-20">
        {/* Hallmark Seal Graphic with Specular Sweep */}
        <div className="specular-sweep bg-[#FBF7F0] border border-[#C9A961] p-10 lg:p-14 text-center space-y-6">
          <div className="w-20 h-20 rounded-full border-2 border-[#C9A961] text-[#9E7F3C] flex items-center justify-center mx-auto bg-[#F4EDE2] shadow-inner">
            <Award className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              BIS Hallmarked Standard
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
              Bureau of Indian Standards Seal
            </h2>
            <p className="text-xs font-light text-[#6E6459] max-w-md mx-auto leading-relaxed">
              Stamped with 750 / 18K purity mark, Civara atelier logo, BIS hallmarking center logo, and unique HUID tracking code.
            </p>
          </div>
        </div>

        {/* Diamond Clarity Scale Indicator */}
        <div className="space-y-6">
          <div className="space-y-2 text-center">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Stone Selection Standard
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
              GIA / IGI Clarity Scale
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Civara selects only VVS and VS clarity diamonds for maximum brilliance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4">
            {clarityGrades.map((cg, idx) => {
              const isSelected = activeGrade === idx;
              return (
                <button
                  key={cg.grade}
                  onClick={() => setActiveGrade(idx)}
                  className={`p-6 border text-left transition-all ${
                    isSelected
                      ? "border-[#C9A961] bg-[#F4EDE2] shadow-md"
                      : "border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#9E7F3C]"
                  }`}
                >
                  <div className="font-serif text-2xl font-medium text-[#C9A961] mb-1">
                    {cg.grade}
                  </div>
                  <div className="text-xs font-medium text-[#241F1B] mb-2">{cg.title}</div>
                  <p className="text-[11px] font-light text-[#6E6459] leading-relaxed">{cg.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* What Arrives in the Box */}
        <div className="bg-[#F4EDE2] p-8 lg:p-12 border border-[#E6DFD3] space-y-6">
          <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
            What Arrives in the Box
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs font-light text-[#6E6459]">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>Handcrafted mahogany presentation box with velvet suede lining.</div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>Original GIA or IGI grading dossier card for main stones.</div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>BIS Hallmark Certificate of Purity & Authenticity.</div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>Civara Lifetime Care & Maintenance Card with unique piece ID.</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
