"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Sparkles, HelpCircle } from "lucide-react";
import { Button, Input, Textarea, Select, Switch, ChipInput } from "../../../components/admin/ui";

const DEFAULT_COLLECTIONS = [
  { id: 1, name: "Rings", slug: "rings" },
  { id: 2, name: "Bracelets", slug: "bracelets" },
  { id: 3, name: "Necklaces", slug: "necklaces" },
  { id: 4, name: "Pendants", slug: "pendants" },
  { id: 5, name: "Bridal", slug: "bridal" },
  { id: 6, name: "Earrings", slug: "earrings" },
];

export default function AdminNewProductPage() {
  const router = useRouter();
  const [collections, setCollections] = useState<Array<{ id: number; name: string; slug: string }>>(DEFAULT_COLLECTIONS);
  const [metalRates, setMetalRates] = useState<Array<{ purity: string; rate_inr: number }>>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    sku: "",
    collection_id: "1",
    description: "",
    short_description: "",
    pricing_mode: "MANUAL" as "MANUAL" | "CALCULATED",
    priceINRDisplay: "", // In Rupees (e.g. 84500)
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
    available_sizes: ["3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"],
    stock_quantity: "10",
    stock_status: "made-to-order" as "in-stock" | "made-to-order" | "out-of-stock",
    is_featured: 0,
    is_published: 1,
    sort_order: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/collections").then((r) => r.json()),
      fetch("/api/admin/pricing/rates").then((r) => r.json()),
    ])
      .then(([colData, rateData]) => {
        if (colData && colData.collections && colData.collections.length > 0) {
          setCollections(colData.collections);
        }
        if (rateData && rateData.rates) {
          setMetalRates(rateData.rates);
        }
      })
      .catch(console.error);
  }, []);

  const selectedCategory = collections.find((c) => String(c.id) === form.collection_id);
  const isRingCategory = selectedCategory?.slug === "rings" || selectedCategory?.name?.toLowerCase().includes("ring");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const autoSku = `CIV-${autoSlug.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}`;

    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
      sku: prev.sku === "" || prev.sku.startsWith("CIV-") ? autoSku : prev.sku,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

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
      price_inr: Math.round(priceRupees * 100), // convert to paise
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
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create design.");
      }

      router.push(`/admin/products/${data.product.id}?tab=photos`);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create piece.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-[#E6DFD3]">
        <div className="space-y-1">
          <Link
            href="/admin/products"
            className="text-xs uppercase tracking-wider text-[#6E6459] hover:text-[#241F1B] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to All Designs
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#241F1B]">
            Add New Jewelry Design
          </h1>
        </div>

        <Button onClick={handleSubmit} isLoading={isSaving} size="md">
          <Save className="w-3.5 h-3.5 mr-2" /> Save & Upload Photos
        </Button>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
        {/* Section 1: Basic Information */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-[#241F1B] pb-2 border-b border-[#E6DFD3]">
            1. Basic Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Design / Product Name *"
                required
                placeholder="e.g. Elara Solitaire Ring"
                value={form.name}
                onChange={handleNameChange}
              />
            </div>
            <Input
              label="SKU Identifier"
              placeholder="CIV-ELARA"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="URL Slug *"
              required
              placeholder="elara-solitaire-ring"
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
            placeholder="The Solitaire & Heritage Edit"
            value={form.short_description}
            onChange={(e) => setForm({ ...form, short_description: e.target.value })}
          />

          <Textarea
            label="Full Editorial Description"
            placeholder="A single certified stone, hand-set in recycled 18-karat gold..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        {/* Section 2: Jewelry Details */}
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
              placeholder="4.8"
              value={form.metal_weight_g}
              onChange={(e) => setForm({ ...form, metal_weight_g: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Stone Type"
              placeholder="Natural Diamond / Solitaire"
              value={form.stone_type}
              onChange={(e) => setForm({ ...form, stone_type: e.target.value })}
            />

            <Input
              label="Stone / Carat Weight (ct)"
              type="number"
              step="0.01"
              placeholder="1.00"
              value={form.diamond_carat}
              onChange={(e) => setForm({ ...form, diamond_carat: e.target.value, stone_weight_ct: e.target.value })}
            />

            <Input
              label="Diamond Clarity & Colour"
              placeholder="VS1, E-F"
              value={form.diamond_clarity}
              onChange={(e) => setForm({ ...form, diamond_clarity: e.target.value })}
            />
          </div>
        </div>

        {/* Section 3: Pricing System */}
        <div className="space-y-4 pt-4 border-t border-[#E6DFD3]">
          <div className="flex items-center justify-between pb-2 border-b border-[#E6DFD3]">
            <h3 className="font-serif text-xl text-[#241F1B]">
              3. Pricing Management
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-[#6E6459] font-medium">Pricing Mode:</span>
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
              placeholder="84500"
              value={form.priceINRDisplay}
              onChange={(e) => setForm({ ...form, priceINRDisplay: e.target.value })}
              helper="Final customer retail price (in Rupees)"
            />

            <Input
              label="Sale / Special Offer Price (INR)"
              type="number"
              placeholder="Optional discount price"
              value={form.sale_priceINRDisplay}
              onChange={(e) => setForm({ ...form, sale_priceINRDisplay: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Making Charges (INR)"
              type="number"
              placeholder="8500"
              value={form.making_chargesINR}
              onChange={(e) => setForm({ ...form, making_chargesINR: e.target.value })}
            />

            <Input
              label="Other / Hallmarking (INR)"
              type="number"
              placeholder="1500"
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

        {/* Section 4: Ring Size Configuration (Conditional for Rings) */}
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
              Configured size range: 3 to 15 in 0.5 increments. All sizes will be available on the public product selector.
            </p>
            <ChipInput
              label="Available Ring Sizes (Half sizes 3 to 15)"
              values={form.available_sizes}
              onChange={(sizes) => setForm({ ...form, available_sizes: sizes })}
            />
          </div>
        )}

        {/* Section 5: Inventory */}
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

        {/* Section 6: Publishing */}
        <div className="space-y-4 pt-4 border-t border-[#E6DFD3]">
          <h3 className="font-serif text-xl text-[#241F1B] pb-2 border-b border-[#E6DFD3]">
            5. Visibility & Storefront
          </h3>

          <Switch
            label="Published to Storefront"
            description="When enabled, piece is visible in collection listings and search."
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

        <div className="pt-6 flex justify-end">
          <Button type="submit" size="lg" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Design & Upload Photos (6–8)
          </Button>
        </div>
      </form>
    </div>
  );
}
