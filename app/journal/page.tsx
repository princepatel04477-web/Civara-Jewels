"use client";

import React from "react";
import Link from "next/link";
import { Catalog } from "../../lib/catalog";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { StaggerGrid } from "../components/motion/StaggerGrid";
import { ImageSlot } from "../components/ImageSlot";
import { ArrowRight } from "lucide-react";

export default function JournalIndexPage() {
  const articles = Catalog.articles;

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Civara Journal
          </div>
          <LineReveal
            as="h1"
            text="Notes on Restraint, Craft & Gemmology"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Editorial features, stone education, and behind-the-scenes insights from our bench goldsmiths.
          </p>
        </div>
      </section>

      {/* Staggered Grid of Journal Cards */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-16">
        <StaggerGrid className="grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <Link
              key={art.slug}
              href={`/journal/${art.slug}`}
              className="group flex flex-col bg-[#FBF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all overflow-hidden"
            >
              <div className="h-64 bg-porcelain relative overflow-hidden">
                <div className="transition-transform duration-900 ease-quiet group-hover:scale-[1.04] w-full h-full">
                  <ImageSlot placeholderText={art.imagePlaceholder} alt={art.title} />
                </div>
              </div>
              <div className="p-8 flex flex-col gap-3 flex-1 justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#9E7F3C]">
                    <span>{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h2 className="font-serif text-2xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors relative inline-block">
                    {art.title}
                  </h2>
                  <p className="text-xs font-light leading-relaxed text-[#6E6459]">
                    {art.excerpt}
                  </p>
                </div>
                <div className="pt-3 border-t border-[#E6DFD3] text-xs uppercase tracking-[0.18em] text-[#241F1B] group-hover:text-[#9E7F3C] inline-flex items-center gap-1 font-medium">
                  Read Article <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </StaggerGrid>
      </section>
    </div>
  );
}
