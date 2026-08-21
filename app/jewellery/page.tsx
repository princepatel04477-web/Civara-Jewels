import React from "react";
import Link from "next/link";
import { Metadata } from "next";
import { Taxonomy } from "../../lib/taxonomy";
import { BreadcrumbNav } from "../components/jewellery/BreadcrumbNav";
import { GsapTextReveal } from "../components/motion/GsapTextReveal";
import { FloatingCard } from "../components/motion/FloatingCard";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Fine Jewellery Categories & Collections | Civara Jewels Atelier",
  description:
    "Explore Civara Jewels' complete fine jewellery taxonomy — from hand-set solitaire rings and chokers to certified diamond bangles, polki head ornaments, and bespoke bridal parures.",
  alternates: {
    canonical: "https://civara-jewels.vercel.app/jewellery",
  },
};

export default function JewelleryIndexPage() {
  const categories = Taxonomy.getAllCategories();

  return (
    <div className="w-full bg-[#FBF7F0] min-h-screen">
      {/* Hero Header */}
      <section className="py-20 px-6 lg:px-20 border-b border-[#E6DFD3] text-center max-w-5xl mx-auto space-y-6">
        <BreadcrumbNav items={[{ name: "Jewellery Taxonomy", url: "/jewellery" }]} />

        <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
          <Sparkles className="w-3.5 h-3.5" /> Made-to-Order Atelier Taxonomy
        </div>

        <GsapTextReveal
          as="h1"
          text="The Master Fine Jewellery Index"
          className="font-serif text-4xl sm:text-6xl font-medium text-[#241F1B]"
        />

        <RuleDraw color="gold" className="w-24 mx-auto my-3" />

        <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
          Fourteen distinct categories of Indian high jewellery, handcrafted in hallmarked 18K/22K gold and GIA/IGI certified natural diamonds. Select a category to explore subcategories and atelier craft notes.
        </p>
      </section>

      {/* Editorial Grid of Categories */}
      <section className="py-20 px-6 lg:px-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, idx) => (
            <FloatingCard key={cat.slug} floatDistance={6} floatDuration={4 + (idx % 3)}>
              <Link
                href={`/jewellery/${cat.slug}`}
                className="group block relative overflow-hidden bg-[#F4EDE2] border border-[#E6DFD3] p-8 hover:border-[#C9A961] transition-all h-full min-h-[380px] flex flex-col justify-between specular-sweep shadow-sm"
              >
                {/* Background Cover Image */}
                {cat.coverImage && (
                  <div className="absolute inset-0 z-0">
                    <img
                      src={cat.coverImage}
                      alt={`${cat.displayName} Cover`}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-quiet group-hover:scale-105 opacity-20 group-hover:opacity-30"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#F4EDE2] via-[#F4EDE2]/80 to-transparent" />
                  </div>
                )}

                <div className="space-y-4 relative z-10">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
                    0{idx + 1} · {cat.subcategories.length} Subcategories
                  </div>
                  <h2 className="font-serif text-3xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                    {cat.displayName}
                  </h2>
                  <p className="text-xs font-light leading-relaxed text-[#6E6459] line-clamp-3">
                    {cat.editorialDescription}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E6DFD3] text-xs uppercase tracking-[0.2em] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] inline-flex items-center gap-1.5 relative z-10">
                  Explore {cat.displayName} <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            </FloatingCard>
          ))}
        </div>
      </section>
    </div>
  );
}
