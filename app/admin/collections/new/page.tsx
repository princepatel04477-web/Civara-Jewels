"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../../../components/admin/ui";

export default function AdminNewCollectionPage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: "/images/home-cc/Rings-cc.png",
    sort_order: 0,
    is_active: 1,
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || prev.slug === autoSlug.slice(0, -1) ? autoSlug : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          slug: form.slug.trim(),
          description: form.description.trim() || null,
          cover_image: form.cover_image.trim() || null,
          sort_order: form.sort_order,
          is_active: form.is_active,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create collection");
      }

      router.push("/admin/collections");
    } catch (err: any) {
      setErrorMessage(err.message || "Error creating collection");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between pb-6 border-b border-[#E6DFD3]">
        <div className="space-y-1">
          <Link
            href="/admin/collections"
            className="text-xs uppercase tracking-wider text-[#6E6459] hover:text-[#241F1B] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#241F1B]">
            Create New Collection
          </h1>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
        <Input
          label="Collection Name *"
          required
          placeholder="e.g. Solitaires & Bands"
          value={form.name}
          onChange={handleNameChange}
        />

        <Input
          label="URL Slug *"
          required
          placeholder="solitaires-and-bands"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          helper="Used in URL: /collections/[slug]"
        />

        <Textarea
          label="Description"
          placeholder="Solitaires cut to catch the room rather than the camera..."
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          label="Cover Image Path"
          placeholder="/images/home-cc/Rings-cc.png"
          value={form.cover_image}
          onChange={(e) => setForm({ ...form, cover_image: e.target.value })}
        />

        <Input
          label="Sort Order"
          type="number"
          value={form.sort_order}
          onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })}
        />

        <Switch
          label="Active Collection"
          description="Visible in navigation and category lists."
          checked={form.is_active === 1}
          onChange={(checked) => setForm({ ...form, is_active: checked ? 1 : 0 })}
        />

        <div className="pt-4 flex justify-end">
          <Button type="submit" size="md" isLoading={isSaving}>
            <Save className="w-4 h-4 mr-2" /> Save Collection
          </Button>
        </div>
      </form>
    </div>
  );
}
