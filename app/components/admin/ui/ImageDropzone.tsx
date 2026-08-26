"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  Star,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  Plus,
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
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const photoCount = images.length;
  const isRecommendedRange = photoCount >= 6 && photoCount <= 8;
  const isBelowRecommended = photoCount < 6;

  // Convert File to Base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload a single file with fallback
  const uploadSingleFile = async (file: File, index: number, total: number) => {
    setUploadProgress(`Uploading photo ${index + 1} of ${total}: ${file.name}...`);

    // 1. Try Multipart FormData first
    const formData = new FormData();
    formData.append("file", file);

    let res = await fetch(`/api/admin/products/${productId}/images`, {
      method: "POST",
      body: formData,
    }).catch(() => null);

    // 2. If FormData failed or rejected, fallback to Base64 payload
    if (!res || !res.ok) {
      try {
        const dataUrl = await fileToBase64(file);
        res = await fetch(`/api/admin/products/${productId}/images`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ dataUrl, alt: file.name }),
        });
      } catch (err: any) {
        throw new Error(err.message || `Failed to process ${file.name}`);
      }
    }

    if (!res || !res.ok) {
      const data = res ? await res.json().catch(() => ({})) : {};
      throw new Error(data.error || `Upload failed for ${file.name}`);
    }
  };

  const handleUploadBatch = async (files: FileList | File[]) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setError(null);

    const fileList = Array.from(files).filter((f) => f.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(f.name));

    if (fileList.length === 0) {
      setError("Please select valid image files (JPG, PNG, WebP, AVIF, SVG).");
      setIsUploading(false);
      return;
    }

    try {
      for (let i = 0; i < fileList.length; i++) {
        await uploadSingleFile(fileList[i], i, fileList.length);
      }

      onImagesChange();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while uploading. Please check the file and try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) handleUploadBatch(files);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) handleUploadBatch(files);
  };

  const handleAddUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress("Adding photo URL...");

    try {
      const res = await fetch(`/api/admin/products/${productId}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: urlInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to add image URL");

      setUrlInput("");
      setShowUrlInput(false);
      onImagesChange();
    } catch (err: any) {
      setError(err.message || "Failed to add photo URL.");
    } finally {
      setIsUploading(false);
      setUploadProgress("");
    }
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
                <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Complete Gallery (6–8 Photos)
              </span>
            ) : isBelowRecommended ? (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] uppercase tracking-wider font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-amber-700" /> Recommended: 6–8 photos ({6 - photoCount} more needed)
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] uppercase tracking-wider font-medium">
                Full Gallery
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#6E6459]">
            Upload 6 to 8 multi-angle views (Cover, Front, 45° Angle, Side, Back, Stone Close-up, Lifestyle).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="border border-[#C9A961]/70 text-[#6E6459] hover:text-[#241F1B] hover:bg-[#FAF7F0] px-3 py-2 text-xs uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <LinkIcon className="w-3.5 h-3.5" /> {showUrlInput ? "Hide URL Input" : "Add Image URL"}
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-[#241F1B] text-[#C9A961] hover:bg-[#181412] px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors inline-flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm"
          >
            <Upload className="w-3.5 h-3.5" /> Browse & Upload
          </button>
        </div>
      </div>

      {/* URL Input Bar */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="p-4 bg-[#FAF7F0] border border-[#E6DFD3] flex gap-3">
          <input
            type="url"
            placeholder="https://example.com/images/piece-front.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="flex-1 bg-white border border-[#E6DFD3] px-3 py-2 text-xs text-[#241F1B] outline-none focus:border-[#C9A961]"
          />
          <button
            type="submit"
            disabled={!urlInput.trim() || isUploading}
            className="bg-[#241F1B] text-[#FAF7F0] px-4 py-2 text-xs uppercase tracking-wider font-medium disabled:opacity-50 cursor-pointer flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Save Image
          </button>
        </form>
      )}

      {/* Drag & Drop Multi-Image Uploader */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!isUploading) fileInputRef.current?.click();
        }}
        className={`border-2 border-dashed ${
          isDragOver ? "border-[#9E7F3C] bg-[#F4EDE2]" : "border-[#C9A961]/60 hover:border-[#9E7F3C] bg-[#FAF7F0]"
        } p-8 text-center cursor-pointer transition-colors space-y-3 select-none`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/jpg,image/webp,image/avif,image/svg+xml,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-[#C9A961] animate-spin" />
            <p className="text-xs font-medium text-[#241F1B] uppercase tracking-wider">
              {uploadProgress || "Processing & uploading photos..."}
            </p>
            <p className="text-[11px] text-[#6E6459]">Optimizing and saving to atelier database...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-8 h-8 text-[#9E7F3C]" />
            <div className="font-serif text-lg text-[#241F1B]">
              Drop single or multiple photos here, or click anywhere to browse
            </div>
            <div className="text-[11px] text-[#6E6459]">
              Select up to 8 high-res photos at once (JPG, PNG, WebP, AVIF, SVG).
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
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
            First photo (#1) is automatically used as the main cover across store cards.
          </span>
        </div>

        {images.length === 0 ? (
          <p className="text-xs text-[#6E6459] italic bg-[#F4EDE2] p-4 border border-[#E6DFD3]">
            No photos uploaded yet. Click the box above or use Browse to add photos for this jewelry piece.
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.path}
                    alt={img.alt || `Photo ${idx + 1}`}
                    className="w-full h-full object-cover"
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
                        className="p-2 bg-[#FAF7F0] text-[#241F1B] hover:text-[#9E7F3C] text-[10px] uppercase tracking-wider font-medium cursor-pointer"
                      >
                        Set Cover
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(img.id)}
                      title="Remove Photo"
                      className="p-2 bg-red-600 text-white hover:bg-red-700 cursor-pointer"
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
                    className="p-1 text-[#6E6459] hover:text-[#241F1B] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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
                    className="p-1 text-[#6E6459] hover:text-[#241F1B] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
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

