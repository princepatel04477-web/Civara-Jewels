"use client";

import React, { useState } from "react";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";

export default function SizeGuidePage() {
  const [activeChain, setActiveChain] = useState<string | null>("18 inch");

  const ringSizes = [
    { inSize: "06", insideDia: "14.5 mm", circumference: "45.5 mm" },
    { inSize: "08", insideDia: "15.1 mm", circumference: "47.4 mm" },
    { inSize: "10", insideDia: "15.7 mm", circumference: "49.3 mm" },
    { inSize: "12", insideDia: "16.5 mm", circumference: "51.8 mm" },
    { inSize: "14", insideDia: "17.3 mm", circumference: "54.3 mm" },
    { inSize: "16", insideDia: "18.1 mm", circumference: "56.8 mm" },
    { inSize: "18", insideDia: "18.9 mm", circumference: "59.3 mm" },
    { inSize: "20", insideDia: "19.7 mm", circumference: "61.8 mm" },
    { inSize: "22", insideDia: "20.5 mm", circumference: "64.3 mm" },
    { inSize: "24", insideDia: "21.3 mm", circumference: "66.8 mm" },
    { inSize: "26", insideDia: "22.1 mm", circumference: "69.3 mm" },
  ];

  const chains = [
    { length: "14 inch", position: "Collar — sits tightly around the base of the neck." },
    { length: "16 inch", position: "Choker — falls right around the collarbone." },
    { length: "18 inch", position: "Princess — falls just below the collarbone; most popular length." },
    { length: "20 inch", position: "Matinee — rests at the top of the chest." },
    { length: "24 inch", position: "Opera — extends below the bust line." },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Atelier Utility
          </div>
          <LineReveal
            as="h1"
            text="Sizing & Fit Guide"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Standard Indian sizing references, chain length placements, and custom measurement instructions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 lg:px-20 py-16 space-y-20">
        {/* Ring Sizing Section */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Ring Sizing
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
              Indian Ring Sizes (06 – 26)
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Every Civara ring includes one complimentary resizing within the first year of ownership.
            </p>
          </div>

          <div className="overflow-x-auto border border-[#E6DFD3]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[#241F1B] uppercase tracking-wider">
                  <th className="p-4">Indian Size</th>
                  <th className="p-4">Inside Diameter</th>
                  <th className="p-4">Inside Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]">
                {ringSizes.map((r) => (
                  <tr key={r.inSize} className="hover:bg-[#F4EDE2] transition-colors">
                    <td className="p-4 font-serif text-base text-[#241F1B] font-medium">
                      Size {r.inSize}
                    </td>
                    <td className="p-4 text-[#6E6459]">{r.insideDia}</td>
                    <td className="p-4 text-[#6E6459]">{r.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Chain Length Diagram & List */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Necklace & Pendant Lengths
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
              Interactive Chain Length Guide
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Hover over a length below to highlight its placement on the mannequin bust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              {chains.map((ch) => {
                const isHovered = activeChain === ch.length;
                return (
                  <div
                    key={ch.length}
                    onMouseEnter={() => setActiveChain(ch.length)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isHovered
                        ? "border-[#C9A961] bg-[#F4EDE2] shadow-sm"
                        : "border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#9E7F3C]"
                    }`}
                  >
                    <div className="font-serif text-xl font-medium text-[#241F1B]">
                      {ch.length}
                    </div>
                    <div className="text-xs font-light text-[#6E6459] mt-1">{ch.position}</div>
                  </div>
                );
              })}
            </div>

            {/* Visual Illustrated Bust */}
            <div className="lg:col-span-5 h-80 bg-porcelain border border-[#E6DFD3] relative flex items-center justify-center p-6 text-center">
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-full border border-[#C9A961]/40 mx-auto flex items-center justify-center font-serif text-3xl text-[#C9A961] bg-[#FBF7F0]">
                  {activeChain ? activeChain.split(" ")[0] : "18"}&quot;
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-medium">
                  {activeChain || "Select a Length"}
                </div>
                <p className="text-xs font-light text-[#6E6459] max-w-xs mx-auto">
                  {chains.find((c) => c.length === activeChain)?.position}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Printable Strip & Measuring Method */}
        <div className="bg-[#F4EDE2] p-8 lg:p-12 border border-[#E6DFD3] space-y-6">
          <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
            How to Measure an Existing Ring
          </h3>
          <ol className="space-y-3 text-xs font-light text-[#6E6459] list-decimal list-inside leading-relaxed">
            <li>Select a ring that fits the intended finger comfortably.</li>
            <li>Measure the inside diameter in millimeters using a precise ruler across the center.</li>
            <li>Match your measurement to the millimeter column in our sizing chart above.</li>
            <li>If between sizes, we recommend selecting the larger size for optimal comfort.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
