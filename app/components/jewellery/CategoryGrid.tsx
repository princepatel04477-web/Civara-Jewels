"use client";

import React from "react";
import Link from "next/link";
import { Product } from "../../../lib/catalog";
import { ProductCard } from "../ProductCard";
import { FloatingCard } from "../motion/FloatingCard";
import { CategoryInfo } from "../../../lib/taxonomy";
import { Sparkles, MessageCircle, Calendar } from "lucide-react";

interface CategoryGridProps {
  products: Product[];
  category: CategoryInfo;
}

export function CategoryGrid({ products, category }: CategoryGridProps) {
  // EMPTY STATE: 0 Products
  if (products.length === 0) {
    return (
      <div className="py-16 space-y-16">
        {/* Commission Enquiry Panel */}
        <div className="max-w-4xl mx-auto p-10 lg:p-16 bg-[#F4EDE2] border border-[#C9A961] text-center space-y-6 specular-sweep">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FBF7F0] border border-[#E6DFD3] text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
            <Sparkles className="w-3.5 h-3.5" /> Made to Order · Bespoke Commission
          </div>

          <h3 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Commission a Bespoke {category.singularNoun}
          </h3>

          <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-xl mx-auto leading-relaxed">
            While current inventory for {category.displayName.toLowerCase()} is being handcrafted in our atelier, our goldsmiths accept custom commissions in 18K/22K gold and certified diamonds.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
            <a
              href={`https://wa.me/919876543210?text=${encodeURIComponent(
                `Hello Civara Jewels, I would like to commission a bespoke ${category.singularNoun}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors inline-flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Enquiry
            </a>
            <Link
              href="/viewings"
              className="border border-[#C9A961] text-[#9E7F3C] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#C9A961] hover:text-[#FBF7F0] transition-colors inline-flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Book Viewing
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // THIN STATE: 1 to 3 Products (2-up Editorial Layout)
  if (products.length <= 3) {
    return (
      <div className="py-12 space-y-10">
        <div className="text-center max-w-md mx-auto">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
            Limited Atelier Curation · {products.length} {products.length === 1 ? "Creation" : "Creations"}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto items-stretch">
          {products.map((product) => (
            <FloatingCard key={product.id} floatDistance={0} className="h-full">
              <ProductCard product={product} />
            </FloatingCard>
          ))}
        </div>
      </div>
    );
  }

  // STANDARD STATE: 4+ Products (3/4-Up Grid)
  return (
    <div className="py-8 sm:py-12">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-7 items-stretch">
        {products.map((product) => (
          <FloatingCard key={product.id} floatDistance={0} className="h-full">
            <ProductCard product={product} />
          </FloatingCard>
        ))}
      </div>
    </div>
  );
}
