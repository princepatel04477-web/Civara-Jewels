"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageVeil } from "../components/motion/ImageVeil";
import { ImageSlot } from "../components/ImageSlot";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(window.scrollY / total);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="w-full relative">
      {/* Scroll-linked vertical gold hairline in left gutter */}
      <div className="hidden lg:block fixed left-8 top-32 bottom-32 w-[1px] bg-[#E6DFD3] z-20 pointer-events-none">
        <div
          className="w-full bg-[#C9A961] transition-all duration-75"
          style={{ height: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Hero Opening Statement */}
      <section className="py-24 lg:py-36 px-6 lg:px-20 max-w-5xl mx-auto text-center">
        <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium mb-6">
          Civara Atelier
        </div>
        <LineReveal
          as="h1"
          text="We craft jewellery that lives with the body — quiet, hallmarked, and made to outlast us."
          className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] text-[#241F1B]"
        />
        <RuleDraw color="gold" className="w-24 mx-auto my-8" delayMs={400} />
      </section>

      {/* Story in Two Columns */}
      <section className="py-20 px-6 lg:px-20 bg-[#F4EDE2] border-y border-[#E6DFD3]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ImageVeil className="h-[460px] sm:h-[500px] lg:h-[520px] bg-porcelain border border-[#E6DFD3] rounded-sm overflow-hidden shadow-sm">
            <ImageSlot
              src="/images/atelier/artisan-bench.png"
              placeholderText="Goldsmith at the workbench with loupe"
              alt="Civara Atelier Master Goldsmith at the Workbench"
            />
          </ImageVeil>

          <div className="space-y-6">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Founding Story
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
              Built on restraint and proportion
            </h2>
            <p className="text-sm lg:text-base font-light leading-relaxed text-[#6E6459]">
              Civara Jewels was founded with a single conviction: fine jewellery should be measured not by weight or excessive ornamentation, but by balance, tactile grace, and emotional resonance.
            </p>
            <p className="text-sm lg:text-base font-light leading-relaxed text-[#6E6459]">
              Every piece begins as a quiet conversation between form and metal. We work exclusively in recycled 18-karat gold and certified natural gemstones, ensuring every commission leaves our bench as a timeless heirloom.
            </p>
          </div>
        </div>
      </section>

      {/* Materials & Sourcing */}
      <section className="py-24 px-6 lg:px-20 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
            Materials & Integrity
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-medium text-[#241F1B]">
            Recycled gold & certified stones
          </h2>
          <p className="text-sm font-light leading-relaxed text-[#6E6459]">
            Uncompromised purity verified by independent hallmarking laboratories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#F4EDE2] p-8 border border-[#E6DFD3] space-y-4">
            <div className="font-serif text-2xl font-medium text-[#241F1B]">
              18k Recycled Gold
            </div>
            <p className="text-xs font-light leading-relaxed text-[#6E6459]">
              All gold used at Civara is 100% recycled and BIS hallmarked. Our custom alloy blend provides a warm, soft honey luster that flatters every skin tone.
            </p>
          </div>

          <div className="bg-[#F4EDE2] p-8 border border-[#E6DFD3] space-y-4">
            <div className="font-serif text-2xl font-medium text-[#241F1B]">
              GIA / IGI Diamonds
            </div>
            <p className="text-xs font-light leading-relaxed text-[#6E6459]">
              Every solitaire diamond above 0.30 carats is accompanied by an official GIA or IGI grading certificate detailing cut, color, clarity, and ethical provenance.
            </p>
          </div>

          <div className="bg-[#F4EDE2] p-8 border border-[#E6DFD3] space-y-4">
            <div className="font-serif text-2xl font-medium text-[#241F1B]">
              Master Bench Work
            </div>
            <p className="text-xs font-light leading-relaxed text-[#6E6459]">
              A single senior goldsmith works on your piece from initial setting to final hand-polishing over 2 to 3 weeks. No assembly lines, no mass production.
            </p>
          </div>
        </div>
      </section>

      {/* Closing Invitation */}
      <section className="bg-[#241F1B] text-[#FBF7F0] py-20 px-6 lg:px-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-xs uppercase tracking-[0.3em] text-[#C9A961]">
            Custom Atelier Commissions
          </div>
          <h2 className="font-serif text-3xl lg:text-4xl font-medium">
            Commission a piece of your own imagining
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#E6DFD3] leading-relaxed">
            Collaborate directly with our master goldsmiths to create a bespoke solitaire ring, ceremonial necklace, or personalized heirloom.
          </p>
          <div className="pt-2">
            <Link
              href="/bespoke"
              className="inline-flex items-center gap-2 bg-[#C9A961] text-[#241F1B] px-9 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#9E7F3C] hover:text-[#FBF7F0] transition-colors"
            >
              Explore Bespoke Journey <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
