"use client";

import React, { useState, useEffect } from "react";
import { HelpCircle, X, Download, MessageCircle, Maximize2, Image as ImageIcon, Table as TableIcon, Check } from "lucide-react";

interface RingSizeSelectorProps {
  selectedSize: string;
  onSelectSize: (size: string) => void;
  productName?: string;
}

export const RingSizeSelector: React.FC<RingSizeSelectorProps> = ({
  selectedSize,
  onSelectSize,
  productName = "Solitaire Ring",
}) => {
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"chart" | "table">("chart");
  const [isFullImageZoom, setIsFullImageZoom] = useState(false);

  // Default half-size increments from 3 to 15
  const defaultSizes = [
    "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5",
    "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5",
    "13", "13.5", "14", "14.5", "15"
  ];

  const [sizes, setSizes] = useState<string[]>(defaultSizes);
  const [chartImageUrl, setChartImageUrl] = useState<string>("/images/Civaraa_Ring_size.png");

  useEffect(() => {
    fetch("/api/public/ring-sizes")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (Array.isArray(data.sizes) && data.sizes.length > 0) {
            setSizes(data.sizes);
          }
          if (data.config?.chart_image_url) {
            setChartImageUrl(data.config.chart_image_url);
          }
        }
      })
      .catch(() => {
        // Fallback to admin route if needed
        fetch("/api/admin/inventory/ring-sizes")
          .then((r) => r.json())
          .then((d) => {
            if (d?.config?.chart_image_url) setChartImageUrl(d.config.chart_image_url);
          })
          .catch(() => {});
      });
  }, []);

  const handleRequestSizerWhatsApp = () => {
    const text = encodeURIComponent(
      `Hello Civara Jewels, I would like to request a complimentary ring sizing kit for the ${productName}.`
    );
    window.open(`https://wa.me/918866077237?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const ringConversionData = [
    { us: "3", inSize: "5 / 6", mm: "14.1 mm", circ: "44.2 mm" },
    { us: "3.5", inSize: "6", mm: "14.5 mm", circ: "45.5 mm" },
    { us: "4", inSize: "7", mm: "14.9 mm", circ: "46.8 mm" },
    { us: "4.5", inSize: "8 / 9", mm: "15.3 mm", circ: "48.0 mm" },
    { us: "5", inSize: "9 / 10", mm: "15.7 mm", circ: "49.3 mm" },
    { us: "5.5", inSize: "11", mm: "16.1 mm", circ: "50.6 mm" },
    { us: "6", inSize: "12 / 13", mm: "16.5 mm", circ: "51.8 mm" },
    { us: "6.5", inSize: "13 / 14", mm: "16.9 mm", circ: "53.1 mm" },
    { us: "7", inSize: "14 / 15", mm: "17.3 mm", circ: "54.4 mm" },
    { us: "7.5", inSize: "16", mm: "17.7 mm", circ: "55.7 mm" },
    { us: "8", inSize: "17 / 18", mm: "18.2 mm", circ: "57.0 mm" },
    { us: "8.5", inSize: "18 / 19", mm: "18.6 mm", circ: "58.3 mm" },
    { us: "9", inSize: "19 / 20", mm: "19.0 mm", circ: "59.5 mm" },
    { us: "9.5", inSize: "21", mm: "19.4 mm", circ: "60.8 mm" },
    { us: "10", inSize: "22 / 23", mm: "19.8 mm", circ: "62.1 mm" },
    { us: "10.5", inSize: "23 / 24", mm: "20.2 mm", circ: "63.4 mm" },
    { us: "11", inSize: "24 / 25", mm: "20.6 mm", circ: "64.6 mm" },
    { us: "11.5", inSize: "26", mm: "21.0 mm", circ: "65.9 mm" },
    { us: "12", inSize: "27 / 28", mm: "21.4 mm", circ: "67.2 mm" },
    { us: "12.5", inSize: "28 / 29", mm: "21.8 mm", circ: "68.5 mm" },
    { us: "13", inSize: "29 / 30", mm: "22.2 mm", circ: "69.7 mm" },
    { us: "13.5", inSize: "30 / 31", mm: "22.6 mm", circ: "71.0 mm" },
    { us: "14", inSize: "31 / 32", mm: "23.0 mm", circ: "72.3 mm" },
    { us: "14.5", inSize: "32 / 33", mm: "23.4 mm", circ: "73.6 mm" },
    { us: "15", inSize: "33 / 34", mm: "23.8 mm", circ: "74.8 mm" },
  ];

  return (
    <div className="w-full space-y-3">
      {/* Header Row: Label, Selected Badge & SINGLE Guide Link */}
      <div className="flex items-center justify-between text-xs border-b border-[#E6DFD3] pb-1.5">
        <div className="flex items-center gap-2">
          <span className="uppercase tracking-[0.2em] text-[11px] text-[#6E6459] font-medium">
            Ring Size:
          </span>
          <span className="font-serif text-sm font-semibold text-[#241F1B]">
            Size {selectedSize}
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsGuideOpen(true)}
          className="text-[11px] text-[#9E7F3C] hover:text-[#241F1B] hover:underline inline-flex items-center gap-1 cursor-pointer font-medium"
        >
          <HelpCircle className="w-3.5 h-3.5" /> Size Guide
        </button>
      </div>

      {/* Grid of Clickable Size Boxes (Size 3 to 15 in 0.5 increments) */}
      <div className="flex flex-wrap gap-2 pt-1">
        {sizes.map((size) => {
          const isSelected = String(selectedSize) === String(size);
          return (
            <button
              key={size}
              type="button"
              onClick={() => onSelectSize(size)}
              className={`min-w-[42px] py-2 px-2.5 text-center text-xs font-medium border transition-all cursor-pointer ${
                isSelected
                  ? "border-[#241F1B] bg-[#241F1B] text-[#C9A961] shadow-xs"
                  : "border-[#E6DFD3] bg-[#FFFFFF] text-[#6E6459] hover:border-[#9E7F3C] hover:text-[#241F1B] hover:bg-[#FAF7F0]"
              }`}
            >
              {size}
            </button>
          );
        })}
      </div>

      {/* Size Guide Modal with Visual Ring Size Chart Photo */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181412]/80 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF7F0] border border-[#C9A961]/40 p-6 sm:p-8 shadow-2xl text-[#241F1B] space-y-6">
            <button
              onClick={() => setIsGuideOpen(false)}
              className="absolute top-4 right-4 p-2 text-[#6E6459] hover:text-[#241F1B] cursor-pointer"
              aria-label="Close size guide"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
                Civara Atelier Service
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
                Official Ring Sizing &amp; Fit Guide
              </h3>
              <p className="text-xs text-[#6E6459] font-light">
                Handcrafted from Size 3 to Size 15 with 1 complimentary resizing included.
              </p>
            </div>

            {/* View Mode Toggle: Visual Photo vs Table */}
            <div className="flex justify-center border-b border-[#E6DFD3] pb-2">
              <div className="flex items-center gap-4 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setActiveTab("chart")}
                  className={`pb-1 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === "chart"
                      ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                      : "text-[#6E6459] hover:text-[#241F1B]"
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" /> Visual Size Chart Photo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("table")}
                  className={`pb-1 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors ${
                    activeTab === "table"
                      ? "text-[#241F1B] border-b-2 border-[#9E7F3C]"
                      : "text-[#6E6459] hover:text-[#241F1B]"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" /> Conversion Matrix
                </button>
              </div>
            </div>

            {/* TAB 1: VISUAL RING SIZE CHART PHOTO */}
            {activeTab === "chart" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="relative group bg-[#FFFFFF] border border-[#E6DFD3] p-2 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={chartImageUrl}
                    alt="Official Civara Ring Size Chart"
                    className="w-full max-h-[420px] object-contain cursor-zoom-in"
                    onClick={() => setIsFullImageZoom(true)}
                  />
                  <button
                    type="button"
                    onClick={() => setIsFullImageZoom(true)}
                    className="absolute bottom-3 right-3 bg-[#241F1B]/90 text-[#C9A961] p-2 text-xs font-medium flex items-center gap-1.5 shadow-md hover:bg-[#181412] cursor-pointer"
                  >
                    <Maximize2 className="w-3.5 h-3.5" /> Click to Enlarge
                  </button>
                </div>
                <div className="text-center text-[11px] text-[#6E6459]">
                  💡 Tip: Match an existing ring&apos;s inside diameter against the visual circle scale.
                </div>
              </div>
            )}

            {/* TAB 2: CONVERSION TABLE */}
            {activeTab === "table" && (
              <div className="space-y-3 animate-fadeIn">
                <div className="overflow-x-auto border border-[#E6DFD3] bg-[#FFFFFF] max-h-72 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-[#F4EDE2] border-b border-[#E6DFD3] text-[#241F1B]">
                      <tr>
                        <th className="p-2.5 font-medium">US Size</th>
                        <th className="p-2.5 font-medium">Indian Size</th>
                        <th className="p-2.5 font-medium">Inside Diameter</th>
                        <th className="p-2.5 font-medium">Circumference</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E6DFD3] text-[#4A4238]">
                      {ringConversionData.map((row) => (
                        <tr
                          key={row.us}
                          className={`hover:bg-[#FAF7F0] ${
                            selectedSize === row.us ? "bg-[#F4EDE2] font-semibold text-[#241F1B]" : ""
                          }`}
                        >
                          <td className="p-2.5 font-serif text-sm">Size {row.us}</td>
                          <td className="p-2.5">{row.inSize}</td>
                          <td className="p-2.5 font-mono">{row.mm}</td>
                          <td className="p-2.5 font-mono">{row.circ}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Actions & WhatsApp Sizer Kit */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3 border-t border-[#E6DFD3]">
              <a
                href={chartImageUrl}
                download="Civara-Ring-Size-Chart.png"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 border border-[#C9A961] text-[#9E7F3C] py-3 text-center text-xs uppercase tracking-wider hover:bg-[#C9A961] hover:text-[#FAF7F0] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" /> Download Size Chart
              </a>

              <button
                type="button"
                onClick={handleRequestSizerWhatsApp}
                className="flex-1 bg-[#241F1B] text-[#C9A961] py-3 text-center text-xs uppercase tracking-wider hover:bg-[#181412] transition-colors inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" /> Request Sizing Kit
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Fullscreen Image Lightbox Zoom */}
      {isFullImageZoom && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#181412]/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsFullImageZoom(false)}
        >
          <button
            onClick={() => setIsFullImageZoom(false)}
            className="absolute top-6 right-6 p-3 bg-[#241F1B] text-[#FBF7F0] hover:text-[#C9A961] rounded-full cursor-pointer z-70"
            aria-label="Close enlarged chart"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[90vh] bg-white p-2 border border-[#C9A961] shadow-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={chartImageUrl}
              alt="Enlarged Civara Ring Size Chart"
              className="max-h-[85vh] max-w-full object-contain mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
