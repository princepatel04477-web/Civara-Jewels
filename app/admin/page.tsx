"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Layers,
  Image as ImageIcon,
  Sparkles,
  Plus,
  ArrowRight,
  Clock,
  DollarSign,
  Boxes,
  AlertTriangle,
  History,
} from "lucide-react";
import { Button } from "../components/admin/ui";

interface DashboardData {
  totalProducts: number;
  publishedProducts: number;
  draftProducts: number;
  featuredProducts: number;
  totalCategories: number;
  totalImages: number;
  lowStockCount: number;
  metalRates: Array<{ id: number; metal: string; purity: string; rate_inr: number }>;
  recentProducts: Array<{
    id: number;
    name: string;
    slug: string;
    price_inr: number;
    is_published: number;
    is_featured: number;
    stock_quantity: number;
    updated_at: string;
  }>;
  recentActivity: Array<{
    id: number;
    action: string;
    entity: string;
    admin_email: string;
    timestamp: string;
  }>;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [prodRes, catRes, rateRes, actRes] = await Promise.all([
        fetch("/api/admin/products"),
        fetch("/api/admin/collections"),
        fetch("/api/admin/pricing/rates"),
        fetch("/api/admin/activity?limit=6"),
      ]);

      const prodData = await prodRes.json();
      const catData = await catRes.json();
      const rateData = await rateRes.json();
      const actData = await actRes.json();

      const products = prodData.products || [];
      const categories = catData.collections || [];
      const rates = rateData.rates || [];
      const activity = actData.logs || [];

      const published = products.filter((p: any) => p.is_published === 1).length;
      const drafts = products.filter((p: any) => p.is_published === 0).length;
      const featured = products.filter((p: any) => p.is_featured === 1).length;
      const lowStock = products.filter((p: any) => (p.stock_quantity ?? 10) < 5).length;
      const totalImgs = products.reduce((acc: number, p: any) => acc + (p.images?.length || (p.primary_image ? 1 : 0)), 0);

