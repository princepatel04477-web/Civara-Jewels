import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Taxonomy } from "../../../lib/taxonomy";
import { Catalog } from "../../../lib/catalog";
import { BreadcrumbNav } from "../../components/jewellery/BreadcrumbNav";
import { FilterBar } from "../../components/jewellery/FilterBar";
import { CategoryGrid } from "../../components/jewellery/CategoryGrid";
import { HowToChoose } from "../../components/jewellery/HowToChoose";
import { CategoryFAQComponent } from "../../components/jewellery/CategoryFAQ";
import { GsapTextReveal } from "../../components/motion/GsapTextReveal";
import { RuleDraw } from "../../components/motion/RuleDraw";
import { ArrowRight, Hammer } from "lucide-react";

interface CategoryPageProps {
  params: {
    category: string;
  };
  searchParams: {
    metal?: string;
    purity?: string;
    stone?: string;
    occasion?: string;
    sort?: string;
  };
}

export function generateStaticParams() {
  return Taxonomy.getAllCategories().map((cat) => ({
    category: cat.slug,
  }));
}

export function generateMetadata({ params, searchParams }: CategoryPageProps): Metadata {
  const cat = Taxonomy.getCategory(params.category);
  if (!cat) return {};

  const hasFacetFilters = Boolean(
    searchParams.metal || searchParams.purity || searchParams.stone || searchParams.occasion
  );

  return {
    title: `${cat.displayName} Collection | Handcrafted Fine Jewellery | Civara Jewels`,
    description: `${cat.editorialDescription} Handcrafted in hallmarked 18K/22K gold and certified diamonds.`,
    robots: hasFacetFilters ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical: `https://civara-jewels.vercel.app/jewellery/${cat.slug}`,
    },
  };
}

