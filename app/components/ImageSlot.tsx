"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ImageSlotProps {
  src?: string;
  placeholderText: string;
  alt?: string;
  className?: string;
  aspectRatio?: string;
}

export const ImageSlot: React.FC<ImageSlotProps> = ({
  src,
  placeholderText,
  alt,
  className = "",
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden flex items-center justify-center group ${className}`}>
      {src && !imageError ? (
        <Image
          src={src}
          alt={alt || placeholderText}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          onError={() => setImageError(true)}
        />
      ) : (
        /* Luxury shimmer placeholder matching Civara design system */
        <div className="absolute inset-0 bg-[#FAF7F0] overflow-hidden flex flex-col items-center justify-center p-6 text-center border border-[#E6DFD3]/60">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F0] via-[#F3EBD8] to-[#FAF7F0] animate-shimmer" />
          <div className="relative z-10 space-y-1">
            <span className="font-serif text-lg font-medium text-[#241F1B]/90 tracking-wide block">
              Civara Atelier
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F3C] max-w-[200px] block">
              {placeholderText}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
