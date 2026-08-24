"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LineReveal } from "../components/motion/LineReveal";
import { RuleDraw } from "../components/motion/RuleDraw";
import { MapPin, Clock, Calendar, CheckCircle2, MessageCircle, Phone, Mail, Video } from "lucide-react";

export default function ViewingsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "+91 ",
    email: "",
    date: "",
    time: "11:00 AM",
    location: "Surat Private Atelier",
    interests: "",
  });

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          city: formData.location,
          date: formData.date,
          piece: formData.interests,
        }),
      });
    } catch {
      // Graceful fallback
    }

    const cleanPhone = formData.phone.replace(/\D/g, "").slice(-10);
    const waText = encodeURIComponent(
      `*Private Viewing Appointment — Civara Jewels*\n\n` +
      `• *Name:* ${formData.name}\n` +
      `• *Phone:* +91 ${cleanPhone}\n` +
      `• *Location:* ${formData.location}\n` +
      `• *Date:* ${formData.date}\n` +
      (formData.interests ? `• *Piece:* ${formData.interests}` : "")
    );
    window.open(`https://wa.me/919999900000?text=${waText}`, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FAF7F0] text-[#211C15]">
      {/* Hero */}
      <section className="py-20 lg:py-28 px-6 lg:px-20 text-center bg-[#FBF7F0] border-b border-[#E6DFD3]">
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs uppercase tracking-[0.32em] text-[#9E7F3C] font-medium">
            Civara Private Concierge
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-medium leading-[1.08] text-[#241F1B]">
            Private Viewings by Appointment
          </h1>
          <div className="w-20 h-[1px] bg-[#C9A961] mx-auto my-3" />
          <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-xl mx-auto">
            Experience our high-jewellery collections in an exclusive private setting with personal concierge guidance.
          </p>
        </div>
      </section>

      {/* Main Grid: Locations Map + Booking Form */}
      <section className="max-w-6xl mx-auto px-6 lg:px-14 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Physical Presence & Map (P2-7) */}
        <div className="lg:col-span-5 space-y-8">
          {/* Static Map Graphic with 2 Pins */}
          <div className="bg-[#F4EDE2] p-6 border border-[#E6DFD3] space-y-5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-[#9E7F3C] font-medium">
                Atelier Locations
              </span>
              <span className="text-[11px] text-[#6E6459]">By Appointment</span>
            </div>

            {/* Stylized Minimalist Map */}
            <div className="relative w-full h-48 bg-[#FAF7F0] border border-[#E6DFD3] rounded-none overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full text-[#E6DFD3]" viewBox="0 0 400 200" fill="none">
                <path
                  d="M 50 150 Q 150 60 200 110 T 350 70"
                  stroke="#E6DFD3"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                {/* Surat Pin */}
                <g transform="translate(180, 110)">
                  <circle cx="0" cy="0" r="7" fill="#C9A961" />
                  <circle cx="0" cy="0" r="14" stroke="#9E7F3C" strokeWidth="1" opacity="0.5" />
                  <text x="14" y="4" fill="#241F1B" fontSize="11" fontFamily="sans-serif" fontWeight="bold">
                    Surat Private Atelier (HQ)
                  </text>
                </g>
              </svg>
            </div>

            {/* Location Cards */}
            <div className="space-y-4 text-xs font-light text-[#6E6459] pt-2">
              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
                <div className="font-medium text-[#241F1B] flex items-center gap-1.5 mb-1">
                  <MapPin className="w-3.5 h-3.5 text-[#9E7F3C]" /> Civara Private Atelier — Surat, Gujarat
                </div>
                <div className="text-[11px]">VIP Diamond District, Surat, Gujarat 395007</div>
                <div className="text-[11px] text-[#9E7F3C] pt-1">Mon – Sun: 10:30 AM – 7:30 PM (By Appointment)</div>
              </div>

              <div className="p-4 bg-[#FAF7F0] border border-[#E6DFD3]">
                <div className="font-medium text-[#241F1B] flex items-center gap-1.5 mb-1">
                  <Video className="w-3.5 h-3.5 text-[#9E7F3C]" /> Virtual Concierge (Worldwide 4K HD)
                </div>
                <div className="text-[11px]">High-definition video consultation with macro gemological loupe</div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
              Direct Contact
            </h3>
            <div className="space-y-2 text-xs text-[#6E6459]">
              <a href="tel:+919999900000" className="flex items-center gap-2 hover:text-[#241F1B]">
                <Phone className="w-3.5 h-3.5 text-[#9E7F3C]" /> +91 99999 00000
              </a>
              <a href="mailto:concierge@civarajewels.com" className="flex items-center gap-2 hover:text-[#241F1B]">
                <Mail className="w-3.5 h-3.5 text-[#9E7F3C]" /> concierge@civarajewels.com
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Booking Form */}
        <div className="lg:col-span-7 bg-[#FBF7F0] p-8 lg:p-12 border border-[#C9A961]/40 relative">
          {submitted ? (
            <div className="py-12 text-center space-y-5 animate-fadeIn">
              <CheckCircle2 className="w-12 h-12 text-[#C9A961] mx-auto" />
              <h3 className="font-serif text-3xl font-medium text-[#241F1B]">
                Viewing Request Received
              </h3>
              <p className="text-sm font-light leading-relaxed text-[#6E6459] max-w-sm mx-auto">
                Thank you, {formData.name}. Our private concierge will confirm your appointment for {formData.location} on {formData.date} within 4 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSubmitted(false)}
                  className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
                >
                  Book Another Appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              <div className="border-b border-[#E6DFD3] pb-4">
                <h3 className="font-serif text-2xl font-medium text-[#241F1B]">
                  Request an Appointment
                </h3>
                <p className="text-xs font-light text-[#6E6459] mt-1">
                  Private viewings in Surat or via Virtual Concierge.
                </p>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Meera Kapoor"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] focus:border-[#9E7F3C] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                    Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] focus:border-[#9E7F3C] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="meera@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] focus:border-[#9E7F3C] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                    Preferred Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] cursor-pointer focus:outline-none"
                  >
                    <option value="Surat Private Atelier">Civara Private Atelier (Surat, Gujarat)</option>
                    <option value="Virtual Concierge HD">Virtual Concierge (Worldwide 4K HD)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] mb-1">
                  Pieces of Interest <span className="text-[10px] text-[#6E6459]/70">(Optional)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Elara Solitaire Ring 1.2ct, Bridal Choker"
                  value={formData.interests}
                  onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 text-sm text-[#241F1B] focus:border-[#9E7F3C] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#241F1B] text-[#C9A961] py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors"
              >
                Confirm Viewing Appointment
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
