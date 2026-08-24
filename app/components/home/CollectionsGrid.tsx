"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Catalog } from "../../../lib/catalog";

interface TileConfig {
  slug: string;
  name: string;
  count: number;
  image: string;
  mobileImage: string;
  desktopSpan: string;
  tabletSpan: string;
}

export const CollectionsGrid: React.FC = () => {
  const collections = Catalog.collections;

  const tiles: TileConfig[] = [
    {
      slug: collections.rings.slug,
      name: collections.rings.name,
      count: collections.rings.count,
      image: "/images/collections-portfolio/Rings-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Rings-Collection-Cover.png",
      desktopSpan: "lg:col-span-2 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
    {
      slug: collections.necklaces.slug,
      name: collections.necklaces.name,
      count: collections.necklaces.count,
      image: "/images/collections-portfolio/Necklace-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Necklace-Collection-Cover.png",
      desktopSpan: "lg:col-span-1 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
    {
      slug: collections.earrings.slug,
      name: collections.earrings.name,
      count: collections.earrings.count,
      image: "/images/collections-portfolio/Earrings-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Earrings-Collection-Cover.png",
      desktopSpan: "lg:col-span-1 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
    {
      slug: collections.bracelets.slug,
      name: collections.bracelets.name,
      count: collections.bracelets.count,
      image: "/images/collections-portfolio/Bracelets-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Bracelets-Collection-Cover.png",
      desktopSpan: "lg:col-span-2 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
    {
      slug: collections.bridal.slug,
      name: collections.bridal.name,
      count: collections.bridal.count,
      image: "/images/collections-portfolio/Bridal-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Bridal-Collection-Cover.png",
      desktopSpan: "lg:col-span-2 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
    {
      slug: collections.pendants.slug,
      name: collections.pendants.name,
      count: collections.pendants.count,
      image: "/images/collections-portfolio/Pendant-Collection-Cover.png",
      mobileImage: "/images/collections-portfolio/Pendant-Collection-Cover.png",
      desktopSpan: "lg:col-span-1 lg:row-span-1",
      tabletSpan: "md:col-span-1",
    },
  ];

  return (
    <div className="w-full">
      {/* Editorial Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 auto-rows-[minmax(280px,24vw)] max-w-7xl mx-auto">
        {tiles.map((tile) => (
          <Link
            key={tile.slug}
            href={`/collections/${tile.slug}`}
            className={`group relative block overflow-hidden bg-[#F4EDE2] border border-[#E6DFD3] hover:border-[#C9A961] transition-all duration-500 rounded-sm shadow-xs hover:shadow-md ${tile.desktopSpan} ${tile.tabletSpan} h-full min-h-[280px] max-h-[440px] lg:max-h-none`}
          >
            {/* Background Image with 1.03 scale over 600ms */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={tile.image}
                alt={`${tile.name} Collection`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center transition-transform duration-600 ease-out group-hover:scale-[1.03]"
                priority={tile.slug === "rings" || tile.slug === "bridal"}
              />
            </div>

            {/* Luxury bottom-to-top gradient scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#181412]/85 via-[#181412]/25 to-transparent pointer-events-none" />

            {/* Bottom-left label overlay, shifts up 4px on hover */}
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 z-10 transform transition-transform duration-600 ease-out group-hover:-translate-y-1">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#C9A961] font-sans font-semibold block mb-1">
                {tile.count} Curated Pieces
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-medium tracking-wide text-[#FBF7F0]">
                {tile.name}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
