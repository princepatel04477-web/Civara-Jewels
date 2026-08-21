"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { NewsletterCapture } from "./footer/NewsletterCapture";
import { MapPin, MessageCircle, Phone, Mail, ShieldCheck } from "lucide-react";

export const Footer = () => {
  const [isAdminAllowed, setIsAdminAllowed] = useState(false);

  useEffect(() => {
    fetch("/api/auth/ip-check")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.isAllowed) {
          setIsAdminAllowed(true);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" className="bg-[#241F1B] text-[#E6DFD3] border-t border-[#6E6459]/30">
      {/* Top Newsletter Strip (P2-6) */}
      <div className="border-b border-[#6E6459]/40 py-12 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2">
            <div className="text-[10px] tracking-[0.28em] text-[#C9A961] uppercase font-medium">
              Civara Private Atelier
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl text-[#FBF7F0] font-medium">
              First look at private releases.
            </h2>
            <p className="text-xs text-[#E6DFD3]/80 leading-relaxed max-w-md">
              Receive previews of limited bespoke solitaire releases and master lapidary studies before public atelier debut.
            </p>
          </div>
          <div className="lg:col-span-6">
            <NewsletterCapture />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-16 lg:py-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Col 1: Brand & Physical Presence (P2-7) */}
        <div className="lg:col-span-2 space-y-5">
          <Link href="/" className="inline-block">
            <div className="font-serif text-2xl tracking-[0.3em] font-medium text-[#FBF7F0]">
              CIVARA <span className="text-[#C9A961]">JEWELS</span>
            </div>
            <div className="text-[10px] tracking-[0.28em] text-[#C9A961] uppercase mt-1">
              Pure. Precious. Perfect.
            </div>
          </Link>
          <p className="text-xs font-light leading-relaxed max-w-sm text-[#E6DFD3]/90">
            A fine jewellery atelier crafting heirlooms in hallmarked 18-karat recycled gold and certified diamonds. Made to order.
          </p>

          {/* Physical Presence Badges (P2-7) */}
          <div className="pt-2 space-y-2 border-t border-[#6E6459]/30 text-xs font-light text-[#E6DFD3]/90">
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-[#C9A961] font-medium">
              Private Ateliers:
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#C9A961] shrink-0 mt-0.5" />
              <span>Bandra West, Mumbai · Khan Market, New Delhi</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-3.5 h-3.5 text-center text-[#C9A961] font-serif shrink-0">◇</span>
              <span>Virtual Concierge Worldwide (High Definition)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Collections & Edits */}
        <div className="space-y-4 text-xs">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[#C9A961] mb-2 font-medium">
            Collections
          </div>
          <ul className="space-y-2.5 font-light text-[#E6DFD3]">
            <li><Link href="/collections/rings" className="hover:text-[#C9A961] transition-colors">Solitaires & Rings</Link></li>
            <li><Link href="/collections/necklaces" className="hover:text-[#C9A961] transition-colors">Chokers & Necklaces</Link></li>
            <li><Link href="/collections/earrings" className="hover:text-[#C9A961] transition-colors">Sculptural Earrings</Link></li>
            <li><Link href="/collections/bracelets" className="hover:text-[#C9A961] transition-colors">Bangles & Cuffs</Link></li>
            <li><Link href="/collections/bridal" className="hover:text-[#C9A961] transition-colors">Bridal & Ceremony</Link></li>
            <li><Link href="/occasions/engagement" className="hover:text-[#C9A961] transition-colors">Engagement Edit</Link></li>
          </ul>
        </div>

        {/* Col 3: Atelier Services & Education */}
        <div className="space-y-4 text-xs">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[#C9A961] mb-2 font-medium">
            Atelier & Craft
          </div>
          <ul className="space-y-2.5 font-light text-[#E6DFD3]">
            <li><Link href="/craft" className="hover:text-[#C9A961] transition-colors">Craft & Provenance</Link></li>
            <li><Link href="/about" className="hover:text-[#C9A961] transition-colors">The Atelier Story</Link></li>
            <li><Link href="/bespoke" className="hover:text-[#C9A961] transition-colors">Bespoke Commissions</Link></li>
            <li><Link href="/studio" className="hover:text-[#C9A961] transition-colors">Civara Studio</Link></li>
            <li><Link href="/viewings" className="hover:text-[#C9A961] transition-colors">Private Viewings</Link></li>
            <li><Link href="/education/4cs" className="hover:text-[#C9A961] transition-colors">Diamond Education</Link></li>
            <li><Link href="/education/metals" className="hover:text-[#C9A961] transition-colors">18k Gold Standards</Link></li>
            <li><Link href="/journal" className="hover:text-[#C9A961] transition-colors">Civara Journal</Link></li>
          </ul>
        </div>

        {/* Col 4: Concierge & Legal */}
        <div className="space-y-4 text-xs">
          <div className="text-[11px] tracking-[0.24em] uppercase text-[#C9A961] mb-2 font-medium">
            Concierge
          </div>
          <div className="space-y-2.5 font-light text-[#E6DFD3]">
            <a href="tel:+919999900000" className="hover:text-[#C9A961] transition-colors flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#C9A961]" /> +91 99999 00000
            </a>
            <a href="mailto:hello@civarajewels.com" className="hover:text-[#C9A961] transition-colors flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#C9A961]" /> hello@civarajewels.com
            </a>
            <a
              href="https://wa.me/919999900000?text=Hello%20Civara%20Jewels%2C%20I%20would%20like%20to%20enquire%20about%20a%20viewing."
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C9A961] hover:underline flex items-center gap-1.5 pt-1"
            >
              <MessageCircle className="w-3.5 h-3.5" /> WhatsApp Concierge →
            </a>
          </div>

          <div className="pt-4 border-t border-[#6E6459]/40 space-y-1.5 text-[11px]">
            <div><Link href="/shipping-and-returns" className="hover:text-[#C9A961] transition-colors">Shipping & Delivery</Link></div>
            <div><Link href="/faq" className="hover:text-[#C9A961] transition-colors">Frequently Asked Questions</Link></div>
            <div><Link href="/privacy" className="hover:text-[#C9A961] transition-colors">Privacy Policy</Link></div>
            <div><Link href="/terms" className="hover:text-[#C9A961] transition-colors">Terms of Service</Link></div>
            {isAdminAllowed && (
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="text-[#C9A961] hover:underline inline-flex items-center gap-1 font-medium tracking-wider uppercase text-[10px]"
                >
                  <ShieldCheck className="w-3.5 h-3.5" /> Admin Panel
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#6E6459]/40 px-6 lg:px-14 py-6 flex flex-col sm:flex-row justify-between items-center text-[11px] tracking-[0.18em] uppercase text-[#6E6459] gap-2">
        <div>© Civara Jewels {new Date().getFullYear()}</div>
        <div className="text-center sm:text-right flex items-center gap-4">
          <span>Bandra, Mumbai · Khan Market, Delhi · Virtual HD</span>
          {isAdminAllowed && (
            <Link href="/admin" className="text-[#C9A961]/80 hover:text-[#C9A961] underline text-[10px]">
              Atelier Admin
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
};
