"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageSlot } from "../components/ImageSlot";
import { MessageCircle, CheckCircle, Sparkles, SlidersHorizontal, ArrowRight, ShieldCheck, Diamond } from "lucide-react";

export default function BespokePage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeStep, setActiveStep] = useState(1);

  // Bespoke Configurator State
  const [selectedCategory, setSelectedCategory] = useState("Engagement Ring");
  const [selectedMetal, setSelectedMetal] = useState("18K Yellow Gold");
  const [selectedStone, setSelectedStone] = useState("Natural GIA Diamond");
  const [selectedBudget, setSelectedBudget] = useState("₹1.5L – ₹3.5L");
  const [selectedTimeline, setSelectedTimeline] = useState("2 – 3 Weeks");

  const steps = [
    {
      num: "01",
      title: "Private Consultation",
      tagline: "The Initial Dialogue",
      desc: "Discuss your story, aesthetic preferences, metal tone, and budget with our atelier concierge in person at our private Mumbai/Delhi suites or via a 4K live video appointment.",
      image: "/images/bespoke/bespoke-step-1.webp",
      alt: "Civara Private Jewellery Consultation with Diamond Parcels",
    },
    {
      num: "02",
      title: "Concept Sketching",
      tagline: "Architectural Form & Balance",
      desc: "Our designers prepare three distinct technical hand sketches and 3D architectural renders exploring claw settings, light-channeling galleries, and finger proportions.",
      image: "/images/bespoke/bespoke-step-2.webp",
      alt: "Hand-Painted Fine Jewellery Gouache Sketch & Technical Drafting",
    },
    {
      num: "03",
      title: "Stone Selection",
      tagline: "Ethical Gemmological Assay",
      desc: "Inspect hand-selected GIA or IGI certified diamonds under 10x gemological magnification, comparing cut symmetry, fire, and natural fluorescence in daylight.",
      image: "/images/bespoke/bespoke-step-3.webp",
      alt: "Loose Certified Diamonds in Gemological Sorting Tray",
    },
    {
      num: "04",
      title: "Wax Model & Casting",
      tagline: "Tactile Fit & Proportions",
      desc: "Review a 1:1 scale wax model to test finger fit and profile height before lost-wax casting in 100% RJC-certified recycled 18-karat gold.",
      image: "/images/bespoke/bespoke-step-4.webp",
      alt: "Hand-Carved Green Jewelry Wax Model at Workbench",
    },
    {
      num: "05",
      title: "Hand-Finishing",
      tagline: "Master Bench Polish & Hallmark",
      desc: "A single master goldsmith sets every stone by microscope, applies final mirror burnishing, and has the piece officially laser-hallmarked by BIS with its unique HUID code.",
      image: "/images/bespoke/bespoke-step-5.webp",
      alt: "Master Goldsmith Hand-Finishing and Polishing 18k Gold Diamond Ring",
    },
  ];

  const categories = [
    "Engagement Ring",
    "Solitaire Stacking Band",
    "Tennis Necklace / Collar",
    "Bridal Suite",
    "Sculptural Earrings",
    "Bespoke Cuff / Bangle",
  ];

  const metals = [
    "18K Yellow Gold (BIS 750)",
    "18K White Gold (BIS 750)",
    "18K Rose Gold (BIS 750)",
    "Platinum 950",
  ];

  const stones = [
    "Natural GIA Diamond",
    "Lab-Grown IGI Diamond",
    "Uncut Polki & Heritage Diamond",
    "Colored Gemstone (Sapphire/Emerald)",
  ];

  const budgets = [
    "₹75,000 – ₹1.5L",
    "₹1.5L – ₹3.5L",
    "₹3.5L – ₹7.5L",
    "₹7.5L + (High Jewellery)",
  ];

  const timelines = [
    "2 – 3 Weeks (Standard)",
    "4 – 6 Weeks (Ceremonial)",
    "Urgent (Under 10 Days)",
  ];

  const whatsappMessage = encodeURIComponent(
    `Hello Civara Atelier,\n\nI would like to commission a Bespoke Jewellery Piece with the following specifications:\n\n` +
      `• Category: ${selectedCategory}\n` +
      `• Precious Metal: ${selectedMetal}\n` +
      `• Gemstone/Diamond: ${selectedStone}\n` +
      `• Target Budget: ${selectedBudget}\n` +
      `• Timeline: ${selectedTimeline}\n\n` +
      `Could we arrange a consultation with the master goldsmith?`
  );

  return (
    <div className="w-full bg-[#FBF7F0]">
      {/* Hero */}
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Custom Atelier Commissions
          </div>
          <LineReveal
            as="h1"
            text="From raw gold and solitary stones to personal heirlooms."
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-4" />
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-2xl mx-auto">
            Every bespoke piece at Civara is handcrafted to order over 2 to 3 weeks. A single dedicated goldsmith guides your piece from initial gouache drawing to official BIS hallmarking.
          </p>
        </div>
      </section>

      {/* 5-Step Journey Rail */}
      <section className="py-20 px-6 lg:px-20 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
            The Commission Process
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
            Five steps from intention to eternity
          </h2>
          <p className="text-xs text-[#6E6459] font-light max-w-xl mx-auto">
            Select each milestone below to discover our atelier’s meticulous creation workflow.
          </p>
        </div>

        {/* Step Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4 relative">
          {steps.map((st, idx) => {
            const isSelected = activeStep === idx + 1;
            return (
              <button
                key={st.num}
                onClick={() => setActiveStep(idx + 1)}
                className={`flex flex-col text-left p-5 border transition-all cursor-pointer rounded-sm ${
                  isSelected
                    ? "border-[#C9A961] bg-[#FAF7F0] shadow-md ring-1 ring-[#C9A961]"
                    : "border-[#E6DFD3] bg-[#FFFFFF] hover:border-[#9E7F3C] opacity-80 hover:opacity-100"
                }`}
              >
                <div
                  className={`font-serif text-2xl font-medium mb-1.5 ${
                    isSelected ? "text-[#C9A961]" : "text-[#9E7F3C]"
                  }`}
                >
                  {st.num}
                </div>
                <div className="text-xs font-medium uppercase tracking-wider text-[#241F1B]">
                  {st.title}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detail Panel */}
        <div className="bg-[#FAF7F0] border border-[#E6DFD3] p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-sm">
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EDE2] border border-[#E6DFD3] text-[10px] uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
              Milestone {steps[activeStep - 1].num} of 05
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.2em] text-[#6E6459] font-medium">
                {steps[activeStep - 1].tagline}
              </div>
              <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
                {steps[activeStep - 1].title}
              </h3>
            </div>
            <p className="text-sm font-light leading-relaxed text-[#6E6459]">
              {steps[activeStep - 1].desc}
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveStep((prev) => (prev % 5) + 1)}
                className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] hover:text-[#241F1B] inline-flex items-center gap-1.5 font-medium cursor-pointer"
              >
                Next Milestone →
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 h-[360px] sm:h-[420px] relative border border-[#E6DFD3] rounded-sm overflow-hidden bg-[#F4EDE2]">
            <ImageSlot
              src={steps[activeStep - 1].image}
              placeholderText={steps[activeStep - 1].title}
              alt={steps[activeStep - 1].alt}
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Before / After Draggable Sketch Comparison Slider */}
      <section className="py-20 px-6 lg:px-20 bg-[#F4EDE2] border-y border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
              Concept to Reality
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
              Hand sketch vs finished gold heirloom
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Drag the center divider to compare the initial bench drawing with the final polished solitaire.
            </p>
          </div>

          <div className="relative h-96 sm:h-[460px] w-full overflow-hidden select-none border border-[#E6DFD3] rounded-sm bg-[#FFFFFF] shadow-sm">
            {/* Background: Finished Piece */}
            <div className="absolute inset-0">
              <ImageSlot
                src="/images/products/aurelia/aurelia-1.jpg"
                placeholderText="Finished 18k Gold Solitaire Ring"
                alt="Civara Finished 18k Gold Solitaire Diamond Ring"
              />
              <span className="absolute bottom-5 right-5 bg-[#241F1B]/85 text-[#FBF7F0] px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-medium z-10">
                Finished 18k Solitaire
              </span>
            </div>

            {/* Foreground: Sketch (Clipped by slider width) */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden bg-[#FAF7F0] border-r border-[#C9A961]"
              style={{ width: `${sliderPos}%` }}
            >
              <div className="w-[896px] h-full relative">
                <ImageSlot
                  src="/images/bespoke/bespoke-sketch.webp"
                  placeholderText="Hand Sketch & Technical Blueprint Draft"
                  alt="Civara Hand-drawn Technical Gouache Jewelry Blueprint"
                />
                <span className="absolute bottom-5 left-5 bg-[#241F1B]/85 text-[#FBF7F0] px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-medium z-10">
                  Atelier Gouache Sketch
                </span>
              </div>
            </div>

            {/* Draggable Divider Bar */}
            <div
              className="absolute inset-y-0 w-[2px] bg-[#C9A961] cursor-ew-resize z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#C9A961] text-[#241F1B] flex items-center justify-center text-xs font-bold shadow-lg ring-2 ring-[#FFFFFF]">
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
              aria-label="Before and after sketch slider"
            />
          </div>
        </div>
      </section>

      {/* Interactive Bespoke Commission Brief Configurator */}
      <section className="py-20 px-6 lg:px-20 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold flex items-center justify-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Interactive Commission Builder
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Configure Your Custom Commission Brief
          </h2>
          <p className="text-xs font-light text-[#6E6459] max-w-xl mx-auto">
            Select your preferences below to instantly generate a structured technical brief for our master goldsmiths.
          </p>
        </div>

        <div className="bg-[#FAF7F0] border border-[#E6DFD3] p-8 lg:p-12 space-y-8 rounded-sm shadow-sm">
          {/* 1. Category */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold block">
              1. Commission Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`p-3 text-xs text-left border rounded-sm transition-all cursor-pointer ${
                    selectedCategory === c
                      ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] shadow-xs ring-1 ring-[#C9A961]"
                      : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Metal */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold block">
              2. Precious Metal Purity
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {metals.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setSelectedMetal(m)}
                  className={`p-3 text-xs text-left border rounded-sm transition-all cursor-pointer ${
                    selectedMetal === m
                      ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] shadow-xs ring-1 ring-[#C9A961]"
                      : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Stones */}
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold block">
              3. Diamond / Gemstone Preference
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {stones.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStone(s)}
                  className={`p-3 text-xs text-left border rounded-sm transition-all cursor-pointer ${
                    selectedStone === s
                      ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] shadow-xs ring-1 ring-[#C9A961]"
                      : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Budget & Timeline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold block">
                4. Target Budget Range
              </label>
              <div className="grid grid-cols-2 gap-2">
                {budgets.map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBudget(b)}
                    className={`p-2.5 text-xs text-center border rounded-sm transition-all cursor-pointer ${
                      selectedBudget === b
                        ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] ring-1 ring-[#C9A961]"
                        : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459]"
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold block">
                5. Target Delivery Timeline
              </label>
              <div className="grid grid-cols-1 gap-2">
                {timelines.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTimeline(t)}
                    className={`p-2.5 text-xs text-center border rounded-sm transition-all cursor-pointer ${
                      selectedTimeline === t
                        ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] ring-1 ring-[#C9A961]"
                        : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Brief Summary Box */}
          <div className="p-6 bg-[#FFFFFF] border border-[#C9A961]/40 rounded-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[#241F1B]">
                Bespoke Commission Summary
              </div>
              <span className="text-[10px] text-[#9E7F3C] uppercase tracking-wider font-semibold">
                Direct Atelier Dispatch
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-light text-[#6E6459]">
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Piece</span>
                <span className="text-[#241F1B] font-medium">{selectedCategory}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Metal</span>
                <span className="text-[#241F1B] font-medium">{selectedMetal}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Stone</span>
                <span className="text-[#241F1B] font-medium">{selectedStone}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Budget</span>
                <span className="text-[#241F1B] font-medium">{selectedBudget}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6E6459]">
                <ShieldCheck className="w-4 h-4 text-[#9E7F3C]" /> Confidential atelier consultation · No obligation
              </div>
              <a
                href={`https://wa.me/919999900000?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#181412] transition-colors rounded-sm cursor-pointer shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                Submit Brief via WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
