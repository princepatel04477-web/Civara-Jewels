import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { BookViewingButton } from "../../components/header/BookViewingButton";

export const metadata: Metadata = {
  title: "Precious Metals Guide: 18k Yellow, Rose, White Gold & Platinum",
  description: "Comparing 18-karat recycled gold alloys and 950 platinum metallurgy.",
  alternates: { canonical: "/education/metals" },
};

export default function PreciousMetalsPage() {
  const metals = [
    {
      name: "18K Recycled Yellow Gold (BIS 750)",
      composition: "75% Pure Gold · 12.5% Silver · 12.5% Copper",
      details: "Our proprietary honey-tone alloy provides a gentle warm glow without harsh brassiness. Durable for lifelong daily wear.",
    },
    {
      name: "18K Rose Gold",
      composition: "75% Pure Gold · 20% Copper · 5% Silver",
      details: "A soft vintage blush tone that develops an exquisite natural lustre alongside skin warmth.",
    },
    {
      name: "18K White Gold",
      composition: "75% Pure Gold · 15% Palladium · 10% Silver",
      details: "Plated with ultra-fine rhodium for brilliant mirror reflectivity that accentuates diamond whiteness.",
    },
    {
      name: "950 Platinum",
      composition: "95% Pure Platinum · 5% Ruthenium",
      details: "Naturally white, dense, and hypoallergenic. Develops a distinguished heirloom patina over decades.",
    },
  ];

  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Atelier Metallurgy Guide
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            Precious Metals & Purity
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="text-sm sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            Why 18-karat hallmarked gold is the global golden ratio of fine jewellery — balancing precious gold purity with structural tensile strength.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {metals.map((metal) => (
          <div key={metal.name} className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
            <h2 className="font-serif text-2xl font-medium text-[#241F1B]">{metal.name}</h2>
            <div className="text-[11px] text-[#9E7F3C] uppercase tracking-wider font-medium">
              {metal.composition}
            </div>
            <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
              {metal.details}
            </p>
          </div>
        ))}
      </section>

      <div className="text-center pb-20">
        <BookViewingButton
          label="Explore Custom Alloy Options"
          className="bg-[#241F1B] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
        />
      </div>
    </div>
  );
}
