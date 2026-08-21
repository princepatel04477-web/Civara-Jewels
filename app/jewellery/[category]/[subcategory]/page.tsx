import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Taxonomy } from "../../../../lib/taxonomy";
import { Catalog } from "../../../../lib/catalog";
import { BreadcrumbNav } from "../../../components/jewellery/BreadcrumbNav";
import { FilterBar } from "../../../components/jewellery/FilterBar";
import { CategoryGrid } from "../../../components/jewellery/CategoryGrid";
import { GsapTextReveal } from "../../../components/motion/GsapTextReveal";
import { RuleDraw } from "../../../components/motion/RuleDraw";
import { Hammer } from "lucide-react";

interface SubcategoryPageProps {
  params: {
    category: string;
    subcategory: string;
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
  const params: { category: string; subcategory: string }[] = [];

  Taxonomy.getAllCategories().forEach((cat) => {
    cat.subcategories.forEach((sub) => {
      if (sub.enabled) {
        params.push({
          category: cat.slug,
          subcategory: sub.slug,
        });
      }
    });
  });

  return params;
}

export function generateMetadata({ params, searchParams }: SubcategoryPageProps): Metadata {
  const result = Taxonomy.getSubcategory(params.category, params.subcategory);
  if (!result) return {};

  const { category, subcategory } = result;
  const hasFacetFilters = Boolean(
    searchParams.metal || searchParams.purity || searchParams.stone || searchParams.occasion
  );

  return {
    title: `${subcategory.displayName} | ${category.displayName} | Civara Jewels`,
    description: `${subcategory.description} Handcrafted in hallmarked gold and certified natural diamonds.`,
    robots: hasFacetFilters ? { index: false, follow: true } : { index: true, follow: true },
    alternates: {
      canonical: `https://civara-jewels.vercel.app/jewellery/${category.slug}/${subcategory.slug}`,
    },
  };
}

export default function SubcategoryLandingPage({ params, searchParams }: SubcategoryPageProps) {
  const result = Taxonomy.getSubcategory(params.category, params.subcategory);
  if (!result) {
    notFound();
  }

  const { category, subcategory } = result;

  // Filter Catalog Products by category & subcategory (or category fallback if subcategory matches)
  let products = Catalog.products.filter(
    (p) => p.category.toLowerCase() === category.slug.toLowerCase()
  );

  if (searchParams.metal) {
    products = products.filter((p) =>
      p.metalOptions.some((m) => m.toLowerCase().includes(searchParams.metal!.replace("-", " ")))
    );
  }

  // Sort
  if (searchParams.sort === "price-asc") {
    products.sort((a, b) => a.priceINR - b.priceINR);
  } else if (searchParams.sort === "price-desc") {
    products.sort((a, b) => b.priceINR - a.priceINR);
  }

  return (
    <div className="w-full bg-[#FBF7F0] min-h-screen">
      {/* Subcategory Hero Header */}
      <section className="py-20 px-6 lg:px-20 bg-[#F4EDE2] border-b border-[#E6DFD3] text-center max-w-5xl mx-auto space-y-6">
        <BreadcrumbNav
          items={[
            { name: "Jewellery", url: "/jewellery" },
            { name: category.displayName, url: `/jewellery/${category.slug}` },
            { name: subcategory.displayName, url: `/jewellery/${category.slug}/${subcategory.slug}` },
          ]}
        />

        <div className="text-xs uppercase tracking-[0.35em] text-[#9E7F3C] font-medium">
          {category.displayName} Subcategory Edit
        </div>

        <GsapTextReveal
          as="h1"
          text={subcategory.displayName}
          className="font-serif text-4xl sm:text-6xl font-medium text-[#241F1B]"
        />

        <RuleDraw color="gold" className="w-24 mx-auto my-3" />

        <p className="text-xs sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
          {subcategory.description}
        </p>
      </section>

      {/* Craft Note */}
      <section className="py-10 px-6 lg:px-20 max-w-4xl mx-auto">
        <div className="p-8 bg-[#FFFFFF] border border-[#E6DFD3] space-y-2 relative specular-sweep">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
            <Hammer className="w-3.5 h-3.5" /> Subcategory Craft Note
          </div>
          <p className="font-serif text-base sm:text-lg font-medium text-[#241F1B] leading-relaxed italic">
            "{subcategory.craftNote}"
          </p>
        </div>
      </section>

      {/* Sticky Filter Bar */}
      <FilterBar />

      {/* Product Grid */}
      <section className="px-6 lg:px-20 max-w-7xl mx-auto min-h-[400px]">
        <CategoryGrid products={products} category={category} />
      </section>
    </div>
  );
}
