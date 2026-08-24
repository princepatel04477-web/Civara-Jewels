"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageSlot } from "../components/ImageSlot";
import { formatINR } from "../../lib/pricing/compute";
import {
  MessageCircle,
  CheckCircle,
  Sparkles,
  SlidersHorizontal,
  ArrowRight,
  ShieldCheck,
  Diamond,
  TrendingUp,
  RefreshCw,
} from "lucide-react";

export default function BespokePage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeStep, setActiveStep] = useState(1);

  // Live Metal Rates State
  const [metalRates, setMetalRates] = useState<{ [key: string]: number }>({
    "18 KT": 69999,
    "16 KT": 62221,
    "14 KT": 55999,
    "10 KT": 42999,
    "Silver": 26999,
  });

  useEffect(() => {
    fetch("/api/public/metal-rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.rates)) {
          const map: { [key: string]: number } = {};
          data.rates.forEach((r: any) => {
            map[r.purity] = r.rate_inr;
          });
          setMetalRates((prev) => ({ ...prev, ...map }));
        }
      })
      .catch(() => {});
  }, []);

  // Bespoke Configurator State
  const [selectedCategory, setSelectedCategory] = useState("Rings");
  const [selectedKarat, setSelectedKarat] = useState("18K");
  const [selectedTone, setSelectedTone] = useState("Yellow Gold");
  const [selectedRingSize, setSelectedRingSize] = useState("7");
  const [selectedStone, setSelectedStone] = useState("Natural GIA Diamond");
  const [selectedBudget, setSelectedBudget] = useState("₹1.5L – ₹3.5L");
  const [selectedTimeline, setSelectedTimeline] = useState("2 – 3 Weeks");

  const steps = [
    {
      num: "01",
      title: "Private Consultation",
      tagline: "The Initial Dialogue",
      desc: "Discuss your story, aesthetic preferences, metal tone, and budget with our atelier concierge in person at our private Surat atelier suites or via a 4K live video appointment.",
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
      desc: "Review a 1:1 scale wax model to test finger fit and profile height before lost-wax casting in 100% RJC-certified recycled gold.",
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

  // 6 Official Categories
  const categories = [
    { id: "Rings", label: "Rings", sub: "Solitaires & Stacking Bands (Sizes 3–15)" },
    { id: "Necklaces", label: "Necklaces", sub: "Tennis Collars & Chokers" },
    { id: "Earrings", label: "Earrings", sub: "Hoops, Drops & Studs" },
    { id: "Bracelets", label: "Bracelets", sub: "Bangles, Cuffs & Tennis Chains" },
    { id: "Bridal", label: "Bridal", sub: "Polki Suites & Ceremonial Sets" },
    { id: "Pendants", label: "Pendants", sub: "Medallions & Lockets" },
  ];

  // Karat Tiers with Official Benchmark Rates
  const karatTiers = [
    { id: "18K", label: "18K Gold", hallmark: "BIS 750", rateKey: "18 KT", defaultRate: 69999 },
    { id: "16K", label: "16K Gold", hallmark: "BIS 667", rateKey: "16 KT", defaultRate: 62221 },
    { id: "14K", label: "14K Gold", hallmark: "BIS 585", rateKey: "14 KT", defaultRate: 55999 },
    { id: "10K", label: "10K Gold", hallmark: "BIS 417", rateKey: "10 KT", defaultRate: 42999 },
    { id: "Silver", label: "Fine Silver", hallmark: "925 Silver", rateKey: "Silver", defaultRate: 26999, unit: "/ 1kg" },
    { id: "Platinum", label: "Platinum", hallmark: "PT 950", rateKey: "Platinum", defaultRate: 32000 },
  ];

  // Color / Tone Tones
  const tones = [
    { id: "Yellow Gold", label: "Yellow Gold", colorClass: "bg-[#ECC976]" },
    { id: "White Gold", label: "White Gold", colorClass: "bg-[#E6E8E8]" },
    { id: "Rose Gold", label: "Rose Gold", colorClass: "bg-[#E8AF98]" },
  ];

  // Ring Sizes (3 to 15 in 0.5 increments)
  const ringSizes = [
    "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
    "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5",
    "13", "13.5", "14", "14.5", "15"
  ];

  const stones = [
    "Natural GIA Certified Diamond",
    "Lab-Grown IGI Certified Diamond",
    "Uncut Polki & Heritage Diamond",
    "Rare Colored Gemstone (Sapphire/Emerald/Ruby)",
  ];

  const budgets = [
    "₹50,000 – ₹1.5L",
    "₹1.5L – ₹3.5L",
    "₹3.5L – ₹7.5L",
    "₹7.5L + (High Jewellery)",
  ];

  const timelines = [
    "2 – 3 Weeks (Standard Atelier)",
    "4 – 6 Weeks (Ceremonial/Wedding)",
    "Express (Under 10 Days)",
  ];

  const currentSelectedKaratObj = karatTiers.find((k) => k.id === selectedKarat) || karatTiers[0];
  const activeMetalRate = metalRates[currentSelectedKaratObj.rateKey] || currentSelectedKaratObj.defaultRate;
  const fullMetalDescription = selectedKarat === "Silver" 
    ? "Fine Silver (925)" 
    : selectedKarat === "Platinum" 
    ? "Platinum 950" 
    : `${selectedKarat} ${selectedTone} (${currentSelectedKaratObj.hallmark})`;

  const whatsappMessage = encodeURIComponent(
    `Hello Civara Atelier,\n\nI would like to commission a Bespoke Jewellery Piece with the following specifications:\n\n` +
      `• Category: ${selectedCategory}\n` +
      (selectedCategory === "Rings" ? `• Ring Size: Size ${selectedRingSize} (Indian standard)\n` : "") +
      `• Metal: ${fullMetalDescription}\n` +
      `• Benchmark Rate: ₹${formatINR(activeMetalRate).replace("₹", "")} ${currentSelectedKaratObj.unit || "/ 10g"}\n` +
      `• Stone Preference: ${selectedStone}\n` +
      `• Target Budget: ${selectedBudget}\n` +
      `• Target Timeline: ${selectedTimeline}\n\n` +
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

      {/* Live Metal Benchmark Rates Ticker Section */}
      <section className="bg-[#FAF7F0] border-b border-[#E6DFD3] py-6 px-6 lg:px-20">
        <div className="max-w-6xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-[#9E7F3C] font-semibold">
              <TrendingUp className="w-4 h-4 text-[#9E7F3C]" /> Active Atelier Benchmark Valuation Rates
            </div>
            <div className="text-[11px] text-[#6E6459] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live Transparent Pricing Standard
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {karatTiers.filter(k => k.id !== "Platinum").map((k) => {
              const rate = metalRates[k.rateKey] || k.defaultRate;
              const isSelected = selectedKarat === k.id;
              return (
                <div
                  key={k.id}
                  onClick={() => setSelectedKarat(k.id)}
                  className={`p-3.5 border transition-all cursor-pointer rounded-sm ${
                    isSelected
                      ? "border-[#C9A961] bg-[#FFFFFF] shadow-sm ring-1 ring-[#C9A961]"
                      : "border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#9E7F3C]"
                  }`}
                >
                  <div className="flex justify-between items-baseline">
                    <span className="font-serif text-sm font-semibold text-[#241F1B]">{k.label}</span>
                    <span className="text-[9px] uppercase tracking-wider text-[#9E7F3C] font-mono">{k.hallmark}</span>
                  </div>
                  <div className="text-base font-serif font-bold text-[#241F1B] mt-1">
                    ₹{formatINR(rate).replace("₹", "")}/-
                  </div>
                  <div className="text-[10px] text-[#6E6459] font-mono">per {k.unit ? "1 kg" : "10 grams"}</div>
                </div>
              );
            })}
          </div>
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
          {/* 1. Category Selection */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
                1. Commission Category
              </label>
              <span className="text-[11px] text-[#6E6459]">6 Official Collections</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {categories.map((c) => {
                const isSelected = selectedCategory === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`p-3.5 text-left border rounded-sm transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] shadow-xs ring-1 ring-[#C9A961]"
                        : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                    }`}
                  >
                    <div className="font-serif text-sm font-semibold text-[#241F1B]">{c.label}</div>
                    <div className="text-[10px] text-[#6E6459] mt-0.5">{c.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 1.1 Ring Size Selector (Visible only when Rings is selected) */}
          {selectedCategory === "Rings" && (
            <div className="p-4 bg-[#FFFFFF] border border-[#E6DFD3] space-y-3 rounded-sm">
              <div className="flex justify-between items-center">
                <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
                  Select Ring Size (Size 3 to 15 · Half Variations)
                </label>
                <span className="text-[11px] font-mono text-[#241F1B] font-bold">Selected: Size {selectedRingSize}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {ringSizes.map((s) => {
                  const isSelected = selectedRingSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedRingSize(s)}
                      className={`px-3 py-1.5 text-xs font-mono border rounded-xs transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#C9A961] bg-[#241F1B] text-[#C9A961] font-bold"
                          : "border-[#E6DFD3] bg-[#FBF7F0] text-[#241F1B] hover:border-[#9E7F3C]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Metal & Karat Selection with Live Benchmark Rates */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
                2. Precious Metal & Karat Purity (Live Rates)
              </label>
              <span className="text-[11px] font-mono text-[#9E7F3C] font-semibold">
                Rate: ₹{formatINR(activeMetalRate).replace("₹", "")} {currentSelectedKaratObj.unit || "/ 10g"}
              </span>
            </div>

            {/* Karat Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {karatTiers.map((k) => {
                const rate = metalRates[k.rateKey] || k.defaultRate;
                const isSelected = selectedKarat === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setSelectedKarat(k.id)}
                    className={`p-3 text-center border rounded-sm transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#C9A961] bg-[#FFFFFF] text-[#241F1B] font-bold shadow-xs ring-1 ring-[#C9A961]"
                        : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                    }`}
                  >
                    <div className="font-serif text-sm">{k.label}</div>
                    <div className="text-[9px] uppercase tracking-wider text-[#9E7F3C] font-mono">{k.hallmark}</div>
                    <div className="text-[11px] font-mono font-semibold text-[#241F1B] mt-1">
                      ₹{formatINR(rate).replace("₹", "")}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Gold Tone / Color Selector (Only if a Gold karat is selected) */}
            {selectedKarat !== "Silver" && selectedKarat !== "Platinum" && (
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs text-[#6E6459]">Gold Tone:</span>
                <div className="flex items-center gap-2">
                  {tones.map((t) => {
                    const isSelected = selectedTone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setSelectedTone(t.id)}
                        className={`flex items-center gap-2 px-3 py-1.5 border text-xs rounded-sm transition-all cursor-pointer ${
                          isSelected
                            ? "border-[#C9A961] bg-[#FFFFFF] font-medium text-[#241F1B] ring-1 ring-[#C9A961]"
                            : "border-[#E6DFD3] bg-[#FBF7F0] text-[#6E6459]"
                        }`}
                      >
                        <span className={`w-3 h-3 rounded-full ${t.colorClass} border border-black/10`} />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 3. Stones Preference */}
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

          {/* Brief Summary Box with Live Rate & WhatsApp Dispatch */}
          <div className="p-6 bg-[#FFFFFF] border border-[#C9A961]/40 rounded-sm space-y-4 shadow-sm">
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
                <span className="text-[#241F1B] font-medium">
                  {selectedCategory} {selectedCategory === "Rings" ? `(Size ${selectedRingSize})` : ""}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Metal & Karat</span>
                <span className="text-[#241F1B] font-medium">{fullMetalDescription}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Benchmark Rate</span>
                <span className="text-[#241F1B] font-medium">₹{formatINR(activeMetalRate).replace("₹", "")} {currentSelectedKaratObj.unit || "/ 10g"}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#9E7F3C] block font-semibold">Target Budget</span>
                <span className="text-[#241F1B] font-medium">{selectedBudget}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#6E6459]">
                <ShieldCheck className="w-4 h-4 text-[#9E7F3C]" /> Confidential atelier consultation · Verified BIS benchmark rates
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
