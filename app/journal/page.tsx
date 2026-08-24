"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Catalog, JournalArticle } from "../../lib/catalog";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { 
  ArrowRight, 
  Search, 
  BookOpen, 
  Sparkles, 
  Compass, 
  Feather, 
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
  Gem
} from "lucide-react";

export default function JournalIndexPage() {
  const allArticles = Catalog.articles;
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(allArticles.map((a) => a.category)));
    return ["All", ...cats];
  }, [allArticles]);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return allArticles.filter((art) => {
      const matchesCat = selectedCategory === "All" || art.category === selectedCategory;
      const matchesSearch =
        !searchQuery ||
        art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        art.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (art.tags && art.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCat && matchesSearch;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  // Featured article (Cover Story)
  const coverStory: JournalArticle = allArticles.find((a) => a.featured) || allArticles[0];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15] min-h-screen">
      {/* 1. EDITORIAL MASTHEAD HERO */}
      <section className="relative py-16 sm:py-20 lg:py-24 px-6 lg:px-14 text-center bg-gradient-to-b from-[#F4EDE2] to-[#FAF7F0] border-b border-[#E6DFD3] overflow-hidden">
        {/* Subtle decorative watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none opacity-[0.03] text-[#241F1B] font-serif text-[180px] lg:text-[260px] tracking-widest whitespace-nowrap">
          CIVARA
        </div>

        <div className="max-w-4xl mx-auto space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#FBF7F0]/80 border border-[#E6DFD3] rounded-full text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#9E7F3C] font-medium shadow-xs">
            <Feather className="w-3.5 h-3.5" /> Civara Atelier Journal · Volume IV
          </div>
          
          <LineReveal
            as="h1"
            text="Notes on Restraint, Craft & Gemmology"
            className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] text-[#241F1B]"
          />
          
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          
          <p className="text-sm sm:text-base font-light leading-relaxed text-[#6E6459] max-w-2xl mx-auto">
            Essays on metallurgical purity, lapidary physics, ancestral heirloom custodianship, and the quiet luxury philosophy guiding our Surat atelier.
          </p>

          {/* Search & Topic Quick Bar */}
          <div className="pt-6 max-w-md mx-auto relative">
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#9E7F3C] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search essays by topic, stone, craft, or keyword..."
                className="w-full pl-11 pr-4 py-3 bg-[#FBF7F0] border border-[#E6DFD3] focus:border-[#C9A961] focus:outline-none rounded-full text-xs text-[#241F1B] placeholder-[#9E9385] transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 text-[10px] uppercase font-mono text-[#9E7F3C] hover:text-[#241F1B]"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TOPIC FILTER TABS */}
      <section className="sticky top-[68px] z-30 bg-[#FAF7F0]/95 backdrop-blur-md border-b border-[#E6DFD3]/80 px-6 lg:px-14 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.16em] transition-all whitespace-nowrap font-medium ${
                    isActive
                      ? "bg-[#241F1B] text-[#C9A961] shadow-xs"
                      : "bg-[#F4EDE2]/70 text-[#6E6459] hover:text-[#241F1B] hover:bg-[#F4EDE2] border border-[#E6DFD3]/60"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
          <div className="hidden sm:block text-[11px] font-mono text-[#9E7F3C] uppercase tracking-wider shrink-0">
            Showing {filteredArticles.length} {filteredArticles.length === 1 ? "Essay" : "Essays"}
          </div>
        </div>
      </section>

      {/* 3. FEATURED MAGAZINE COVER STORY (Visible when viewing "All" and no search) */}
      {selectedCategory === "All" && !searchQuery && coverStory && (
        <section className="max-w-7xl mx-auto px-6 lg:px-14 pt-12 pb-6">
          <div className="border border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#C9A961] transition-all duration-500 rounded-sm shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 group">
            {/* Story Content Left */}
            <div className="lg:col-span-7 p-8 sm:p-12 lg:p-14 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 bg-[#241F1B] text-[#C9A961] text-[10px] uppercase tracking-[0.22em] font-medium rounded-full">
                    ★ Cover Essay
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
                    {coverStory.category}
                  </span>
                </div>

                <Link href={`/journal/${coverStory.slug}`}>
                  <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors leading-[1.15]">
                    {coverStory.title}
                  </h2>
                </Link>

                <p className="font-serif text-base sm:text-lg italic text-[#6E6459] leading-relaxed">
                  "{coverStory.subtitle}"
                </p>

                <p className="text-xs sm:text-sm font-light leading-relaxed text-[#6E6459] line-clamp-3 sm:line-clamp-4">
                  {coverStory.excerpt}
                </p>
              </div>

              {/* Author & CTA */}
              <div className="pt-6 border-t border-[#E6DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-serif font-medium text-[#241F1B]">
                    {coverStory.author}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-mono text-[#9E7F3C] uppercase tracking-wider">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {coverStory.date}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {coverStory.readTime}</span>
                  </div>
                </div>

                <Link
                  href={`/journal/${coverStory.slug}`}
                  className="bg-[#241F1B] text-[#C9A961] px-6 py-3 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-all inline-flex items-center justify-center gap-2 group/btn shrink-0"
                >
                  Read Cover Essay <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Story Image Right */}
            <div className="lg:col-span-5 relative min-h-[300px] lg:min-h-full bg-[#181412] overflow-hidden">
              <Image
                src={coverStory.image || "/images/atelier/artisan-bench.png"}
                alt={coverStory.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181412]/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#FBF7F0]/20 lg:to-transparent" />
              
              {/* Badge overlay */}
              <div className="absolute bottom-4 right-4 bg-[#241F1B]/90 backdrop-blur-md border border-[#C9A961]/40 px-3.5 py-1.5 rounded-full text-[9px] uppercase tracking-[0.25em] text-[#C9A961] font-mono">
                Surat Atelier Bench Notes
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. ESSAYS CURATED GRID */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-10 lg:py-14">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-20 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm p-8 space-y-4">
            <BookOpen className="w-8 h-8 text-[#9E7F3C] mx-auto opacity-70" />
            <h3 className="font-serif text-2xl font-medium text-[#241F1B]">No Essays Found</h3>
            <p className="text-sm text-[#6E6459] font-light max-w-md mx-auto">
              We couldn't find any journal entries matching "{searchQuery}". Try selecting another category or clear your search.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-2 border border-[#C9A961] text-[#9E7F3C] px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-[#241F1B] hover:text-[#C9A961]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((art) => (
              <article
                key={art.slug}
                className="group flex flex-col bg-[#FBF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all duration-500 rounded-sm shadow-xs hover:shadow-xl overflow-hidden"
              >
                {/* Article Image Container */}
                <Link href={`/journal/${art.slug}`} className="relative aspect-[16/10] bg-[#F4EDE2] overflow-hidden block">
                  <Image
                    src={art.image || "/images/home-cc/Rings-cc.png"}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181412]/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                  
                  {/* Category Pill Tag */}
                  <div className="absolute top-3 left-3 bg-[#FAF7F0]/95 backdrop-blur-md border border-[#E6DFD3] px-3 py-1 rounded-full text-[9px] uppercase tracking-[0.2em] font-semibold text-[#9E7F3C] shadow-xs">
                    {art.category}
                  </div>

                  {/* Read Time */}
                  <div className="absolute bottom-3 right-3 bg-[#181412]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[9px] uppercase font-mono text-[#FBF7F0] tracking-wider">
                    {art.readTime}
                  </div>
                </Link>

                {/* Article Card Body */}
                <div className="p-6 sm:p-7 flex flex-col flex-1 justify-between gap-4">
                  <div className="space-y-2.5">
                    <div className="text-[10px] font-mono text-[#9E7F3C] uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {art.date}
                    </div>

                    <Link href={`/journal/${art.slug}`}>
                      <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors leading-snug">
                        {art.title}
                      </h3>
                    </Link>

                    <p className="text-xs font-light leading-relaxed text-[#6E6459] line-clamp-3">
                      {art.excerpt}
                    </p>
                  </div>

                  {/* Card Bottom Meta & CTA */}
                  <div className="pt-4 border-t border-[#E6DFD3] flex items-center justify-between">
                    <span className="text-[11px] font-serif italic text-[#9E9385]">
                      {art.author}
                    </span>
                    <Link
                      href={`/journal/${art.slug}`}
                      className="text-xs uppercase tracking-[0.16em] text-[#241F1B] group-hover:text-[#9E7F3C] font-medium inline-flex items-center gap-1.5 transition-colors"
                    >
                      Read Essay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* 5. ATELIER GLOSSARY & BENCH STANDARDS */}
      <section className="max-w-7xl mx-auto px-6 lg:px-14 py-12 border-t border-[#E6DFD3]">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold flex items-center justify-center gap-2">
            <Compass className="w-3.5 h-3.5" /> Bench Intelligence
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            The Civara Gemmological Codex
          </h2>
          <p className="text-xs sm:text-sm font-light text-[#6E6459]">
            Key metallurgical and optical principles underlying every bespoke piece crafted at our Surat benches.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F4EDE2] border border-[#C9A961]/50 flex items-center justify-center text-[#9E7F3C]">
              <Sparkles className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-lg font-medium text-[#241F1B]">Total Internal Reflection</h4>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Every diamond pavilion is angled precisely to prevent light leakage, returning 100% of entering photons as spectral fire.
            </p>
          </div>

          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F4EDE2] border border-[#C9A961]/50 flex items-center justify-center text-[#9E7F3C]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-lg font-medium text-[#241F1B]">BIS 750 Hallmarking</h4>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Government-certified 18K purity laser-inscribed in Surat with unique HUID authenticity codes.
            </p>
          </div>

          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F4EDE2] border border-[#C9A961]/50 flex items-center justify-center text-[#9E7F3C]">
              <Gem className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-lg font-medium text-[#241F1B]">Microscopic Talon Claws</h4>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Prongs sculpted under 20x magnification to minimize metal footprint and maximize 360° stone illumination.
            </p>
          </div>

          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F4EDE2] border border-[#C9A961]/50 flex items-center justify-center text-[#9E7F3C]">
              <Feather className="w-4 h-4" />
            </div>
            <h4 className="font-serif text-lg font-medium text-[#241F1B]">Ergonomic Comfort Profile</h4>
            <p className="text-xs font-light text-[#6E6459] leading-relaxed">
              Internal band radiuses polished with vegetable rouge compound for a weightless, silk-smooth touch on the finger.
            </p>
          </div>
        </div>
      </section>

      {/* 6. THE ATELIER LEDGER (DARK LUXURY NEWSLETTER READING ROOM) */}
      <section className="bg-[#181412] text-[#FBF7F0] py-16 sm:py-20 px-6 lg:px-14 border-t border-[#3A322C]">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#241F1B] border border-[#C9A961]/40 rounded-full text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A961] font-mono">
            <BookOpen className="w-3.5 h-3.5" /> The Atelier Ledger
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium text-[#FBF7F0] leading-tight">
            Curated Notes Delivered to Your Inbox
          </h2>

          <p className="text-xs sm:text-sm font-light text-[#B8AEA2] max-w-xl mx-auto leading-relaxed">
            Bi-weekly gemmological dissections, private Surat salon viewing invitations, and early previews of newly completed bespoke heirlooms.
          </p>

          {newsletterSubscribed ? (
            <div className="p-6 bg-[#241F1B] border border-[#C9A961] rounded-sm inline-flex items-center gap-3 text-sm text-[#C9A961]">
              <CheckCircle2 className="w-5 h-5 text-[#C9A961]" />
              <span>Thank you for subscribing to The Atelier Ledger. Your welcome dispatch is on its way.</span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="pt-2 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 bg-[#241F1B] border border-[#3A322C] focus:border-[#C9A961] text-xs text-[#FBF7F0] placeholder-[#6E6459] rounded-full focus:outline-none transition-colors"
              />
              <button
                type="submit"
                className="bg-[#C9A961] text-[#181412] px-8 py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#D4B66E] transition-all whitespace-nowrap shadow-md cursor-pointer"
              >
                Join Ledger
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#6E6459] uppercase tracking-wider font-mono">
            Delivered twice monthly · Strict privacy · No unsolicited marketing
          </p>
        </div>
      </section>
    </div>
  );
}
