"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Upload, 
  ImageIcon, 
  Trash2, 
  RefreshCw,
  Eye
} from "lucide-react";
import { Button, Input, Select } from "../../../components/admin/ui";

export default function AdminRingSizesConfigPage() {
  const [minSize, setMinSize] = useState("3");
  const [maxSize, setMaxSize] = useState("15");
  const [increment, setIncrement] = useState("0.5");
  const [pricingMode, setPricingMode] = useState("SAME_PRICE");
  const [chartImageUrl, setChartImageUrl] = useState("/images/ring-size-chart.svg");
  const [generatedSizes, setGeneratedSizes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory/ring-sizes");
      const data = await res.json();
      if (data.config) {
        setMinSize(String(data.config.min_size));
        setMaxSize(String(data.config.max_size));
        setIncrement(String(data.config.increment));
        setPricingMode(data.config.pricing_mode || "SAME_PRICE");
        if (data.config.chart_image_url) {
          setChartImageUrl(data.config.chart_image_url);
        }
      }
      if (data.sizes) {
        setGeneratedSizes(data.sizes);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setErrorMessage("Please upload an image file (PNG, JPG, WEBP, or SVG).");
      return;
    }

    setIsUploading(true);
    setErrorMessage("");

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        setChartImageUrl(base64);
        setSuccessMessage("Chart image loaded. Click 'Save Configuration' to publish to live website.");
      }
      setIsUploading(false);
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image file.");
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMessage("");

    const min = parseFloat(minSize);
    const max = parseFloat(maxSize);
    const step = parseFloat(increment);

    if (isNaN(min) || isNaN(max) || isNaN(step) || min >= max || step <= 0) {
      setErrorMessage("Please enter valid positive numbers where min < max.");
      setIsSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/inventory/ring-sizes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          min_size: min,
          max_size: max,
          increment: step,
          pricing_mode: pricingMode,
          chart_image_url: chartImageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update ring size config");

      setGeneratedSizes(data.sizes || []);
      setSuccessMessage("Ring size configuration and chart image published to live website.");
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save configuration");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div className="space-y-1">
          <Link
            href="/admin/inventory"
            className="text-xs uppercase tracking-wider text-[#6E6459] hover:text-[#241F1B] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Inventory
          </Link>
          <h1 className="font-serif text-3xl font-medium text-[#241F1B]">
            Ring Sizing &amp; Chart Configuration
          </h1>
        </div>

        <div className="text-xs text-[#6E6459] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
          <span>Universal Ring Matrix</span>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Rules Banner */}
      <div className="bg-[#F4EDE2] border border-[#E6DFD3] p-5 space-y-2">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#9E7F3C] font-semibold">
          <Sparkles className="w-4 h-4" /> Atelier Ring Sizing &amp; Public Display Guarantee
        </div>
        <p className="text-xs text-[#6E6459] leading-relaxed">
          Standard Indian &amp; International half-sizes range from <strong>Size 3 to Size 15 in 0.5 increments</strong>. Upload your official ring size chart photo below — it will be rendered immediately inside the <strong>Size Guide modal on every product page</strong> and the <strong>/size-guide page</strong>.
        </p>
      </div>

      {/* Configuration Form */}
      <form onSubmit={handleSave} className="bg-[#FBF7F0] p-8 border border-[#E6DFD3] space-y-8">
        
        {/* SECTION 1: RING SIZE CHART PHOTO UPLOAD */}
        <div className="space-y-4 pb-6 border-b border-[#E6DFD3]">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-xl text-[#241F1B]">
                Official Ring Size Chart Photo
              </h3>
              <p className="text-xs text-[#6E6459]">
                Upload your custom ring sizing diagram or measurement reference chart.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setChartImageUrl("/images/ring-size-chart.svg")}
                className="text-xs text-[#6E6459] hover:text-[#9E7F3C] border border-[#E6DFD3] px-2.5 py-1 inline-flex items-center gap-1 cursor-pointer bg-[#FFFFFF]"
                title="Reset to official Civara Atelier default chart"
              >
                <RefreshCw className="w-3 h-3" /> Reset Default
              </button>
            </div>
          </div>

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
              isDragOver
                ? "border-[#9E7F3C] bg-[#F4EDE2]"
                : "border-[#E6DFD3] hover:border-[#9E7F3C] bg-[#FAF7F0]"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileUpload(e.target.files[0]);
                }
              }}
            />
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#F4EDE2] border border-[#C9A961]/40 flex items-center justify-center text-[#9E7F3C]">
                {isUploading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              </div>
              <div className="text-xs font-medium text-[#241F1B]">
                Click to browse or drag &amp; drop ring size chart image
              </div>
              <div className="text-[11px] text-[#6E6459]">
                Supports PNG, JPG, WEBP, or SVG
              </div>
            </div>
          </div>

          {/* Live Chart Preview */}
          {chartImageUrl && (
            <div className="space-y-2 bg-[#FFFFFF] border border-[#E6DFD3] p-4">
              <div className="flex items-center justify-between text-xs text-[#6E6459] pb-2 border-b border-[#E6DFD3]">
                <span className="flex items-center gap-1.5 font-medium text-[#241F1B]">
                  <Eye className="w-3.5 h-3.5 text-[#9E7F3C]" /> Active Size Chart Preview (Public Display)
                </span>
                <span className="font-mono text-[10px] text-[#9E7F3C]">
                  {chartImageUrl.startsWith("data:") ? "Custom Uploaded Image" : chartImageUrl}
                </span>
              </div>
              <div className="relative w-full max-h-96 aspect-4/3 bg-[#FAF7F0] flex items-center justify-center overflow-hidden border border-[#E6DFD3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={chartImageUrl}
                  alt="Official Ring Size Chart Preview"
                  className="max-h-96 max-w-full object-contain mx-auto"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: SCALE PARAMETERS */}
        <div className="space-y-4">
          <h3 className="font-serif text-xl text-[#241F1B]">
            Scale Generator Parameters
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Minimum Size"
              type="number"
              step="0.5"
              value={minSize}
              onChange={(e) => setMinSize(e.target.value)}
              required
            />

            <Input
              label="Maximum Size"
              type="number"
              step="0.5"
              value={maxSize}
              onChange={(e) => setMaxSize(e.target.value)}
              required
            />

            <Input
              label="Step Increment"
              type="number"
              step="0.1"
              value={increment}
              onChange={(e) => setIncrement(e.target.value)}
              required
            />
          </div>

          <Select
            label="Ring Size Pricing Policy"
            value={pricingMode}
            onChange={(e) => setPricingMode(e.target.value)}
            options={[
              { label: "SAME_PRICE (All ring sizes identical price)", value: "SAME_PRICE" },
              { label: "VARIABLE (Custom price adjustments per size)", value: "VARIABLE" },
            ]}
          />
        </div>

        {/* Generated Preview */}
        <div className="space-y-3 pt-4 border-t border-[#E6DFD3]">
          <div className="flex items-center justify-between">
            <h4 className="text-xs uppercase tracking-wider text-[#6E6459] font-medium">
              Generated Active Ring Sizes ({generatedSizes.length} sizes)
            </h4>
            <span className="text-[10px] text-[#9E7F3C]">Rendered on public PDP selector</span>
          </div>

          <div className="flex flex-wrap gap-2 p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
            {generatedSizes.map((s) => (
              <span
                key={s}
                className="px-3 py-1.5 bg-[#FAF7F0] border border-[#C9A961]/50 text-xs font-serif text-[#241F1B] shadow-xs"
              >
                Size {s}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit" size="md" isLoading={isSaving}>
            <Save className="w-3.5 h-3.5 mr-2" /> Save &amp; Publish Configuration
          </Button>
        </div>
      </form>
    </div>
  );
}
