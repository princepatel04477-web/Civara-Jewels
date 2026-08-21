"use client";

import React from "react";
import Link from "next/link";
import { LineReveal } from "./components/motion/LineReveal";
import { RuleDraw } from "./components/motion/RuleDraw";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center py-24 px-6 lg:px-20 text-center bg-[#FBF7F0]">
      <div className="max-w-xl mx-auto space-y-6">
        <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
          404 — Civara Atelier
        </div>
        <LineReveal
          as="h1"
          text="This piece has been moved."
          className="font-serif text-4xl sm:text-5xl font-medium leading-[1.1] text-[#241F1B]"
        />
        <RuleDraw color="gold" className="w-20 mx-auto my-4" />
        <p className="text-xs sm:text-sm font-light text-[#6E6459] leading-relaxed">
          The page or piece you are searching for might have been renamed or relocated within our high jewellery collections.
        </p>
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <Link
            href="/collections"
            className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#181412] transition-colors"
          >
            Explore Collections
          </Link>
          <Link
            href="/about"
            className="border border-[#C9A961] text-[#9E7F3C] px-8 py-3.5 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#C9A961] hover:text-[#FBF7F0] transition-colors inline-flex items-center gap-1"
          >
            The Atelier <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
