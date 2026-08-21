import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Catalog } from "../../../lib/catalog";
import { ProductCard } from "../../components/ProductCard";
import { BookViewingButton } from "../../components/header/BookViewingButton";
import { ArrowRight } from "lucide-react";

interface OccasionData {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  curatedProductIds: string[];
}

const occasionsData: Record<string, OccasionData> = {
  engagement: {
    slug: "engagement",
    title: "The Engagement Edit",
    subtitle: "Solitaires cut to catch the room rather than the camera.",
    description:
      "Hand-set natural diamonds in 18-karat recycled gold claw and bezel mounts. Designed for daily intimacy and enduring quiet luxury.",
    heroImage: "/images/home-cc/Rings-cc.png",
    curatedProductIds: [
      "elara-solitaire",
      "aethel-emerald-ring",
      "meera-bridal-solitaire-duo",
      "nira-stacking-band",
      "vela-diamond-pendant",
    ],
  },
  wedding: {
    slug: "wedding",
    title: "The Ceremony & Wedding Edit",
    subtitle: "Heirloom gold and diamond suites crafted for the aisle and generations after.",
    description:
      "Grand statement sets, royal kundan chokers, and sculpted interlocking bands designed with architectural restraint.",
    heroImage: "/images/home-cc/bridal-cc.png",
    curatedProductIds: [
      "aanya-bridal-choker-set",
      "meera-bridal-solitaire-duo",
      "celeste-diamond-tennis-necklace",
      "kaia-diamond-cuff",
      "ora-pearl-drops",
      "sena-gold-bangle",
    ],
  },
  anniversary: {
    slug: "anniversary",
    title: "The Anniversary Edit",
    subtitle: "Commemorating shared years with eternal fire.",
    description:
      "Liquid diamond tennis necklaces, sculptural cuff bracelets, and memory lockets designed to mark life’s most precious milestones.",
    heroImage: "/images/home-cc/Necklaces-cc.png",
    curatedProductIds: [
      "celeste-diamond-tennis-necklace",
      "kaia-diamond-cuff",
      "aster-constellation-locket",
      "elara-solitaire",
      "solene-gold-hoops",
    ],
  },
  milestone: {
    slug: "milestone",
    title: "The Milestone Edit",
    subtitle: "Honoring triumphs, graduations, and quiet personal victories.",
    description:
      "Intimate talismans, tactile open cuffs, and delicate diamond studs crafted in hallmarked 18k solid gold.",
    heroImage: "/images/home-cc/Bracelets-cc.png",
    curatedProductIds: [
      "sena-gold-bangle",
      "vela-diamond-pendant",
      "solene-gold-hoops",
      "ora-pearl-drops",
      "nira-stacking-band",
    ],
  },
  everyday: {
    slug: "everyday",
    title: "The Daily Luxe Edit",
    subtitle: "Weightless 18k gold essentials made to belong to the skin.",
    description:
      "Hollow-core ergonomic hoops, stacking wave bands, and featherlight gold chains created for continuous daily wear.",
    heroImage: "/images/home-cc/Earrings-cc.png",
    curatedProductIds: [
      "solene-gold-hoops",
      "nira-stacking-band",
      "lyra-gold-choker",
      "vela-diamond-pendant",
      "sena-gold-bangle",
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(occasionsData).map((occasion) => ({
    occasion,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { occasion: string };
}): Promise<Metadata> {
  const occasion = occasionsData[params.occasion?.toLowerCase()];
  if (!occasion) return { title: "Occasions | Civara Jewels" };

  return {
    title: `${occasion.title} | Civara Jewels`,
    description: occasion.description,
    alternates: {
      canonical: `/occasions/${occasion.slug}`,
    },
    openGraph: {
      title: `${occasion.title} | Civara Jewels`,
      description: occasion.description,
      images: [{ url: occasion.heroImage }],
    },
  };
}

export default function OccasionPage({
  params,
}: {
  params: { occasion: string };
}) {
  const occasion = occasionsData[params.occasion?.toLowerCase()];

  if (!occasion) {
    notFound();
  }

  const products = occasion.curatedProductIds
    .map((id) => Catalog.getProductById(id))
    .filter(Boolean) as (typeof Catalog.products);

  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-4 text-xs uppercase tracking-[0.18em] text-[#6E6459]">
        <Link href="/" className="hover:text-[#241F1B] transition-colors">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link href="/collections" className="hover:text-[#241F1B] transition-colors">
          Curated Edits
        </Link>{" "}
        &nbsp;/&nbsp; <span className="text-[#241F1B]">{occasion.title}</span>
      </div>

      {/* Hero */}
      <section className="py-16 sm:py-24 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-[10.5px] uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Curated Occasion Edit
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            {occasion.title}
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="font-serif text-lg sm:text-xl text-[#9E7F3C] font-medium italic">
            "{occasion.subtitle}"
          </p>
          <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            {occasion.description}
          </p>
        </div>
      </section>

      {/* Occasions Nav Bar */}
      <section className="border-b border-[#E6DFD3] bg-[#F4EDE2]/60 px-6 py-3 overflow-x-auto">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-6 sm:gap-8 text-xs uppercase tracking-[0.16em] whitespace-nowrap">
          {Object.values(occasionsData).map((occ) => {
            const isActive = occ.slug === occasion.slug;
            return (
              <Link
                key={occ.slug}
                href={`/occasions/${occ.slug}`}
                className={`py-1 transition-colors ${
                  isActive
                    ? "text-[#9E7F3C] border-b border-[#9E7F3C] font-medium"
                    : "text-[#6E6459] hover:text-[#241F1B]"
                }`}
              >
                {occ.slug}
              </Link>
            );
          })}
        </div>
      </section>

      {/* Curated Grid */}
      <section className="py-16 sm:py-20 px-6 lg:px-14 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-7">
          {products.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Viewing CTA */}
        <div className="mt-16 p-8 sm:p-12 text-center bg-[#FBF7F0] border border-[#C9A961]/40 space-y-4 max-w-3xl mx-auto">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
            Private Atelier Concierge
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-[#241F1B] font-medium">
            Customise for Your Special Milestone
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#6E6459] max-w-xl mx-auto leading-relaxed">
            Looking for specific carat sizes, bespoke engraving, or custom metal alloys? Our master goldsmiths can tailor any design to your moment.
          </p>
          <div className="pt-2">
            <BookViewingButton
              label="Enquire for Custom Commission"
              className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
