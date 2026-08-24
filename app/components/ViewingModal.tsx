"use client";

import React, { useState } from "react";
import { X, Calendar, Clock, MapPin, CheckCircle2 } from "lucide-react";

interface ViewingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ViewingModal: React.FC<ViewingModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    type: "In-Person Atelier Visit",
    date: "",
    time: "11:00 AM",
    notes: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#faf7f0] border border-[#d8caac] p-8 shadow-2xl overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#8a8172] hover:text-[#211c15] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8 space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f5efe2] text-[#a8843c] mb-2">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-serif text-3xl font-medium text-[#211c15]">Viewing Scheduled</h3>
            <p className="text-sm font-light text-[#5f5748] max-w-xs mx-auto leading-relaxed">
              Thank you, {formData.name}. Our private concierge will confirm your appointment via WhatsApp and email within 2 hours.
            </p>
            <div className="pt-4">
              <button
                onClick={handleReset}
                className="bg-[#171310] text-[#c9a45c] px-8 py-3.5 text-xs uppercase tracking-[0.22em] hover:bg-[#2a241b] transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-6">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#a8843c] mb-2">
                Civara Private Atelier
              </div>
              <h2 className="font-serif text-3xl font-medium text-[#211c15]">Book a Private Viewing</h2>
              <p className="text-xs font-light text-[#5f5748] mt-1">
                Experience our high-jewellery collections in an exclusive private setting.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Roy"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm focus:border-[#a8843c]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 99999 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="hello@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Viewing Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm cursor-pointer"
                >
                  <option value="In-Person Atelier Visit">In-Person Atelier Visit (Surat, Gujarat)</option>
                  <option value="Virtual Live Concierge">Virtual Live Consultation (HD Cam)</option>
                  <option value="Home Appointment">Bespoke Home Appointment</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm"
                  />
                </div>
                <div>
                  <label className="block uppercase tracking-[0.18em] text-[#8a8172] mb-1">Time Slot</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full p-3 bg-[#fdfbf6] border border-[#d8caac] text-[#211c15] text-sm"
                  >
                    <option value="11:00 AM">11:00 AM - 01:00 PM</option>
                    <option value="02:00 PM">02:00 PM - 04:00 PM</option>
                    <option value="05:00 PM">05:00 PM - 07:00 PM</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-[#171310] text-[#c9a45c] py-4 text-xs uppercase tracking-[0.22em] font-medium hover:bg-[#2a241b] transition-colors"
              >
                Confirm Viewing Request
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
