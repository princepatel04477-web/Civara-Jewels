"use client";

import React, { useState, useEffect } from "react";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { Download, Maximize2, X, Image as ImageIcon, Sparkles, MessageCircle } from "lucide-react";

export default function SizeGuidePage() {
  const [activeChain, setActiveChain] = useState<string | null>("18 inch");
  const [chartImageUrl, setChartImageUrl] = useState<string>("/images/Civaraa_Ring_size.png");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  useEffect(() => {
    fetch("/api/public/ring-sizes")
      .then((res) => res.json())
      .then((data) => {
        if (data?.config?.chart_image_url) {
          setChartImageUrl(data.config.chart_image_url);
        }
      })
      .catch(() => {});
  }, []);

  const ringSizes = [
    { us: "3", inSize: "05 / 06", insideDia: "14.1 mm", circumference: "44.2 mm" },
    { us: "3.5", inSize: "06", insideDia: "14.5 mm", circumference: "45.5 mm" },
    { us: "4", inSize: "07", insideDia: "14.9 mm", circumference: "46.8 mm" },
    { us: "4.5", inSize: "08 / 09", insideDia: "15.3 mm", circumference: "48.0 mm" },
    { us: "5", inSize: "09 / 10", insideDia: "15.7 mm", circumference: "49.3 mm" },
    { us: "5.5", inSize: "11", insideDia: "16.1 mm", circumference: "50.6 mm" },
    { us: "6", inSize: "12 / 13", insideDia: "16.5 mm", circumference: "51.8 mm" },
    { us: "6.5", inSize: "13 / 14", insideDia: "16.9 mm", circumference: "53.1 mm" },
    { us: "7", inSize: "14 / 15", insideDia: "17.3 mm", circumference: "54.4 mm" },
    { us: "7.5", inSize: "16", insideDia: "17.7 mm", circumference: "55.7 mm" },
    { us: "8", inSize: "17 / 18", insideDia: "18.2 mm", circumference: "57.0 mm" },
    { us: "8.5", inSize: "18 / 19", insideDia: "18.6 mm", circumference: "58.3 mm" },
    { us: "9", inSize: "19 / 20", insideDia: "19.0 mm", circumference: "59.5 mm" },
    { us: "9.5", inSize: "21", insideDia: "19.4 mm", circumference: "60.8 mm" },
    { us: "10", inSize: "22 / 23", insideDia: "19.8 mm", circumference: "62.1 mm" },
    { us: "10.5", inSize: "23 / 24", insideDia: "20.2 mm", circumference: "63.4 mm" },
    { us: "11", inSize: "24 / 25", insideDia: "20.6 mm", circumference: "64.6 mm" },
    { us: "11.5", inSize: "26", insideDia: "21.0 mm", circumference: "65.9 mm" },
    { us: "12", inSize: "27 / 28", insideDia: "21.4 mm", circumference: "67.2 mm" },
    { us: "12.5", inSize: "28 / 29", insideDia: "21.8 mm", circumference: "68.5 mm" },
    { us: "13", inSize: "29 / 30", insideDia: "22.2 mm", circumference: "69.7 mm" },
    { us: "13.5", inSize: "30 / 31", insideDia: "22.6 mm", circumference: "71.0 mm" },
    { us: "14", inSize: "31 / 32", insideDia: "23.0 mm", circumference: "72.3 mm" },
    { us: "14.5", inSize: "32 / 33", insideDia: "23.4 mm", circumference: "73.6 mm" },
    { us: "15", inSize: "33 / 34", insideDia: "23.8 mm", circumference: "74.8 mm" },
  ];

  const chains = [
    { length: "14 inch", position: "Collar — sits tightly around the base of the neck." },
    { length: "16 inch", position: "Choker — falls right around the collarbone." },
    { length: "18 inch", position: "Princess — falls just below the collarbone; most popular length." },
    { length: "20 inch", position: "Matinee — rests at the top of the chest." },
    { length: "24 inch", position: "Opera — extends below the bust line." },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Atelier Utility
          </div>
          <LineReveal
            as="h1"
            text="Sizing & Fit Guide"
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Official Indian and International ring conversion chart, diameter scales, and necklace chain placements.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-5xl mx-auto px-6 lg:px-20 py-16 space-y-20">
        
        {/* Ring Sizing Section with Visual Chart Photo */}
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
                Ring Sizing
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
                Official Ring Size Chart
              </h2>
              <p className="text-xs font-light text-[#6E6459]">
                Every Civara ring includes one complimentary resizing within the first year of ownership.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={chartImageUrl}
                download="Civara-Ring-Size-Chart.png"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs border border-[#C9A961] text-[#9E7F3C] px-4 py-2 hover:bg-[#241F1B] hover:text-[#C9A961] transition-colors inline-flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" /> Download Chart
              </a>
            </div>
          </div>

          {/* Visual Chart Photo Card */}
          <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-4 sm:p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between text-xs text-[#6E6459] pb-2 border-b border-[#E6DFD3]">
              <span className="flex items-center gap-1.5 font-medium text-[#241F1B]">
                <ImageIcon className="w-4 h-4 text-[#9E7F3C]" /> Visual Sizing Matrix &amp; Diameter Scale
              </span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="text-xs text-[#9E7F3C] hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3.5 h-3.5" /> View Fullscreen
              </button>
            </div>

            <div className="relative group flex items-center justify-center bg-[#FAF7F0] p-4 border border-[#E6DFD3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={chartImageUrl}
                alt="Civara Jewels Official Ring Size Chart"
                className="w-full max-h-[520px] object-contain cursor-zoom-in transition-transform duration-300 group-hover:scale-[1.01]"
                onClick={() => setIsZoomOpen(true)}
              />
            </div>
          </div>

          {/* Full Interactive Table */}
          <div className="overflow-x-auto border border-[#E6DFD3] bg-[#FFFFFF]">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[#241F1B] uppercase tracking-wider">
                  <th className="p-4">US / CAN Size</th>
                  <th className="p-4">Indian (IN) Size</th>
                  <th className="p-4">Inside Diameter</th>
                  <th className="p-4">Inside Circumference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3] text-[#4A4238]">
                {ringSizes.map((r) => (
                  <tr key={r.us} className="hover:bg-[#FAF7F0] transition-colors">
                    <td className="p-4 font-serif text-base text-[#241F1B] font-medium">
                      Size {r.us}
                    </td>
                    <td className="p-4 text-[#6E6459]">Size {r.inSize}</td>
                    <td className="p-4 font-mono text-[#241F1B]">{r.insideDia}</td>
                    <td className="p-4 font-mono text-[#6E6459]">{r.circumference}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Chain Length Diagram & List */}
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
              Necklace &amp; Pendant Lengths
            </div>
            <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
              Interactive Chain Length Guide
            </h2>
            <p className="text-xs font-light text-[#6E6459]">
              Hover over a length below to highlight its placement on the mannequin bust.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
            {/* List */}
            <div className="lg:col-span-7 space-y-4">
              {chains.map((ch) => {
                const isHovered = activeChain === ch.length;
                return (
                  <div
                    key={ch.length}
                    onMouseEnter={() => setActiveChain(ch.length)}
                    className={`p-4 border transition-all cursor-pointer ${
                      isHovered
                        ? "border-[#C9A961] bg-[#F4EDE2] shadow-sm"
                        : "border-[#E6DFD3] bg-[#FBF7F0] hover:border-[#9E7F3C]"
                    }`}
                  >
                    <div className="font-serif text-xl font-medium text-[#241F1B]">
                      {ch.length}
                    </div>
                    <div className="text-xs font-light text-[#6E6459] mt-1">{ch.position}</div>
                  </div>
                );
              })}
            </div>

            {/* Visual Illustrated Bust */}
            <div className="lg:col-span-5 h-80 bg-porcelain border border-[#E6DFD3] relative flex items-center justify-center p-6 text-center">
              <div className="space-y-4">
                <div className="w-24 h-24 rounded-full border border-[#C9A961]/40 mx-auto flex items-center justify-center font-serif text-3xl text-[#C9A961] bg-[#FBF7F0]">
                  {activeChain ? activeChain.split(" ")[0] : "18"}&quot;
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-medium">
                  {activeChain || "Select a Length"}
                </div>
                <p className="text-xs font-light text-[#6E6459] max-w-xs mx-auto">
                  {chains.find((c) => c.length === activeChain)?.position}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Measuring Method */}
        <div className="bg-[#F4EDE2] p-8 lg:p-12 border border-[#E6DFD3] space-y-6">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#9E7F3C] font-semibold">
            <Sparkles className="w-4 h-4" /> Professional Measuring Instructions
          </div>
          <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
            How to Measure an Existing Ring
          </h3>
          <ol className="space-y-3 text-xs font-light text-[#6E6459] list-decimal list-inside leading-relaxed">
            <li>Select a ring that fits the intended finger comfortably.</li>
            <li>Measure the inside diameter in millimeters using a precise ruler across the center circle.</li>
            <li>Match your measurement to the millimeter column in our sizing chart above.</li>
            <li>If between sizes, we recommend selecting the larger size for optimal comfort.</li>
          </ol>
        </div>
      </section>

      {/* Fullscreen Lightbox Zoom */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-[#181412]/95 backdrop-blur-md animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
        >
          <button
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 bg-[#241F1B] text-[#FBF7F0] hover:text-[#C9A961] rounded-full cursor-pointer z-70"
            aria-label="Close enlarged chart"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-5xl max-h-[90vh] bg-white p-3 border border-[#C9A961] shadow-2xl">
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
}