export default function CategoryLandingPage({ params, searchParams }: CategoryPageProps) {
  const category = Taxonomy.getCategory(params.category);
  if (!category) {
    notFound();
  }

  // Filter Catalog Products by category & facets
  let products = Catalog.products.filter(
    (p) => p.category.toLowerCase() === category.slug.toLowerCase()
  );

  if (searchParams.metal) {
    products = products.filter((p) =>
      p.metalOptions.some((m) => m.toLowerCase().includes(searchParams.metal!.replace("-", " ")))
    );
  }
  if (searchParams.stone) {
    products = products.filter((p) =>
      p.stoneType.toLowerCase().includes(searchParams.stone!.toLowerCase())
    );
  }

  // Sort
  if (searchParams.sort === "price-asc") {
    products.sort((a, b) => a.priceINR - b.priceINR);
  } else if (searchParams.sort === "price-desc") {
    products.sort((a, b) => b.priceINR - a.priceINR);
  }

  const relatedCategories = Taxonomy.getRelatedCategories(category.slug);

  // CollectionPage JSON-LD
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${category.displayName} Collection — Civara Jewels`,
    description: category.editorialDescription,
    url: `https://civara-jewels.vercel.app/jewellery/${category.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: p.name,
        url: `https://civara-jewels.vercel.app/products/${p.id}`,
      })),
    },
  };

  return (
    <div className="w-full bg-[#FBF7F0] min-h-screen">
      {/* Schema.org CollectionPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />

      {/* 1. EDITORIAL HERO (FULL-BLEED ART DIRECTED HERO) */}
      <section className="relative py-20 px-6 lg:px-20 bg-[#F4EDE2] border-b border-[#E6DFD3] overflow-hidden">
        {category.coverImage && (
          <div className="absolute inset-0 z-0">
            <picture className="w-full h-full block">
              {category.mobileCoverImage && (
                <source media="(max-width: 767px)" srcSet={category.mobileCoverImage} />
              )}
              <img
                src={category.coverImage}
                alt={`${category.displayName} Hero`}
                className="w-full h-full object-cover object-center opacity-15"
              />
            </picture>
            <div className="absolute inset-0 bg-gradient-to-t from-[#F4EDE2] via-[#F4EDE2]/80 to-[#F4EDE2]/40" />
          </div>
        )}

        <div className="max-w-5xl mx-auto space-y-6 relative z-10 text-center">
          <BreadcrumbNav
            items={[
              { name: "Jewellery", url: "/jewellery" },
              { name: category.displayName, url: `/jewellery/${category.slug}` },
            ]}
          />

          <div className="text-xs uppercase tracking-[0.35em] text-[#9E7F3C] font-medium">
            Category Edit 0{category.sortOrder} · {category.subcategories.length} Subcategories
          </div>

          <GsapTextReveal
            as="h1"
            text={category.displayName}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium text-[#241F1B]"
          />

          <RuleDraw color="gold" className="w-24 mx-auto my-3" />

          <p className="text-xs sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            {category.editorialDescription}
          </p>
        </div>
      </section>

      {/* 2. ATELIER CRAFT NOTE (40–60 words) */}
      <section className="py-12 px-6 lg:px-20 max-w-4xl mx-auto">
        <div className="p-8 sm:p-10 bg-[#FFFFFF] border border-[#E6DFD3] space-y-3 relative specular-sweep">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
            <Hammer className="w-3.5 h-3.5" /> Atelier Craft Note
          </div>
          <p className="font-serif text-lg sm:text-xl font-medium text-[#241F1B] leading-relaxed italic">
            "{category.craftNote}"
          </p>
          <div className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459] font-mono">
            — Master Goldsmith, Civara Atelier Mumbai
          </div>
        </div>
      </section>

      {/* 3. SUBCATEGORY HAIRLINE CHIPS ROW */}
      <section className="py-6 px-6 lg:px-20 max-w-7xl mx-auto overflow-x-auto">
        <div className="flex items-center gap-3 min-w-max pb-2">
          <span className="text-[10px] uppercase tracking-[0.22em] text-[#9E7F3C] font-medium mr-2">
            Subcategories:
          </span>
          {category.subcategories.map((sub) => (
            <Link
              key={sub.slug}
              href={`/jewellery/${category.slug}/${sub.slug}`}
              className="border border-[#E6DFD3] bg-[#FBF7F0] px-4 py-2 text-xs text-[#241F1B] font-light hover:border-[#C9A961] hover:text-[#9E7F3C] transition-colors whitespace-nowrap"
            >
              {sub.displayName}
            </Link>
          ))}
        </div>
      </section>

      {/* 4. STICKY FILTER BAR */}
      <FilterBar />

      {/* 5. PRODUCT GRID (HANDLES 0, 1-3, 4+ STATES) */}
      <section className="px-6 lg:px-20 max-w-7xl mx-auto min-h-[400px]">
        <CategoryGrid products={products} category={category} />
      </section>

      {/* 6. HOW TO CHOOSE GUIDE STRIP */}
      {category.howToChoose && <HowToChoose guide={category.howToChoose} />}

      {/* 7. RELATED CATEGORIES */}
      {relatedCategories.length > 0 && (
        <section className="py-16 px-6 lg:px-20 max-w-7xl mx-auto border-t border-[#E6DFD3]">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
              Complementary Atelier Edits
            </div>
            <h3 className="font-serif text-3xl font-medium text-[#241F1B]">
              Related Categories
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedCategories.map((rel) => (
              <Link
                key={rel.slug}
                href={`/jewellery/${rel.slug}`}
                className="group p-6 bg-[#F4EDE2] border border-[#E6DFD3] hover:border-[#C9A961] transition-colors space-y-2 block"
              >
                <div className="text-[10px] uppercase tracking-[0.22em] text-[#9E7F3C]">
                  {rel.subcategories.length} Subcategories
                </div>
                <div className="font-serif text-xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                  {rel.displayName}
                </div>
                <p className="text-xs font-light text-[#6E6459] line-clamp-2">
                  {rel.editorialDescription}
                </p>
                <div className="pt-2 text-[11px] uppercase tracking-[0.18em] font-medium text-[#241F1B] group-hover:text-[#9E7F3C] inline-flex items-center gap-1">
                  Explore <ArrowRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 8. CATEGORY FAQ */}
      {category.faqs.length > 0 && (
        <CategoryFAQComponent categoryName={category.displayName} faqs={category.faqs} />
      )}
    </div>
  );
}
