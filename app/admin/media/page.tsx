"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Image as ImageIcon, Star, ExternalLink, Search } from "lucide-react";

interface ProductWithImages {
  id: number;
  name: string;
  slug: string;
  collection_name?: string;
  images: Array<{
    id: number;
    path: string;
    alt: string | null;
    is_primary: number;
    sort_order: number;
  }>;
}

export default function AdminMediaPage() {
  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const totalPhotos = products.reduce((acc, p) => acc + (p.images?.length || 0), 0);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Digital Asset Management
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Product Photography & Media
          </h1>
        </div>

        <div className="text-xs text-[#6E6459]">
          Total Assets: <strong className="text-[#241F1B]">{totalPhotos} photos</strong> across {products.length} pieces
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#FBF7F0] border border-[#E6DFD3] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#9E7F3C]" />
        <input
          type="text"
          placeholder="Filter galleries by piece name or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-[#241F1B] outline-none"
        />
      </div>

      {isLoading ? (
        <div className="py-20 text-center text-xs text-[#6E6459]">Loading photography assets...</div>
      ) : (
        <div className="space-y-10">
          {filtered.map((p) => {
            const imgs = p.images || [];
            return (
              <div key={p.id} className="bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#E6DFD3]">
                  <div>
                    <h3 className="font-serif text-xl font-medium text-[#241F1B]">
                      {p.name}
                    </h3>
                    <div className="text-[10px] uppercase tracking-widest text-[#6E6459]">
                      {p.collection_name || "Uncategorized"} • {imgs.length} / 8 Photos
                    </div>
                  </div>

                  <Link
                    href={`/admin/products/${p.id}`}
                    className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline font-medium flex items-center gap-1"
                  >
                    Manage Gallery <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>

                {imgs.length === 0 ? (
                  <p className="text-xs text-[#6E6459] italic">No photos uploaded for this piece yet.</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                    {imgs.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`relative aspect-square bg-[#F4EDE2] border ${
                          img.is_primary ? "border-[#C9A961] ring-2 ring-[#C9A961]/40" : "border-[#E6DFD3]"
                        } overflow-hidden`}
                      >
                        <Image
                          src={img.path}
                          alt={img.alt || `${p.name} photo`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, 150px"
                        />
                        {img.is_primary === 1 && (
                          <div className="absolute top-1 left-1 bg-[#241F1B] text-[#C9A961] p-1">
                            <Star className="w-2.5 h-2.5 fill-[#C9A961]" />
                          </div>
                        )}
                        <div className="absolute bottom-1 right-1 bg-[#241F1B]/80 text-[#FAF7F0] text-[8px] px-1 font-mono">
                          #{idx + 1}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
