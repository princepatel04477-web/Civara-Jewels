"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Check } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../../../components/admin/ui";

export default function AdminEditCollectionPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: "",
    sort_order: 0,
    is_active: 1,
  });

  useEffect(() => {
    fetch(`/api/admin/collections/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.collection) {
          const c = data.collection;
          setForm({
            name: c.name || "",
            slug: c.slug || "",
            description: c.description || "",
            cover_image: c.cover_image || "",
            sort_order: c.sort_order || 0,
            is_active: c.is_active ?? 1,
          });
        }
      })
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/admin/collections/${id}`, {
        method: "PATCH",
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
        throw new Error(data.error || "Failed to update collection");
      }

      setSavedSuccess(true);
    } catch (err: any) {
      setErrorMessage(err.message || "Error updating collection");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-20 text-center text-xs text-[#6E6459]">Loading collection...</div>;
  }

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
            Edit Collection: {form.name}
          </h1>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
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
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="URL Slug *"
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          helper="Used in URL: /collections/[slug]"
        />

        <Textarea
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          label="Cover Image Path"
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
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
