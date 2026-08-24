"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Catalog } from "../lib/catalog";
import { ProductCard } from "./components/ProductCard";
import { GsapTextReveal } from "./components/motion/GsapTextReveal";
import { RuleDraw } from "./components/motion/RuleDraw";
import { ImageVeil } from "./components/motion/ImageVeil";
import { ImageSlot } from "./components/ImageSlot";
import { CollectionsGrid } from "./components/home/CollectionsGrid";
import { PressStrip } from "./components/home/PressStrip";
import { WhatsAppConcierge } from "./components/floating/WhatsAppConcierge";
import { BookViewingDialog } from "./components/header/BookViewingDialog";
import { KineticDiamondWireframe } from "./components/ui/KineticDiamondWireframe";
import { formatINR } from "../lib/pricing/compute";
import {
  ArrowRight,
  Sparkles,
  Award,
  ShieldCheck,
  Compass,
  TrendingUp,
  MapPin,
  Video,
  CheckCircle,
  Gem,
} from "lucide-react";

export default function HomePage() {
  const featuredProducts = Catalog.getFeaturedProducts(4);
  const [isViewingOpen, setIsViewingOpen] = useState(false);

  // Live Metal Benchmark Rates State
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

  const benchmarkTiers = [
    { label: "18K Gold", hallmark: "BIS 750", rateKey: "18 KT", defaultRate: 69999 },
    { label: "16K Gold", hallmark: "BIS 667", rateKey: "16 KT", defaultRate: 62221 },
    { label: "14K Gold", hallmark: "BIS 585", rateKey: "14 KT", defaultRate: 55999 },
    { label: "10K Gold", hallmark: "BIS 417", rateKey: "10 KT", defaultRate: 42999 },
    { label: "Fine Silver", hallmark: "925 Silver", rateKey: "Silver", defaultRate: 26999, unit: "/ 1kg" },
  ];

  const quickCategories = [
    { name: "Rings", href: "/collections/rings", count: "12 pieces", icon: "💍", cover: "/images/collections-portfolio/Rings-Collection-Cover.png" },
    { name: "Necklaces", href: "/collections/necklaces", count: "8 pieces", icon: "📿", cover: "/images/collections-portfolio/Necklace-Collection-Cover.png" },
    { name: "Earrings", href: "/collections/earrings", count: "10 pieces", icon: "✨", cover: "/images/collections-portfolio/Earrings-Collection-Cover.png" },
    { name: "Bracelets", href: "/collections/bracelets", count: "6 pieces", icon: "💫", cover: "/images/collections-portfolio/Bracelets-Collection-Cover.png" },
    { name: "Bridal", href: "/collections/bridal", count: "14 pieces", icon: "👑", cover: "/images/collections-portfolio/Bridal-Collection-Cover.png" },
    { name: "Pendants", href: "/collections/pendants", count: "7 pieces", icon: "💎", cover: "/images/collections-portfolio/Pendant-Collection-Cover.png" },
  ];

  return (
    <div className="w-full bg-[#FBF7F0]">
      {/* 1. HERO (CONCEPT B: CINEMATIC FULL-WIDTH ATELIER CANVAS) */}
      <section className="relative min-h-[85vh] lg:min-h-[92vh] flex flex-col justify-between pt-16 sm:pt-24 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-14 text-center bg-[#FBF7F0] border-b border-[#E6DFD3] overflow-hidden">
        {/* Interactive 3D Kinetic Diamond Geometry & Wireframe Facets Background */}
        <KineticDiamondWireframe />

        {/* Hero Content Centerpiece */}
        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 relative z-10 my-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F4EDE2]/80 border border-[#E6DFD3] rounded-full text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.32em] text-[#9E7F3C] font-medium shadow-xs">
            <Sparkles className="w-3 h-3 text-[#C9A961]" /> Private Fine Jewellery Atelier · Surat, India
          </div>

          {/* GSAP Word-by-Word Reveal Headline */}
          <GsapTextReveal
            as="h1"
            text="Quiet solitaires and hallmarked gold heirlooms made to outlast us."
            className="font-serif text-3xl sm:text-6xl lg:text-7xl font-medium leading-[1.12] sm:leading-[1.08] text-[#241F1B] max-w-5xl mx-auto px-2"
            staggerMs={45}
          />

          <RuleDraw color="gold" className="w-20 sm:w-28 mx-auto my-3 sm:my-4" delayMs={300} />

          <p className="text-xs sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed px-3">
            Handcrafted to order in 18k recycled gold and certified natural diamonds. A single master goldsmith crafts each setting individually. Enquire, view, own.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto">
            <Link
              href="/collections"
              className="w-full sm:w-auto bg-[#241F1B] text-[#C9A961] px-8 sm:px-10 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] font-medium rounded-full hover:bg-[#181412] transition-all text-center shadow-md hover:shadow-lg"
            >
              Explore Collections
            </Link>
            <button
              onClick={() => setIsViewingOpen(true)}
              className="w-full sm:w-auto border border-[#C9A961] bg-[#FAF7F0] text-[#9E7F3C] px-8 sm:px-10 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] font-medium rounded-full hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all inline-flex items-center justify-center gap-2 text-center cursor-pointer shadow-xs"
            >
              Book Private Viewing
            </button>
            <Link
              href="/bespoke"
              className="text-xs uppercase tracking-[0.2em] text-[#241F1B] hover:text-[#9E7F3C] transition-colors inline-flex items-center gap-1.5 font-medium py-2 px-3"
            >
              Bespoke Commissions <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interactive Quick Category Jump Rail (Concept B Signature) */}
        <div className="relative z-10 mt-10 pt-6 border-t border-[#E6DFD3]/80 max-w-6xl mx-auto w-full">
          <div className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-semibold mb-3">
            Explore By Category
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
            {quickCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="group p-3 sm:p-3.5 bg-[#FFFFFF]/90 hover:bg-[#FFFFFF] border border-[#E6DFD3] hover:border-[#C9A961] transition-all duration-300 rounded-sm text-left shadow-xs hover:shadow-md flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base sm:text-lg">{cat.icon}</span>
                  <span className="text-[9px] uppercase tracking-wider text-[#9E7F3C] font-mono opacity-80 group-hover:opacity-100">
                    {cat.count}
                  </span>
                </div>
                <div className="font-serif text-sm sm:text-base font-semibold text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors mt-2">
                  {cat.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. LIVE ATELIER BENCHMARK VALUATION BAR */}
      <section className="bg-[#FAF7F0] border-b border-[#E6DFD3] py-5 px-4 sm:px-6 lg:px-14">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#F4EDE2] border border-[#C9A961] flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#9E7F3C]" />
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-[#241F1B] font-semibold flex items-center gap-2">
                Live Atelier Benchmark Rates
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <div className="text-[10.5px] text-[#6E6459] font-light">
                100% BIS Hallmarked · Daily transparent valuation standards
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 flex-1">
            {benchmarkTiers.map((b) => {
              const rate = metalRates[b.rateKey] || b.defaultRate;
              return (
                <div
                  key={b.label}
                  className="px-3 py-2 bg-[#FFFFFF] border border-[#E6DFD3] rounded-xs flex flex-col justify-center"
                >
                  <div className="flex justify-between items-baseline text-[10px] text-[#6E6459]">
                    <span className="font-medium text-[#241F1B]">{b.label}</span>
                    <span className="text-[#9E7F3C] font-mono">{b.hallmark}</span>
                  </div>
                  <div className="font-serif text-xs sm:text-sm font-bold text-[#241F1B] mt-0.5">
                    ₹{formatINR(rate).replace("₹", "")}
                    <span className="text-[9px] font-sans font-normal text-[#6E6459] ml-1">
                      {b.unit ? "/ 1kg" : "/ 10g"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. CURATED ATELIER EDITS (BENTO 2.0) */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Curated Atelier Edits
          </div>
          <GsapTextReveal
            as="h2"
            text="High Jewellery Collections"
            className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]"
          />
          <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-xl mx-auto">
            Explore our permanent high-jewellery collections, designed and crafted for generational permanence.
          </p>
        </div>

        <CollectionsGrid />
      </section>

      {/* 4. FEATURED PIECES (ATELIER SHOWCASE) */}
      {featuredProducts.length >= 4 && (
        <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-14 bg-[#F4EDE2] border-y border-[#E6DFD3]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-14 gap-3 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E7F3C] font-semibold">
                  Atelier Showcase
                </div>
                <GsapTextReveal
                  as="h2"
                  text="Featured Solitaires & Bands"
                  className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]"
                />
              </div>
              <Link
                href="/collections"
                className="text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] text-[#241F1B] border-b border-[#241F1B] pb-0.5 hover:text-[#9E7F3C] hover:border-[#9E7F3C] transition-colors font-medium whitespace-nowrap"
              >
                View Full Catalog →
              </Link>
            </div>

            {/* 2-Col Mobile Grid, 4-Col Desktop Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-7 items-stretch">
              {featuredProducts.map((product) => (
                <div key={product.id} className="h-full">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. MASTER GOLDSMITH CRAFT & STORY SECTION */}
      <section className="py-16 sm:py-24 md:py-28 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-6 relative h-[360px] sm:h-[460px] border border-[#E6DFD3] rounded-sm overflow-hidden bg-[#F4EDE2] shadow-sm">
            <ImageSlot
              src="/images/atelier/artisan-bench.png"
              placeholderText="Civara Master Goldsmith at Atelier Workbench"
              alt="Civara Master Goldsmith Handcrafting Solitaire Ring at Workbench"
              className="object-cover object-center"
            />
            <div className="absolute bottom-4 left-4 bg-[#241F1B]/90 text-[#FBF7F0] px-3.5 py-1.5 text-[10px] uppercase tracking-widest font-mono">
              Civara Atelier · Bench Goldsmithing
            </div>
          </div>

          <div className="lg:col-span-6 space-y-6">
            <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
              The Master Goldsmith's Bench
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B] leading-tight">
              One master craftsman. From molten gold to final hallmark.
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
              We reject industrial casting matrices and mass assembly lines. Every Civara heirloom is sculpted by a single master goldsmith in our Surat atelier suites—ensuring harmonious claw alignment, light-refracting galleries, and unmatched structural permanence.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-[#FFFFFF] border border-[#E6DFD3] rounded-xs space-y-1">
                <div className="text-xs font-serif font-semibold text-[#241F1B]">100% Recycled 18K Gold</div>
                <p className="text-[11px] text-[#6E6459]">RJC-certified ethical provenance with official BIS 750 laser hallmarking.</p>
              </div>
              <div className="p-4 bg-[#FFFFFF] border border-[#E6DFD3] rounded-xs space-y-1">
                <div className="text-xs font-serif font-semibold text-[#241F1B]">Microscope Stone Setting</div>
                <p className="text-[11px] text-[#6E6459]">Every diamond is seated under 20x optical zoom for flawless light reflection.</p>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
              >
                Discover The Atelier <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/craft"
                className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] hover:text-[#241F1B] font-medium"
              >
                Material Provenance →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BESPOKE COMMISSION JOURNEY BANNER */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 bg-[#F4EDE2] border-y border-[#E6DFD3]">
        <div className="max-w-6xl mx-auto bg-[#FAF7F0] border border-[#C9A961] p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center rounded-sm shadow-sm">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F4EDE2] border border-[#E6DFD3] text-[10px] uppercase tracking-[0.22em] text-[#9E7F3C] font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Custom Commissions
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium leading-[1.12] text-[#241F1B]">
              From technical gouache sketch to personal heirloom.
            </h2>
            <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
              Explore our 5-step custom commission workflow. Select your stone, precious metal karat, and ring size to generate an immediate technical brief for our atelier.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                href="/bespoke"
                className="inline-flex items-center justify-center gap-2 bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium rounded-full hover:bg-[#181412] transition-colors"
              >
                Explore Bespoke Journey <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 h-64 sm:h-80 relative border border-[#E6DFD3] rounded-sm overflow-hidden bg-[#FAF7F0]">
            <ImageSlot
              src="/images/bespoke/bespoke-step-2.webp"
              placeholderText="Hand-Drawn Jewelry Sketch"
              alt="Civara Bespoke Jewellery Gouache Sketch and Drafting Blueprint"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* 7. PRIVATE SALON & VIRTUAL VIEWING BOOKING SALON */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-14 max-w-6xl mx-auto text-center space-y-10">
        <div className="space-y-3">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
            Concierge Appointments
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
            Experience Civara in Person or in 4K Virtual HD
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-xl mx-auto">
            Book an uninterrupted, private 45-minute consultation with our senior gemmologists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {/* Salon 1: In-Person */}
          <div className="p-8 bg-[#FAF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#F4EDE2] flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#9E7F3C]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-semibold text-[#241F1B]">Private Atelier Salon</h3>
              <p className="text-xs text-[#6E6459]">Surat Private Salon, Gujarat</p>
            </div>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Inspect loose GIA diamonds under 10x gemmological loupes, try physical sample mountings, and discuss custom alloy casting over artisanal refreshments.
            </p>
            <button
              onClick={() => setIsViewingOpen(true)}
              className="w-full bg-[#241F1B] text-[#C9A961] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors rounded-xs cursor-pointer"
            >
              Book In-Person Viewing
            </button>
          </div>

          {/* Salon 2: Virtual Concierge */}
          <div className="p-8 bg-[#FAF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all rounded-sm space-y-4">
            <div className="w-10 h-10 rounded-full bg-[#F4EDE2] flex items-center justify-center">
              <Video className="w-5 h-5 text-[#9E7F3C]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-semibold text-[#241F1B]">4K Virtual Concierge</h3>
              <p className="text-xs text-[#6E6459]">Available Globally · Seamless Live Stream</p>
            </div>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Live macro-camera diamond comparisons, 3D architectural CAD reviews, and tailored stone recommendations from the comfort of your residence.
            </p>
            <button
              onClick={() => setIsViewingOpen(true)}
              className="w-full border border-[#C9A961] text-[#9E7F3C] bg-[#FFFFFF] py-3 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C9A961] hover:text-[#FBF7F0] transition-all rounded-xs cursor-pointer"
            >
              Schedule Virtual Session
            </button>
          </div>
        </div>
      </section>

      {/* 8. ATELIER INTEGRITY & PURITY PROMISE */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-14 bg-[#241F1B] text-[#FBF7F0]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 text-center">
          <div className="space-y-2.5 p-6 sm:p-8 border border-[#6E6459]/40 bg-[#181412]/50">
            <Award className="w-7 h-7 sm:w-8 sm:h-8 text-[#C9A961] mx-auto stroke-1" />
            <div className="font-serif text-lg sm:text-xl font-medium text-[#FBF7F0]">
              100% Recycled 18k Gold
            </div>
            <p className="text-xs font-light text-[#E6DFD3]/80 leading-relaxed">
              Every creation is stamped with official BIS 750 hallmark purity standards.
            </p>
          </div>

          <div className="space-y-2.5 p-6 sm:p-8 border border-[#6E6459]/40 bg-[#181412]/50">
            <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[#C9A961] mx-auto stroke-1" />
            <div className="font-serif text-lg sm:text-xl font-medium text-[#FBF7F0]">
              GIA & IGI Certified
            </div>
            <p className="text-xs font-light text-[#E6DFD3]/80 leading-relaxed">
              Independent gemmological certificates provided for all main solitaire diamonds.
            </p>
          </div>

          <div className="space-y-2.5 p-6 sm:p-8 border border-[#6E6459]/40 bg-[#181412]/50">
            <Compass className="w-7 h-7 sm:w-8 sm:h-8 text-[#C9A961] mx-auto stroke-1" />
            <div className="font-serif text-lg sm:text-xl font-medium text-[#FBF7F0]">
              Lifetime Guarantee
            </div>
            <p className="text-xs font-light text-[#E6DFD3]/80 leading-relaxed">
              Complimentary annual prong inspection, ultrasonic cleansing, and re-polishing.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Press Recognition Strip */}
      <PressStrip />

      {/* 10. Sticky WhatsApp Concierge on Mobile */}
      <WhatsAppConcierge />

      {/* Viewing Booking Dialog */}
      <BookViewingDialog isOpen={isViewingOpen} onClose={() => setIsViewingOpen(false)} />
    </div>
  );
}
