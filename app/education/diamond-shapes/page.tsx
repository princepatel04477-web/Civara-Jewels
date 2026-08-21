import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookViewingButton } from "../../components/header/BookViewingButton";

export const metadata: Metadata = {
  title: "Diamond Shapes & Silhouettes Guide",
  description: "Comparing round brilliant, oval, emerald cut, pear, and cushion diamond silhouettes.",
  alternates: { canonical: "/education/diamond-shapes" },
};

export default function DiamondShapesPage() {
  const shapes = [
    {
      name: "Round Brilliant",
      traits: "57–58 facets engineered for maximum total internal reflection and fire. The classic timeless silhouette.",
      ratio: "1.00 : 1.00",
    },
    {
      name: "Oval Solitaire",
      traits: "Elongates the finger with modern grace. Offers greater surface face-up area per carat than a round diamond.",
      ratio: "1.35 – 1.45",
    },
    {
      name: "Emerald Cut",
      traits: "Step-cut faceting creating an architectonic 'hall of mirrors' reflection. Celebrates exceptional purity and clarity.",
      ratio: "1.40 – 1.55",
    },
    {
      name: "Pear & Drop",
      traits: "Teardrop silhouette combining the fire of brilliant faceting with the poetry of organic form.",
      ratio: "1.50 – 1.65",
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Atelier Shape Study
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            Diamond Shapes & Silhouettes
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="text-sm sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            Each diamond cut holds a distinct architectural geometry and light personality.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {shapes.map((shape) => (
          <div key={shape.name} className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#241F1B]">{shape.name}</h2>
            <div className="text-[11px] text-[#9E7F3C] uppercase tracking-wider font-medium">
              Ideal Length-to-Width: {shape.ratio}
            </div>
            <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
              {shape.traits}
            </p>
          </div>
        ))}
      </section>

      <div className="text-center pb-20">
        <BookViewingButton
          label="Compare Diamond Shapes in Person"
          className="bg-[#241F1B] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
        />
      </div>
    </div>
  );
}
