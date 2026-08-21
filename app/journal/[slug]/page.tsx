"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, notFound } from "next/navigation";
import { Catalog } from "../../../lib/catalog";
import { LineReveal } from "../../components/motion/LineReveal";
import { RuleDraw } from "../../components/motion/RuleDraw";
import { ArrowLeft, MessageCircle, Share2, BookOpen } from "lucide-react";

export default function JournalArticlePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const article = Catalog.getArticleBySlug(slug) || Catalog.articles[0];
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }

    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress(window.scrollY / total);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `"${article.title}" — Civara Journal\n\n${currentUrl || "https://civara-jewels.vercel.app/journal/" + article.slug}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="w-full relative bg-[#FAF7F0] text-[#211C15]">
      {/* Top fixed scroll progress hairline in gold */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-[#E6DFD3] z-50 pointer-events-none">
        <div
          className="h-full bg-[#C9A961] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 lg:px-14 py-6 text-xs uppercase tracking-[0.18em] text-[#6E6459]">
        <Link href="/" className="hover:text-[#241F1B]">
          Home
        </Link>{" "}
        &nbsp;/&nbsp;{" "}
        <Link href="/journal" className="hover:text-[#241F1B]">
          Journal
        </Link>{" "}
        &nbsp;/&nbsp; <span className="text-[#241F1B]">{article.title}</span>
      </div>

      {/* Article Header */}
      <section className="max-w-4xl mx-auto px-6 lg:px-14 py-8 space-y-4 text-center">
        <div className="flex items-center justify-center gap-3 text-xs uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
          <span>{article.category}</span>
          <span>·</span>
          <span>{article.readTime}</span>
          <span>·</span>
          <span>{article.date}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.1] text-[#241F1B]">
          {article.title}
        </h1>
        <p className="text-base sm:text-lg font-light leading-relaxed text-[#6E6459] max-w-2xl mx-auto pt-2">
          {article.subtitle}
        </p>
        <RuleDraw color="gold" className="w-20 mx-auto my-6" />
      </section>

      {/* Hero Editorial Image */}
      <section className="max-w-5xl mx-auto px-6 lg:px-14 mb-12">
        <div className="relative aspect-[16/9] sm:aspect-[2.2/1] bg-[#F4EDE2] border border-[#E6DFD3] overflow-hidden">
          <Image
            src="/images/home-cc/Rings-cc.png"
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
        </div>
      </section>

      {/* Main Content Grid: TOC on Desktop + Article Body */}
      <section className="max-w-6xl mx-auto px-6 lg:px-14 pb-24 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Desktop Sticky Table of Contents (TOC) */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-28 self-start space-y-6">
          <div className="p-5 bg-[#FBF7F0] border border-[#E6DFD3] space-y-3 text-xs">
            <div className="flex items-center gap-2 uppercase tracking-[0.2em] text-[10px] text-[#9E7F3C] font-medium">
              <BookOpen className="w-3.5 h-3.5" /> Table of Contents
            </div>
            <ul className="space-y-2 text-[#6E6459] font-light">
              <li className="hover:text-[#241F1B] transition-colors cursor-pointer">• Atelier Overview</li>
              <li className="hover:text-[#241F1B] transition-colors cursor-pointer">• Material Assay & Origin</li>
              <li className="hover:text-[#241F1B] transition-colors cursor-pointer">• Lapidary Proportions</li>
              <li className="hover:text-[#241F1B] transition-colors cursor-pointer">• Heirloom Custody</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="w-full border border-[#C9A961] text-[#9E7F3C] py-3 text-xs uppercase tracking-wider hover:bg-[#241F1B] hover:text-[#C9A961] hover:border-[#241F1B] transition-all flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" /> Share on WhatsApp
          </button>
        </aside>

        {/* Article Body */}
        <div className="lg:col-span-9 max-w-2xl space-y-8 text-sm sm:text-base font-light leading-relaxed text-[#6E6459]">
          <p className="first-letter:font-serif first-letter:text-6xl first-letter:text-[#C9A961] first-letter:float-left first-letter:mr-3 first-letter:leading-none">
            {article.content[0]}
          </p>

          {/* Pull Quote */}
          <div className="bg-[#F4EDE2] border-l-2 border-[#C9A961] p-8 my-8 space-y-2">
            <p className="font-serif text-2xl sm:text-3xl italic leading-snug text-[#241F1B]">
              "{article.pullQuote}"
            </p>
          </div>

          {article.content.slice(1).map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          {/* Mobile Share Action */}
          <div className="pt-6 lg:hidden">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="w-full bg-[#241F1B] text-[#C9A961] py-3.5 text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> Share on WhatsApp
            </button>
          </div>

          {/* Bottom metadata */}
          <div className="pt-8 border-t border-[#E6DFD3] flex items-center justify-between text-xs">
            <Link
              href="/journal"
              className="uppercase tracking-[0.2em] text-[#241F1B] border-b border-[#E6DFD3] pb-1 hover:text-[#9E7F3C] flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Journal Index
            </Link>
            <span className="text-[#6E6459]">By {article.author}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
