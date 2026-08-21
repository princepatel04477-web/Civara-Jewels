"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Boxes, Sparkles, AlertTriangle, CheckCircle2, Search, ArrowRight } from "lucide-react";
import { Button } from "../../components/admin/ui";

interface InventoryRow {
  id: number;
  name: string;
  slug: string;
  sku: string | null;
  collection_name: string | null;
  stock_quantity: number;
  stock_status: string;
  is_published: number;
}

export default function AdminInventoryPage() {
  const [products, setProducts] = useState<InventoryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleUpdateStock = async (id: number, quantity: number, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stock_quantity: quantity,
          stock_status: status,
        }),
      });

      if (res.ok) {
        setSuccessMessage("Stock updated.");
        setTimeout(() => setSuccessMessage(""), 3000);
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase())) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Vault & Workshop Fulfillment
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Inventory & Stock Control
          </h1>
        </div>

        <Link href="/admin/inventory/ring-sizes">
          <Button variant="secondary" size="md" className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4" /> Ring Sizing Configuration
          </Button>
        </Link>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="p-4 bg-[#FBF7F0] border border-[#E6DFD3] flex items-center gap-3">
        <Search className="w-4 h-4 text-[#9E7F3C]" />
        <input
          type="text"
          placeholder="Filter designs by name, SKU or slug..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-[#241F1B] outline-none"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading inventory from SQLite...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                <th className="py-3.5 px-4">SKU / Design</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Stock Count</th>
                <th className="py-3.5 px-4">Fulfillment Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#241F1B]">
                    <Link href={`/admin/products/${p.id}`} className="hover:text-[#9E7F3C]">
                      {p.name}
                    </Link>
                    <div className="text-[10px] text-[#6E6459] font-mono">{p.sku || p.slug}</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#6E6459]">
                    {p.collection_name || "—"}
                  </td>

                  <td className="py-3.5 px-4">
                    <input
                      type="number"
                      defaultValue={p.stock_quantity ?? 10}
                      onBlur={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val) && val !== p.stock_quantity) {
                          handleUpdateStock(p.id, val, p.stock_status);
                        }
                      }}
                      className="w-20 p-1.5 bg-[#FAF7F0] border border-[#E6DFD3] text-xs font-mono text-[#241F1B] focus:border-[#C9A961] outline-none"
                    />
                  </td>

                  <td className="py-3.5 px-4">
                    <select
                      value={p.stock_status || "made-to-order"}
                      onChange={(e) => handleUpdateStock(p.id, p.stock_quantity, e.target.value)}
                      className="p-1.5 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none focus:border-[#C9A961]"
                    >
                      <option value="made-to-order">Made to Order</option>
                      <option value="in-stock">In Stock (Immediate)</option>
                      <option value="out-of-stock">Vault Archive</option>
                    </select>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline font-medium"
                    >
                      Edit Design
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
