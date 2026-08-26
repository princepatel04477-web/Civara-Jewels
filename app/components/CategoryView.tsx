"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Catalog, Product, CollectionInfo } from "../../lib/catalog";
import { ProductCard } from "./ProductCard";
import { FloatingCard } from "./motion/FloatingCard";
import { GsapTextReveal } from "./motion/GsapTextReveal";
import { RuleDraw } from "./motion/RuleDraw";
import { SlidersHorizontal, ArrowUpDown, Calendar, MessageCircle } from "lucide-react";
import { WhatsAppConcierge } from "./floating/WhatsAppConcierge";

interface CategoryViewProps {
  categorySlug: string;
}

export const CategoryView: React.FC<CategoryViewProps> = ({ categorySlug }) => {
  const initialCollection = Catalog.getCollection(categorySlug);
  const initialProducts = Catalog.getProductsByCategory(categorySlug);

  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [collectionInfo, setCollectionInfo] = useState<CollectionInfo | undefined>(initialCollection);
  const [metalFilter, setMetalFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"featured" | "low-to-high" | "high-to-low">("featured");

  // Fetch live products and category details from SQLite API
  useEffect(() => {
    fetch(`/api/public/products?category=${encodeURIComponent(categorySlug)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.products) && data.products.length > 0) {
          const mapped = data.products.map((p: any) => Catalog.mapDbProductToProduct(p));
          setProducts(mapped);
        }
      })
      .catch(() => {});

    fetch("/api/public/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.categories)) {
          const matched = data.categories.find((c: any) => c.slug.toLowerCase() === categorySlug.toLowerCase());
          if (matched) {
            setCollectionInfo({
              slug: matched.slug,
              name: matched.name,
              tagline: "The Civara Atelier Edit",
              description: matched.description || "Explore fine jewellery in hallmarked 18-karat gold and certified diamonds.",
              count: matched.product_count || 0,
              heroPlaceholder: matched.name,
              coverImage: matched.cover_image || "/images/home-cc/Rings-cc.png",
            });
          }
        }
      })
      .catch(() => {});
  }, [categorySlug]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (metalFilter !== "all") {
      result = result.filter((p) =>
        p.metalOptions?.some((m) => m.toLowerCase().includes(metalFilter.toLowerCase()))
      );
    }
    if (sortBy === "low-to-high") {
      result.sort((a, b) => a.priceINR - b.priceINR);
    } else if (sortBy === "high-to-low") {
      result.sort((a, b) => b.priceINR - a.priceINR);
    }
    return result;
  }, [products, metalFilter, sortBy]);

  const categoryName = collectionInfo ? collectionInfo.name : categorySlug.toUpperCase();
  const tagline = collectionInfo ? collectionInfo.tagline : "Civara Edit";
  const description = collectionInfo
    ? collectionInfo.description
    : "Explore fine jewellery in hallmarked 18-karat gold and certified diamonds.";

  return (
    <div className="w-full">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-4 text-xs uppercase tracking-[0.18em] text-[#6E6459]">
        <Link href="/" className="hover:text-[#241F1B] transition-colors">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link href="/collections" className="hover:text-[#241F1B] transition-colors">
          Collections
        </Link>{" "}
        &nbsp;/&nbsp; <span className="text-[#241F1B]">{categoryName}</span>
      </div>

      {/* Category Hero Banner */}
      <section className="bg-[#F4EDE2] py-16 lg:py-24 px-6 lg:px-14 text-center border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            {tagline}
          </div>
          <GsapTextReveal
            as="h1"
            text={categoryName}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            {description}
          </p>
        </div>
      </section>

      {/* Main Catalog Listing */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-12 lg:py-16">
        {/* Filter & Sort Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 mb-10 border-b border-[#E6DFD3]">
          <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-[#6E6459]">
            <SlidersHorizontal className="w-4 h-4 text-[#9E7F3C]" />
            <span>Filter Metal:</span>
            <select
              value={metalFilter}
              onChange={(e) => setMetalFilter(e.target.value)}
              className="bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] p-2.5 text-xs cursor-pointer uppercase focus:border-[#C9A961]"
            >
              <option value="all">All Metals</option>
              <option value="yellow">Yellow Gold</option>
              <option value="white">White Gold / Platinum</option>
              <option value="rose">Rose Gold</option>
            </select>
          </div>

          <div className="flex items-center gap-3 text-xs tracking-wider uppercase text-[#6E6459]">
            <ArrowUpDown className="w-4 h-4 text-[#9E7F3C]" />
            <span>Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] p-2.5 text-xs cursor-pointer uppercase focus:border-[#C9A961]"
            >
              <option value="featured">Featured Edit</option>
              <option value="low-to-high">Price: Low to High</option>
              <option value="high-to-low">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-[#F4EDE2] border border-[#E6DFD3] space-y-3">
            <h3 className="font-serif text-2xl text-[#241F1B]">No pieces match your selected filter</h3>
            <p className="text-xs text-[#6E6459]">Try choosing a different metal filter or browse all pieces.</p>
            <button
              onClick={() => setMetalFilter("all")}
              className="mt-2 inline-block bg-[#241F1B] text-[#C9A961] px-6 py-2.5 text-xs uppercase tracking-widest"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-8 items-stretch">
            {filteredProducts.map((p) => (
              <FloatingCard key={p.id} floatDistance={0} className="h-full">
                <ProductCard product={p} />
              </FloatingCard>
            ))}
          </div>
        )}

        {/* Atelier Consultation Callout */}
        <div className="mt-20 bg-[#241F1B] text-[#FBF7F0] p-8 sm:p-12 lg:p-16 text-center space-y-6 border border-[#6E6459]/40 specular-sweep">
          <div className="text-[11px] uppercase tracking-[0.3em] text-[#C9A961]">
            Civara Private Atelier
          </div>
          <GsapTextReveal
            as="h3"
            text={`Handcrafted ${categoryName.toLowerCase()} tailored to your vision.`}
            className="font-serif text-3xl sm:text-4xl font-medium max-w-xl mx-auto leading-tight"
          />
          <p className="text-xs sm:text-sm font-light text-[#E6DFD3]/90 max-w-lg mx-auto leading-relaxed">
            Every piece is crafted to order in hallmarked 18k gold and certified diamonds by master goldsmiths. Book a private viewing or speak with our concierge.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/viewings"
              className="inline-flex items-center gap-2 bg-[#C9A961] text-[#241F1B] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#9E7F3C] hover:text-[#FBF7F0] transition-colors"
            >
              <Calendar className="w-4 h-4" /> Book a Private Viewing
            </Link>
            <a
              href={`https://wa.me/918866077237?text=Hello%20Civara%20Jewels%2C%20I%20am%20interested%20in%20the%20${encodeURIComponent(categoryName)}%20collection.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-[#C9A961] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#C9A961] hover:text-[#241F1B] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Concierge WhatsApp
            </a>
          </div>
        </div>
      </section>
      <WhatsAppConcierge />
    </div>
  );
};
