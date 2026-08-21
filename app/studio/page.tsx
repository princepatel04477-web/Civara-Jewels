"use client";

import React, { useState } from "react";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { ImageVeil } from "../components/motion/ImageVeil";
import { ImageSlot } from "../components/ImageSlot";
import { Sparkles, MessageCircle, Send, Check } from "lucide-react";

export default function StudioPage() {
  const [brief, setBrief] = useState("");
  const [metal, setMetal] = useState("Yellow Gold");
  const [stone, setStone] = useState("Natural Diamond");
  const [silhouette, setSilhouette] = useState("Ring");
  const [isFocused, setIsFocused] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [conceptGenerated, setConceptGenerated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const metals = ["Yellow Gold", "White Gold", "Rose Gold"];
  const stones = ["Natural Diamond", "Lab-Grown Diamond", "Moissanite", "Emerald"];
  const silhouettes = ["Ring", "Pendant", "Earrings", "Bracelet", "Bridal Set"];

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brief.trim()) return;
    setIsGenerating(true);
    setConceptGenerated(false);
    setTimeout(() => {
      setIsGenerating(false);
      setConceptGenerated(true);
    }, 1800);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Civara Jewels, I created a Studio bespoke concept:\n` +
      `• Silhouette: ${silhouette}\n` +
      `• Metal: ${metal}\n` +
      `• Stone: ${stone}\n` +
      `• Description: "${brief}"`
  );

  return (
    <div className="w-full">
      {/* Header */}
      <section className="py-20 lg:py-24 px-6 lg:px-20 text-center bg-[#F4EDE2] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Civara Studio
          </div>
          <LineReveal
            as="h1"
            text="Describe your dream piece in plain words."
            className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]"
          />
          <RuleDraw color="gold" className="w-20 mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Civara Studio drafts a sketch and technical brief for our master goldsmiths.
          </p>
        </div>
      </section>

      {/* Drafting Table Interface */}
      <section className="max-w-4xl mx-auto px-6 lg:px-20 py-16">
        <form onSubmit={handleGenerate} className="space-y-8 bg-[#FBF7F0] p-8 border border-[#E6DFD3]">
          {/* Silhouette Selection */}
          <div>
            <label className="block text-xs uppercase tracking-[0.22em] text-[#6E6459] mb-3">
              1. Select Silhouette
            </label>
            <div className="flex flex-wrap gap-2.5">
              {silhouettes.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => setSilhouette(s)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-wider transition-all border ${
                    silhouette === s
                      ? "border-[#C9A961] bg-[#F4EDE2] text-[#241F1B] font-medium"
                      : "border-[#E6DFD3] text-[#6E6459] hover:border-[#9E7F3C]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description Textarea with expanding hairline on focus */}
          <div>
            <label className="block text-xs uppercase tracking-[0.22em] text-[#6E6459] mb-3">
              2. Describe Design Details
            </label>
            <div className="relative">
              <textarea
                value={brief}
                onChange={(e) => setBrief(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="e.g. A delicate solitaire ring with a pear-shaped stone, subtle claw setting, and thin textured yellow gold band…"
                className="w-full min-h-[140px] p-5 bg-porcelain border border-[#E6DFD3] text-sm text-[#241F1B] font-light leading-relaxed focus:outline-none"
              />
              <div
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] bg-[#C9A961] transition-all duration-300 ${
                  isFocused ? "w-full" : "w-0"
                }`}
              />
            </div>
          </div>

          {/* Metal & Stone Pickers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-[#6E6459] mb-3">
                3. Metal Finish
              </label>
              <div className="flex flex-wrap gap-2">
                {metals.map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMetal(m)}
                    className={`px-3 py-2 text-xs transition-all border ${
                      metal === m
                        ? "border-[#C9A961] bg-[#F4EDE2] text-[#241F1B] font-medium"
                        : "border-[#E6DFD3] text-[#6E6459]"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-[0.22em] text-[#6E6459] mb-3">
                4. Primary Stone
              </label>
              <div className="flex flex-wrap gap-2">
                {stones.map((st) => (
                  <button
                    type="button"
                    key={st}
                    onClick={() => setStone(st)}
                    className={`px-3 py-2 text-xs transition-all border ${
                      stone === st
                        ? "border-[#C9A961] bg-[#F4EDE2] text-[#241F1B] font-medium"
                        : "border-[#E6DFD3] text-[#6E6459]"
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={!brief.trim() || isGenerating}
            className={`w-full py-4 text-xs uppercase tracking-[0.22em] font-medium transition-all flex items-center justify-center gap-2 ${
              brief.trim() && !isGenerating
                ? "bg-[#241F1B] text-[#C9A961] hover:bg-[#181412]"
                : "bg-[#E6DFD3] text-[#6E6459] cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Generate Studio Concept
          </button>
        </form>

        {/* Slow Rotating Hairline Ring Loader */}
        {isGenerating && (
          <div className="my-16 text-center space-y-4 animate-fadeIn">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border border-dashed border-[#C9A961] animate-[spin_8s_linear_infinite]" />
              <div className="absolute inset-2 rounded-full border border-[#9E7F3C]/40" />
            </div>
            <div className="font-serif text-2xl text-[#241F1B] italic">
              Drafting technical render…
            </div>
            <p className="text-xs text-[#6E6459]">
              Balancing claw proportions, stone angles, and 18k metal reflection.
            </p>
          </div>
        )}

        {/* Generated Result Container with ImageVeil */}
        {conceptGenerated && !isGenerating && (
          <div className="mt-16 bg-[#F4EDE2] border border-[#E6DFD3] p-8 lg:p-12 space-y-8 animate-fadeIn">
            <div className="text-center space-y-2">
              <div className="text-xs uppercase tracking-[0.28em] text-[#9E7F3C]">
                Draft Render
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#241F1B]">
                Bespoke {silhouette} Concept
              </h2>
            </div>

            <ImageVeil className="h-96 bg-porcelain relative border border-[#E6DFD3]">
              <ImageSlot
                src="/images/elara-solitaire-main.jpg"
                placeholderText={`Rendered ${silhouette} in ${metal} with ${stone}`}
              />
            </ImageVeil>

            <div className="bg-[#FBF7F0] p-6 border border-[#E6DFD3] space-y-3 text-xs">
              <div className="flex justify-between border-b border-[#E6DFD3] pb-2">
                <span className="text-[#6E6459]">Silhouette</span>
                <span className="text-[#241F1B] font-medium">{silhouette}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6DFD3] pb-2">
                <span className="text-[#6E6459]">Metal Alloy</span>
                <span className="text-[#241F1B] font-medium">{metal}</span>
              </div>
              <div className="flex justify-between border-b border-[#E6DFD3] pb-2">
                <span className="text-[#6E6459]">Center Stone</span>
                <span className="text-[#241F1B] font-medium">{stone}</span>
              </div>
              <div className="flex justify-between pb-1">
                <span className="text-[#6E6459]">Estimated Craft Time</span>
                <span className="text-[#241F1B] font-medium">2–3 Weeks</span>
              </div>
            </div>

            {submitted ? (
              <div className="bg-porcelain border border-[#C9A961] p-6 text-center space-y-2">
                <Check className="w-6 h-6 text-[#C9A961] mx-auto" />
                <div className="font-serif text-xl font-medium text-[#241F1B]">
                  Enquiry Submitted
                </div>
                <p className="text-xs text-[#6E6459]">
                  Our master goldsmith will review your draft concept and respond within 24 hours.
                </p>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setSubmitted(true)}
                  className="flex-1 bg-[#241F1B] text-[#C9A961] py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#181412] transition-colors flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Concept to Atelier
                </button>
                <a
                  href={`https://wa.me/919999900000?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-[#C9A961] text-[#9E7F3C] py-4 text-xs uppercase tracking-[0.22em] text-center font-medium hover:bg-[#C9A961] hover:text-[#FBF7F0] transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Discuss on WhatsApp
                </a>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
