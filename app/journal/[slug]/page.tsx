"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Catalog, JournalArticle } from "../../../lib/catalog";
import { LineReveal } from "../../components/motion/LineReveal";
import { RuleDraw } from "../../components/motion/RuleDraw";
import { 
  ArrowLeft, 
  ArrowRight,
  MessageCircle, 
  Share2, 
  BookOpen, 
  Check, 
  Sparkles,
  Calendar,
  Clock,
  ExternalLink,
  Feather
} from "lucide-react";

export default function JournalArticlePage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const article: JournalArticle = Catalog.getArticleBySlug(slug) || Catalog.articles[0];
  const relatedProduct = article.relatedProductSlug ? Catalog.getProductById(article.relatedProductSlug) : null;
  const otherArticles = Catalog.articles.filter((a) => a.slug !== article.slug).slice(0, 2);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);

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

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl || "https://civara-jewels.vercel.app/journal/" + article.slug);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="w-full relative bg-[#FAF7F0] text-[#211C15]">
      {/* Top fixed scroll progress hairline in gold */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] bg-[#E6DFD3] z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-[#9E7F3C] via-[#C9A961] to-[#E6DFD3] transition-all duration-75"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 lg:px-14 py-6 text-xs uppercase tracking-[0.18em] text-[#6E6459] flex items-center gap-2">
        <Link href="/" className="hover:text-[#241F1B] transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/journal" className="hover:text-[#241F1B] transition-colors">
          Journal
        </Link>
        <span>/</span>
        <span className="text-[#241F1B] font-medium truncate max-w-xs sm:max-w-md">{article.title}</span>
      </div>

      {/* Article Header */}
      <section className="max-w-4xl mx-auto px-6 lg:px-14 py-6 sm:py-10 space-y-5 text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#F4EDE2] border border-[#E6DFD3] rounded-full text-[10.5px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
          <Feather className="w-3 h-3" /> {article.category}
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-medium leading-[1.12] text-[#241F1B]">
          {article.title}
        </h1>

        <p className="font-serif text-lg sm:text-xl italic text-[#6E6459] max-w-2xl mx-auto pt-1 leading-relaxed">
          "{article.subtitle}"
        </p>

        <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#9E7F3C] uppercase tracking-wider pt-2">
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {article.date}</span>
          <span>·</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime}</span>
          <span>·</span>
          <span className="text-[#241F1B] font-serif capitalize italic">{article.author}</span>
        </div>

        <RuleDraw color="gold" className="w-20 mx-auto my-4" />
      </section>

      {/* Hero Editorial Image with Luxury Frame */}
      <section className="max-w-5xl mx-auto px-6 lg:px-14 mb-14">
        <div className="relative aspect-[16/9] sm:aspect-[2.1/1] bg-[#181412] border border-[#E6DFD3] rounded-sm overflow-hidden shadow-lg">
          <Image
            src={article.image || "/images/atelier/artisan-bench.png"}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181412]/60 via-transparent to-transparent" />
          
          <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 text-[10px] uppercase font-mono tracking-[0.24em] text-[#FBF7F0] bg-[#181412]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9A961]/30">
            Civara Atelier Archives · Surat, Gujarat
          </div>
        </div>
      </section>

      {/* Main Content Grid: Sidebar + Body */}
      <section className="max-w-6xl mx-auto px-6 lg:px-14 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Desktop Sticky Reading Sidebar */}
        <aside className="hidden lg:block lg:col-span-4 sticky top-28 self-start space-y-6">
          <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-4 shadow-xs">
            <div className="flex items-center gap-2 uppercase tracking-[0.22em] text-[10px] text-[#9E7F3C] font-semibold">
              <BookOpen className="w-3.5 h-3.5" /> Editorial Overview
            </div>
            <div className="text-xs text-[#6E6459] font-light leading-relaxed">
              {article.excerpt}
            </div>
            
            {article.tags && article.tags.length > 0 && (
              <div className="pt-3 border-t border-[#E6DFD3] flex flex-wrap gap-1.5">
                {article.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-[#F4EDE2] text-[10px] font-mono text-[#9E7F3C] uppercase tracking-wider rounded-sm">
                    #{t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Social Share Box */}
          <div className="p-5 bg-[#FBF7F0] border border-[#E6DFD3] rounded-sm space-y-3">
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-[#241F1B] font-medium">
              Share This Dispatch
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="w-full border border-[#C9A961] text-[#9E7F3C] py-2.5 px-3 text-[11px] uppercase tracking-wider hover:bg-[#241F1B] hover:text-[#C9A961] hover:border-[#241F1B] transition-all flex items-center justify-center gap-1.5 rounded-sm cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="w-full bg-[#241F1B] text-[#FBF7F0] py-2.5 px-3 text-[11px] uppercase tracking-wider hover:bg-[#181412] hover:text-[#C9A961] transition-all flex items-center justify-center gap-1.5 rounded-sm cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-[#C9A961]" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
            </div>
          </div>

          {/* Related Product Card Widget */}
          {relatedProduct && (
            <div className="p-5 bg-[#F4EDE2]/80 border border-[#C9A961]/40 rounded-sm space-y-3">
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#9E7F3C] font-semibold flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" /> Featured Creation
              </div>
              <Link href={`/products/${relatedProduct.id}`} className="group flex gap-3.5 items-center">
                <div className="w-16 h-16 relative bg-[#FAF7F0] border border-[#E6DFD3] rounded-sm shrink-0 overflow-hidden">
                  <Image
                    src={relatedProduct.mainImage || "/images/home-cc/Rings-cc.png"}
                    alt={relatedProduct.name}
                    fill
                    sizes="64px"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="font-serif text-base font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors leading-tight">
                    {relatedProduct.name}
                  </h4>
                  <div className="text-xs font-mono text-[#9E7F3C] mt-0.5">
                    ₹{relatedProduct.priceINR.toLocaleString("en-IN")}
                  </div>
                </div>
              </Link>
              <Link
                href={`/products/${relatedProduct.id}`}
                className="w-full text-center block bg-[#241F1B] text-[#C9A961] py-2 text-[11px] uppercase tracking-[0.18em] rounded-sm hover:bg-[#181412] transition-colors"
              >
                Explore Creation →
              </Link>
            </div>
          )}
        </aside>

        {/* Article Body */}
        <div className="lg:col-span-8 space-y-7 text-sm sm:text-base font-light leading-[1.85] text-[#4A4238]">
          {/* First Paragraph with Drop Cap */}
          <p className="first-letter:font-serif first-letter:text-6xl first-letter:text-[#9E7F3C] first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:font-medium">
            {article.content[0]}
          </p>

          {/* Pull Quote */}
          {article.pullQuote && (
            <div className="bg-gradient-to-r from-[#F4EDE2] to-[#FAF7F0] border-l-3 border-[#C9A961] p-7 sm:p-9 my-8 space-y-2 rounded-r-sm shadow-xs">
              <p className="font-serif text-2xl sm:text-3xl italic leading-snug text-[#241F1B]">
                "{article.pullQuote}"
              </p>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#9E7F3C] font-mono pt-1">
                — {article.author} · Surat Atelier
              </div>
            </div>
          )}

          {article.content.slice(1).map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Mobile Share Action Bar */}
          <div className="pt-6 lg:hidden flex gap-3">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex-1 bg-[#241F1B] text-[#C9A961] py-3.5 text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp
            </button>
            <button
              type="button"
              onClick={handleCopyLink}
              className="flex-1 border border-[#C9A961] text-[#9E7F3C] py-3.5 text-xs uppercase tracking-wider rounded-full flex items-center justify-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-[#9E7F3C]" /> : <Share2 className="w-4 h-4" />}
              {copied ? "Link Copied!" : "Share Link"}
            </button>
          </div>

          {/* Article Footer & Author Signature */}
          <div className="pt-10 border-t border-[#E6DFD3] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="text-[#6E6459]">
                Published by <span className="text-[#241F1B] font-medium">{article.author}</span> · Civara Jewels Atelier, Surat
              </div>
              <Link
                href="/journal"
                className="uppercase tracking-[0.2em] text-[#9E7F3C] hover:text-[#241F1B] flex items-center gap-1.5 font-medium transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> All Journal Entries
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. NEXT ESSAYS RECOMMENDATION GRID */}
      {otherArticles.length > 0 && (
        <section className="bg-[#F4EDE2]/50 border-t border-[#E6DFD3] py-16 px-6 lg:px-14">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="flex items-end justify-between border-b border-[#E6DFD3] pb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-semibold">
                  Continued Reading
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
                  Further Atelier Notes
                </h3>
              </div>
              <Link
                href="/journal"
                className="text-xs uppercase tracking-[0.18em] text-[#241F1B] hover:text-[#9E7F3C] font-medium flex items-center gap-1"
              >
                View Archive <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/journal/${art.slug}`}
                  className="group bg-[#FBF7F0] border border-[#E6DFD3] hover:border-[#C9A961] p-6 sm:p-7 rounded-sm transition-all duration-500 shadow-xs hover:shadow-lg flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#9E7F3C] font-semibold">
                      {art.category} · {art.readTime}
                    </div>
                    <h4 className="font-serif text-xl sm:text-2xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs font-light text-[#6E6459] line-clamp-2 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>
                  <div className="pt-2 text-xs uppercase tracking-[0.18em] text-[#241F1B] group-hover:text-[#9E7F3C] font-medium inline-flex items-center gap-1">
                    Read Essay <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
