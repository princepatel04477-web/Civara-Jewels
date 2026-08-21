"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Catalog, Product } from "../../../lib/catalog";
import { useCurrency } from "../../context/CurrencyContext";
import { ProductCard } from "../../components/ProductCard";
import { isInWishlist, toggleWishlistId } from "../../../lib/wishlist";
import { ProductGallery } from "../../components/product/ProductGallery";
import { PriceBreakdown } from "../../components/product/PriceBreakdown";
import { RingSizeSelector } from "../../components/product/RingSizeSelector";
import { CertificationStrip } from "../../components/product/CertificationStrip";
import { BookViewingDialog } from "../../components/header/BookViewingDialog";
import { WhatsAppConcierge } from "../../components/floating/WhatsAppConcierge";
import { Plus, Minus, MessageCircle, Calendar, Heart, Sparkles } from "lucide-react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = (params?.id as string) || "elara-solitaire";

  // Initial product from catalog as SSR fallback
  const initialProduct = Catalog.getProductById(productId) || Catalog.getProductById("elara-solitaire")!;
  const [product, setProduct] = useState<Product>(initialProduct);
  const [liveImages, setLiveImages] = useState<string[]>([]);
  const [metalRate18k, setMetalRate18k] = useState<number>(69999);

  const { formatPrice } = useCurrency();

  const [selectedMetal, setSelectedMetal] = useState(
    product.metalOptions?.[0] || "18k Yellow Gold"
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
        if (data && data.rates) {
          const rate18 = data.rates.find((r: any) => r.purity === "18 KT" || r.purity === "18k");
          if (rate18) {
            setMetalRate18k(rate18.rate_inr);
          }
        }
      })
      .catch(() => {});
  }, [productId]);

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
      content: product.details?.materials || "Recycled 18-karat hallmarked gold. Centre stone certified by GIA/IGI.",
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
      `I would like to enquire about ordering the *${product.name}* in ${selectedMetal}` +
      (product.sizeType === "ring" ? ` (Size: ${selectedSize})` : "") +
      `.\n\nPrice: ${formatPrice(product.priceINR)}`
    );
    window.open(`https://wa.me/919999900000?text=${text}`, "_blank", "noopener,noreferrer");
  };

  // Structured Data (JSON-LD) - Product & Breadcrumbs
  const productJsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        "@id": `https://civara-jewels.vercel.app/products/${product.id}#product`,
        name: product.name,
        image: galleryImages,
        description: product.description,
        sku: `CIV-${product.id.toUpperCase()}`,
        brand: {
          "@type": "Brand",
          name: "Civara Jewels",
        },
        category: product.categoryName,
        offers: {
          "@type": "Offer",
          price: product.priceINR,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `https://civara-jewels.vercel.app/products/${product.id}`,
          priceValidUntil: "2027-12-31",
          seller: {
            "@type": "Organization",
            name: "Civara Jewels",
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://civara-jewels.vercel.app/products/${product.id}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://civara-jewels.vercel.app",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: product.categoryName,
            item: `https://civara-jewels.vercel.app/jewellery/${product.category}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: product.name,
            item: `https://civara-jewels.vercel.app/products/${product.id}`,
          },
        ],
      },
    ],
  };

  return (
    <div className="w-full pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-4 text-xs uppercase tracking-[0.18em] text-[#6E6459]">
        <Link href="/" className="hover:text-[#241F1B] transition-colors">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link
          href={`/jewellery/${product.category}`}
          className="hover:text-[#241F1B] transition-colors"
        >
          {product.categoryName}
        </Link>{" "}
        &nbsp;/&nbsp; <span className="text-[#241F1B]">{product.name}</span>
      </div>

      {/* Main Product Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-4 lg:py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        {/* Left Gallery Column — Displays complete 6–8 photo gallery */}
        <div className="lg:col-span-7 flex flex-col gap-4 lg:sticky lg:top-28 self-start">
          <ProductGallery
            images={galleryImages}
            productName={product.name}
          />
        </div>

        {/* Right Product Details Column */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          {/* Tagline & Wishlist */}
          <div className="flex items-center justify-between">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
              {product.tagline || "Civara Atelier Edit"}
            </div>
            <button
              onClick={handleToggleWishlist}
              className="inline-flex items-center gap-1.5 text-xs text-[#9E7F3C] hover:text-[#241F1B] transition-colors"
              aria-label={isSaved ? "Saved to wishlist" : "Save piece"}
            >
              <Heart
                className={`w-4 h-4 ${
                  isSaved ? "fill-[#C9A961] text-[#C9A961]" : "text-[#9E7F3C]"
                }`}
              />
              <span className="uppercase tracking-wider text-[10px]">
                {isSaved ? "Saved" : "Save"}
              </span>
            </button>
          </div>

          {/* Heading & Reconciled Price */}
          <div className="space-y-1">
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              {product.name}
            </h1>
            <div className="font-serif text-2xl sm:text-3xl text-[#9E7F3C] font-medium pt-1">
              {formatPrice(product.priceINR)}
            </div>
          </div>

          <p className="text-xs sm:text-sm font-light leading-relaxed text-[#6E6459]">
            {product.description}
          </p>

          {/* Metal Picker */}
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-[#6E6459] mb-2.5">
              Metal Selection — <span className="text-[#241F1B] font-medium">{selectedMetal}</span>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {(product.metalOptions || ["18k Yellow Gold", "18k Rose Gold", "18k White Gold"]).map((m) => {
                const isSelected = selectedMetal === m;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMetal(m)}
                    className={`px-4 py-2.5 text-xs tracking-wider transition-all border ${
                      isSelected
                        ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] font-medium"
                        : "border-[#E6DFD3] bg-[#FAF7F0] text-[#6E6459] hover:border-[#9E7F3C]"
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
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

          {/* Price Breakdown Block backed by Live SQLite Metal Rates */}
          <PriceBreakdown
            metalLabel={`Metal (18k Recycled Gold, 4.8g)`}
            metalAmount={Math.round(product.priceINR * 0.44)}
            diamondLabel={product.stoneType ? `Diamonds (${product.stoneType})` : undefined}
            diamondAmount={product.stoneType && product.stoneType.includes("Gold Only") ? 0 : Math.round(product.priceINR * 0.46)}
            makingCharges={Math.round(product.priceINR * 0.07)}
            gstAmount={Math.round(product.priceINR * 0.03)}
            totalAmount={product.priceINR}
            gold18kRate={metalRate18k}
          />

          {/* Hallmark & Certificate Strip */}
          <CertificationStrip
            hallmark="BIS 750 (18K)"
            lab="GIA"
            certNumber={`GIA-${product.id.substring(0, 4).toUpperCase()}8912`}
            productName={product.name}
          />

          {/* Education Link */}
          <div className="text-xs text-[#9E7F3C] flex items-center gap-4 pt-1">
            <Link href="/education/4cs" className="hover:underline flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Learn about diamond 4Cs →
            </Link>
            <Link href="/education/metals" className="hover:underline flex items-center gap-1">
              Atelier 18k gold purity →
            </Link>
          </div>

          {/* Conversion Actions */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              type="button"
              onClick={handleEnquireWhatsApp}
              className="w-full bg-[#241F1B] text-[#C9A961] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#181412] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Enquire on WhatsApp
            </button>
            <button
              type="button"
              onClick={() => setIsViewingOpen(true)}
              className="w-full border border-[#C9A961] text-[#9E7F3C] py-4 px-8 text-xs uppercase tracking-[0.2em] text-center font-medium rounded-full hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all flex items-center justify-center gap-2"
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

      {/* Mobile Sticky WhatsApp Concierge (P1-5) */}
      <WhatsAppConcierge productName={product.name} />
    </div>
  );
}
