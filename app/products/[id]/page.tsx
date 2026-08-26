"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Catalog, Product, STANDARD_METAL_OPTIONS, STANDARD_RING_SIZES } from "../../../lib/catalog";
import { useCurrency } from "../../context/CurrencyContext";
import { ProductCard } from "../../components/ProductCard";
import { isInWishlist, toggleWishlistId } from "../../../lib/wishlist";
import { ProductGallery } from "../../components/product/ProductGallery";
import { RingSizeSelector } from "../../components/product/RingSizeSelector";
import { ProductSpecsAccordion } from "../../components/product/ProductSpecsAccordion";
import { ProductDossierSection } from "../../components/product/ProductDossierSection";
import { BookViewingDialog } from "../../components/header/BookViewingDialog";
import { WhatsAppConcierge } from "../../components/floating/WhatsAppConcierge";
import { extractPurityFromMetalOption } from "../../../lib/pricing/compute";
import { MessageCircle, Calendar, Heart } from "lucide-react";

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
            setSelectedMetal((prev) => mapped.metalOptions.includes(prev) ? prev : mapped.metalOptions[0]);
          }
          if (mapped.sizeOptions && mapped.sizeOptions.length > 0) {
            const availableSizes = mapped.sizeOptions;
            setSelectedSize((prev) => availableSizes.includes(prev) ? prev : availableSizes[0]);
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
    window.open(`https://wa.me/918866077237?text=${text}`, "_blank", "noopener,noreferrer");
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

          {/* Heading & Jared-style Total Carat Weights & Reconciled Dynamic Price */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              {product.name}
            </h1>
            <div className="text-xs text-[#6E6459] flex items-center gap-1.5">
              <span>Total Carat Weights</span>
              <span className="text-[#9E7F3C] cursor-help" title="Total Carat Weight of all diamonds set into this piece">ⓘ</span>
              <span>: <strong>{product.stoneType || "1.00 CT. T.W."}</strong></span>
            </div>
            <div className="flex items-baseline gap-3 pt-1">
              <div className="font-serif text-2xl sm:text-3xl text-[#9E7F3C] font-medium">
                {formatPrice(calculatedPricing.totalPrice)}
              </div>
              <span className="text-xs text-[#6E6459] font-light">
                (Includes 3% GST & Insured Delivery)
              </span>
            </div>
          </div>

          {/* Metal & Karat Selection Configurator (Sleek Jared-style Horizontal Swatches) */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-1.5">
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#6E6459]">
                Metal: <strong className="text-[#241F1B] font-serif">{selectedMetal}</strong>
              </div>
              <span className="text-[11px] font-mono text-[#9E7F3C] font-medium">
                ₹{calculatedPricing.rateUsed.toLocaleString("en-IN")}/10g
              </span>
            </div>

            {/* Karat Pills */}
            <div className="flex items-center gap-2">
              {["18K", "14K", "10K"].map((k) => {
                const isSelectedKarat = selectedMetal.startsWith(k);
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => {
                      const colorPart = selectedMetal.toLowerCase().includes("white")
                        ? "White Gold"
                        : selectedMetal.toLowerCase().includes("rose")
                        ? "Rose Gold"
                        : "Yellow Gold";
                      setSelectedMetal(`${k} ${colorPart}`);
                    }}
                    className={`flex-1 py-2 px-3 text-xs tracking-wider border transition-all text-center cursor-pointer ${
                      isSelectedKarat
                        ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium shadow-xs"
                        : "border-[#E6DFD3] bg-[#FAF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                    }`}
                  >
                    {k} Gold
                  </button>
                );
              })}
            </div>

            {/* Color Swatch Pills */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Yellow Gold", color: "bg-[#DDB466]", border: "border-amber-400", label: "Yellow" },
                { name: "White Gold", color: "bg-[#E5E5E5]", border: "border-gray-300", label: "White" },
                { name: "Rose Gold", color: "bg-[#E8C2B3]", border: "border-rose-300", label: "Rose" },
              ].map((swatch) => {
                const currentKarat = selectedMetal.startsWith("14K")
                  ? "14K"
                  : selectedMetal.startsWith("10K")
                  ? "10K"
                  : "18K";
                const targetMetal = `${currentKarat} ${swatch.name}`;
                const isSelected = selectedMetal === targetMetal;

                return (
                  <button
                    key={swatch.name}
                    type="button"
                    onClick={() => setSelectedMetal(targetMetal)}
                    className={`py-2 px-3 text-xs tracking-wider border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isSelected
                        ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium shadow-xs"
                        : "border-[#E6DFD3] bg-[#FFFFFF] text-[#6E6459] hover:border-[#9E7F3C]"
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full border ${swatch.color} ${swatch.border}`} />
                    <span className="text-[11px] font-medium">{swatch.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ring Size UX: 3 to 15 in 0.5 increments */}
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

          {/* Conversion Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleEnquireWhatsApp}
              className="w-full bg-[#241F1B] text-[#C9A961] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#181412] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-98"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setIsViewingOpen(true)}
              className="w-full border border-[#C9A961] text-[#9E7F3C] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <Calendar className="w-4 h-4" />
              Book a private viewing
            </button>
          </div>

          {/* Jared-style Quick Service & Trust Badges */}
          <div className="py-3 border-y border-[#E6DFD3]/70 space-y-2 text-xs text-[#6E6459]">
            <div className="flex items-center gap-2.5">
              <span className="text-base">🚚</span>
              <span><strong>Complimentary Insured Delivery</strong> — Dispatched within 7–10 days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base">🏛️</span>
              <span><strong>Free Surat Atelier Private Viewing</strong> — In-Person or 4K Virtual</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base">💎</span>
              <span><strong>Expert Guidance & Care</strong> — Direct gemmologist consultation</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-base">🔄</span>
              <span><strong>Free And Easy 30-Day Returns</strong> & Lifetime Care</span>
            </div>
          </div>

          {/* Jared / Luxury Fine Jewellery Specifications & Overview Accordion */}
          <ProductSpecsAccordion
            product={product}
            selectedMetal={selectedMetal}
            selectedSize={selectedSize}
            calculatedPricing={calculatedPricing}
          />
        </div>
      </section>

      {/* Full-width Product Dossier & Gemmological Sheet */}
      <ProductDossierSection
        product={product}
        selectedMetal={selectedMetal}
        selectedSize={selectedSize}
        calculatedPricing={calculatedPricing}
      />

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
