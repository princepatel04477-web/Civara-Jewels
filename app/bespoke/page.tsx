"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageSlot } from "../components/ImageSlot";
import { MessageCircle, CheckCircle } from "lucide-react";

export default function BespokePage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeStep, setActiveStep] = useState(1);

  const steps = [
    {
      num: "01",
      title: "Private Consultation",
      desc: "Discuss your story, aesthetic preferences, metal tone, and budget with our atelier concierge in person or via live video.",
    },
    {
      num: "02",
      title: "Concept Sketching",
      desc: "Our designers prepare three distinct technical hand sketches and 3D architectural renders exploring claw settings and proportions.",
    },
    {
      num: "03",
      title: "Stone Selection",
      desc: "Inspect hand-selected GIA/IGI certified diamonds or colored gemstones side by side under natural daylight.",
    },
    {
      num: "04",
      title: "Wax Model & Casting",
      desc: "Review a 1:1 scale wax model to test finger fit before casting in recycled 18-karat gold.",
    },
    {
      num: "05",
      title: "Hand-Finishing",
      desc: "A single master goldsmith sets every stone by hand, burnishes the gold, and applies the official BIS hallmark.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Custom Atelier Commissions
          </div>
          <LineReveal
            as="h1"
            text="From raw gold and single stones to personal heirlooms."
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-4" />
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Every bespoke piece at Civara is handcrafted to order over 2 to 3 weeks. No templates, no mass production.
          </p>
        </div>
      </section>

      {/* 5-Step Journey Rail */}
      <section className="py-20 px-6 lg:px-20 max-w-6xl mx-auto">
        <div className="text-center mb-16 space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
            The Commission Process
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
            Five steps to your bespoke piece
          </h2>
        </div>

        {/* Step Navigation Rail */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative mb-12">
          {steps.map((st, idx) => {
            const isSelected = activeStep === idx + 1;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx + 1)}
                className={`flex flex-col text-left p-6 border transition-all ${
                  isSelected
                    ? "border-[#C9A961] bg-[#F4EDE2] shadow-md"
                    : "border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#9E7F3C]"
                }`}
              >
                <div
                  className={`font-serif text-2xl font-medium mb-2 ${
                    isSelected ? "text-[#C9A961]" : "text-[#9E7F3C]"
                  }`}
                >
                  {st.num}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-[#241F1B] mb-1">
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="bg-[#F4EDE2] border border-[#E6DFD3] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 space-y-4">
            <div className="font-serif text-4xl text-[#C9A961]">
              {steps[activeStep - 1].num}
            </div>
            <h3 className="font-serif text-3xl font-medium text-[#241F1B]">
              {steps[activeStep - 1].title}
            </h3>
            <p className="text-sm font-light leading-relaxed text-[#6E6459]">
              {steps[activeStep - 1].desc}
            </p>
          </div>
          <div className="lg:col-span-8 h-80 bg-porcelain relative border border-[#E6DFD3]">
            <ImageSlot
              placeholderText={`Atelier visual for step ${steps[activeStep - 1].num}: ${steps[activeStep - 1].title}`}
            />
          </div>
        </div>
      </section>

      {/* Before / After Draggable Sketch Comparison Slider */}
      <section className="py-20 px-6 lg:px-20 bg-[#F4EDE2] border-y border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Concept to Reality
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
              Hand sketch vs finished gold piece
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Drag the divider handle to compare the initial bench draft with the final polished solitaire.
            </p>
          </div>

          <div className="relative h-96 sm:h-[450px] w-full overflow-hidden select-none border border-[#E6DFD3] bg-porcelain">
            {/* Background: Finished Piece */}
            <div className="absolute inset-0">
              <ImageSlot
                src="/images/elara-solitaire-main.jpg"
                placeholderText="Finished 18k Gold Ring"
              />
              <span className="absolute bottom-4 right-4 bg-[#241F1B]/80 text-[#FBF7F0] px-3 py-1 text-[10px] uppercase tracking-widest">
                Finished Piece
              </span>
            </div>

            {/* Foreground: Sketch (Clipped by slider width) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-[#F4EDE2]"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="w-[800px] h-full relative">
                <ImageSlot placeholderText="Hand Sketch & Technical Blueprint Draft" />
                <span className="absolute bottom-4 left-4 bg-[#241F1B]/80 text-[#FBF7F0] px-3 py-1 text-[10px] uppercase tracking-widest">
                  Atelier Sketch
                </span>
              </div>
            </div>

            {/* Draggable Divider Bar */}
            <div
              className="absolute inset-y-0 w-[2px] bg-[#C9A961] cursor-ew-resize z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C9A961] text-[#241F1B] flex items-center justify-center text-xs font-bold shadow-lg">
                ↔
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="95"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
            />
          </div>
        </div>
      </section>

      {/* Action Banner */}
      <section className="py-20 px-6 lg:px-20 text-center max-w-3xl mx-auto space-y-6">
        <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
          Begin your bespoke consultation
        </h2>
        <p className="text-xs sm:text-sm font-light text-[#6E6459]">
          Speak directly with our concierge via WhatsApp to share your inspirations, ring sizes, or custom stone requests.
        </p>
        <div className="pt-2">
          <a
            href="https://wa.me/919999900000?text=Hello%20Civara%20Jewels%2C%20I%20would%20like%20to%20start%20a%20bespoke%20commission%20enquiry."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#241F1B] text-[#C9A961] px-10 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#181412] transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            Discuss Bespoke on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}
