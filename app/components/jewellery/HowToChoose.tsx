"use client";

import React from "react";
import { HowToChooseGuide } from "../../../lib/taxonomy";
import { RuleDraw } from "../motion/RuleDraw";
import { Compass } from "lucide-react";

interface HowToChooseProps {
  guide: HowToChooseGuide;
}

export function HowToChoose({ guide }: HowToChooseProps) {
  return (
    <section className="py-20 px-6 lg:px-20 bg-[#FFFFFF] border-y border-[#E6DFD3] my-16 specular-sweep">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            <Compass className="w-3.5 h-3.5" /> Atelier Expertise & Technical Guide
          </div>
          <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            {guide.title}
          </h3>
          <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
            {guide.intro}
          </p>
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {guide.items.map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-4 hover:border-[#C9A961] transition-colors relative group"
            >
              {/* Diagrammatic Hairline Line Art Accent */}
              <div className="w-12 h-12 border border-[#C9A961] flex items-center justify-center font-serif text-lg font-medium text-[#9E7F3C] bg-[#FFFFFF] group-hover:bg-[#C9A961] group-hover:text-[#FBF7F0] transition-colors">
                0{idx + 1}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9E7F3C] font-medium">
                  {item.subtitle}
                </div>
                <h4 className="font-serif text-xl font-medium text-[#241F1B]">
                  {item.title}
                </h4>
              </div>

              <p className="text-xs font-light text-[#6E6459] leading-relaxed">
                {item.description}
              </p>

              <div className="pt-4 border-t border-[#E6DFD3] text-[11px] font-mono text-[#9E7F3C]">
                {item.spec}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
