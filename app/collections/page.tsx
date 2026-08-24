import React from "react";
import Link from "next/link";
import Image from "next/image";
import { AccordionGallery, AccordionItem } from "../components/ui/AccordionGallery";
import { Sparkles } from "lucide-react";

export default function CollectionsIndexPage() {
  // Category Nav Strip with home-cc artwork covers
  const categoryCards = [
    { name: "Rings", href: "/collections/rings", count: "64 PIECES", cover: "/images/home-cc/Rings-cc.png" },
    { name: "Necklaces", href: "/collections/necklaces", count: "48 PIECES", cover: "/images/home-cc/Necklaces-cc.png" },
    { name: "Earrings", href: "/collections/earrings", count: "52 PIECES", cover: "/images/home-cc/Earrings-cc.png" },
    { name: "Bracelets", href: "/collections/bracelets", count: "31 PIECES", cover: "/images/home-cc/Bracelets-cc.png" },
    { name: "Bridal", href: "/collections/bridal", count: "27 PIECES", cover: "/images/home-cc/bridal-cc.png" },
    { name: "Pendants", href: "/collections/pendants", count: "39 PIECES", cover: "/images/home-cc/Pendants-cc.png" },
  ];

  // Curated High-Res 3:4 Portrait Collection Portfolio Photography
  const accordionItems: AccordionItem[] = [
    {
      image: "/images/collections-portfolio/Rings-Collection-Cover.webp",
      label: "Rings",
      link: "/collections/rings",
      alt: "Civara Handcrafted Solitaires & Stacking Rings",
    },
    {
      image: "/images/collections-portfolio/Necklace-Collection-Cover.webp",
      label: "Necklaces",
      link: "/collections/necklaces",
      alt: "Civara Liquid Diamond Tennis Strands & Collars",
    },
    {
      image: "/images/collections-portfolio/Earrings-Collection-Cover.webp",
      label: "Earrings",
      link: "/collections/earrings",
      alt: "Civara Ergonomic Hoops & Diamond Drops",
    },
    {
      image: "/images/collections-portfolio/Bracelets-Collection-Cover.webp",
      label: "Bracelets",
      link: "/collections/bracelets",
      alt: "Civara Hinged Bangles & Open Diamond Cuffs",
    },
    {
      image: "/images/collections-portfolio/Bridal-Collection-Cover.webp",
      label: "Bridal",
      link: "/collections/bridal",
      alt: "Civara Heirloom Royal Bridal Suites & Kundan Chokers",
    },
    {
      image: "/images/collections-portfolio/Pendant-Collection-Cover.webp",
      label: "Pendants",
      link: "/collections/pendants",
      alt: "Civara Geometric Diamond Cages & Constellation Lockets",
    },
  ];

  return (
    <div className="w-full bg-[#FBF7F0] min-h-[85vh]">
      {/* Hero Header */}
      <section className="py-14 sm:py-18 lg:py-20 px-6 lg:px-14 text-center border-b border-[#E6DFD3]">
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

      {/* Category Nav Strip (home-cc Photography) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 pt-10 pb-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {categoryCards.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group relative overflow-hidden h-28 sm:h-32 border border-[#E6DFD3] hover:border-[#C9A961] transition-all duration-500 rounded-sm text-left shadow-xs hover:shadow-xl flex flex-col justify-end p-3.5"
            >
              {/* Background home-cc photo */}
              <Image
                src={cat.cover}
                alt={cat.name}
                fill
                sizes="(max-width: 768px) 50vw, 16vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
              />
              {/* Dark luxury gradient scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#181412]/90 via-[#181412]/45 to-transparent group-hover:via-[#181412]/30 transition-colors duration-300" />

              {/* Text content */}
              <div className="relative z-10 flex flex-col justify-end">
                <div className="font-serif text-base sm:text-lg font-medium text-[#FBF7F0] group-hover:text-[#C9A961] transition-colors leading-tight">
                  {cat.name}
                </div>
                <div className="text-[9.5px] uppercase tracking-[0.2em] text-[#C9A961] font-mono font-medium mt-0.5">
                  {cat.count}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Accordion Gallery Showcase Section (Portfolio Photography) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-8 lg:py-14 space-y-6">
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
