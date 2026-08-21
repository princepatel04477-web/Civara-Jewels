"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { LineReveal } from "./motion/LineReveal";
import { RuleDraw } from "./motion/RuleDraw";

export interface LegalSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  subtitle: string;
  sections: LegalSection[];
}

export const LegalLayout: React.FC<LegalLayoutProps> = ({
  title,
  subtitle,
  sections,
}) => {
  const [activeId, setActiveId] = useState(sections[0]?.id || "");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(sec.id);
            break;
          }
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [sections]);

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Atelier Policy & Terms
          </div>
          <LineReveal
            as="h1"
            text={title}
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Main Legal Content with Sticky Left Gutter Navigation */}
      <section className="max-w-6xl mx-auto px-6 lg:px-20 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Sticky Left Navigation */}
        <div className="hidden lg:block lg:col-span-4 sticky top-32 space-y-2 bg-[#FBF7F0] p-6 border border-[#E6DFD3]">
          <div className="text-[11px] uppercase tracking-[0.24em] text-[#9E7F3C] mb-4 font-medium">
            Page Index
          </div>
          <div className="space-y-1 relative">
            {sections.map((sec) => {
              const isActive = activeId === sec.id;
              return (
                <a
                  key={sec.id}
                  href={`#${sec.id}`}
                  className={`block py-2 px-3 text-xs transition-colors relative ${
                    isActive ? "text-[#241F1B] font-medium bg-[#F4EDE2]" : "text-[#6E6459] hover:text-[#241F1B]"
                  }`}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#C9A961]" />
                  )}
                  {sec.title}
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Content Sections */}
        <div className="lg:col-span-8 space-y-16">
          {sections.map((sec) => (
            <div key={sec.id} id={sec.id} className="scroll-mt-32 space-y-4">
              <h2 className="font-serif text-2xl lg:text-3xl font-medium text-[#241F1B] border-b border-[#E6DFD3] pb-3">
                {sec.title}
              </h2>
              <div className="text-sm font-light leading-relaxed text-[#6E6459] space-y-4">
                {sec.content}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