      setData({
        totalProducts: products.length,
        publishedProducts: published,
        draftProducts: drafts,
        featuredProducts: featured,
        totalCategories: categories.length,
        totalImages: totalImgs,
        lowStockCount: lowStock,
        metalRates: rates,
        recentProducts: products.slice(0, 6),
        recentActivity: activity,
      });
    } catch (err) {
      console.error("Dashboard fetch error", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Atelier Executive Overview
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/products/new">
            <Button size="md" className="flex items-center gap-1.5 shadow-sm">
              <Plus className="w-3.5 h-3.5" /> Add Design
            </Button>
          </Link>
          <Link href="/admin/pricing">
            <Button variant="secondary" size="md" className="flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Metal Rates
            </Button>
          </Link>
        </div>
      </div>

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Designs */}
        <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-2">
          <div className="flex items-center justify-between text-[#9E7F3C]">
            <Package className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Total Designs</span>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            {isLoading ? "—" : data?.totalProducts}
          </div>
          <div className="text-[11px] text-[#6E6459] flex items-center gap-2">
            <span className="text-emerald-700 font-medium">{data?.publishedProducts || 0} published</span>
            <span>•</span>
            <span>{data?.draftProducts || 0} draft</span>
          </div>
        </div>

        {/* Categories */}
        <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-2">
          <div className="flex items-center justify-between text-[#9E7F3C]">
            <Layers className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Categories</span>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            {isLoading ? "—" : data?.totalCategories}
          </div>
          <div className="text-[11px] text-[#6E6459]">
            Active SQLite-driven collections
          </div>
        </div>

        {/* Photography & 6-8 Images */}
        <div className="p-6 bg-[#FBF7F0] border border-[#E6DFD3] space-y-2">
          <div className="flex items-center justify-between text-[#9E7F3C]">
            <ImageIcon className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Photos & Assets</span>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            {isLoading ? "—" : data?.totalImages}
          </div>
          <div className="text-[11px] text-[#6E6459]">
            6–8 photos per piece standard
          </div>
        </div>

        {/* Low Stock Warning */}
        <div className="p-6 bg-[#241F1B] text-[#FBF7F0] border border-[#6E6459]/40 space-y-2">
          <div className="flex items-center justify-between text-[#C9A961]">
            <Boxes className="w-5 h-5" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Inventory Status</span>
          </div>
          <div className="font-serif text-3xl sm:text-4xl font-medium text-[#FBF7F0]">
            {isLoading ? "—" : data?.lowStockCount === 0 ? "Optimal" : `${data?.lowStockCount} Low`}
          </div>
          <div className="text-[11px] text-[#E6DFD3]/70">
            Made-to-order & live stock
          </div>
        </div>
      </div>

      {/* Metal Rates Quick Dashboard Strip (P11 Requirement) */}
      <div className="bg-[#FAF7F0] border border-[#C9A961]/40 p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-[#9E7F3C]" />
            <h2 className="font-serif text-lg font-medium text-[#241F1B]">Current Metal Rates</h2>
          </div>
          <Link
            href="/admin/pricing"
            className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline font-medium flex items-center gap-1"
          >
            Manage Rates <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {data?.metalRates && data.metalRates.length > 0 ? (
            data.metalRates.map((r) => (
              <div key={r.id} className="p-4 bg-[#FBF7F0] border border-[#E6DFD3] space-y-1">
                <div className="text-[10px] uppercase tracking-wider text-[#6E6459] font-medium">
                  {r.purity} ({r.metal})
                </div>
                <div className="font-serif text-xl sm:text-2xl font-medium text-[#241F1B]">
                  ₹{r.rate_inr.toLocaleString("en-IN")}
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-4 text-xs text-[#6E6459]">Loading rates from SQLite...</div>
          )}
        </div>
      </div>

      {/* Grid: Recent Catalog Updates & Recent Activity Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Catalog Updates Table (2 cols) */}
        <div className="lg:col-span-2 bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
            <h2 className="font-serif text-xl font-medium text-[#241F1B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#9E7F3C]" /> Recent Catalog Designs
            </h2>
            <Link
              href="/admin/products"
              className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline flex items-center gap-1"
            >
              All Designs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#6E6459]">Loading catalog data...</div>
          ) : data?.recentProducts.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6E6459]">No products in SQLite database yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                    <th className="py-2.5 px-2">Design Name</th>
                    <th className="py-2.5 px-2">Price (INR)</th>
                    <th className="py-2.5 px-2">Status</th>
                    <th className="py-2.5 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6DFD3]/60">
                  {data?.recentProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F4EDE2]/50 transition-colors">
                      <td className="py-3 px-2 font-medium text-[#241F1B]">
                        <Link href={`/admin/products/${p.id}`} className="hover:text-[#9E7F3C]">
                          {p.name}
                        </Link>
                        <div className="text-[10px] text-[#6E6459] font-mono">{p.slug}</div>
                      </td>
                      <td className="py-3 px-2 font-serif text-sm">
                        ₹{(p.price_inr / 100).toLocaleString("en-IN")}
                      </td>
                      <td className="py-3 px-2">
                        {p.is_published === 1 ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-medium">
                            Published
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-[10px] uppercase tracking-wider">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          href={`/admin/products/${p.id}`}
                          className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline font-medium"
                        >
                          Edit Piece
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Audit Log Stream (1 col) */}
        <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E6DFD3]">
            <h2 className="font-serif text-xl font-medium text-[#241F1B] flex items-center gap-2">
              <History className="w-4 h-4 text-[#9E7F3C]" /> Recent Activity
            </h2>
            <Link
              href="/admin/activity"
              className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline flex items-center gap-1"
            >
              All Logs <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {isLoading ? (
            <div className="py-12 text-center text-xs text-[#6E6459]">Loading activity logs...</div>
          ) : data?.recentActivity.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#6E6459]">No audit logs recorded yet.</div>
          ) : (
            <div className="space-y-3">
              {data?.recentActivity.map((log) => (
                <div key={log.id} className="p-3 bg-[#FAF7F0] border border-[#E6DFD3] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#241F1B] text-[11px] uppercase tracking-wider">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] text-[#6E6459]">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : ""}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6E6459]">
                    Entity: <span className="text-[#241F1B] font-medium">{log.entity}</span> by {log.admin_email}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
