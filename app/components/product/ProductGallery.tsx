"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({
  images,
  productName,
}) => {
  // Ensure we have at least 1 image
  const galleryImages = images.length > 0 ? images : ["/images/elara-solitaire-main.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [touchStart, setTouchStart] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (diff > 50 && activeIndex < galleryImages.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (diff < -50 && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
    setTouchStart(null);
  };

  return (
    <div className="w-full space-y-4">
      {/* Main Image Container with 2x Hover Zoom on Desktop */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full aspect-[4/5] sm:aspect-square max-h-[640px] bg-[#FAF7F0] border border-[#E6DFD3] overflow-hidden group cursor-crosshair select-none"
      >
        {galleryImages.map((src, idx) => (
          <div
            key={src + idx}
            className={`absolute inset-0 transition-opacity duration-200 ease-in-out ${
              activeIndex === idx ? "opacity-100 z-10" : "opacity-0 pointer-events-none z-0"
            }`}
          >
            <Image
              src={src}
              alt={`${productName} — View ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
              className={`object-cover object-center transition-transform duration-200 ease-out ${
                isZooming && activeIndex === idx ? "hidden lg:block lg:scale-[2.0]" : "scale-100"
              }`}
              style={
                isZooming && activeIndex === idx
                  ? {
                      transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    }
                  : undefined
              }
            />
          </div>
        ))}

        {/* Mobile Swipe Pagination Dots */}
        {galleryImages.length > 1 && (
          <div className="absolute bottom-4 inset-x-0 z-20 flex justify-center items-center gap-1.5 sm:hidden pointer-events-none">
            {galleryImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === idx ? "w-6 bg-[#C9A961]" : "w-1.5 bg-[#E6DFD3]/80"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop & Tablet Click-to-Swap Thumbnails */}
      {galleryImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 pt-1">
          {galleryImages.map((src, idx) => {
            const isSelected = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                className={`relative aspect-square bg-[#FAF7F0] border transition-all duration-200 overflow-hidden focus:outline-none ${
                  isSelected
                    ? "border-[#C9A961] ring-1 ring-[#C9A961]"
                    : "border-[#E6DFD3] opacity-70 hover:opacity-100 hover:border-[#9E7F3C]"
                }`}
                aria-label={`Switch to gallery photo ${idx + 1}`}
              >
                <Image
                  src={src}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  sizes="120px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
