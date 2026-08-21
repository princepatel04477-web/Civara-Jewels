"use client";

import React, { useState } from "react";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ChevronDown } from "lucide-react";

export default function CarePage() {
  const [openSection, setOpenSection] = useState<string>("daily-care");

  const sections = [
    {
      id: "daily-care",
      title: "Daily Care & Handling",
      content:
        "Put your jewellery on last when getting dressed, after applying hairspray, perfumes, and lotions. Avoid wearing gold solitaires while swimming in chlorinated pools, exercising, or handling harsh household cleaners.",
    },
    {
      id: "storage",
      title: "Storage & Protection",
      content:
        "Store each Civara piece individually in its provided velvet-lined suede pouch to prevent metal-on-metal friction and gemstone micro-scratches. Keep in a cool, dry place away from direct sunlight.",
    },
    {
      id: "lifetime-service",
      title: "Complimentary Lifetime Cleaning & Inspection",
      content:
        "Every Civara piece includes lifetime complimentary ultrasonic cleaning, stone security inspection, and surface re-polishing at any of our ateliers. Simply schedule a viewing or mail your piece via insured shipping.",
    },
    {
      id: "repair-resizing",
      title: "Repair & Resizing Turnaround Times",
      content:
        "Ring resizing is complimentary within the first year and takes 5 to 7 business days. Claw tightening, stone replacement, and chain re-soldering take 7 to 10 business days by our master bench craftsmen.",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Lifetime Guarantee
          </div>
          <LineReveal
            as="h1"
            text="Care & Lifetime Service"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Guidelines to preserve the luster, setting security, and nacre of your fine jewellery over generations.
          </p>
        </div>
      </section>

      {/* Accordion Sections */}
      <section className="max-w-4xl mx-auto px-6 lg:px-20 py-16">
        <div className="border border-[#E6DFD3] divide-y divide-[#E6DFD3] bg-[#FBF7F0]">
          {sections.map((sec) => {
            const isOpen = openSection === sec.id;
            return (
              <div key={sec.id} className="p-6">
                <button
                  onClick={() => setOpenSection(isOpen ? "" : sec.id)}
                  className="w-full flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-serif text-2xl font-medium text-[#241F1B]">
                    {sec.title}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#9E7F3C] transition-transform duration-320 ease-inout ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </button>
                {isOpen && (
                  <p className="mt-4 text-sm font-light leading-relaxed text-[#6E6459] pt-2 border-t border-[#E6DFD3]/60 transition-all duration-320 ease-inout">
                    {sec.content}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
