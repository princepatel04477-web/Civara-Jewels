"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  Upload,
  Star,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export interface ProductImageItem {
  id: number;
  product_id: number;
  path: string;
  alt: string | null;
  is_primary: number;
  sort_order: number;
}

interface ImageDropzoneProps {
  productId: number;
  images: ProductImageItem[];
  onImagesChange: () => void;
}

export const ImageDropzone: React.FC<ImageDropzoneProps> = ({
  productId,
  images,
  onImagesChange,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoCount = images.length;
  const isRecommendedRange = photoCount >= 6 && photoCount <= 8;
  const isBelowRecommended = photoCount < 6;

  const handleUploadBatch = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload images");
      }

      onImagesChange();
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) handleUploadBatch(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files) handleUploadBatch(files);
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Are you sure you want to remove this photo from the gallery?")) return;

    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: "DELETE",
      });
      if (res.ok) onImagesChange();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleSetPrimary = async (imageId: number) => {
    try {
      const res = await fetch(`/api/admin/products/${productId}/images/${imageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_primary: 1 }),
      });
      if (res.ok) onImagesChange();
    } catch (err) {
      console.error("Set primary failed", err);
    }
  };

  const handleMoveOrder = async (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const reordered = [...images];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const newIds = reordered.map((img) => img.id);

    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageIds: newIds }),
      });
      if (res.ok) onImagesChange();
    } catch (err) {
      console.error("Reorder failed", err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Gallery Status & 6 to 8 Photo Counter Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#F4EDE2] border border-[#E6DFD3]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase tracking-[0.2em] font-semibold text-[#241F1B]">
              DESIGN PHOTOS — {photoCount} / 8
            </span>
            {isRecommendedRange ? (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Complete Gallery
              </span>
            ) : isBelowRecommended ? (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-700" /> Recommended: 6–8 photos
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] uppercase tracking-wider font-medium">
                Full Gallery
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6E6459]">
            Upload 6 to 8 multi-angle views (Cover, Front, Side, Back, Macro Stone, Lifestyle).
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-[#241F1B] text-[#C9A961] hover:bg-[#181412] px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-1.5 shrink-0"
        >
          <Upload className="w-3.5 h-3.5" /> Upload Photos
        </button>
      </div>

      {/* Drag & Drop Multi-Image Uploader */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-[#C9A961]/60 hover:border-[#9E7F3C] bg-[#FAF7F0] p-8 text-center cursor-pointer transition-colors space-y-3"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={handleFileChange}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#C9A961] animate-spin" />
            <p className="text-xs text-[#6E6459] uppercase tracking-wider">
              Processing & converting batch to WebP...
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-[#9E7F3C]" />
            <div className="font-serif text-lg text-[#241F1B]">
              Drop 6–8 design photos here or click to browse
            </div>
            <div className="text-[11px] text-[#6E6459]">
              Supports multi-file selection (JPG, PNG, WebP). Optimized at 2400px edge for luxury jewelry.
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Uploaded Gallery Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs uppercase tracking-[0.2em] text-[#6E6459] font-medium">
            Photo Order & Primary Cover ({images.length} photos)
          </h4>
          <span className="text-[10px] text-[#6E6459]">
            First photo is primary cover on catalog cards and store listings.
          </span>
        </div>

        {images.length === 0 ? (
          <p className="text-xs text-[#6E6459] italic bg-[#F4EDE2] p-4 border border-[#E6DFD3]">
            No photos uploaded yet. Designs should feature 6–8 photos before publishing.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, idx) => (
              <div
                key={img.id}
                className={`relative bg-[#FAF7F0] border ${
                  img.is_primary ? "border-[#C9A961] shadow-md ring-2 ring-[#C9A961]/30" : "border-[#E6DFD3]"
                } overflow-hidden group flex flex-col`}
              >
                {/* Photo Preview */}
                <div className="relative aspect-square w-full bg-[#F4EDE2]">
                  <Image
                    src={img.path}
                    alt={img.alt || `Photo ${idx + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />

                  {/* Slot Number */}
                  <div className="absolute bottom-2 left-2 bg-[#241F1B]/80 text-[#FAF7F0] text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-mono">
                    #{idx + 1}
                  </div>

                  {/* Primary Badge */}
                  {img.is_primary === 1 && (
                    <div className="absolute top-2 left-2 bg-[#241F1B] text-[#C9A961] text-[9px] uppercase tracking-wider px-2 py-0.5 font-medium flex items-center gap-1 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-[#C9A961]" /> Cover Photo
                    </div>
                  )}

                  {/* Quick Action Overlay */}
                  <div className="absolute inset-0 bg-[#241F1B]/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {img.is_primary === 0 && (
                      <button
                        type="button"
                        onClick={() => handleSetPrimary(img.id)}
                        className="p-2 bg-[#FAF7F0] text-[#241F1B] hover:text-[#9E7F3C] text-[10px] uppercase tracking-wider font-medium"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      title="Remove Photo"
                      className="p-2 bg-red-600 text-white hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bottom Control Bar: Reorder buttons */}
                <div className="p-2 bg-[#FAF7F0] border-t border-[#E6DFD3] flex items-center justify-between text-xs">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMoveOrder(idx, "left")}
                    className="p-1 text-[#6E6459] hover:text-[#241F1B] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Left / Earlier"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>

                  <span className="text-[10px] text-[#6E6459] font-mono">
                    View {idx + 1}
                  </span>

                  <button
                    type="button"
                    disabled={idx === images.length - 1}
                    onClick={() => handleMoveOrder(idx, "right")}
                    className="p-1 text-[#6E6459] hover:text-[#241F1B] disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move Right / Later"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
