"use client";

import React from "react";
import Link from "next/link";
import { Catalog } from "../lib/catalog";
import { ProductCard } from "./components/ProductCard";
import { GsapTextReveal } from "./components/motion/GsapTextReveal";
import { RuleDraw } from "./components/motion/RuleDraw";
import { ImageVeil } from "./components/motion/ImageVeil";
import { ImageSlot } from "./components/ImageSlot";
import { CollectionsGrid } from "./components/home/CollectionsGrid";
import { PressStrip } from "./components/home/PressStrip";
import { WhatsAppConcierge } from "./components/floating/WhatsAppConcierge";
import { ArrowRight, Sparkles, Award, ShieldCheck, Compass } from "lucide-react";

export default function HomePage() {
  const featuredProducts = Catalog.getFeaturedProducts(4);

  return (
    <div className="w-full">
      {/* 1. HERO (ATTENTION) - Wide 2-line layout with GSAP Text Reveal & Voice Corrections */}
      <section className="relative min-h-[78vh] sm:min-h-[85vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3] overflow-hidden">
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,169,97,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 relative z-10">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.28em] sm:tracking-[0.35em] text-[#9E7F3C] font-medium">
            Fine Jewellery Atelier · Handcrafted to Order
          </div>

          {/* GSAP Word-by-Word Reveal Headline with real spaces & accessible name */}
          <GsapTextReveal
            as="h1"
            text="Quiet solitaires and hallmarked gold heirlooms made to outlast us."
            className="font-serif text-3xl sm:text-6xl lg:text-7xl font-medium leading-[1.12] sm:leading-[1.08] text-[#241F1B] max-w-5xl mx-auto px-2"
            staggerMs={45}
          />

          <RuleDraw color="gold" className="w-20 sm:w-24 mx-auto my-3 sm:my-4" delayMs={300} />

          <p className="text-xs sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed px-3">
            Made in hallmarked 18k recycled gold. Set with certified diamonds. Every piece is made to order. Enquire, view, own.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-5 pt-2 sm:pt-4 w-full sm:w-auto max-w-xs sm:max-w-none mx-auto">
            <Link
              href="/collections"
              className="w-full sm:w-auto bg-[#241F1B] text-[#C9A961] px-8 sm:px-9 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] font-medium rounded-full hover:bg-[#181412] transition-colors text-center"
            >
              Explore Collections
            </Link>
            <Link
              href="/bespoke"
              className="w-full sm:w-auto border border-[#C9A961] text-[#9E7F3C] px-8 sm:px-9 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] font-medium rounded-full hover:bg-[#C9A961] hover:text-[#FBF7F0] transition-colors inline-flex items-center justify-center gap-2 text-center"
            >
              Bespoke Journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 2. INTEREST (BENTO COLLECTION EDITS) - Responsive Bento Grid (P1-1) */}
      <section className="py-14 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-14 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 space-y-2 sm:space-y-3">
          <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E7F3C] font-medium">
            Curated Atelier Edits
          </div>
          <GsapTextReveal
            as="h2"
            text="High Jewellery Collections"
            className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]"
          />
        </div>

        <CollectionsGrid />
      </section>

      {/* 3. FEATURED PIECES (DESIRE) - Gated Showcase with Real High-Res Photography (P0-3) */}
      {featuredProducts.length >= 4 && (
        <section className="py-14 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-14 bg-[#F4EDE2] border-y border-[#E6DFD3]">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-14 gap-3 sm:gap-6">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] text-[#9E7F3C] font-medium">
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

      {/* 4. CIVARA STUDIO TEASER with ImageVeil & Voice Corrections */}
      <section className="py-14 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-14 max-w-6xl mx-auto">
        <div className="bg-[#FBF7F0] border border-[#C9A961] p-6 sm:p-10 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center specular-sweep">
          <div className="lg:col-span-7 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#F4EDE2] border border-[#E6DFD3] text-[9.5px] sm:text-[10px] uppercase tracking-[0.22em] sm:tracking-[0.24em] text-[#9E7F3C] font-medium">
              <Sparkles className="w-3.5 h-3.5" /> Interactive Design Engine
            </div>
            <GsapTextReveal
              as="h2"
              text="Design your bespoke solitaire ring in plain words."
              className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium leading-[1.14] sm:leading-[1.12] text-[#241F1B]"
            />
            <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
              Select your silhouette, gold alloy, and diamond shape. Civara Studio drafts a sketch and technical brief for our master goldsmiths.
            </p>
            <div className="pt-2">
              <Link
                href="/studio"
                className="inline-flex items-center justify-center gap-2 bg-[#241F1B] text-[#C9A961] px-7 sm:px-8 py-3.5 sm:py-4 text-xs uppercase tracking-[0.2em] sm:tracking-[0.22em] font-medium rounded-full hover:bg-[#181412] transition-colors w-full sm:w-auto"
              >
                Enter the Studio <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5">
            <ImageVeil className="h-64 sm:h-80 bg-porcelain border border-[#E6DFD3]">
              <ImageSlot
                src="/images/home-cc/Rings-cc.png"
                placeholderText="Civara Studio Technical Render"
                alt="Civara Studio draft render"
              />
            </ImageVeil>
          </div>
        </div>
      </section>

      {/* 5. ATELIER INTEGRITY PROMISE */}
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
              Private Viewings
            </div>
            <p className="text-xs font-light text-[#E6DFD3]/80 leading-relaxed">
              Exclusively by appointment in Mumbai, Delhi, or via live virtual concierge HD.
            </p>
          </div>
        </div>
      </section>

      {/* Press / Seen-in recognition strip (P2-8) */}
      <PressStrip />

      {/* Sticky WhatsApp Concierge on Mobile */}
      <WhatsAppConcierge />
    </div>
  );
}
