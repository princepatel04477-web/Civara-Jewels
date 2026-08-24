"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, ArrowRight } from "lucide-react";

interface BookViewingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  initialPiece?: string;
}

export const BookViewingDialog: React.FC<BookViewingDialogProps> = ({
  isOpen,
  onClose,
  initialPiece = "",
}) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+91 ");
  const [city, setCity] = useState("Surat Atelier");
  const [date, setDate] = useState("");
  const [piece, setPiece] = useState(initialPiece);
  const [notes, setNotes] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const dialogRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Compute minimum date (today + 2 days)
  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (initialPiece) {
      setPiece(initialPiece);
    }
  }, [initialPiece]);

  // Scroll lock and ESC listener
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    setTimeout(() => firstInputRef.current?.focus(), 50);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Please enter your full name";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    const last10 = cleanPhone.slice(-10);
    if (last10.length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!date) {
      newErrors.date = "Please select your preferred date";
    } else {
      const selected = new Date(date);
      const min = new Date(getMinDate());
      if (selected < min) {
        newErrors.date = "Bookings require at least 48 hours notice";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      // 1. Submit to API route
      await fetch("/api/viewings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city,
          date,
          piece: piece.trim(),
          notes: notes.trim(),
        }),
      });

      // 2. Open WhatsApp pre-filled summary
      const cleanPhone = phone.replace(/\D/g, "").slice(-10);
      const waText = encodeURIComponent(
        `*Private Viewing Request — Civara Jewels*\n\n` +
        `• *Client:* ${name.trim()}\n` +
        `• *Phone:* +91 ${cleanPhone}\n` +
        `• *Location:* ${city}\n` +
        `• *Date:* ${date}\n` +
        (piece.trim() ? `• *Piece of Interest:* ${piece.trim()}\n` : "") +
        (notes.trim() ? `• *Notes:* ${notes.trim()}\n` : "")
      );

      const waUrl = `https://wa.me/919999900000?text=${waText}`;
      window.open(waUrl, "_blank", "noopener,noreferrer");

      setIsSuccess(true);
    } catch (err) {
      console.error(err);
      setIsSuccess(true); // Fallback gracefully
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#181412]/75 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="viewing-modal-title"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-lg bg-[#FAF7F0] border border-[#C9A961]/40 p-6 sm:p-10 shadow-2xl overflow-y-auto max-h-[92vh] text-[#241F1B]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 text-[#6E6459] hover:text-[#241F1B] transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-10 space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F4EDE2] text-[#9E7F3C] mb-1">
              <CheckCircle2 className="w-7 h-7 stroke-1" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]">
              Viewing Requested
            </h3>
            <p className="text-sm font-light text-[#6E6459] max-w-sm mx-auto leading-relaxed">
              Received. A private concierge will confirm within 4 hours.
            </p>
            <div className="pt-6">
              <button
                onClick={onClose}
                className="bg-[#241F1B] text-[#C9A961] px-8 py-3.5 text-xs uppercase tracking-[0.2em] hover:bg-[#181412] transition-colors rounded-full"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-7 space-y-1.5">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C] font-medium">
                Private Atelier Appointment
              </div>
              <h2
                id="viewing-modal-title"
                className="font-serif text-2xl sm:text-3xl font-medium text-[#241F1B]"
              >
                Book a Viewing
              </h2>
              <p className="text-xs font-light text-[#6E6459]">
                Private appointments in Surat or worldwide via Virtual Concierge HD.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5 text-xs">
              {/* Name */}
              <div>
                <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                  Full Name *
                </label>
                <input
                  ref={firstInputRef}
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: "" });
                  }}
                  placeholder="e.g. Tara Mehta"
                  className={`w-full py-2.5 bg-transparent border-b ${
                    errors.name ? "border-red-600" : "border-[#C9A961]/50 focus:border-[#9E7F3C]"
                  } text-[#241F1B] placeholder-[#6E6459]/50 text-sm focus:outline-none transition-colors`}
                />
                {errors.name && (
                  <p className="text-[11px] text-red-700 mt-1">{errors.name}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                  Phone (India +91) *
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (errors.phone) setErrors({ ...errors, phone: "" });
                  }}
                  placeholder="+91 98200 12345"
                  className={`w-full py-2.5 bg-transparent border-b ${
                    errors.phone ? "border-red-600" : "border-[#C9A961]/50 focus:border-[#9E7F3C]"
                  } text-[#241F1B] placeholder-[#6E6459]/50 text-sm focus:outline-none transition-colors`}
                />
                {errors.phone && (
                  <p className="text-[11px] text-red-700 mt-1">{errors.phone}</p>
                )}
              </div>

              {/* City & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                    Preferred Location *
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 focus:border-[#9E7F3C] text-[#241F1B] text-sm focus:outline-none cursor-pointer"
                  >
                    <option value="Surat Atelier">Civara Atelier & Salon (Surat, Gujarat)</option>
                    <option value="Virtual Concierge HD">Virtual Concierge (Worldwide 4K HD)</option>
                  </select>
                </div>

                <div>
                  <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    min={getMinDate()}
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value);
                      if (errors.date) setErrors({ ...errors, date: "" });
                    }}
                    className={`w-full py-2.5 bg-transparent border-b ${
                      errors.date ? "border-red-600" : "border-[#C9A961]/50 focus:border-[#9E7F3C]"
                    } text-[#241F1B] text-sm focus:outline-none transition-colors`}
                  />
                  {errors.date && (
                    <p className="text-[11px] text-red-700 mt-1">{errors.date}</p>
                  )}
                </div>
              </div>

              {/* Piece of Interest */}
              <div>
                <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                  Piece of Interest <span className="text-[10px] text-[#6E6459]/70">(Optional)</span>
                </label>
                <input
                  type="text"
                  value={piece}
                  onChange={(e) => setPiece(e.target.value)}
                  placeholder="e.g. Elara Solitaire 1.2ct, Custom Bridal Set"
                  className="w-full py-2.5 bg-transparent border-b border-[#C9A961]/50 focus:border-[#9E7F3C] text-[#241F1B] placeholder-[#6E6459]/50 text-sm focus:outline-none transition-colors"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block uppercase tracking-[0.16em] text-[10.5px] text-[#6E6459] mb-1">
                  Specific Requests / Notes <span className="text-[10px] text-[#6E6459]/70">(Optional)</span>
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ring size inquiries, custom diamond carat preference..."
                  className="w-full py-2 bg-transparent border-b border-[#C9A961]/50 focus:border-[#9E7F3C] text-[#241F1B] placeholder-[#6E6459]/50 text-sm focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#241F1B] text-[#C9A961] py-4 text-xs uppercase tracking-[0.2em] font-medium rounded-full hover:bg-[#181412] transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Confirm Viewing Request"}
                  {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
