import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Sparkles, Heart } from "lucide-react";
import { BookViewingButton } from "../../components/header/BookViewingButton";

export const metadata: Metadata = {
  title: "Jewellery Care & Lifetime Maintenance Guide",
  description: "Preserving the fire and lustre of 18k gold, natural diamonds, and pearls across generations.",
  alternates: { canonical: "/education/care" },
};

export default function CareEducationPage() {
  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Atelier Longevity Guide
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium text-[#241F1B]">
            Daily Care & Lifetime Service
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="text-sm sm:text-base font-light text-[#6E6459] max-w-2xl mx-auto leading-relaxed">
            Heirlooms are made to be worn every day. Simple care rituals keep your gold and stones shining with uninterrupted fire.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 lg:px-20 max-w-4xl mx-auto space-y-8 text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
          <h2 className="font-serif text-2xl font-medium text-[#241F1B]">Daily Cleaning at Home</h2>
          <p>
            Submerge your gold and diamond solitaire pieces in lukewarm water with a drop of mild pH-neutral soap. Gently loosen skin oils behind the stone using our ultra-soft camel-hair atelier brush. Rinse thoroughly and pat dry with a lint-free chamois cloth.
          </p>
        </div>

        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
          <h2 className="font-serif text-2xl font-medium text-[#241F1B]">Cosmetics & Activity Precautions</h2>
          <p>
            Always put on your fine jewellery as the final step after perfumes, hairsprays, and lotions have completely absorbed. Remove rings prior to rigorous gym sessions, heavy lifting, or entering chlorinated swimming pools.
          </p>
        </div>

        <div className="p-8 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3">
          <h2 className="font-serif text-2xl font-medium text-[#241F1B]">Complimentary Atelier Lifetime Service</h2>
          <p>
            Every Civara creation includes free annual claw inspection, ultrasonic cleaning, and repolishing in our Surat atelier, plus one free resizing in your first year of custody.
          </p>
        </div>

        <div className="text-center pt-6">
          <BookViewingButton
            label="Book a Service Appointment"
            className="bg-[#241F1B] text-[#C9A961] px-8 py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
          />
        </div>
      </section>
    </div>
  );
}
