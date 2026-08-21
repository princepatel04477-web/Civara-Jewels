"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, X, Download, MessageCircle, Check } from "lucide-react";

interface RingSizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  productName?: string;
}

export const RingSizeSelector: React.FC<RingSizeSelectorProps> = ({
  selectedSize,
  onSelectSize,
  productName = "Solitaire Ring",
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // Default half-size increments from 3 to 15 (per civara-admin.md)
  const defaultSizes = [
    "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
    "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5",
    "13", "13.5", "14", "14.5", "15"
  ];

  const [sizes, setSizes] = useState<string[]>(defaultSizes);

  useEffect(() => {
    fetch("/api/admin/inventory/ring-sizes")
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.sizes) && data.sizes.length > 0) {
          setSizes(data.sizes);
        }
      })
      .catch(() => {});
  }, []);

  const handleRequestSizerWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Civara Jewels, I would like to request a complimentary ring sizing kit for the ${productName}.`
    );
    window.open(`https://wa.me/919999900000?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full space-y-3">
      {/* Header Row: Label, Selected Badge & Guide Link */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.16em] text-[11px] text-[#6E6459] font-medium">
            Ring Size:
          </span>
          <span className="font-serif text-sm font-medium text-[#241F1B]">
            Size {selectedSize}
          </span>
          <span className="text-[10px] text-[#9E7F3C] font-normal pl-1">
            (Same price all sizes)
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="text-[11px] text-[#9E7F3C] hover:underline inline-flex items-center gap-1"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Size Guide
        </button>
      </div>

      {/* Grid of half-sizes (3, 3.5, 4, ... 15) */}
      <div className="flex flex-wrap gap-1.5 sm:gap-2 max-h-36 overflow-y-auto p-1.5 border border-[#E6DFD3]/60 bg-[#FAF7F0]/60">
        {sizes.map((size) => {
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`min-w-[42px] h-9 px-2 text-xs flex items-center justify-center border transition-all ${
                isSelected
                  ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium shadow-sm"
                  : "border-[#E6DFD3] bg-[#FAF7F0] text-[#241F1B] hover:border-[#9E7F3C]"
              }`}
              title={`Ring Size ${size} (Crafted to order)`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Size Guide Modal */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181412]/75 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#C9A961]/40 p-6 sm:p-8 shadow-2xl text-[#241F1B] space-y-5">
            <button
              onClick={() => setIsGuideOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6E6459] hover:text-[#241F1B]"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                Civara Atelier Service
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
                Ring Sizing & Fit Guide
              </h3>
            </div>

            <div className="space-y-3 text-xs font-light text-[#6E6459] leading-relaxed">
              <p>
                Our rings are handcrafted in half-size increments from <strong>Size 3 to Size 15</strong>. All ring sizes carry the exact same price. We offer <strong>one complimentary resizing</strong> within the first year of ownership.
              </p>

              <div className="border border-[#E6DFD3] bg-[#F4EDE2]/40 p-4 space-y-2">
                <div className="font-medium text-[#241F1B] text-xs">Standard Conversion Reference:</div>
                <div className="grid grid-cols-3 gap-2 text-[11px] text-[#241F1B]">
                  <div>Size 5 $\approx$ 15.7mm</div>
                  <div>Size 6 $\approx$ 16.5mm</div>
                  <div>Size 7 $\approx$ 17.3mm</div>
                  <div>Size 8 $\approx$ 18.2mm</div>
                  <div>Size 10 $\approx$ 19.8mm</div>
                  <div>Size 12 $\approx$ 21.4mm</div>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <a
                  href="/Civara-Ring-Size-Guide.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-[#C9A961] text-[#9E7F3C] py-3 text-center text-xs uppercase tracking-wider hover:bg-[#C9A961] hover:text-[#FAF7F0] transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Printable PDF Guide
                </a>

                <button
                  type="button"
                  onClick={handleRequestSizerWhatsApp}
                  className="flex-1 bg-[#241F1B] text-[#C9A961] py-3 text-center text-xs uppercase tracking-wider hover:bg-[#181412] transition-colors inline-flex items-center justify-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Request Sizing Kit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
