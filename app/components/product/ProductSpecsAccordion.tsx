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
  selectedDiamondType?: "Natural Diamond" | "Lab Grown Diamond";
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
  selectedDiamondType = "Natural Diamond",
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

  const isLabGrown = selectedDiamondType === "Lab Grown Diamond";

  const labGrownOverviewText = product.labGrownDescription ||
    `An exquisite ${stoneShape.toLowerCase()} IGI-certified Type IIa lab grown diamond rests within a sculpted center setting in this atelier ${categoryItemLabel}. Grown through advanced CVD technology replicating diamond crystallization in a controlled environment, it exhibits identical hardness, refractive fire, and atomic structure as earth-mined diamonds. Fashioned in ${selectedMetal}, this design pairs sustainable modern elegance with a total diamond weight of ${stoneWeightVal} carat.`;

  const naturalOverviewText = product.naturalDiamondDescription || product.description ||
    `A brilliant ${stoneShape.toLowerCase()} natural diamond rests within a dynamic carved center setting in this exquisite ${categoryItemLabel}. Rows of fiery round diamonds border the architectural silhouette to complete the regal look. Fashioned in ${selectedMetal}, the total diamond weight of the ${categoryItemLabel} is ${stoneWeightVal} carat.`;

  const activeOverviewText = isLabGrown ? labGrownOverviewText : naturalOverviewText;

  // Tooltip descriptions
  const tooltips: Record<string, string> = {
    totalWeight: "Total Carat Weight represents the combined weight of all diamonds set into this piece.",
    color: "Color grade 'F-G / I' indicates exceptional diamond brilliance and high light transmission.",
    clarity: "Clarity grade indicates eye-clean diamond purity inspected under 10x microscopic magnification.",
    commitment: isLabGrown
      ? "Civara Atelier Diamond Care: complimentary annual inspection, prong tightening, and lifetime authenticity guarantee."
      : "Civara Lifetime Diamond Commitment: complimentary annual inspection, claw tightening, and natural stone security.",
    stoneType: isLabGrown
      ? "Type IIa CVD/HPHT lab grown diamond possessing identical carbon atomic lattice, refractive index (2.42), and optical fire to mined diamonds with zero mining impact."
      : "100% natural earth-mined conflict-free diamond certified by accredited gemmological laboratories (GIA/IGI).",
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
          className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
        >
          <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
            Overview
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.overview ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.overview && (
          <div className="pb-6 space-y-4 text-xs sm:text-[13px] leading-relaxed text-[#4A4238] font-light animate-fadeIn">
            <p>{activeOverviewText}</p>

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
      {/* 2. PRODUCT DETAILS ACCORDION                            */}
      {/* ======================================================== */}
      <div className="py-1">
        <button
          type="button"
          onClick={() => toggleSection("details")}
          className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
        >
          <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
            Product Details
          </span>
          <ChevronDown
            className={`w-5 h-5 text-[#241F1B] transition-transform duration-200 ${
              openSections.details ? "rotate-180" : ""
            }`}
          />
        </button>

        {openSections.details && (
          <div className="pb-8 pt-2 space-y-8 md:space-y-9 animate-fadeIn text-[#241F1B]">
            {/* Helper spec row renderer */}
            {(() => {
              const renderSpecRow = (item: { label: string; value: React.ReactNode; tooltipKey?: string }) => {
                const hasTooltip = Boolean(item.tooltipKey && tooltips[item.tooltipKey]);
                const isTooltipOpen = Boolean(item.tooltipKey && activeTooltip === item.tooltipKey);

                return (
                  <div key={item.label} className="py-3 sm:py-3.5 border-b border-[#E6DFD3]/60 last:border-b-0 transition-colors">
                    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-6">
                      <div className="text-[14px] md:text-[15px] font-sans text-[#6E6459] font-normal leading-relaxed flex items-center gap-1.5">
                        <span>{item.label}</span>
                        {hasTooltip && (
                          <button
                            type="button"
                            onClick={(e) => handleTooltip(e, item.tooltipKey!)}
                            className="text-[#9E7F3C]/80 hover:text-[#9E7F3C] p-0.5 rounded-full transition-colors cursor-pointer inline-flex items-center justify-center focus:outline-none"
                            aria-label={`Learn more about ${item.label}`}
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <div className="text-[15px] md:text-[16px] font-sans text-[#241F1B] font-medium leading-relaxed md:text-right">
                        {item.value}
                      </div>
                    </div>
                    {isTooltipOpen && hasTooltip && (
                      <div className="mt-2.5 p-3 bg-[#FAF7F0] border border-[#C9A961]/40 text-xs sm:text-[13px] text-[#4A4238] rounded-xs animate-fadeIn leading-relaxed">
                        {tooltips[item.tooltipKey!]}
                      </div>
                    )}
                  </div>
                );
              };

              // 1. Diamond Details
              const diamondDetails = [
                { label: "Total Weight (CT. T.W.)", value: stoneWeightVal, tooltipKey: "totalWeight" },
                { label: "Color", value: "F – G", tooltipKey: "color" },
                { label: "Clarity", value: "VVS – VS", tooltipKey: "clarity" },
                { label: "Lifetime Diamond Commitment", value: "Yes", tooltipKey: "commitment" },
                { 
                  label: "Stone Type", 
                  value: isLabGrown ? "Lab Grown Diamond (Type IIa CVD)" : "Natural Diamond", 
                  tooltipKey: "stoneType" 
                },
                { label: "Stone Color", value: "White" },
                { label: "Stone Shape", value: stoneShape, tooltipKey: "stoneShape" },
                { label: "Stone Carat Range", value: "1 Ctw - Under 3 Ctw" },
                { 
                  label: "Stone Class", 
                  value: isLabGrown ? "Lab-Created (Type IIa CVD/HPHT)" : "Natural Earth-Mined" 
                },
                { 
                  label: "Stone Setting", 
                  value: isRing ? "Talon Claw / Channel" : "Precision Bezel / Prong" 
                },
                { label: "Setting Only", value: "No" },
              ];

              // 2. Accent Diamond Details
              const accentDiamondDetails = [
                { 
                  label: "Stone 2 Type", 
                  value: isLabGrown ? "Lab Grown Diamond" : "Natural Diamond" 
                },
                { label: "Stone 2 Color", value: "White" },
                { label: "Stone 2 Shape", value: "Round" },
                { 
                  label: "Stone 2 Class", 
                  value: isLabGrown ? "Lab-Created" : "Natural" 
                },
                { label: "Stone 2 Diamond Clarity", value: "VS" },
                { label: "Stone 2 Diamond Color", value: "F – G" },
              ];

              // 3. Metal Details
              const metalDetails = [
                { label: "Metal Type", value: "Gold", tooltipKey: "metalType" },
                { label: "Metal Color", value: metalColor },
                { label: "Metal Finish", value: isWhite ? "Rhodium" : "High Mirror Polish" },
                { label: "Gold Karat", value: goldKarat, tooltipKey: "goldKarat" },
                ...(isWhite ? [{ label: "Rhodium Color", value: "White" }] : []),
              ];

              // 4. Ring Details
              const ringDetails = [
                { 
                  label: isRing ? "Ring Style" : "Style", 
                  value: product.categoryName || "Rings" 
                },
                ...(isRing
                  ? [{ label: "Standard Ring Size", value: selectedSize }]
                  : isNecklace
                  ? [{ label: "Chain Length", value: "18 Inches (Includes 2\" Extender)" }]
                  : isBracelet
                  ? [{ label: "Standard Wrist Size", value: "7.0 Inches" }]
                  : []),
                { 
                  label: isRing ? "Height" : "Dimensions", 
                  value: "10.2 mm" 
                },
                { 
                  label: "Craft Origin", 
                  value: "Surat Atelier, Gujarat", 
                  tooltipKey: "origin" 
                },
              ];

              return (
                <>
                  {/* Subsection 1: Diamond Details */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-[17px] font-medium text-[#241F1B] pb-2 border-b border-[#E6DFD3] tracking-wide">
                      Diamond Details
                    </h4>
                    <div>
                      {diamondDetails.map(renderSpecRow)}
                    </div>
                  </div>

                  {/* Subsection 2: Accent Diamond Details */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-[17px] font-medium text-[#241F1B] pb-2 border-b border-[#E6DFD3] tracking-wide">
                      Accent Diamond Details
                    </h4>
                    <div>
                      {accentDiamondDetails.map(renderSpecRow)}
                    </div>
                  </div>

                  {/* Subsection 3: Metal Details */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-[17px] font-medium text-[#241F1B] pb-2 border-b border-[#E6DFD3] tracking-wide">
                      Metal Details
                    </h4>
                    <div>
                      {metalDetails.map(renderSpecRow)}
                    </div>
                  </div>

                  {/* Subsection 4: Ring Details */}
                  <div className="space-y-1">
                    <h4 className="font-serif text-[17px] font-medium text-[#241F1B] pb-2 border-b border-[#E6DFD3] tracking-wide">
                      {isRing ? "Ring Details" : isNecklace ? "Necklace Details" : isEarring ? "Earring Details" : isBracelet ? "Bracelet Details" : "Ring Details"}
                    </h4>
                    <div>
                      {ringDetails.map(renderSpecRow)}
                    </div>
                  </div>
                </>
              );
            })()}
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
          className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
        >
          <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
            Financing
          </span>
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
          className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
        >
          <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
            Shipping and Returns
          </span>
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
          className="w-full py-4 sm:py-5 flex items-center justify-between text-left group transition-colors cursor-pointer"
        >
          <span className="font-serif text-[20px] sm:text-[22px] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
            Disclosures & Care
          </span>
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
