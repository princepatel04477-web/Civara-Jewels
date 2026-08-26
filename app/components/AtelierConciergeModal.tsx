"use client";

import React, { useState } from "react";
import { Product } from "../../lib/catalog";
import { MetalRates, computePrice, formatINR } from "../../lib/pricing/compute";
import { X, MessageCircle, Calendar, ShieldCheck, CheckCircle2, Phone, User, Clock } from "lucide-react";

interface AtelierConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  selectedMetal: string;
  selectedSize: string;
  metalRates?: MetalRates;
  initialMode?: "enquire" | "viewing";
}

export function AtelierConciergeModal({
  isOpen,
  onClose,
  product,
  selectedMetal,
  selectedSize,
  metalRates,
  initialMode = "enquire",
}: AtelierConciergeModalProps) {
  const [activeTab, setActiveTab] = useState<"enquire" | "viewing">(initialMode);

  // Form State for Private Viewing
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Surat Atelier");
  const [preferredDate, setPreferredDate] = useState("");
  const [specialNotes, setSpecialNotes] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  // Calculate live rate snapshot
  const currentRates: MetalRates = metalRates || {
    gold24kPer10g: 72500,
    platinumPer10g: 32000,
    silverPerKg: 86000,
    updatedAt: new Date().toISOString(),
    updatedBy: "System",
  };

  const pricingProduct = product.pricing || {
    id: product.id,
    name: product.name,
    metal: "gold",
    purity: 18,
    netWeightG: 4.5,
    grossWeightG: 4.8,
    wastagePercent: 8,
    makingCharge: { type: "per_gram", value: 1100 },
    stones: [],
    otherCharges: 1200,
    priceMode: "live",
  };

  const breakdown = computePrice(pricingProduct, currentRates);

  const timestampFormatted = new Date().toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const whatsappMessageText =
    `*CIVARA JEWELS — ATELIER ENQUIRY SNAPSHOT*\n` +
    `----------------------------------------\n` +
    `Piece: ${product.name} (${product.id})\n` +
    `Selection: ${selectedMetal}${selectedSize !== "Standard" ? ` | Size: ${selectedSize}` : ""}\n` +
    `Purity: ${pricingProduct.purity}K Gold | Weight: ${pricingProduct.netWeightG}g Net\n` +
    `Quoted Rate: ${formatINR(currentRates.gold24kPer10g)} / 10g (24K)\n` +
    `Quoted Total: ${breakdown.formattedTotalINR} (incl. 3% GST)\n` +
    `Snapshot Timestamp: ${timestampFormatted}\n` +
    `----------------------------------------\n` +
    `Hello Atelier Concierge, I would like to lock this rate and proceed with my bespoke order.`;

  const whatsappUrl = `https://wa.me/918866077237?text=${encodeURIComponent(whatsappMessageText)}`;

  const handleViewingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#241F1B]/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div className="bg-[#FFFFFF] border border-[#C9A961] max-w-2xl w-full p-6 sm:p-10 relative specular-sweep shadow-2xl space-y-6 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#6E6459] hover:text-[#241F1B] transition-colors p-1"
          aria-label="Close Concierge Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
            Civara Atelier Concierge
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
            Bespoke Enquiry &amp; Viewing
          </h2>
          <p className="text-xs font-light text-[#6E6459] max-w-md mx-auto">
            Directly connect with our Master Goldsmiths with locked price snapshots.
          </p>
        </div>

        {/* Locked Price Snapshot Box */}
        <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-4 sm:p-5 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between text-[#9E7F3C] font-serif font-medium border-b border-[#E6DFD3] pb-2 text-sm">
            <span>{product.name}</span>
            <span className="text-[#241F1B] font-mono font-semibold">{breakdown.formattedTotalINR}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#6E6459]">
            <div>
              Option: <span className="text-[#241F1B]">{selectedMetal}</span>
            </div>
            <div>
              Size: <span className="text-[#241F1B]">{selectedSize}</span>
            </div>
            <div>
              Purity: <span className="text-[#241F1B]">{pricingProduct.purity}K Gold</span>
            </div>
            <div>
              Weight: <span className="text-[#241F1B]">{pricingProduct.netWeightG}g Net</span>
            </div>
            <div>
              Rate Snapshot: <span className="text-[#241F1B]">{formatINR(currentRates.gold24kPer10g)} / 10g</span>
            </div>
            <div>
              Time: <span className="text-[#241F1B]">{timestampFormatted}</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-[#9E7F3C] flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Guaranteed locked rate for 48 hours upon enquiry submission.
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-[#E6DFD3]">
          <button
            onClick={() => {
              setActiveTab("enquire");
              setIsSubmitted(false);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "enquire"
                ? "border-[#C9A961] text-[#241F1B]"
                : "border-transparent text-[#6E6459] hover:text-[#241F1B]"
            }`}
          >
            <MessageCircle className="w-4 h-4 text-[#9E7F3C]" /> WhatsApp Concierge
          </button>
          <button
            onClick={() => {
              setActiveTab("viewing");
              setIsSubmitted(false);
            }}
            className={`flex-1 py-3 text-xs uppercase tracking-[0.2em] font-medium transition-colors border-b-2 flex items-center justify-center gap-2 ${
              activeTab === "viewing"
                ? "border-[#C9A961] text-[#241F1B]"
                : "border-transparent text-[#6E6459] hover:text-[#241F1B]"
            }`}
          >
            <Calendar className="w-4 h-4 text-[#9E7F3C]" /> Book Private Viewing
          </button>
        </div>

        {/* TAB 1: WhatsApp Direct Snapshot Dispatch */}
        {activeTab === "enquire" && (
          <div className="space-y-4 text-center py-2">
            <p className="text-xs text-[#6E6459] font-light leading-relaxed">
              Clicking below opens a direct WhatsApp chat with our Senior Atelier Specialist, pre-loading your custom piece specifications and locked price snapshot.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-[#241F1B] text-[#C9A961] py-4 px-6 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Dispatch Snapshot via WhatsApp
            </a>
          </div>
        )}

        {/* TAB 2: Private Viewing Form */}
        {activeTab === "viewing" && (
          <div>
            {isSubmitted ? (
              <div className="text-center py-8 space-y-4 bg-[#FBF7F0] border border-[#E6DFD3] p-6">
                <CheckCircle2 className="w-10 h-10 text-[#9E7F3C] mx-auto" />
                <h3 className="font-serif text-xl font-medium text-[#241F1B]">Viewing Request Received</h3>
                <p className="text-xs font-light text-[#6E6459] leading-relaxed max-w-sm mx-auto">
                  Thank you, {fullName}. Our Atelier Specialist will contact you at {phone} within 2 hours to confirm your private session.
                </p>
                <button
                  onClick={onClose}
                  className="bg-[#241F1B] text-[#C9A961] px-8 py-3 text-xs uppercase tracking-[0.18em]"
                >
                  Return to Creation
                </button>
              </div>
            ) : (
              <form onSubmit={handleViewingSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459]">Full Name</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#9E7F3C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="Your Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459]">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#9E7F3C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459]">Atelier Location</label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] px-3 py-2.5 text-xs focus:outline-none focus:border-[#C9A961]"
                    >
                      <option value="Surat Atelier">Civara Flagship Atelier (Surat, Gujarat)</option>
                      <option value="Virtual Private Consultation">Virtual High-Definition Session (Worldwide)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459]">Preferred Date</label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-[#9E7F3C] absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="date"
                        required
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] pl-9 pr-3 py-2.5 text-xs focus:outline-none focus:border-[#C9A961]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E6459]">Special Requirements (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="E.g., Interested in matching ring sizes, custom engraving..."
                    value={specialNotes}
                    onChange={(e) => setSpecialNotes(e.target.value)}
                    className="w-full bg-[#FBF7F0] border border-[#E6DFD3] text-[#241F1B] p-3 text-xs focus:outline-none focus:border-[#C9A961]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#241F1B] text-[#C9A961] py-4 text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#181412] transition-colors"
                >
                  Confirm Private Viewing Request
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
