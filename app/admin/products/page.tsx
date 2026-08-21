"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Filter, Trash2, Edit2, Star, CheckCircle2, AlertCircle } from "lucide-react";
import { Button, Select, Input } from "../../components/admin/ui";

interface ProductRow {
  id: number;
  slug: string;
  name: string;
  collection_id: number | null;
  collection_name?: string;
  price_inr: number;
  metal: string;
  is_published: number;
  is_featured: number;
  primary_image?: string;
  updated_at: string;
}

export default function AdminProductsListPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [collections, setCollections] = useState<Array<{ id: number; name: string }>>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");
  const [publishedFilter, setPublishedFilter] = useState("all");
  const [featuredFilter, setFeaturedFilter] = useState("all");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (collectionFilter !== "all") params.set("collectionId", collectionFilter);
      if (publishedFilter !== "all") params.set("published", publishedFilter === "1" ? "1" : "0");
      if (featuredFilter !== "all") params.set("featured", featuredFilter === "1" ? "1" : "0");

      const [prodRes, colRes] = await Promise.all([
        fetch(`/api/admin/products?${params.toString()}`),
        fetch("/api/admin/collections"),
      ]);

      const prodData = await prodRes.json();
      const colData = await colRes.json();

      setProducts(prodData.products || []);
      setCollections(colData.collections || []);
    } catch (err) {
      console.error("Failed to load products", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [collectionFilter, publishedFilter, featuredFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleDeleteProduct = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action will permanently remove its images and data.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchProducts();
      } else {
        alert("Failed to delete product.");
      }
    } catch (err) {
      console.error("Delete error", err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Catalog Management
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Products & Solitaires
          </h1>
        </div>

        <Link href="/admin/products/new">
          <Button size="md" className="flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> New Product
          </Button>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-5 space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
          {/* Search by name/slug */}
          <div className="lg:col-span-2">
            <label className="block text-[10px] uppercase tracking-widest text-[#6E6459] mb-1 font-medium">
              Search by name or slug
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="e.g. Elara Solitaire..."
                className="w-full p-2 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none focus:border-[#C9A961]"
              />
              <button
                type="submit"
                className="bg-[#241F1B] text-[#C9A961] px-3 py-2 text-xs uppercase"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Collection Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6E6459] mb-1 font-medium">
              Collection
            </label>
            <select
              value={collectionFilter}
              onChange={(e) => setCollectionFilter(e.target.value)}
              className="w-full p-2 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none"
            >
              <option value="all">All Collections</option>
              {collections.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Published Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6E6459] mb-1 font-medium">
              Published
            </label>
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="w-full p-2 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="1">Published (Public)</option>
              <option value="0">Draft (Hidden)</option>
            </select>
          </div>

          {/* Featured Filter */}
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-[#6E6459] mb-1 font-medium">
              Featured
            </label>
            <select
              value={featuredFilter}
              onChange={(e) => setFeaturedFilter(e.target.value)}
              className="w-full p-2 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none"
            >
              <option value="all">All</option>
              <option value="1">Featured Only</option>
              <option value="0">Not Featured</option>
            </select>
          </div>
        </form>
      </div>

      {/* Products Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading products from SQLite...</div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-sm font-serif text-[#241F1B]">No pieces match your search or filter.</p>
            <Link href="/admin/products/new">
              <Button size="sm">Create First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                  <th className="py-3 px-4 w-16">Image</th>
                  <th className="py-3 px-4">Piece Name</th>
                  <th className="py-3 px-4">Collection</th>
                  <th className="py-3 px-4">Price (INR)</th>
                  <th className="py-3 px-4">Metal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]/60">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FAF7F0] transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 relative bg-[#F4EDE2] border border-[#E6DFD3] overflow-hidden">
                        {p.primary_image ? (
                          <Image
                            src={p.primary_image}
                            alt={p.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-[#6E6459]">
                            No img
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name & Slug */}
                    <td className="py-3 px-4 font-medium text-[#241F1B]">
                      <Link href={`/admin/products/${p.id}`} className="hover:text-[#9E7F3C]">
                        {p.name}
                      </Link>
                      <div className="text-[10px] text-[#6E6459] font-mono">{p.slug}</div>
                    </td>

                    {/* Collection */}
                    <td className="py-3 px-4 text-[#6E6459]">
                      {p.collection_name || "—"}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-serif text-sm font-medium text-[#241F1B]">
                      ₹{(p.price_inr / 100).toLocaleString("en-IN")}
                    </td>

                    {/* Metal */}
                    <td className="py-3 px-4 text-[#6E6459]">
                      {p.metal}
                    </td>

                    {/* Published */}
                    <td className="py-3 px-4">
                      {p.is_published === 1 ? (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-medium inline-block">
                          Published
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-[10px] uppercase tracking-wider inline-block">
                          Draft
                        </span>
                      )}
                    </td>

                    {/* Featured */}
                    <td className="py-3 px-4">
                      {p.is_featured === 1 ? (
                        <span className="text-[#9E7F3C] font-medium flex items-center gap-1">
                          <Star className="w-3 h-3 fill-[#C9A961]" /> Yes
                        </span>
                      ) : (
                        <span className="text-[#6E6459]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${p.id}`}
                        className="inline-flex p-1.5 text-[#241F1B] hover:text-[#9E7F3C] hover:bg-[#F4EDE2]"
                        title="Edit Piece"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => handleDeleteProduct(p.id, p.name)}
                        className="inline-flex p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50"
                        title="Delete Piece"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
