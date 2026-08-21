"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Catalog, Product } from "../../lib/catalog";
import { getWishlistIds, toggleWishlistId } from "../../lib/wishlist";
import { useCurrency } from "../context/CurrencyContext";
import { ImageSlot } from "../components/ImageSlot";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { Heart, Trash2, MessageCircle, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const [savedProducts, setSavedProducts] = useState<Product[]>([]);
  const { formatPrice } = useCurrency();

  const reloadWishlist = () => {
    const ids = getWishlistIds();
    const items = ids
      .map((id) => Catalog.getProductById(id))
      .filter((p): p is Product => p !== undefined);
    setSavedProducts(items);
  };

  useEffect(() => {
    reloadWishlist();
    window.addEventListener("wishlist-updated", reloadWishlist);
    return () => window.removeEventListener("wishlist-updated", reloadWishlist);
  }, []);

  const handleRemove = (id: string) => {
    toggleWishlistId(id);
    reloadWishlist();
  };

  const combinedWhatsAppMessage = encodeURIComponent(
    `Hello Civara Jewels, I have saved the following pieces from my wishlist for a combined enquiry:\n` +
      savedProducts.map((p, idx) => `${idx + 1}. ${p.name} (${formatPrice(p.priceINR)})`).join("\n") +
      `\n\nPlease advise on availability and private viewing options.`
  );

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Saved Pieces
          </div>
          <LineReveal
            as="h1"
            text="Your Personal Wishlist"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Review your saved solitary rings, pendants, and heirlooms, or submit them together as a single combined enquiry.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-6 lg:px-20 py-16">
        {savedProducts.length === 0 ? (
          /* Invitation Empty State */
          <div className="text-center py-24 bg-[#FBF7F0] border border-[#E6DFD3] space-y-6 max-w-2xl mx-auto">
            <Heart className="w-10 h-10 text-[#C9A961] mx-auto stroke-1" />
            <p className="font-serif text-2xl font-medium text-[#241F1B]">
              Your wishlist awaits its first piece.
            </p>
            <p className="text-xs font-light text-[#6E6459] max-w-md mx-auto">
              Explore our collections to save solitaire rings, tennis necklaces, and handcrafted bangles for future consideration.
            </p>
            <div className="pt-2">
              <Link
                href="/collections"
                className="inline-flex items-center gap-2 bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors"
              >
                Explore All Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Header Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pb-6 border-b border-[#E6DFD3]">
              <div className="text-xs uppercase tracking-[0.2em] text-[#6E6459]">
                {savedProducts.length} {savedProducts.length === 1 ? "Piece Saved" : "Pieces Saved"}
              </div>
              <a
                href={`https://wa.me/919999900000?text=${combinedWhatsAppMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Enquire All via WhatsApp
              </a>
            </div>

            {/* Grid of Saved Products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FBF7F0] border border-[#E6DFD3] p-4 flex flex-col justify-between group transition-all"
                >
                  <div className="space-y-4">
                    <div className="h-72 bg-porcelain relative overflow-hidden">
                      <ImageSlot src={p.mainImage} placeholderText={p.imagePlaceholder} alt={p.name} />
                      <button
                        onClick={() => handleRemove(p.id)}
                        className="absolute top-3 right-3 p-2 bg-white/90 rounded-full text-[#6E6459] hover:text-red-600 transition-colors shadow-sm"
                        title="Remove piece"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-center space-y-1">
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F3C]">
                        {p.categoryName}
                      </div>
                      <Link
                        href={`/products/${p.id}`}
                        className="font-serif text-xl font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors block"
                      >
                        {p.name}
                      </Link>
                      <div className="font-serif text-lg text-[#6E6459]">
                        {formatPrice(p.priceINR)}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-[#E6DFD3]">
                    <Link
                      href={`/products/${p.id}`}
                      className="w-full block text-center py-2.5 text-xs uppercase tracking-[0.18em] border border-[#241F1B] text-[#241F1B] hover:bg-[#241F1B] hover:text-[#FBF7F0] transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
