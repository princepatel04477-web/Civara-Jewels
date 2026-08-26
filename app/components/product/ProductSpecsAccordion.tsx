"use client";

import React, { useState } from "react";
import { 
  ChevronDown, 
  Info, 
  Truck, 
  RefreshCw, 
  ShieldCheck, 
  Copy, 
  Check 
} from "lucide-react";
import { Product } from "../../../lib/catalog";

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
  selectedSize = "10.0",
  calculatedPricing,
}) => {
  // Accordion state: "overview" and "details" are expanded by default (matching Jared video)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    overview: true,
    details: true,
    financing: false,
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

  // Generate clean 9-digit Item # like Jared (e.g. 790231500)
  const itemSku = `7902${(product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 100) % 90000 + 10000).toString()}00`;

  const copySku = () => {
    navigator.clipboard?.writeText(itemSku);
    setCopiedSku(true);
    setTimeout(() => setCopiedSku(false), 2000);
  };

  // Derive dynamic category and design label
  const categoryLower = (product.category || "").toLowerCase();
  const isRing = product.sizeType === "ring" || categoryLower.includes("ring");
  const isNecklace = categoryLower.includes("necklace") || categoryLower.includes("pendant") || categoryLower.includes("mangalsutra");
  const isEarring = categoryLower.includes("earring");
  const isBracelet = categoryLower.includes("bracelet") || categoryLower.includes("bangle");

  const categoryItemLabel = isRing
    ? "ring"
    : isNecklace
    ? "necklace"
    : isEarring
    ? "earrings"
    : isBracelet
    ? "bracelet"
    : "piece";

  const stoneWeightVal = product.stoneType?.includes("ct") 
    ? product.stoneType.replace(/ct/i, "").trim() 
    : "1";
  
  const stoneShape = product.name.toLowerCase().includes("oval")
    ? "Oval"
    : product.name.toLowerCase().includes("emerald")
    ? "Emerald"
    : product.name.toLowerCase().includes("pear")
    ? "Pear"
    : product.name.toLowerCase().includes("cushion")
    ? "Cushion"
    : "Round";

  const isWhite = selectedMetal.toLowerCase().includes("white");
  const isRose = selectedMetal.toLowerCase().includes("rose");
  const metalColor = isWhite ? "White" : isRose ? "Rose" : "Yellow";

  let goldKarat = "18K";
  if (selectedMetal.startsWith("14K")) goldKarat = "14K";
  else if (selectedMetal.startsWith("16K")) goldKarat = "16K";
  else if (selectedMetal.startsWith("10K")) goldKarat = "10K";
  else if (selectedMetal.toLowerCase().includes("silver")) goldKarat = "925 Silver";

  const defaultOverviewText = product.description && product.description.length > 30
    ? product.description
    : `A brilliant ${stoneShape.toLowerCase()} diamond rests within a dynamic carved center setting in this exquisite ${categoryItemLabel}. Rows of even more fiery round diamonds border the architectural silhouette to complete the regal look. Fashioned in ${selectedMetal}, the total diamond weight of the ${categoryItemLabel} is ${stoneWeightVal} carat.`;

  // Tooltip descriptions
  const tooltips: Record<string, string> = {
    totalWeight: "Total Carat Weight represents the combined weight of all diamonds set into this piece.",
    color: "Color grade 'F-G / I' indicates exceptional diamond brilliance and high light transmission.",
    clarity: "Clarity grade indicates eye-clean diamond purity inspected under 10x microscopic magnification.",
    commitment: "Civara Lifetime Diamond Commitment: complimentary annual inspection, claw tightening, and stone security.",
    stoneType: "100% natural earth-mined conflict-free diamond certified by accredited gemmological laboratories.",
    stoneShape: "The geometric optical cut of the diamond optimized for total internal light reflection.",
    metalType: "Solid gold alloy refined to exact Bureau of Indian Standards (BIS) hallmarked purities.",
    goldKarat: "Karat denotes gold purity ratio. 18K is 75% pure gold; 14K is 58.5% pure gold.",
    rhodium: "Electrolytic Rhodium plating applied to white gold alloys for brilliant, reflective luster.",
    origin: "Handcrafted to order by master jewel artisans in our Surat, Gujarat private atelier.",
  };

  const handleTooltip = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setActiveTooltip(activeTooltip === key ? null : key);
  };

  return (
    <div className="w-full border-t border-[#E6DFD3] divide-y divide-[#E6DFD3] text-[#241F1B] font-sans">
      
      {/* ======================================================== */}
      {/* 1. OVERVIEW ACCORDION (Matching Jared Video)            */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("overview")}
          className="w-full py-4 flex items-center justify-between text-left font-serif text-base sm:text-lg font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
        >
          <span>Overview</span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.overview ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.overview && (
          <div className="pb-6 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#4A4238] font-light animate-fadeIn">
            <p>{defaultOverviewText}</p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#6E6459]">
              <span className="font-semibold text-[#241F1B]">Item #:</span>
              <span>{itemSku}</span>
              <button
                type="button"
                onClick={copySku}
                className="ml-2 text-[11px] font-sans text-[#9E7F3C] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                {copiedSku ? (
                  <span className="text-emerald-600 inline-flex items-center gap-1">
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

      {/* ======================================================== */}
      {/* 2. DETAILS ACCORDION (Matching Jared Video Exactly)      */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("details")}
          className="w-full py-4 flex items-center justify-between text-left font-serif text-base sm:text-lg font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
        >
          <span>Details</span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.details ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.details && (
          <div className="pb-6 space-y-6 text-xs sm:text-[13px] text-[#241F1B] animate-fadeIn">
            
            {/* 2A. STONE(S) SUBSECTION */}
            <div className="space-y-2.5">
              <h4 className="font-serif font-semibold text-sm sm:text-base text-[#241F1B]">
                Stone(s)
              </h4>
              <ul className="space-y-2 pl-2 text-[#4A4238]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Total Weight (CT. T.W.): <strong>{stoneWeightVal}</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "totalWeight")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "totalWeight" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.totalWeight}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Color: <strong>F – G</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "color")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "color" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.color}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Clarity: <strong>VVS – VS</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "clarity")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "clarity" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.clarity}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Lifetime Diamond Commitment: <strong>Yes</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "commitment")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "commitment" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.commitment}
                  </div>
                )}

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Stone Type: <strong>Diamond</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "stoneType")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "stoneType" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.stoneType}
                  </div>
                )}

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone Color: <strong>White</strong></span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Stone Shape: <strong>{stoneShape}</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "stoneShape")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "stoneShape" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.stoneShape}
                  </div>
                )}

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone Carat Range: <strong>1 Ctw - Under 3 Ctw</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone Class: <strong>Natural</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Type: <strong>Diamond</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Color: <strong>White</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Shape: <strong>Round</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Class: <strong>Natural</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone Setting: <strong>{isRing ? "Talon Claw / Channel" : "Precision Bezel / Prong"}</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Setting Only: <strong>No</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Diamond Clarity: <strong>VS</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Stone 2 Diamond Color: <strong>F – G</strong></span>
                </li>
              </ul>
            </div>

            {/* 2B. METAL(S) SUBSECTION */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-serif font-semibold text-sm sm:text-base text-[#241F1B]">
                Metal(s)
              </h4>
              <ul className="space-y-2 pl-2 text-[#4A4238]">
                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Metal Type: <strong>Gold</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "metalType")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "metalType" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.metalType}
                  </div>
                )}

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Metal Color: <strong>{metalColor}</strong></span>
                </li>

                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>Metal Finish: <strong>{isWhite ? "Rhodium" : "High Mirror Polish"}</strong></span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Gold Karat: <strong>{goldKarat}</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "goldKarat")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "goldKarat" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.goldKarat}
                  </div>
                )}

                {isWhite && (
                  <li className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Rhodium Color: <strong>White</strong></span>
                  </li>
                )}
              </ul>
            </div>

            {/* 2C. DESIGN & CATEGORY SPECIFIC SUBSECTION */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-serif font-semibold text-sm sm:text-base text-[#241F1B]">
                {isRing ? "Ring Design" : isNecklace ? "Necklace & Pendant Design" : isEarring ? "Earring Design" : isBracelet ? "Bracelet Design" : "Jewellery Design"}
              </h4>
              <ul className="space-y-2 pl-2 text-[#4A4238]">
                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>{isRing ? "Ring Style" : "Style"}: <strong>{product.categoryName || "Haute Joaillerie Fine Creation"}</strong></span>
                </li>

                {isRing ? (
                  <li className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Standard Ring Size: <strong>{selectedSize}</strong></span>
                  </li>
                ) : isNecklace ? (
                  <li className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Chain Length: <strong>18 Inches (Includes 2" Extender)</strong></span>
                  </li>
                ) : isBracelet ? (
                  <li className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Standard Wrist Size: <strong>7.0 Inches</strong></span>
                  </li>
                ) : null}
              </ul>
            </div>

            {/* 2D. PRODUCT DETAILS SUBSECTION */}
            <div className="space-y-2.5 pt-2">
              <h4 className="font-serif font-semibold text-sm sm:text-base text-[#241F1B]">
                Product Details
              </h4>
              <ul className="space-y-2 pl-2 text-[#4A4238]">
                <li className="flex items-center gap-2">
                  <span className="text-[#241F1B] text-base leading-none">•</span>
                  <span>{isRing ? "Height" : "Dimensions"}: <strong>10.2 mm</strong></span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-[#241F1B] text-base leading-none">•</span>
                    <span>Craft Origin: <strong>Surat Atelier, Gujarat</strong></span>
                  </span>
                  <button 
                    type="button" 
                    onClick={(e) => handleTooltip(e, "origin")}
                    className="text-[#6E6459] hover:text-[#241F1B] p-1 cursor-pointer"
                  >
                    <Info className="w-3.5 h-3.5" />
                  </button>
                </li>
                {activeTooltip === "origin" && (
                  <div className="p-2.5 bg-[#FAF7F0] border border-[#C9A961]/60 text-xs text-[#241F1B] rounded-xs animate-fadeIn ml-4">
                    {tooltips.origin}
                  </div>
                )}
              </ul>
            </div>

          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 3. FINANCING ACCORDION                                   */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("financing")}
          className="w-full py-4 flex items-center justify-between text-left font-serif text-base sm:text-lg font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
        >
          <span>Financing</span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.financing ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.financing && (
          <div className="pb-6 space-y-3 text-xs sm:text-[13px] text-[#4A4238] font-light leading-relaxed animate-fadeIn">
            <p>
              We offer bespoke atelier installment plans and flexible payment schedules. Secure payments are accepted via UPI, credit/debit cards, bank wire transfers, and verified concierge links.
            </p>
            <p className="text-[11px] text-[#6E6459]">
              All valuations include BIS assay hallmarking, transit insurance, and statutory GST with zero hidden costs. Contact your client advisor to arrange split-payment milestones.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 4. SHIPPING AND RETURNS ACCORDION                        */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("shipping")}
          className="w-full py-4 flex items-center justify-between text-left font-serif text-base sm:text-lg font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
        >
          <span>Shipping and Returns</span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.shipping ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.shipping && (
          <div className="pb-6 space-y-3.5 text-xs sm:text-[13px] text-[#4A4238] font-light leading-relaxed animate-fadeIn">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#9E7F3C] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#241F1B] font-medium block">Complimentary Armored Courier Delivery</strong>
                Dispatched via armored, fully insured transit (Sequel / BVC) with mandatory recipient OTP & signature on delivery.
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
                <strong className="text-[#241F1B] font-medium block">Free And Easy 30-Day Returns & Inspection</strong>
                Complimentary 30-day inspection, exchange, or resizing in accordance with Civara's fine jewellery pledge.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* 5. DISCLOSURES & CARE ACCORDION                          */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("care")}
          className="w-full py-4 flex items-center justify-between text-left font-serif text-base sm:text-lg font-medium text-[#241F1B] hover:text-[#9E7F3C] transition-colors cursor-pointer"
        >
          <span>Disclosures & Care</span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.care ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.care && (
          <div className="pb-6 space-y-3 text-xs sm:text-[13px] text-[#4A4238] font-light leading-relaxed animate-fadeIn">
            <p>
              <strong className="text-[#241F1B] font-medium">Ethical Kimberly Process Commitment:</strong> All diamonds set into Civara fine jewellery are 100% ethically sourced adhering to United Nations Kimberly Process standards.
            </p>
            <p>
              <strong className="text-[#241F1B] font-medium">Lifetime Complimentary Care:</strong> Bring or courier your piece to our Surat Atelier anytime for complimentary ultrasonic cleaning, claw prong tightening, and high-lustre repolishing.
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
