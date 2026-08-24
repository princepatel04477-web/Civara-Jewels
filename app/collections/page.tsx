"use client";

import React from "react";
import Link from "next/link";
import { Catalog } from "../../lib/catalog";
import { ImageSlot } from "../components/ImageSlot";
import { AccordionGallery, AccordionItem } from "../components/ui/AccordionGallery";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CollectionsIndexPage() {
  const collectionsList = Object.values(Catalog.collections);

  // High-Resolution 16:9 Photography Items for AccordionGallery
  const accordionItems: AccordionItem[] = [
    {
      image: "/images/home-m-cc/Rings-m.png",
      label: "Rings",
      link: "/collections/rings",
      alt: "Civara Handcrafted Solitaires & Stacking Rings",
    },
    {
      image: "/images/home-m-cc/Necklaces-m.png",
      label: "Necklaces",
      link: "/collections/necklaces",
      alt: "Civara Liquid Diamond Tennis Strands & Collars",
    },
    {
      image: "/images/home-m-cc/earrings-m.png",
      label: "Earrings",
      link: "/collections/earrings",
      alt: "Civara Ergonomic Hoops & Diamond Drops",
    },
    {
      image: "/images/home-m-cc/bracelets-m.png",
      label: "Bracelets",
      link: "/collections/bracelets",
      alt: "Civara Hinged Bangles & Open Diamond Cuffs",
    },
    {
      image: "/images/home-m-cc/bridal-m.png",
      label: "Bridal",
      link: "/collections/bridal",
      alt: "Civara Heirloom Royal Bridal Suites & Kundan Chokers",
    },
    {
      image: "/images/home-m-cc/pendants-m.png",
      label: "Pendants",
      link: "/collections/pendants",
      alt: "Civara Geometric Diamond Cages & Constellation Lockets",
    },
  ];

  return (
    <div className="w-full bg-[#FBF7F0]">
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
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-12 lg:py-16 space-y-6">
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
            Hover or tap across the panels to reveal each high jewelry curation.
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
            height={480}
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

      {/* Curated Grid of Collections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-12 lg:py-20 border-t border-[#E6DFD3]">
        <div className="text-center space-y-2 mb-12">
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Catalog Directory
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Explore by Category
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {collectionsList.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group flex flex-col bg-[#FAF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="relative w-full aspect-[16/10] bg-[#F4EDE2] overflow-hidden">
                <ImageSlot
                  src={c.mobileCoverImage || c.coverImage}
                  placeholderText={c.heroPlaceholder}
                  alt={c.name}
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col gap-3">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#9E7F3C]">
                  {c.count} Pieces
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs font-light leading-relaxed text-[#6E6459] line-clamp-2">
                  {c.description}
                </p>
                <div className="pt-2 text-xs uppercase tracking-[0.2em] text-[#241F1B] group-hover:text-[#9E7F3C] inline-flex items-center gap-1.5 font-medium">
                  Explore {c.name} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
