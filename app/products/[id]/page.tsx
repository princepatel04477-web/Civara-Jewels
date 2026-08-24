"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Catalog, Product, STANDARD_METAL_OPTIONS, STANDARD_RING_SIZES } from "../../../lib/catalog";
import { useCurrency } from "../../context/CurrencyContext";
import { ProductCard } from "../../components/ProductCard";
import { isInWishlist, toggleWishlistId } from "../../../lib/wishlist";
import { ProductGallery } from "../../components/product/ProductGallery";
import { PriceBreakdown } from "../../components/product/PriceBreakdown";
import { RingSizeSelector } from "../../components/product/RingSizeSelector";
import { CertificationStrip } from "../../components/product/CertificationStrip";
import { BookViewingDialog } from "../../components/header/BookViewingDialog";
import { WhatsAppConcierge } from "../../components/floating/WhatsAppConcierge";
import { extractPurityFromMetalOption } from "../../../lib/pricing/compute";
import { Plus, Minus, MessageCircle, Calendar, Heart, Sparkles, ShieldCheck } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "elara-solitaire";

  // Initial product from catalog as SSR fallback
  const initialProduct = Catalog.getProductById(productId) || Catalog.getProductById("elara-solitaire")!;
  const [product, setProduct] = useState<Product>(initialProduct);
  const [liveImages, setLiveImages] = useState<string[]>([]);
  
  // Benchmark Rates State
  const [ratesMap, setRatesMap] = useState<Record<string, number>>({
    "18 KT": 69999,
    "16 KT": 62221,
    "14 KT": 55999,
    "10 KT": 42999,
    "Silver": 26999,
  });

  const { formatPrice } = useCurrency();

  const [selectedMetal, setSelectedMetal] = useState(
    product.metalOptions?.[0] || "18K Yellow Gold"
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions ? product.sizeOptions[0] : "12"
  );
  const [openAccordion, setOpenAccordion] = useState<string>("Materials & certification");
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(() => isInWishlist(product.id));

  // Fetch live product from SQLite API
  useEffect(() => {
    fetch(`/api/public/products/${productId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.product) {
          const dbP = data.product;
          const mapped = Catalog.mapDbProductToProduct(dbP);
          setProduct(mapped);

          if (dbP.images && dbP.images.length > 0) {
            const allImgs = dbP.images.map((img: any) => img.path);
            setLiveImages(allImgs);
          }

          if (mapped.metalOptions && mapped.metalOptions.length > 0) {
            setSelectedMetal(mapped.metalOptions[0]);
          }
          if (mapped.sizeOptions && mapped.sizeOptions.length > 0) {
            setSelectedSize(mapped.sizeOptions[0]);
          }
        }
      })
      .catch(() => {});

    // Fetch live metal rates
    fetch("/api/public/metal-rates")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.rates && Array.isArray(data.rates)) {
          const map: Record<string, number> = {
            "18 KT": 69999,
            "16 KT": 62221,
            "14 KT": 55999,
            "10 KT": 42999,
            "Silver": 26999,
          };
          data.rates.forEach((r: any) => {
            if (r.purity && r.rate_inr) {
              map[r.purity] = r.rate_inr;
            }
          });
          setRatesMap(map);
        }
      })
      .catch(() => {});
  }, [productId]);

  // Extract Karat & Color details of active selected metal
  const activePurity = useMemo(() => {
    return extractPurityFromMetalOption(selectedMetal);
  }, [selectedMetal]);

  // Dynamic metal rate for the active selection
  const activeRate = useMemo(() => {
    if (activePurity.isSilver) return ratesMap["Silver"] || 26999;
    if (activePurity.purityKarat === 10) return ratesMap["10 KT"] || 42999;
    if (activePurity.purityKarat === 14) return ratesMap["14 KT"] || 55999;
    if (activePurity.purityKarat === 16) return ratesMap["16 KT"] || 62221;
    return ratesMap["18 KT"] || 69999;
  }, [activePurity, ratesMap]);

  // Dynamic Price Computation
  const calculatedPricing = useMemo(() => {
    const netWeight = product.netWeightG || 3.4;
    const rate18k = ratesMap["18 KT"] || 69999;

    // Base metal amount in 18k
    const baseMetal18k = netWeight * (rate18k / 10);
    // Active metal amount
    const activeMetal = netWeight * (activeRate / (activePurity.isSilver ? 1000 : 10));

    // Non-metal value in 18k piece (diamonds + making + charges)
    const basePrice = product.priceINR;
    const nonMetalComponent = Math.max(0, basePrice - (baseMetal18k * 1.03));

    // Adjusted dynamic price with 3% GST
    const dynamicTotal = Math.round(nonMetalComponent + (activeMetal * 1.03));
    const finalPrice = Math.max(dynamicTotal, 5000);

    const metalPortion = Math.round(activeMetal);
    const gstPortion = Math.round(finalPrice * 0.03);
    const diamondPortion = product.stoneType && product.stoneType.includes("Gold Only") 
      ? 0 
      : Math.round(Math.max(0, finalPrice - metalPortion - gstPortion - 4800));
    const makingPortion = Math.max(3000, finalPrice - metalPortion - diamondPortion - gstPortion);

    return {
      totalPrice: finalPrice,
      metalAmount: metalPortion,
      diamondAmount: diamondPortion,
      makingCharges: makingPortion,
      gstAmount: gstPortion,
      rateUsed: activeRate,
      purityLabel: `${activePurity.purityLabel} Gold Rate:`,
      hallmarkString: activePurity.purityKarat === 18 
        ? "BIS 750 (18 Karat)" 
        : activePurity.purityKarat === 16
        ? "BIS 667 (16 Karat)"
        : activePurity.purityKarat === 14 
        ? "BIS 585 (14 Karat)" 
        : activePurity.purityKarat === 10
        ? "BIS 417 (10 Karat)"
        : "BIS Hallmarked Fine Metal",
    };
  }, [product, activeRate, activePurity, ratesMap]);

  const related = Catalog.getRelatedProducts(product.id, 4);

  // Gallery image array (supports 6 to 8 photos from database)
  const galleryImages = (
    liveImages.length > 0
      ? liveImages
      : [
          product.mainImage || "/images/elara-solitaire-main.jpg",
          product.altImage || "/images/home-cc/Rings-cc.png",
          ...(product.thumbnails || []),
        ]
  ).filter((v, i, a) => a.indexOf(v) === i && Boolean(v));

  const accordions = [
    {
      title: "Materials & certification",
      content: product.details?.materials || "Recycled hallmarked gold. Centre stone certified by GIA/IGI.",
    },
    {
      title: "Craft & delivery",
      content: product.details?.craft || "Hand-finished to order by a single master goldsmith over 2–3 weeks. Complimentary insured delivery.",
    },
    {
      title: "Care & lifetime service",
      content: product.details?.care || "Complimentary lifetime cleaning and inspection. One free resizing within the first year.",
    },
  ];

  const handleToggleWishlist = () => {
    const updated = toggleWishlistId(product.id);
    setIsSaved(updated);
  };

  const handleEnquireWhatsApp = () => {
    const text = encodeURIComponent(
      `*Civara Atelier Enquiry*\n\n` +
      `I would like to enquire about ordering the *${product.name}*.\n\n` +
      `*Metal:* ${selectedMetal} (${calculatedPricing.hallmarkString})\n` +
      (product.sizeType === "ring" ? `*Ring Size:* ${selectedSize}\n` : "") +
      `*Dynamic Atelier Value:* ₹${calculatedPricing.totalPrice.toLocaleString("en-IN")}\n\n` +
      `Please connect me with an Atelier Private Client Advisor.`
    );
    window.open(`https://wa.me/919999900000?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const metalOptionList = product.metalOptions && product.metalOptions.length > 0 
    ? product.metalOptions 
    : STANDARD_METAL_OPTIONS;

  // Group metal options by Karat (18K, 16K, 14K, 10K, etc.)
  const karatGroups = useMemo(() => {
    const groups: { label: string; rate: number; options: string[] }[] = [];
    const karats = ["18K", "16K", "14K", "10K"];

    karats.forEach((k) => {
      const filtered = metalOptionList.filter((m) => m.toUpperCase().startsWith(k));
      if (filtered.length > 0) {
        const rateKey = `${k.replace("K", "")} KT`;
        groups.push({
          label: `${k} Gold`,
          rate: ratesMap[rateKey] || 69999,
          options: filtered,
        });
      }
    });

    // Add any remaining options (e.g. Silver or Custom)
    const otherOptions = metalOptionList.filter(
      (m) => !karats.some((k) => m.toUpperCase().startsWith(k))
    );
    if (otherOptions.length > 0) {
      groups.push({
        label: "Special Editions",
        rate: ratesMap["Silver"] || 26999,
        options: otherOptions,
      });
    }

    return groups;
  }, [metalOptionList, ratesMap]);

  return (
    <div className="w-full pb-16">
      {/* Breadcrumb Navigation */}
      <nav className="max-w-7xl mx-auto px-6 lg:px-14 py-4 text-xs font-light text-[#6E6459] flex items-center gap-2">
        <Link href="/" className="hover:text-[#241F1B] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href={`/jewellery/${product.category}`} className="hover:text-[#241F1B] capitalize transition-colors">
          {product.categoryName}
        </Link>
        <span>/</span>
        <span className="text-[#241F1B] font-medium">{product.name}</span>
      </nav>

      {/* Main Product Showcase Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-6 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT COLUMN: Gallery */}
        <div className="lg:col-span-7">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
          />
        </div>

        {/* RIGHT COLUMN: Product Details & Configurator */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tagline & Wishlist */}
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.22em] text-[#9E7F3C] font-medium">
              {product.tagline || "Civara Atelier Edit"}
            </span>
            <button
              onClick={handleToggleWishlist}
              className="p-2 text-[#6E6459] hover:text-[#9E7F3C] transition-colors focus:outline-none"
              aria-label="Save to Wishlist"
            >
              <Heart
                className={`w-5 h-5 transition-transform active:scale-125 ${
                  isSaved ? "fill-[#9E7F3C] text-[#9E7F3C]" : ""
                }`}
              />
            </button>
          </div>

          {/* Heading & Reconciled Dynamic Price */}
          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              {product.name}
            </h1>
            <div className="flex items-baseline gap-3 pt-1">
              <div className="font-serif text-2xl sm:text-3xl text-[#9E7F3C] font-medium">
                {formatPrice(calculatedPricing.totalPrice)}
              </div>
              <span className="text-xs text-[#6E6459] font-light">
                (Includes 3% GST & Insured Delivery)
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm font-light leading-relaxed text-[#6E6459]">
            {product.description}
          </p>

          {/* Metal & Karat Selection Configurator (18K, 16K, 14K, 10K in White / Yellow / Rose) */}
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-2">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#6E6459]">
                Selected Metal: <strong className="text-[#241F1B] font-serif">{selectedMetal}</strong>
              </div>
              <span className="text-[11px] font-mono text-[#9E7F3C] font-medium">
                ₹{calculatedPricing.rateUsed.toLocaleString("en-IN")}/10g
              </span>
            </div>

            {/* Karat Categories & Variations */}
            <div className="space-y-3">
              {karatGroups.map((group) => (
                <div key={group.label} className="p-3 bg-[#FAF7F0] border border-[#E6DFD3] space-y-2">
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-[#6E6459] font-medium">
                    <span className="text-[#241F1B] font-serif">{group.label}</span>
                    <span className="text-[#9E7F3C] font-mono">₹{group.rate.toLocaleString("en-IN")}/-</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {group.options.map((m) => {
                      const isSelected = selectedMetal === m;
                      const isWhite = m.toLowerCase().includes("white");
                      const isRose = m.toLowerCase().includes("rose");
                      const isYellow = m.toLowerCase().includes("yellow");

                      return (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setSelectedMetal(m)}
                          className={`px-3 py-2 text-xs tracking-wider transition-all border flex flex-col items-center justify-center gap-1 cursor-pointer ${
                            isSelected
                              ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium shadow-sm"
                              : "border-[#E6DFD3] bg-[#FFFFFF] text-[#6E6459] hover:border-[#9E7F3C]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full border ${
                                isWhite
                                  ? "bg-[#E5E5E5] border-gray-300"
                                  : isRose
                                  ? "bg-[#E8C2B3] border-rose-300"
                                  : "bg-[#DDB466] border-amber-300"
                              }`}
                            />
                            <span className="text-[11px] font-medium">
                              {isWhite ? "White" : isRose ? "Rose" : isYellow ? "Yellow" : m}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ring Size UX: 3 to 15 in 0.5 increments (All sizes same price rule) */}
          {product.sizeType === "ring" ? (
            <RingSizeSelector
              selectedSize={selectedSize}
              onSelectSize={(s) => setSelectedSize(s)}
              productName={product.name}
            />
          ) : product.sizeType !== "none" && product.sizeOptions ? (
            <div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-[#6E6459] mb-2.5">
                <span>
                  {product.sizeType === "chain" ? "Chain Length" : "Wrist Size"}
                </span>
                <Link
                  href="/size-guide"
                  className="text-[#9E7F3C] underline lowercase tracking-normal text-xs"
                >
                  Size Guide
                </Link>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.sizeOptions.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2.5 text-xs transition-all border ${
                        isSelected
                          ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium"
                          : "border-[#E6DFD3] bg-[#FAF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Transparent Price Breakdown Block backed by Live Karat Arithmetic */}
          <PriceBreakdown
            metalLabel={`Metal (${selectedMetal}, ${(product.netWeightG || 3.4).toFixed(2)}g)`}
            metalAmount={calculatedPricing.metalAmount}
            diamondLabel={product.stoneType ? `Diamonds (${product.stoneType})` : undefined}
            diamondAmount={calculatedPricing.diamondAmount}
            makingCharges={calculatedPricing.makingCharges}
            gstAmount={calculatedPricing.gstAmount}
            totalAmount={calculatedPricing.totalPrice}
            metalPurityLabel={calculatedPricing.purityLabel}
            metalRate={calculatedPricing.rateUsed}
          />

          {/* Hallmark & Certificate Strip */}
          <CertificationStrip
            hallmark={calculatedPricing.hallmarkString}
            lab="GIA & IGI"
            certNumber={`CIV-${product.id.substring(0, 4).toUpperCase()}8912`}
            productName={product.name}
          />

          {/* Education Link */}
          <div className="text-xs text-[#9E7F3C] flex items-center gap-4 pt-1">
            <Link href="/education/4cs" className="hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Learn about diamond 4Cs →
            </Link>
            <Link href="/education/metals" className="hover:underline flex items-center gap-1">
              Atelier gold purity guide →
            </Link>
          </div>

          {/* Conversion Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleEnquireWhatsApp}
              className="w-full bg-[#241F1B] text-[#C9A961] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#181412] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setIsViewingOpen(true)}
              className="w-full border border-[#C9A961] text-[#9E7F3C] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book a private viewing
            </button>
            <div className="text-xs font-light text-[#6E6459] text-center">
              Every piece is made to order. Enquire, view, own.
            </div>
          </div>

          {/* Accordions */}
          <div className="border-t border-[#E6DFD3] pt-2">
            {accordions.map((acc) => {
              const isOpen = openAccordion === acc.title;
              return (
                <div key={acc.title} className="border-b border-[#E6DFD3]/70">
                  <button
                    type="button"
                    onClick={() => setOpenAccordion(isOpen ? "" : acc.title)}
                    className="w-full py-4 flex items-center justify-between text-left text-xs uppercase tracking-[0.16em] text-[#241F1B] hover:text-[#9E7F3C] transition-colors"
                  >
                    <span>{acc.title}</span>
                    <span className="text-[#9E7F3C]">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="text-xs sm:text-sm font-light leading-relaxed text-[#6E6459] pb-5 animate-fadeIn">
                      {acc.content}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* RELATED PIECES */}
      <section className="py-16 px-6 lg:px-14 bg-[#F4EDE2] border-t border-[#E6DFD3] mt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-center font-medium text-[#241F1B] mb-10">
            You May Also Admire
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Book Viewing Dialog Modal */}
      <BookViewingDialog
        isOpen={isViewingOpen}
        onClose={() => setIsViewingOpen(false)}
        initialPiece={product.name}
      />

      {/* Mobile Sticky WhatsApp Concierge */}
      <WhatsAppConcierge productName={product.name} />
    </div>
  );
}
