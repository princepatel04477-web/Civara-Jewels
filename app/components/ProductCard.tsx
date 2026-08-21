"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Product } from "../../lib/catalog";
import { useCurrency } from "../context/CurrencyContext";
import { ImageSlot } from "./ImageSlot";
import { isInWishlist, toggleWishlistId } from "../../lib/wishlist";
import { Heart } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice } = useCurrency();
  const [isSaved, setIsSaved] = useState(() => isInWishlist(product.id));
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newSaved = toggleWishlistId(product.id);
    setIsSaved(newSaved);
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="specular-sweep group flex flex-col justify-between bg-[#FBF7F0] border border-[#E6DFD3] p-3 sm:p-4 transition-all duration-300 hover:border-[#C9A961] relative h-full w-full"
    >
      {/* Save / Wishlist Toggle Button */}
      <button
        onClick={handleToggleWishlist}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 p-1.5 sm:p-2 rounded-full bg-white/85 backdrop-blur-sm text-[#9E7F3C] hover:scale-110 transition-transform shadow-xs"
        aria-label={isSaved ? "Remove from saved pieces" : "Save piece to wishlist"}
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
            isSaved ? "fill-[#C9A961] text-[#C9A961]" : "text-[#9E7F3C]"
          }`}
        />
      </button>

      {/* Porcelain photography ground with 2-angle crossfade on hover */}
      <Link href={`/products/${product.id}`} className="block w-full">
        <div className="aspect-[4/5] w-full bg-porcelain relative overflow-hidden border border-[#E6DFD3]/60">
          {/* Main Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-600 ease-quiet ${
              isHovered && product.altImage ? "opacity-0" : "opacity-100"
            }`}
          >
            <ImageSlot
              src={product.mainImage}
              placeholderText={product.imagePlaceholder}
              alt={product.name}
            />
          </div>

          {/* Secondary Alternate Angle Image */}
          {product.altImage && (
            <div
              className={`absolute inset-0 transition-opacity duration-600 ease-quiet ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <ImageSlot
                src={product.altImage}
                placeholderText={`${product.name} — alternate angle`}
                alt={`${product.name} alternate view`}
              />
            </div>
          )}
        </div>
      </Link>

      {/* Static Info - Leveled & Vertically Balanced */}
      <div className="flex flex-col flex-1 justify-between pt-2.5 sm:pt-4 text-center">
        <div className="space-y-1 flex flex-col items-center">
          <div className="text-[8.5px] sm:text-[10px] uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#9E7F3C] font-medium min-h-[14px] sm:min-h-[16px] line-clamp-1">
            {product.tagline}
          </div>
          <Link
            href={`/products/${product.id}`}
            className="font-serif text-sm sm:text-xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors min-h-[2.5rem] sm:min-h-[3.25rem] flex items-center justify-center leading-snug px-1 text-center"
          >
            {product.name}
          </Link>
        </div>
        <div className="font-serif text-xs sm:text-base text-[#6E6459] pt-1.5 sm:pt-2 mt-auto">
          {formatPrice(product.priceINR)}
        </div>
      </div>
    </div>
  );
};
