"use client";

import React, { useEffect, useState } from "react";
import { Plus, Trash2, Edit2, Layers, AlertCircle, CheckCircle2, ArrowUp, ArrowDown } from "lucide-react";
import { Button, Input, Textarea, Switch } from "../../components/admin/ui";

interface CategoryItem {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  is_active: number;
  sort_order: number;
  product_count?: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    cover_image: "",
    is_active: 1,
    sort_order: 0,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/collections");
      const data = await res.json();
      setCategories(data.collections || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setForm({
      name: "",
      slug: "",
      description: "",
      cover_image: "",
      is_active: 1,
      sort_order: categories.length,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c: CategoryItem) => {
    setEditingCategory(c);
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      cover_image: c.cover_image || "",
      is_active: c.is_active,
      sort_order: c.sort_order,
    });
    setErrorMessage("");
    setIsModalOpen(true);
  };

  const handleNameChange = (val: string) => {
    const autoSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setForm((prev) => ({
      ...prev,
      name: val,
      slug: prev.slug === "" || editingCategory ? prev.slug : autoSlug,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    try {
      const url = editingCategory
        ? `/api/admin/collections/${editingCategory.id}`
        : "/api/admin/collections";
      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save category");

      setIsModalOpen(false);
      setSuccessMessage(editingCategory ? "Category updated." : "Category created.");
      setTimeout(() => setSuccessMessage(""), 3500);
      fetchCategories();
    } catch (err: any) {
      setErrorMessage(err.message || "Save failed");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (c: CategoryItem) => {
    if (!confirm(`Delete category "${c.name}"? SQLite safety check will prevent deletion if pieces are assigned to it.`)) return;

    try {
      const res = await fetch(`/api/admin/collections/${c.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Cannot delete category");
        return;
      }
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Catalog Taxonomy
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Categories & Collections
          </h1>
        </div>

        <Button onClick={handleOpenAdd} size="md" className="flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Categories Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading categories from SQLite...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                <th className="py-3 px-4">Category Name</th>
                <th className="py-3 px-4">Slug</th>
                <th className="py-3 px-4">Assigned Designs</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60">
              {categories.map((c) => (
                <tr key={c.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="py-3.5 px-4 font-medium text-[#241F1B]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-3.5 h-3.5 text-[#9E7F3C]" />
                      <span>{c.name}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6459]">
                    /collections/{c.slug}
                  </td>
                  <td className="py-3.5 px-4 font-serif text-sm text-[#241F1B]">
                    {c.product_count || 0} pieces
                  </td>
                  <td className="py-3.5 px-4">
                    {c.is_active === 1 ? (
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-neutral-200 text-neutral-700 text-[10px] uppercase tracking-wider">
                        Disabled
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(c)}
                      className="p-1.5 text-[#241F1B] hover:text-[#9E7F3C] hover:bg-[#F4EDE2]"
                      title="Edit Category"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c)}
                      className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50"
                      title="Delete Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal / Drawer for Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181412]/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#C9A961]/50 p-6 sm:p-8 shadow-2xl space-y-6 text-[#241F1B]">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                Category Configuration
              </div>
              <h3 className="font-serif text-2xl font-medium">
                {editingCategory ? `Edit "${editingCategory.name}"` : "Add New Category"}
              </h3>
            </div>

            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <Input
                label="Category Name *"
                required
                placeholder="e.g. Solitaires & Rings"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
              />

              <Input
                label="URL Slug *"
                required
                placeholder="rings"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
              />

              <Textarea
                label="Editorial Description"
                placeholder="Heirloom solitaires hand-finished in 18k gold..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <Switch
                label="Category Active"
                description="When active, category is listed in public navigation."
                checked={form.is_active === 1}
                onChange={(checked) => setForm({ ...form, is_active: checked ? 1 : 0 })}
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E6DFD3]">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  Save Category
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
