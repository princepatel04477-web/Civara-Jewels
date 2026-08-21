"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Catalog, Product, JournalArticle, CollectionInfo } from "../../lib/catalog";
import { useCurrency } from "../context/CurrencyContext";
import { ImageSlot } from "../components/ImageSlot";
import { Search as SearchIcon, ArrowRight } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const { formatPrice } = useCurrency();

  // Debounce input change by 250ms
  useEffect(() => {
    setIsSearching(true);
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      setIsSearching(false);
    }, 250);
    return () => clearTimeout(handler);
  }, [query]);

  const results = Catalog.searchCatalog(debouncedQuery);

  return (
    <div className="w-full">
      {/* Header Search Bar */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Search Atelier
          </div>
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rings, solitaire, emerald, diamonds, care..."
              className="w-full p-5 pl-14 bg-porcelain border border-[#C9A961] text-base text-[#241F1B] placeholder-[#6E6459]/60 shadow-sm focus:outline-none"
              autoFocus
            />
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#9E7F3C]" />
          </div>
          {query && (
            <div className="text-xs text-[#6E6459]">
              Showing search results for &ldquo;<span className="text-[#241F1B] font-medium">{query}</span>&rdquo;
            </div>
          )}
        </div>
      </section>

      {/* Search Results Area */}
      <section className="max-w-6xl mx-auto px-6 lg:px-20 py-16">
        {!debouncedQuery.trim() ? (
          <div className="text-center py-16 text-xs text-[#6E6459]">
            Type a gemstone, collection name, or keyword above to search the Civara catalog.
          </div>
        ) : (
          <div className={`space-y-16 transition-opacity duration-200 ${isSearching ? "opacity-40" : "opacity-100"}`}>
            {/* Product Results */}
            {results.products.length > 0 && (
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.24em] text-[#9E7F3C] border-b border-[#E6DFD3] pb-2 font-medium">
                  Products ({results.products.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {results.products.map((p) => (
                    <Link
                      key={p.id}
                      href={`/products/${p.id}`}
                      className="group bg-[#FBF7F0] border border-[#E6DFD3] p-4 hover:border-[#C9A961] transition-all"
                    >
                      <div className="h-64 bg-porcelain relative mb-3">
                        <ImageSlot src={p.mainImage} placeholderText={p.imagePlaceholder} alt={p.name} />
                      </div>
                      <div className="text-center space-y-1">
                        <div className="font-serif text-lg font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                          {p.name}
                        </div>
                        <div className="font-serif text-sm text-[#6E6459]">
                          {formatPrice(p.priceINR)}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Collection Results */}
            {results.collections.length > 0 && (
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.24em] text-[#9E7F3C] border-b border-[#E6DFD3] pb-2 font-medium">
                  Collections ({results.collections.length})
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {results.collections.map((c) => (
                    <Link
                      key={c.slug}
                      href={`/collections/${c.slug}`}
                      className="group bg-[#F4EDE2] border border-[#E6DFD3] p-6 hover:border-[#C9A961] transition-all space-y-2"
                    >
                      <div className="font-serif text-2xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                        {c.name}
                      </div>
                      <p className="text-xs text-[#6E6459] font-light leading-relaxed">
                        {c.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Journal Results */}
            {results.articles.length > 0 && (
              <div className="space-y-6">
                <div className="text-xs uppercase tracking-[0.24em] text-[#9E7F3C] border-b border-[#E6DFD3] pb-2 font-medium">
                  Journal Articles ({results.articles.length})
                </div>
                <div className="space-y-4">
                  {results.articles.map((art) => (
                    <Link
                      key={art.slug}
                      href={`/journal/${art.slug}`}
                      className="group block bg-[#FBF7F0] border border-[#E6DFD3] p-6 hover:border-[#C9A961] transition-all space-y-1"
                    >
                      <div className="text-[10px] uppercase tracking-widest text-[#9E7F3C]">
                        {art.category}
                      </div>
                      <h3 className="font-serif text-xl font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                        {art.title}
                      </h3>
                      <p className="text-xs text-[#6E6459] font-light">{art.excerpt}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {results.products.length === 0 &&
              results.collections.length === 0 &&
              results.articles.length === 0 && (
                <div className="text-center py-16 bg-[#F4EDE2] border border-[#E6DFD3] space-y-3">
                  <h3 className="font-serif text-2xl text-[#241F1B]">No matching items found</h3>
                  <p className="text-xs text-[#6E6459]">
                    Try searching for &quot;ring&quot;, &quot;emerald&quot;, &quot;pendant&quot;, or &quot;care&quot;.
                  </p>
                </div>
              )}
          </div>
        )}
      </section>
    </div>
  );
}
