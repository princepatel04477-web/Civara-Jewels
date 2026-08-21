"use client";

import React from "react";
import Link from "next/link";
import { Catalog } from "../../lib/catalog";
import { ImageSlot } from "../components/ImageSlot";
import { ArrowRight } from "lucide-react";

export default function CollectionsIndexPage() {
  const collectionsList = Object.values(Catalog.collections);

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-[#f5efe2] py-20 lg:py-28 px-6 lg:px-14 text-center border-b border-[#eadfc9]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#a8843c] font-medium">
            Civara High Jewellery
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#211c15]">
            All Collections
          </h1>
          <div className="w-16 border-t border-[#a8843c] mx-auto my-2"></div>
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#5f5748] max-w-xl mx-auto">
            Discover heirlooms in hallmarked 18-karat gold and certified diamonds, crafted by master artisans for quiet radiance and balance.
          </p>
        </div>
      </section>

      {/* Grid of Collections */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
          {collectionsList.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="group flex flex-col bg-[#faf7f0] border border-[#eadfc9] hover:border-[#a8843c] transition-all overflow-hidden shadow-sm hover:shadow-md"
            >
              <div className="relative w-full aspect-[16/10] bg-[#f5efe2] overflow-hidden">
                <ImageSlot
                  src={c.mobileCoverImage || c.coverImage}
                  placeholderText={c.heroPlaceholder}
                  alt={c.name}
                  className="object-cover object-center"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col gap-3">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#a8843c]">
                  {c.count} Pieces
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#211c15] group-hover:text-[#a8843c] transition-colors">
                  {c.name}
                </h3>
                <p className="text-xs font-light leading-relaxed text-[#5f5748] line-clamp-2">
                  {c.description}
                </p>
                <div className="pt-2 text-xs uppercase tracking-[0.2em] text-[#211c15] group-hover:text-[#a8843c] inline-flex items-center gap-1.5 font-medium">
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
