"use client";

import React from "react";
import { AccordionGallery, AccordionItem } from "../components/ui/AccordionGallery";
import { Sparkles } from "lucide-react";

export default function CollectionsIndexPage() {
  // High-Resolution Atelier Photography Items for AccordionGallery (Centered & Clean)
  const accordionItems: AccordionItem[] = [
    {
      image: "/images/collections-gallery/rings.jpg",
      label: "Rings",
      link: "/collections/rings",
      alt: "Civara Handcrafted Solitaires & Stacking Rings",
    },
    {
      image: "/images/collections-gallery/necklaces.jpg",
      label: "Necklaces",
      link: "/collections/necklaces",
      alt: "Civara Liquid Diamond Tennis Strands & Collars",
    },
    {
      image: "/images/collections-gallery/earrings.jpg",
      label: "Earrings",
      link: "/collections/earrings",
      alt: "Civara Ergonomic Hoops & Diamond Drops",
    },
    {
      image: "/images/collections-gallery/bracelets.jpg",
      label: "Bracelets",
      link: "/collections/bracelets",
      alt: "Civara Hinged Bangles & Open Diamond Cuffs",
    },
    {
      image: "/images/collections-gallery/bridal.jpg",
      label: "Bridal",
      link: "/collections/bridal",
      alt: "Civara Heirloom Royal Bridal Suites & Kundan Chokers",
    },
    {
      image: "/images/collections-gallery/pendants.jpg",
      label: "Pendants",
      link: "/collections/pendants",
      alt: "Civara Geometric Diamond Cages & Constellation Lockets",
    },
  ];

  return (
    <div className="w-full bg-[#FBF7F0] min-h-[85vh]">
      {/* Hero Header */}
      <section className="py-16 sm:py-20 lg:py-24 px-6 lg:px-14 text-center border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-semibold flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Civara High Jewellery
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            All Collections
          </h1>
          <div className="w-16 border-t border-[#C9A961] mx-auto my-2" />
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-2xl mx-auto">
            Discover heirlooms in hallmarked gold and certified diamonds, crafted by master artisans for quiet radiance and balance.
          </p>
        </div>
      </section>

      {/* Interactive Accordion Gallery Showcase Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-12 lg:py-20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E6DFD3] pb-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
              Interactive Atelier Showcase
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
              The Collection Portfolio
            </h2>
          </div>
          <p className="text-xs text-[#6E6459] font-light">
            Hover or tap across the panels to explore each high jewelry curation.
          </p>
        </div>

        {/* React Bits AccordionGallery Component */}
        <div className="w-full pt-2">
          <AccordionGallery
            items={accordionItems}
            defaultIndex={0}
            accentColor="#C9A961"
            overlayColor="#181412"
            textColor="#FFFFFF"
            height={520}
            gap={12}
            radius={8}
            expandRatio={0.5}
            trigger="hover"
            showLabels={true}
            grayscale={false}
            parallax={0.4}
            tilt={6}
          />
        </div>
      </section>
    </div>
  );
}
