"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  Info, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Gem, 
  Copy, 
  Check, 
  Award
} from "lucide-react";
import { Product } from "../../../lib/catalog";
import { formatINR } from "../../../lib/pricing/compute";

interface ProductSpecsAccordionProps {
  product: Product;
  selectedMetal: string;
  selectedSize?: string;
  calculatedPricing: {
    totalPrice: number;
    metalAmount: number;
    diamondAmount: number;
    makingCharges: number;
    gstAmount: number;
    hallmarkString: string;
    rateUsed: number;
    purityLabel: string;
  };
}

export const ProductSpecsAccordion: React.FC<ProductSpecsAccordionProps> = ({
  product,
  selectedMetal,
  selectedSize = "12",
  calculatedPricing,
}) => {
  // Multiple accordion open state, with "overview" and "details" open by default (like Jared video)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    details: true,
    pricing: false,
    shipping: false,
    care: false,
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [copiedSku, setCopiedSku] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Generate clean SKU / Item #
  const itemSku = `CIV-${product.id.replace(/-/g, "").substring(0, 8).toUpperCase()}`;

  const copySku = () => {
    navigator.clipboard?.writeText(itemSku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  // Extract selected metal color & karat
  const isWhite = selectedMetal.toLowerCase().includes("white");
  const isRose = selectedMetal.toLowerCase().includes("rose");
  const metalColor = isWhite ? "White" : isRose ? "Rose" : "Yellow";
  
  let karatLabel = "18K (750)";
  if (selectedMetal.startsWith("14K")) karatLabel = "14K (585)";
  else if (selectedMetal.startsWith("16K")) karatLabel = "16K (667)";
  else if (selectedMetal.startsWith("10K")) karatLabel = "10K (417)";
  else if (selectedMetal.toLowerCase().includes("silver")) karatLabel = "925 Sterling Silver";

  // Derive diamond carat and shape
  const stoneWeight = product.stoneType?.includes("ct") 
    ? product.stoneType 
    : "1.00 CT. T.W.";

  const stoneShape = product.name.toLowerCase().includes("oval")
    ? "Oval Brilliant"
    : product.name.toLowerCase().includes("emerald")
    ? "Emerald Cut"
    : product.name.toLowerCase().includes("pear")
    ? "Pear Shaped"
    : product.name.toLowerCase().includes("cushion")
    ? "Cushion Cut"
    : "Round Brilliant";

  // Tooltip definitions
  const tooltips: Record<string, string> = {
    totalWeight: "Total Carat Weight (CT. T.W.) represents the combined weight of all diamonds set into this creation.",
    color: "F-G Color grade indicates rare, exceptional colorless to near-colorless diamond brilliance.",
    clarity: "VVS-VS clarity means the diamond is completely eye-clean with minute natural inclusions only visible under 10x microscopic magnification.",
    commitment: "Includes Civara's Lifetime Diamond Commitment: complimentary annual prong inspection, claw tightening, and authenticity guarantee.",
    stoneType: "100% genuine earth-mined or conflict-free certified fine diamonds, certified by GIA / IGI.",
    stoneShape: "The architectural cut and optical facet geometry of the diamond maximizing total internal reflection.",
    metalType: "Solid precious metal alloy refined to strict Bureau of Indian Standards (BIS) purity benchmarks.",
    goldKarat: "Karat denotes gold purity. 18K is 75.0% pure gold, 14K is 58.5% pure gold, and 10K is 41.7% pure gold.",
    hallmark: "Laser-inscribed BIS hallmark authenticating gold purity and atelier assay registration.",
    atelier: "Handcrafted to order by master goldsmiths and diamond setters in our private atelier in Surat, Gujarat.",
  };

  const handleTooltipClick = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div className="w-full border-t border-[#E6DFD3] pt-2 space-y-0 divide-y divide-[#E6DFD3]/80 font-sans text-xs">
      
      {/* 1. OVERVIEW ACCORDION */}
      <div className="py-2">
        <button
          type="button"
          onClick={() => toggleSection("overview")}
          className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
          aria-expanded={openSections.overview}
        >
          <span className="flex items-center gap-2">
            <span>Overview</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-250 ${
              openSections.overview ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.overview && (
          <div className="pb-5 pt-1 space-y-4 animate-fadeIn text-[#6E6459] text-xs sm:text-sm font-light leading-relaxed">
            <p>
              {product.description || (
                `A brilliant ${stoneShape.toLowerCase()} diamond rests within a dynamic hand-sculpted setting in this bespoke creation. Rows of even more fiery round diamonds border the silhouette to complete the regal look. Fashioned in ${selectedMetal}, the fine jewellery creation embodies timeless architectural elegance.`
              )}
            </p>

            <div className="flex items-center gap-3 pt-2 text-[11px] font-mono text-[#6E6459] border-t border-[#E6DFD3]/60">
              <span className="font-semibold text-[#241F1B]">Item #:</span>
              <span className="text-[#9E7F3C] font-medium">{itemSku}</span>
              <button
                type="button"
                onClick={copySku}
                className="inline-flex items-center gap-1 text-[10px] text-[#6E6459] hover:text-[#241F1B] transition-colors p-1 cursor-pointer"
                title="Copy Item #"
              >
                {copiedSku ? (
                  <span className="text-emerald-600 inline-flex items-center gap-1 font-sans">
                    <Check className="w-3 h-3" /> Copied
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1">
                    <Copy className="w-3 h-3" /> Copy
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. DETAILS ACCORDION (Jared / Luxury Fine Jewellery Spec Grid) */}
      <div className="py-2">
        <button
          type="button"
          onClick={() => toggleSection("details")}
          className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
          aria-expanded={openSections.details}
        >
          <span className="flex items-center gap-2">
            <span>Details</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-250 ${
              openSections.details ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.details && (
          <div className="pb-6 pt-2 space-y-6 animate-fadeIn">
            
            {/* 2A. STONE(S) SUBSECTION */}
            <div className="space-y-3">
              <div className="text-[11px] uppercase font-serif tracking-[0.2em] font-semibold text-[#241F1B] flex items-center gap-1.5 border-b border-[#E6DFD3] pb-1.5">
                <Gem className="w-3.5 h-3.5 text-[#9E7F3C]" /> Stone(s)
              </div>
              <ul className="space-y-2.5 text-xs text-[#6E6459] pl-1">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Total Weight (CT. T.W.): <strong className="text-[#241F1B] font-normal">{stoneWeight}</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "totalWeight")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Total Weight"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "totalWeight" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.totalWeight}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Color: <strong className="text-[#241F1B] font-normal">F – G (Near Colorless)</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "color")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Diamond Color"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "color" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.color}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Clarity: <strong className="text-[#241F1B] font-normal">VVS – VS (Eye-Clean)</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "clarity")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Diamond Clarity"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "clarity" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.clarity}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Lifetime Diamond Commitment: <strong className="text-[#241F1B] font-normal">Yes</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "commitment")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Lifetime Commitment"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "commitment" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.commitment}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Stone Type: <strong className="text-[#241F1B] font-normal">Natural Diamond</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "stoneType")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Stone Type"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "stoneType" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.stoneType}
                  </div>
                )}

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Stone Color: <strong className="text-[#241F1B] font-normal">Colorless / Icy White</strong>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Stone Shape: <strong className="text-[#241F1B] font-normal">{stoneShape}</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "stoneShape")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Stone Shape"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "stoneShape" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.stoneShape}
                  </div>
                )}

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Stone Class: <strong className="text-[#241F1B] font-normal">100% Natural Earth-Mined</strong>
                </li>

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Stone Setting: <strong className="text-[#241F1B] font-normal">Precision Talon Claw / Micro-Prong</strong>
                </li>

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Setting Only: <strong className="text-[#241F1B] font-normal">No (Complete Finished Jewel)</strong>
                </li>
              </ul>
            </div>

            {/* 2B. METAL(S) SUBSECTION */}
            <div className="space-y-3">
              <div className="text-[11px] uppercase font-serif tracking-[0.2em] font-semibold text-[#241F1B] flex items-center gap-1.5 border-b border-[#E6DFD3] pb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#9E7F3C]" /> Metal(s)
              </div>
              <ul className="space-y-2.5 text-xs text-[#6E6459] pl-1">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Metal Type: <strong className="text-[#241F1B] font-normal">Solid Gold</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "metalType")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Metal Type"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "metalType" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.metalType}
                  </div>
                )}

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Metal Color: <strong className="text-[#241F1B] font-normal">{metalColor} Gold</strong>
                </li>

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Metal Finish: <strong className="text-[#241F1B] font-normal">{isWhite ? "High Polish Rhodium" : "Mirror Polish"}</strong>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Gold Karat: <strong className="text-[#241F1B] font-normal">{karatLabel}</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "goldKarat")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Gold Karat"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "goldKarat" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.goldKarat}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Hallmark Inscription: <strong className="text-[#241F1B] font-normal">{calculatedPricing.hallmarkString}</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "hallmark")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Hallmark"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "hallmark" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.hallmark}
                  </div>
                )}

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Estimated Net Weight: <strong className="text-[#241F1B] font-normal">{(product.netWeightG || 3.4).toFixed(2)} g (Approx)</strong>
                </li>
              </ul>
            </div>

            {/* 2C. DESIGN & SIZING SUBSECTION */}
            <div className="space-y-3">
              <div className="text-[11px] uppercase font-serif tracking-[0.2em] font-semibold text-[#241F1B] flex items-center gap-1.5 border-b border-[#E6DFD3] pb-1.5">
                <Award className="w-3.5 h-3.5 text-[#9E7F3C]" /> {product.sizeType === "ring" ? "Ring Design & Sizing" : "Design & Dimensions"}
              </div>
              <ul className="space-y-2.5 text-xs text-[#6E6459] pl-1">
                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Style: <strong className="text-[#241F1B] font-normal">{product.categoryName || "Haute Joaillerie Fine Ring"}</strong>
                </li>

                {product.sizeType === "ring" && (
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Selected Size: <strong className="text-[#241F1B] font-normal">Size {selectedSize} (Standard Indian Scale 3–15)</strong>
                  </li>
                )}

                <li className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                  Shank Profile: <strong className="text-[#241F1B] font-normal">Ergonomic Comfort Fit Shank</strong>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#9E7F3C]" />
                    Atelier Origin: <strong className="text-[#241F1B] font-normal">Surat, Gujarat (India)</strong>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltipClick(e, "atelier")}
                    className="text-[#9E7F3C] hover:text-[#241F1B] p-0.5 cursor-pointer"
                    aria-label="Info on Atelier Origin"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "atelier" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-[11px] text-[#241F1B] rounded-xs animate-fadeIn">
                    {tooltips.atelier}
                  </div>
                )}
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* 3. FINANCING & TRANSPARENT PRICING ACCORDION */}
      <div className="py-2">
        <button
          type="button"
          onClick={() => toggleSection("pricing")}
          className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
          aria-expanded={openSections.pricing}
        >
          <span className="flex items-center gap-2">
            <span>Price Breakdown & Financing</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-250 ${
              openSections.pricing ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.pricing && (
          <div className="pb-5 pt-1 space-y-3 animate-fadeIn text-[#6E6459]">
            <div className="bg-[#FAF7F0] p-4 border border-[#E6DFD3] space-y-2.5">
              <div className="flex justify-between text-xs pb-1.5 border-b border-[#E6DFD3]/60">
                <span>Net Gold Value ({(product.netWeightG || 3.4).toFixed(2)}g @ ₹{calculatedPricing.rateUsed.toLocaleString("en-IN")}/10g)</span>
                <span className="font-mono text-[#241F1B] font-medium">{formatINR(calculatedPricing.metalAmount)}</span>
              </div>
              <div className="flex justify-between text-xs pb-1.5 border-b border-[#E6DFD3]/60">
                <span>Certified Diamond Value ({stoneWeight})</span>
                <span className="font-mono text-[#241F1B] font-medium">{formatINR(calculatedPricing.diamondAmount)}</span>
              </div>
              <div className="flex justify-between text-xs pb-1.5 border-b border-[#E6DFD3]/60">
                <span>Master Goldsmith Making Charges</span>
                <span className="font-mono text-[#241F1B] font-medium">{formatINR(calculatedPricing.makingCharges)}</span>
              </div>
              <div className="flex justify-between text-xs pb-1.5 border-b border-[#E6DFD3]/60">
                <span>3% Statutory GST & Hallmarking</span>
                <span className="font-mono text-[#241F1B] font-medium">{formatINR(calculatedPricing.gstAmount)}</span>
              </div>
              <div className="flex justify-between text-sm font-serif font-medium text-[#241F1B] pt-1">
                <span>Total Dynamic Value</span>
                <span className="text-[#9E7F3C] font-mono font-semibold">{formatINR(calculatedPricing.totalPrice)}</span>
              </div>
            </div>
            <p className="text-[11px] font-light leading-relaxed text-[#6E6459]">
              Every piece comes with zero hidden fees. Includes complimentary insured door delivery and GIA/IGI diamond grading dossier.
            </p>
          </div>
        )}
      </div>

      {/* 4. SHIPPING AND RETURNS ACCORDION */}
      <div className="py-2">
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
          aria-expanded={openSections.shipping}
        >
          <span className="flex items-center gap-2">
            <span>Shipping and Returns</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-250 ${
              openSections.shipping ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.shipping && (
          <div className="pb-5 pt-1 space-y-3 animate-fadeIn text-[#6E6459] text-xs font-light leading-relaxed">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#241F1B] font-medium block">Complimentary Armored Courier Delivery</strong>
                Dispatched via fully insured logistics partners (Sequel / BVC) with mandatory OTP & signature verification.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#241F1B] font-medium block">Handmade to Order Timeline</strong>
                Handcrafted from scratch in Surat within 7 to 10 business days, followed by priority 2-day express transit.
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#241F1B] font-medium block">30-Day Inspection & Exchange Policy</strong>
                Complimentary resizing or exchange in accordance with Civara's fine jewellery pledge.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. DISCLOSURES & CARE ACCORDION */}
      <div className="py-2">
        <button
          type="button"
          onClick={() => toggleSection("care")}
          className="w-full py-3.5 flex items-center justify-between text-left text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
          aria-expanded={openSections.care}
        >
          <span className="flex items-center gap-2">
            <span>Disclosures & Care</span>
          </span>
          <ChevronDown
            className={`w-4 h-4 text-[#9E7F3C] transition-transform duration-250 ${
              openSections.care ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.care && (
          <div className="pb-5 pt-1 space-y-3 animate-fadeIn text-[#6E6459] text-xs font-light leading-relaxed">
            <p>
              <strong className="text-[#241F1B] font-medium">Ethical Kimberly Process Commitment:</strong> All diamonds set into Civara jewellery are 100% ethically sourced from certified conflict-free global cutters adhering to UN Kimberly Process standards.
            </p>
            <p>
              <strong className="text-[#241F1B] font-medium">Lifetime Complimentary Care:</strong> Bring or courier your piece to our Surat Atelier anytime for complimentary ultrasonic cleaning, stone tightening, and high-lustre repolishing.
            </p>
            <p>
              <strong className="text-[#241F1B] font-medium">One Free Resizing:</strong> Includes one complimentary ring resizing within the first 12 months of purchase.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
