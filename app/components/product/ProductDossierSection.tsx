"use client";

import React, { useState } from "react";
import { Product } from "../../../lib/catalog";
import { formatINR } from "../../../lib/pricing/compute";
import { ShieldCheck, Truck, Sparkles, Check, Copy, Award, Gem, FileText, Info } from "lucide-react";

interface ProductDossierSectionProps {
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

export const ProductDossierSection: React.FC<ProductDossierSectionProps> = ({
  product,
  selectedMetal,
  selectedSize = "10.0",
  calculatedPricing,
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "pricing" | "delivery">("specs");
  const [copied, setCopied] = useState(false);

  const itemSku = `7902${(product.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 100) % 90000 + 10000).toString()}00`;

  const copySku = () => {
    navigator.clipboard?.writeText(itemSku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const categoryLower = (product.category || "").toLowerCase();
  const isRing = product.sizeType === "ring" || categoryLower.includes("ring");
  const isNecklace = categoryLower.includes("necklace") || categoryLower.includes("pendant") || categoryLower.includes("mangalsutra");
  const isEarring = categoryLower.includes("earring");
  const isBracelet = categoryLower.includes("bracelet") || categoryLower.includes("bangle");

  const stoneWeightVal = product.stoneType?.includes("ct") 
    ? product.stoneType.replace(/ct/i, "").trim() 
    : "1.00";

  const stoneShape = product.name.toLowerCase().includes("oval")
    ? "Oval"
    : product.name.toLowerCase().includes("emerald")
    ? "Emerald"
    : product.name.toLowerCase().includes("pear")
    ? "Pear"
    : product.name.toLowerCase().includes("cushion")
    ? "Cushion"
    : "Round Brilliant";

  const isWhite = selectedMetal.toLowerCase().includes("white");
  const isRose = selectedMetal.toLowerCase().includes("rose");
  const metalColor = isWhite ? "White" : isRose ? "Rose" : "Yellow";

  let goldKarat = "18K (750 Fine Gold)";
  if (selectedMetal.startsWith("14K")) goldKarat = "14K (585 Fine Gold)";
  else if (selectedMetal.startsWith("16K")) goldKarat = "16K (667 Fine Gold)";
  else if (selectedMetal.startsWith("10K")) goldKarat = "10K (417 Fine Gold)";

  const specsList = [
    { label: "Item SKU Number", value: itemSku, group: "Identification" },
    { label: "Total Diamond Weight", value: `${stoneWeightVal} CT. T.W.`, group: "Stone" },
    { label: "Diamond Color Grade", value: "F – G (Colorless / Rare White)", group: "Stone" },
    { label: "Diamond Clarity Grade", value: "VVS – VS (Microscopically Clean)", group: "Stone" },
    { label: "Stone Cut & Shape", value: stoneShape, group: "Stone" },
    { label: "Stone Class & Sourcing", value: "100% Natural Earth-Mined (UN Kimberley Certified)", group: "Stone" },
    { label: "Stone Setting Architecture", value: isRing ? "Hand-sculpted Talon Claw / Channel" : "Precision Bezel & Micro-Prong", group: "Stone" },
    { label: "Lifetime Diamond Commitment", value: "Included (Complimentary Annual Tightening & Inspection)", group: "Stone" },
    { label: "Precious Metal Type", value: "Solid Gold Alloy", group: "Metal" },
    { label: "Selected Gold Purity", value: goldKarat, group: "Metal" },
    { label: "Metal Tone & Lustre", value: `${metalColor} Gold`, group: "Metal" },
    { label: "Surface Finish", value: isWhite ? "Electrolytic Rhodium Plating" : "Atelier Mirror High Polish", group: "Metal" },
    { label: "BIS Hallmark Certification", value: calculatedPricing.hallmarkString, group: "Metal" },
    { 
      label: isRing ? "Selected Ring Size" : isNecklace ? "Chain Length" : isBracelet ? "Wrist Fit" : "Design Dimensions", 
      value: isRing ? `Size ${selectedSize} (Standard Indian / US Scale)` : isNecklace ? "18 Inches with 2\" Extender" : isBracelet ? "7.0 Inches (Adjustable)" : "10.2 mm Atelier Profile", 
      group: "Design" 
    },
    { label: "Artisan Workshop Origin", value: "Surat Atelier, Gujarat, India", group: "Provenance" },
    { label: "Crafting Time", value: "7 to 10 Working Days (Handmade to Order)", group: "Provenance" },
  ];

  return (
    <section className="w-full bg-[#FAF7F0] border-t border-b border-[#E6DFD3] py-14 px-6 lg:px-14">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-[11px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium block">
            Atelier Technical Specifications
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#241F1B] font-medium">
            Product Dossier & Gemmological Detail
          </h2>
          <p className="text-xs text-[#6E6459] font-light leading-relaxed">
            Every Civara creation is individually cast, hand-set, and hallmarked in our Surat Atelier with complete provenance.
          </p>
        </div>

        {/* Dossier Tabs */}
        <div className="flex justify-center border-b border-[#E6DFD3]">
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 px-3 text-xs uppercase tracking-[0.16em] font-medium transition-all relative cursor-pointer ${
                activeTab === "specs"
                  ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                  : "text-[#6E6459] hover:text-[#241F1B]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Gem className="w-3.5 h-3.5" /> Full Specifications
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 px-3 text-xs uppercase tracking-[0.16em] font-medium transition-all relative cursor-pointer ${
                activeTab === "overview"
                  ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                  : "text-[#6E6459] hover:text-[#241F1B]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" /> Overview & Craft
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pricing")}
              className={`pb-3 px-3 text-xs uppercase tracking-[0.16em] font-medium transition-all relative cursor-pointer ${
                activeTab === "pricing"
                  ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                  : "text-[#6E6459] hover:text-[#241F1B]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" /> Valuation Breakdown
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("delivery")}
              className={`pb-3 px-3 text-xs uppercase tracking-[0.16em] font-medium transition-all relative cursor-pointer ${
                activeTab === "delivery"
                  ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                  : "text-[#6E6459] hover:text-[#241F1B]"
              }`}
            >
              <span className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Delivery & Care Pledge
              </span>
            </button>
          </div>
        </div>

        {/* TAB 1: FULL SPECIFICATIONS GRID */}
        {activeTab === "specs" && (
          <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 animate-fadeIn space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E6DFD3]">
              <div>
                <h3 className="font-serif text-lg font-medium text-[#241F1B]">
                  {product.name} — Technical Sheet
                </h3>
                <span className="text-xs text-[#6E6459] font-mono">
                  Item #: {itemSku}
                </span>
              </div>
              <button
                type="button"
                onClick={copySku}
                className="self-start sm:self-auto text-xs text-[#9E7F3C] border border-[#C9A961]/50 px-3 py-1.5 rounded-xs hover:bg-[#FAF7F0] inline-flex items-center gap-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600">Copied SKU</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Item Number</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3.5 text-xs text-[#241F1B]">
              {specsList.map((spec) => (
                <div key={spec.label} className="flex items-baseline justify-between py-2 border-b border-[#E6DFD3]/60 gap-4">
                  <span className="text-[#6E6459] font-light">{spec.label}</span>
                  <span className="font-medium text-right text-[#241F1B] font-mono">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: OVERVIEW & STORY */}
        {activeTab === "overview" && (
          <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 animate-fadeIn space-y-6">
            <div className="max-w-3xl space-y-4 text-xs sm:text-sm text-[#4A4238] font-light leading-relaxed">
              <h3 className="font-serif text-xl font-medium text-[#241F1B]">
                The Design Inspiration & Architecture
              </h3>
              <p>
                {product.description || (
                  `A luminous ${stoneShape.toLowerCase()} diamond rests within an architecturally sculpted center setting in this atelier masterpiece. Crafted in solid ${selectedMetal}, every facet is calibrated for high light dispersion and intense internal fire.`
                )}
              </p>
              <p>
                Handcrafted from start to finish by master artisans in Surat, Gujarat — the historic global epicenter of diamond cutting and fine jewellery lapidary. Every piece undergoes 18 distinct quality inspection stages before receiving its laser-inscribed BIS hallmark.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: PRICING ARITHMETIC */}
        {activeTab === "pricing" && (
          <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 animate-fadeIn space-y-6">
            <h3 className="font-serif text-xl font-medium text-[#241F1B]">
              Transparent Valuation Breakdown
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1">
                <span className="text-[11px] text-[#6E6459] uppercase tracking-wider block">Net Gold Value</span>
                <span className="font-serif text-lg font-medium text-[#241F1B] block">{formatINR(calculatedPricing.metalAmount)}</span>
                <span className="text-[10px] text-[#6E6459]">{(product.netWeightG || 3.4).toFixed(2)}g @ ₹{calculatedPricing.rateUsed.toLocaleString("en-IN")}/10g</span>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1">
                <span className="text-[11px] text-[#6E6459] uppercase tracking-wider block">Certified Diamonds</span>
                <span className="font-serif text-lg font-medium text-[#241F1B] block">{formatINR(calculatedPricing.diamondAmount)}</span>
                <span className="text-[10px] text-[#6E6459]">{stoneWeightVal} CT. T.W. Natural Diamond</span>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1">
                <span className="text-[11px] text-[#6E6459] uppercase tracking-wider block">Making Charges</span>
                <span className="font-serif text-lg font-medium text-[#241F1B] block">{formatINR(calculatedPricing.makingCharges)}</span>
                <span className="text-[10px] text-[#6E6459]">Surat Master Bench Goldsmithing</span>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1">
                <span className="text-[11px] text-[#6E6459] uppercase tracking-wider block">Statutory GST (3%)</span>
                <span className="font-serif text-lg font-medium text-[#241F1B] block">{formatINR(calculatedPricing.gstAmount)}</span>
                <span className="text-[10px] text-[#6E6459]">Includes BIS Assay & Hallmarking</span>
              </div>
            </div>
            <div className="p-4 bg-[#241F1B] text-[#FBF7F0] flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-[#C9A961]">Total Dynamic Price</span>
              <span className="font-serif text-xl sm:text-2xl font-medium text-[#C9A961]">{formatINR(calculatedPricing.totalPrice)}</span>
            </div>
          </div>
        )}

        {/* TAB 4: DELIVERY & CARE */}
        {activeTab === "delivery" && (
          <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-6 sm:p-8 animate-fadeIn space-y-6">
            <h3 className="font-serif text-xl font-medium text-[#241F1B]">
              Atelier Delivery & Lifetime Care Pledge
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-[#4A4238] leading-relaxed">
              <div className="space-y-2 p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
                <Truck className="w-5 h-5 text-[#9E7F3C]" />
                <strong className="block text-[#241F1B] text-sm font-medium">Armored Insured Transit</strong>
                <p>Delivered via specialized armored security couriers (Sequel / BVC Logistics) with full transit insurance and mandatory OTP verification.</p>
              </div>

              <div className="space-y-2 p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
                <ShieldCheck className="w-5 h-5 text-[#9E7F3C]" />
                <strong className="block text-[#241F1B] text-sm font-medium">Free 30-Day Returns</strong>
                <p>Enjoy complete peace of mind with 30-day inspection, exchange, or return privileges in unworn condition with original seals intact.</p>
              </div>

              <div className="space-y-2 p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
                <Sparkles className="w-5 h-5 text-[#9E7F3C]" />
                <strong className="block text-[#241F1B] text-sm font-medium">Lifetime Complimentary Care</strong>
                <p>Complimentary annual ultrasonic cleaning, prong tightening, and one free ring resizing during your first year of ownership.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
