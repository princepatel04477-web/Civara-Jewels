import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { BookViewingButton } from "../../components/header/BookViewingButton";

export const metadata: Metadata = {
  title: "The 4 Cs of Diamonds: Cut, Colour, Clarity, Carat",
  description: "An editorial guide to understanding diamond grading, optical brilliance, and light return.",
  alternates: { canonical: "/education/4cs" },
};

export default function Diamond4CsPage() {
  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Atelier Gemmology Guide
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            The 4 Cs of Diamonds
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="text-sm sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            Beyond standard carat weights and laboratory acronyms, discover how proportions and optical symmetry govern true fire and brilliance.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-4xl mx-auto space-y-12 text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
        {/* Cut */}
        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium block">
            01 · Cut & Proportion
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            The Most Critical Factor of Brilliance
          </h2>
          <p>
            While other Cs are determined by nature in the earth's mantle, Cut is the direct signature of human lapidary mastery. A diamond with flawless clarity but poor cut will look glassy and dull. Civara selects strictly <strong>Triple Excellent</strong> cut stones where light entering the crown reflects back through the table with maximum brilliance.
          </p>
        </div>

        {/* Colour */}
        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium block">
            02 · Colour Grade
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            The Absence of Colour (D through J)
          </h2>
          <p>
            Diamond colour grading measures the absence of body tint. We curate natural diamonds in the <strong>E–G colour spectrum</strong> (colourless to near colourless), ensuring crystalline whiteness that sets harmoniously in both 18k yellow gold and white gold alloys.
          </p>
        </div>

        {/* Clarity */}
        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium block">
            03 · Clarity Grade
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            Internal Inclusions & Eye-Clean Perfection
          </h2>
          <p>
            Under 10x gemmological magnification, nature leaves microscopic crystallization patterns. At Civara, every stone is guaranteed <strong>Eye-Clean (VS1 or higher)</strong> — with no blemishes or inclusions visible to the naked human eye.
          </p>
        </div>

        {/* Carat */}
        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-4">
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium block">
            04 · Carat Weight
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            Weight, Diameter & Finger Coverage
          </h2>
          <p>
            One carat equals exactly 200 milligrams. However, two 1.00ct diamonds can have completely different perceived sizes based on pavilion depth. We optimize crown spread so your diamond displays optimal millimeter face coverage without compromising light performance.
          </p>
        </div>

        <div className="text-center pt-6 space-y-4">
          <BookViewingButton
            label="Consult Our Master Gemmologist"
            className="bg-[#241F1B] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
          />
        </div>
      </section>
    </div>
  );
}
