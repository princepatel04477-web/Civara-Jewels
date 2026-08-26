"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Trash2,
  Copy,
  ExternalLink,
  Sparkles,
  ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Button, Input, Textarea, Select, Switch, ChipInput } from "../../../components/admin/ui";
import { ImageDropzone, ProductImageItem } from "../../../components/admin/ui/ImageDropzone";

const DEFAULT_COLLECTIONS = [
  { id: 1, name: "Rings", slug: "rings" },
  { id: 2, name: "Bracelets", slug: "bracelets" },
  { id: 3, name: "Necklaces", slug: "necklaces" },
  { id: 4, name: "Pendants", slug: "pendants" },
  { id: 5, name: "Bridal", slug: "bridal" },
  { id: 6, name: "Earrings", slug: "earrings" },
];

export default function AdminEditProductPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"details" | "photos" | "preview">(
    tabParam === "photos" ? "photos" : tabParam === "preview" ? "preview" : "details"
  );

  const [collections, setCollections] = useState<Array<{ id: number; name: string; slug: string }>>(DEFAULT_COLLECTIONS);
  const [metalRates, setMetalRates] = useState<Array<{ purity: string; rate_inr: number }>>([]);
  const [images, setImages] = useState<ProductImageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    collection_id: "",
    description: "",
    short_description: "",
    pricing_mode: "MANUAL" as "MANUAL" | "CALCULATED",
    priceINRDisplay: "",
    sale_priceINRDisplay: "",
    metal: "18k Yellow Gold",
    purity: "18 KT",
    metal_weight_g: "",
    stone_type: "Natural Diamond",
    stone_weight_ct: "",
    diamond_carat: "",
    diamond_clarity: "VS1",
    diamond_colour: "E-F",
    making_chargesINR: "",
    other_chargesINR: "",
    metal_rate_ref: "18 KT",
    gst_percent: "3",
    available_sizes: [] as string[],
    stock_quantity: "10",
    stock_status: "made-to-order" as "in-stock" | "made-to-order" | "out-of-stock",
    is_featured: 0,
    is_published: 1,
    sort_order: 0,
  });

  const fetchProductData = async () => {
    try {
      const [prodRes, colRes, rateRes, imgRes] = await Promise.all([
        fetch(`/api/admin/products/${id}`),
        fetch("/api/admin/collections"),
        fetch("/api/admin/pricing/rates"),
        fetch(`/api/admin/products/${id}/images`),
      ]);

      const prodData = await prodRes.json();
      const colData = await colRes.json();
      const rateData = await rateRes.json();
      const imgData = await imgRes.json();

      if (!prodRes.ok || !prodData.product) {
        throw new Error(prodData.error || "Product not found");
      }

      const p = prodData.product;
      setCollections(colData.collections || []);
      setMetalRates(rateData.rates || []);
      setImages(imgData.images || p.images || []);

      let parsedSizes: string[] = ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"];
      if (p.available_sizes) {
        try {
          parsedSizes = typeof p.available_sizes === "string" ? JSON.parse(p.available_sizes) : p.available_sizes;
        } catch {
          parsedSizes = [p.available_sizes];
        }
      }

      setForm({
        name: p.name || "",
        slug: p.slug || "",
        sku: p.sku || "",
        collection_id: p.collection_id ? String(p.collection_id) : "",
        description: p.description || "",
        short_description: p.short_description || "",
        pricing_mode: (p.pricing_mode as any) || "MANUAL",
        priceINRDisplay: String(p.price_inr ? Math.round(p.price_inr / 100) : ""),
        sale_priceINRDisplay: p.sale_price_inr ? String(Math.round(p.sale_price_inr / 100)) : "",
        metal: p.metal || "18k Yellow Gold",
        purity: p.purity || "18 KT",
        metal_weight_g: p.metal_weight_g ? String(p.metal_weight_g) : "",
        stone_type: p.stone_type || "Natural Diamond",
        stone_weight_ct: p.stone_weight_ct ? String(p.stone_weight_ct) : "",
        diamond_carat: p.diamond_carat ? String(p.diamond_carat) : "",
        diamond_clarity: p.diamond_clarity || "VS1",
        diamond_colour: p.diamond_colour || "E-F",
        making_chargesINR: p.making_charges ? String(Math.round(p.making_charges / 100)) : "",
        other_chargesINR: p.other_charges ? String(Math.round(p.other_charges / 100)) : "",
        metal_rate_ref: p.metal_rate_ref || "18 KT",
        gst_percent: String(p.gst_percent ?? 3),
        available_sizes: parsedSizes,
        stock_quantity: String(p.stock_quantity ?? 10),
        stock_status: (p.stock_status as any) || "made-to-order",
        is_featured: p.is_featured ?? 0,
        is_published: p.is_published ?? 1,
        sort_order: p.sort_order ?? 0,
      });
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to load product");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [id]);

  const selectedCategory = collections.find((c) => String(c.id) === form.collection_id);
  const isRingCategory = selectedCategory?.slug === "rings" || selectedCategory?.name?.toLowerCase().includes("ring");

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSuccessMessage("");

    const priceRupees = parseFloat(form.priceINRDisplay);
    if (isNaN(priceRupees) || priceRupees <= 0) {
      setErrorMessage("Please enter a valid retail price in INR.");
      setIsSaving(false);
      return;
    }

    const payload = {
      name: form.name.trim(),
      slug: form.slug.trim(),
      sku: form.sku.trim() || null,
      collection_id: form.collection_id ? parseInt(form.collection_id, 10) : null,
      description: form.description.trim() || null,
      short_description: form.short_description.trim() || null,
      pricing_mode: form.pricing_mode,
      price_inr: Math.round(priceRupees * 100),
      sale_price_inr: form.sale_priceINRDisplay ? Math.round(parseFloat(form.sale_priceINRDisplay) * 100) : null,
      metal: form.metal,
      purity: form.purity,
      metal_weight_g: form.metal_weight_g ? parseFloat(form.metal_weight_g) : null,
      stone_type: form.stone_type || null,
      stone_weight_ct: form.stone_weight_ct ? parseFloat(form.stone_weight_ct) : null,
      diamond_carat: form.diamond_carat ? parseFloat(form.diamond_carat) : null,
      diamond_clarity: form.diamond_clarity || null,
      diamond_colour: form.diamond_colour || null,
      making_charges: form.making_chargesINR ? Math.round(parseFloat(form.making_chargesINR) * 100) : null,
      other_charges: form.other_chargesINR ? Math.round(parseFloat(form.other_chargesINR) * 100) : null,
      metal_rate_ref: form.metal_rate_ref || null,
      gst_percent: parseFloat(form.gst_percent) || 3,
      available_sizes: form.available_sizes,
      stock_quantity: parseInt(form.stock_quantity, 10) || 10,
      stock_status: form.stock_status,
      is_featured: form.is_featured,
      is_published: form.is_published,
      sort_order: form.sort_order,
    };

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update piece");
      }

      setSuccessMessage("Changes saved successfully to SQLite.");
      setTimeout(() => setSuccessMessage(""), 4000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to update piece.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDuplicate = async () => {
    if (!confirm("Duplicate this piece? A draft copy with cloned images will be created.")) return;
    setIsDuplicating(true);
    try {
      const res = await fetch(`/api/admin/products/${id}/duplicate`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to duplicate");
      router.push(`/admin/products/${data.product.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || "Duplication failed");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${form.name}" and its associated gallery photos?`)) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/products");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Deletion failed");
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-[#6E6459]">Loading design details from SQLite...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Bar with Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider text-[#6E6459] hover:text-[#241F1B] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Designs
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
              {form.name || "Edit Design"}
            </h1>
            <span className="text-xs font-mono text-[#6E6459]">ID #{id}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/products/${form.slug}`}
            target="_blank"
            className="px-3 py-2 text-xs uppercase tracking-wider text-[#9E7F3C] hover:text-[#241F1B] border border-[#C9A961]/60 hover:bg-[#F4EDE2] transition-colors inline-flex items-center gap-1"
          >
            <ExternalLink className="w-3.5 h-3.5" /> View PDP
          </Link>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleDuplicate}
            isLoading={isDuplicating}
            className="flex items-center gap-1"
          >
            <Copy className="w-3.5 h-3.5" /> Duplicate Piece
          </Button>

          <Button size="sm" onClick={() => handleSubmit()} isLoading={isSaving} className="flex items-center gap-1">
            <Save className="w-3.5 h-3.5" /> Save Changes
          </Button>

          <button
            type="button"
            onClick={handleDelete}
            title="Delete piece"
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 border border-red-200 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Alerts */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E6DFD3] gap-6 text-xs uppercase tracking-widest font-medium">
        <button
          onClick={() => setActiveTab("details")}
          className={`pb-3 border-b-2 transition-colors ${
            activeTab === "details"
              ? "border-[#241F1B] text-[#241F1B] font-semibold"
              : "border-transparent text-[#6E6459] hover:text-[#241F1B]"
          }`}
        >
          Details & Gemmology
        </button>
        <button
          onClick={() => setActiveTab("photos")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "photos"
              ? "border-[#241F1B] text-[#241F1B] font-semibold"
              : "border-transparent text-[#6E6459] hover:text-[#241F1B]"
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Product Photos ({images.length}/8)</span>
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`pb-3 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === "preview"
              ? "border-[#241F1B] text-[#241F1B] font-semibold"
              : "border-transparent text-[#6E6459] hover:text-[#241F1B]"
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Visibility & Status</span>
        </button>
      </div>

      {/* TAB 1: DETAILS & SPECS */}
      {activeTab === "details" && (
        <form onSubmit={handleSubmit} className="space-y-8 bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-serif text-xl text-[#241F1B] pb-2 border-b border-[#E6DFD3]">
              1. Basic Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <Input
                  label="Design / Product Name *"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <Input
                label="SKU Identifier"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="URL Slug *"
                required
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                helper="Storefront URL: /products/your-slug"
              />

              <Select
                label="Jewelry Category *"
                value={form.collection_id}
                onChange={(e) => setForm({ ...form, collection_id: e.target.value })}
                options={collections.map((c) => ({ label: c.name, value: c.id }))}
              />
            </div>

            <Input
              label="Short Tagline"
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
            />

            <Textarea
              label="Full Editorial Description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Jewelry Details */}
          <div className="space-y-4 pt-4 border-t border-[#E6DFD3]">
            <h3 className="font-serif text-xl text-[#241F1B] pb-2 border-b border-[#E6DFD3]">
              2. Jewelry Details & Gemmology
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Primary Metal"
                value={form.metal}
                onChange={(e) => setForm({ ...form, metal: e.target.value })}
                options={[
                  { label: "18k Yellow Gold (BIS 750)", value: "18k Yellow Gold" },
                  { label: "18k Rose Gold", value: "18k Rose Gold" },
                  { label: "18k White Gold", value: "18k White Gold" },
                  { label: "14k Yellow Gold", value: "14k Yellow Gold" },
                  { label: "950 Platinum", value: "950 Platinum" },
                  { label: "925 Sterling Silver", value: "925 Sterling Silver" },
                ]}
              />

              <Select
                label="Purity Reference"
                value={form.purity}
                onChange={(e) => setForm({ ...form, purity: e.target.value })}
                options={[
                  { label: "18 KT", value: "18 KT" },
                  { label: "14 KT", value: "14 KT" },
                  { label: "10 KT", value: "10 KT" },
                  { label: "Silver", value: "Silver" },
                  { label: "PT950", value: "PT950" },
                ]}
              />

              <Input
                label="Net Metal Weight (grams)"
                type="number"
                step="0.01"
                value={form.metal_weight_g}
                onChange={(e) => setForm({ ...form, metal_weight_g: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Stone Type"
                value={form.stone_type}
                onChange={(e) => setForm({ ...form, stone_type: e.target.value })}
              />

              <Input
                label="Stone / Carat Weight (ct)"
                type="number"
                step="0.01"
                value={form.diamond_carat}
                onChange={(e) => setForm({ ...form, diamond_carat: e.target.value, stone_weight_ct: e.target.value })}
              />

              <Input
                label="Diamond Clarity & Colour"
                value={form.diamond_clarity}
                onChange={(e) => setForm({ ...form, diamond_clarity: e.target.value })}
              />
            </div>
          </div>

          {/* Pricing System */}
          <div className="space-y-4 pt-4 border-t border-[#E6DFD3]">
            <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD3]">
              <h3 className="font-serif text-xl text-[#241F1B]">
                3. Pricing Management
              </h3>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6459] font-medium">Mode:</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, pricing_mode: form.pricing_mode === "MANUAL" ? "CALCULATED" : "MANUAL" })}
                  className={`px-3 py-1 text-xs uppercase font-medium border ${
                    form.pricing_mode === "MANUAL"
                      ? "bg-[#241F1B] text-[#C9A961] border-[#241F1B]"
                      : "bg-[#FAF7F0] text-[#6E6459] border-[#C9A961]"
                  }`}
                >
                  {form.pricing_mode === "MANUAL" ? "Manual Price" : "Calculated Live"}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Product Retail Price in INR (₹) *"
                type="number"
                required
                value={form.priceINRDisplay}
                onChange={(e) => setForm({ ...form, priceINRDisplay: e.target.value })}
                helper="Final customer retail price (in Rupees)"
              />

              <Input
                label="Sale / Special Offer Price (INR)"
                type="number"
                value={form.sale_priceINRDisplay}
                onChange={(e) => setForm({ ...form, sale_priceINRDisplay: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Making Charges (INR)"
                type="number"
                value={form.making_chargesINR}
                onChange={(e) => setForm({ ...form, making_chargesINR: e.target.value })}
              />

              <Input
                label="Other / Hallmarking (INR)"
                type="number"
                value={form.other_chargesINR}
                onChange={(e) => setForm({ ...form, other_chargesINR: e.target.value })}
              />

              <Input
                label="GST Tax Rate (%)"
                type="number"
                value={form.gst_percent}
                onChange={(e) => setForm({ ...form, gst_percent: e.target.value })}
              />
            </div>
          </div>

          {/* Ring Sizes Configuration */}
          {isRingCategory && (
            <div className="space-y-4 pt-4 border-t border-[#E6DFD3] bg-[#FAF7F0] p-4 border">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg text-[#241F1B] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#9E7F3C]" /> Ring Sizing Configuration
                </h3>
                <span className="text-[11px] text-[#9E7F3C] font-medium uppercase tracking-wider">
                  Scale: Size 3 to 15
                </span>
              </div>
              <p className="text-xs text-[#6E6459]">
                Configured sizes (3 to 15 in 0.5 increments) available on the public product selector.
              </p>
              <ChipInput
                label="Available Ring Sizes"
                values={form.available_sizes}
                onChange={(sizes) => setForm({ ...form, available_sizes: sizes })}
              />
            </div>
          )}

          {/* Inventory */}
          <div className="space-y-4 pt-4 border-t border-[#E6DFD3]">
            <h3 className="font-serif text-xl text-[#241F1B] pb-2 border-b border-[#E6DFD3]">
              4. Inventory & Stock
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Stock Quantity"
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
              />

              <Select
                label="Stock Status"
                value={form.stock_status}
                onChange={(e) => setForm({ ...form, stock_status: e.target.value as any })}
                options={[
                  { label: "Made to Order (2-3 weeks)", value: "made-to-order" },
                  { label: "In Stock (Ships in 48h)", value: "in-stock" },
                  { label: "Vault Archive / Inquire", value: "out-of-stock" },
                ]}
              />
            </div>
          </div>

          <div className="pt-6 flex justify-end">
            <Button type="submit" size="lg" isLoading={isSaving}>
              <Save className="w-4 h-4 mr-2" /> Save Piece Changes
            </Button>
          </div>
        </form>
      )}

      {/* TAB 2: PRODUCT PHOTOS (6 to 8 Photos Gallery) */}
      {activeTab === "photos" && (
        <div className="bg-[#FBF7F0] p-8 border border-[#E6DFD3] space-y-6">
          <div>
            <h3 className="font-serif text-2xl text-[#241F1B]">
              Product Photography Gallery
            </h3>
            <p className="text-xs text-[#6E6459] mt-1">
              Every design supports 6 to 8 high-resolution photos. Primary cover is highlighted with a gold border.
            </p>
          </div>

          <ImageDropzone
            productId={parseInt(id, 10)}
            images={images}
            onImagesChange={fetchProductData}
          />
        </div>
      )}

      {/* TAB 3: VISIBILITY & PREVIEW */}
      {activeTab === "preview" && (
        <div className="bg-[#FBF7F0] p-8 border border-[#E6DFD3] space-y-6">
          <h3 className="font-serif text-2xl text-[#241F1B]">
            Storefront Visibility & Publishing
          </h3>

          <div className="space-y-4">
            <Switch
              label="Published to Storefront"
              description="When enabled, piece is publicly viewable in collections and search."
              checked={form.is_published === 1}
              onChange={(checked) => setForm({ ...form, is_published: checked ? 1 : 0 })}
            />

            <Switch
              label="Featured on Homepage"
              description="Showcase piece in the curated showcase on the homepage."
              checked={form.is_featured === 1}
              onChange={(checked) => setForm({ ...form, is_featured: checked ? 1 : 0 })}
            />

            <Input
              label="Catalog Sort Order"
              type="number"
              value={String(form.sort_order)}
              onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
              helper="Lower numbers appear first."
            />
          </div>

          <div className="pt-6 border-t border-[#E6DFD3] flex justify-between items-center">
            <Link
              href={`/products/${form.slug}`}
              target="_blank"
              className="text-xs uppercase tracking-wider text-[#9E7F3C] hover:underline inline-flex items-center gap-1 font-medium"
            >
              <ExternalLink className="w-4 h-4" /> Open Live Product Page
            </Link>

            <Button onClick={() => handleSubmit()} isLoading={isSaving} size="md">
              <Save className="w-3.5 h-3.5 mr-2" /> Save Visibility Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
