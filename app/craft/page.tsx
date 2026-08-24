import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Award, ShieldCheck, FileCheck, Compass, Sparkles, ArrowRight } from "lucide-react";
import { BookViewingButton } from "../components/header/BookViewingButton";

export const metadata: Metadata = {
  title: "Craft & Material Provenance",
  description:
    "The truth about our materials: RJC-certified 18k recycled gold, GIA & IGI certified conflict-free diamonds, and master bench goldsmithing.",
  alternates: {
    canonical: "/craft",
  },
  openGraph: {
    title: "Craft & Material Provenance | Civara Jewels",
    description:
      "RJC-certified 18k recycled gold, GIA/IGI certified diamonds, and master bench goldsmithing.",
  },
};

export default function CraftPage() {
  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      {/* Hero Header */}
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center border-b border-[#E6DFD3] bg-[#FBF7F0]">
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Civara Atelier Standards
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-medium leading-[1.08] text-[#241F1B]">
            Craft & Material Provenance
          </h1>
          <div className="w-24 h-[1px] bg-[#C9A961] mx-auto my-4" />
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-2xl mx-auto">
            Fine jewellery is an intimate custody of precious elements. We document every grain of gold and every facet of diamond from refiner assay to your skin.
          </p>
        </div>
      </section>

      {/* Section 1: RJC-Certified 18K Recycled Gold */}
      <section className="py-16 lg:py-24 px-6 lg:px-20 max-w-7xl mx-auto border-b border-[#E6DFD3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
              01 · Gold Sourcing
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              100% RJC-Certified Recycled Gold
            </h2>
            <p className="text-sm font-light leading-relaxed text-[#6E6459]">
              Every gram of gold poured in our atelier originates from RJC (Responsible Jewellery Council) certified refineries in Surat and accredited bullion houses. By refining existing pre-owned fine jewellery and industrial recycled bullion, we avoid virgin gold mining footprint entirely.
            </p>
            <div className="bg-[#F4EDE2] border border-[#E6DFD3] p-5 space-y-2 text-xs">
              <div className="font-medium text-[#241F1B]">Atelier Purity Guarantee:</div>
              <p className="text-[#6E6459] leading-relaxed">
                75.0% pure gold alloyed with 12.5% silver and 12.5% copper to create our signature warm honey patina — luminous, enduring, and hypoallergenic.
              </p>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] bg-white border border-[#E6DFD3] overflow-hidden">
            <Image
              src="/images/home-cc/Rings-cc.png"
              alt="Molten 18k recycled gold alloy"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Section 2: GIA & IGI Diamond Certification */}
      <section className="py-16 lg:py-24 px-6 lg:px-20 max-w-7xl mx-auto border-b border-[#E6DFD3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 lg:order-2 space-y-5">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
              02 · Diamond Verification
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              Independent GIA & IGI Certification
            </h2>
            <p className="text-sm font-light leading-relaxed text-[#6E6459]">
              We do not self-certify stones. Every solitary diamond above 0.30 carats is independently graded by the Gemological Institute of America (GIA) or International Gemological Institute (IGI).
            </p>
            <ul className="space-y-2.5 text-xs text-[#6E6459]">
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9E7F3C]" /> Laser-inscribed serial number on the diamond girdle matching certificate.
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9E7F3C]" /> Strict Kimberley Process certification guaranteeing 100% conflict-free origins.
              </li>
              <li className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#9E7F3C]" /> Triple Excellent cut grades prioritizing fire, brilliance, and scintillation.
              </li>
            </ul>
          </div>

          <div className="lg:col-span-6 lg:order-1 relative aspect-[4/3] bg-white border border-[#E6DFD3] overflow-hidden">
            <Image
              src="/images/vela-pendant.jpg"
              alt="GIA certified diamond inspection loupe"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Section 3: BIS 750 Hallmarking */}
      <section className="py-16 lg:py-24 px-6 lg:px-20 max-w-7xl mx-auto border-b border-[#E6DFD3]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-6 space-y-5">
            <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
              03 · Government Assay
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
              BIS 750 Hallmark Stamping
            </h2>
            <p className="text-sm font-light leading-relaxed text-[#6E6459]">
              Every finished jewel is submitted to the Bureau of Indian Standards (BIS) Hallmarking Centre in Surat. The hallmark contains three permanent laser marks: the BIS logo triangle, the purity numeral 750, and the unique 6-digit HUID (Hallmark Unique Identification) code.
            </p>
            <div className="pt-2">
              <Link
                href="/certification"
                className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline font-medium"
              >
                Learn more about BIS Hallmarking →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] bg-white border border-[#E6DFD3] overflow-hidden">
            <Image
              src="/images/home-cc/bridal-cc.png"
              alt="BIS 750 hallmark engraving"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
          </div>
        </div>
      </section>

      {/* Section 4: Bench Goldsmith Workflow */}
      <section className="py-16 lg:py-24 px-6 lg:px-20 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
            04 · The Bench Goldsmith
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B]">
            From Technical Brief to Masterpiece
          </h2>
          <p className="text-sm font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            Every Civara creation is crafted by a dedicated master goldsmith with over two decades of traditional bench experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left pt-6">
          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
            <div className="font-serif text-2xl text-[#9E7F3C]">I. Wax & Mould</div>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Precision 3D concept translated into ultra-fine micro-investment casting with zero porosity.
            </p>
          </div>
          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
            <div className="font-serif text-2xl text-[#9E7F3C]">II. Hand Lapidary</div>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Microscope claw setting and bezel shaping ensuring flush seated stones with 360° light transmission.
            </p>
          </div>
          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
            <div className="font-serif text-2xl text-[#9E7F3C]">III. Final Polish</div>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Hand-buffing with natural rouge compound followed by ultrasonic bath and final gemmological assay.
            </p>
          </div>
        </div>

        <div className="pt-8">
          <BookViewingButton
            label="Schedule an Atelier Consultation"
            className="bg-[#241F1B] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
          />
        </div>
      </section>
    </div>
  );
}
