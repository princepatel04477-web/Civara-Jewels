"use client";

import React from "react";
import Link from "next/link";
import { NewsletterCapture } from "./footer/NewsletterCapture";
import { MapPin, MessageCircle, Phone, Mail, ShieldCheck, DollarSign } from "lucide-react";

export const Footer = () => {
  const [isAdminAllowed, setIsAdminAllowed] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;

    // Check Server IP authorization
    fetch("/api/auth/ip-check")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        if (data?.isAllowed) {
          try {
            localStorage.removeItem("civara_seller_restricted");
            sessionStorage.removeItem("civara_seller_restricted");
            document.cookie = "civara_seller_network=; path=/; max-age=0";
          } catch {}
          setIsAdminAllowed(true);
        } else {
          setIsAdminAllowed(false);
        }
      })
      .catch(() => {
        if (mounted) setIsAdminAllowed(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <footer id="contact" className="bg-[#241F1B] text-[#E6DFD3] border-t border-[#6E6459]/30">
      {/* Top Newsletter Strip (P2-6) */}
      <div className="border-b border-[#6E6459]/40 py-14 px-6 lg:px-14">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-2.5">
            <div className="text-xs sm:text-sm tracking-[0.28em] text-[#C9A961] uppercase font-semibold">
              Civara Private Atelier
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#FBF7F0] font-medium">
              First look at private releases.
            </h2>
            <p className="text-sm sm:text-base text-[#E6DFD3]/85 leading-relaxed max-w-lg font-light">
              Receive previews of limited bespoke solitaire releases and master lapidary studies before public atelier debut.
            </p>
          </div>
          <div className="lg:col-span-6">
            <NewsletterCapture />
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 lg:px-14 py-20 lg:py-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12">
        {/* Col 1: Brand & Physical Presence (P2-7) */}
        <div className="lg:col-span-2 space-y-6">
          <Link href="/" className="inline-block">
            <div className="font-serif text-3xl sm:text-4xl tracking-[0.28em] font-medium text-[#FBF7F0]">
              CIVARA <span className="text-[#C9A961]">JEWELS</span>
            </div>
            <div className="text-xs sm:text-sm tracking-[0.28em] text-[#C9A961] uppercase mt-1.5 font-medium">
              Pure. Precious. Perfect.
            </div>
          </Link>
          <p className="text-sm sm:text-base font-light leading-relaxed max-w-md text-[#E6DFD3]/90">
            A fine jewellery atelier crafting heirlooms in hallmarked 18-karat recycled gold and certified diamonds. Made to order.
          </p>

          {/* Physical Presence Badges (P2-7) */}
          <div className="pt-3 space-y-3 border-t border-[#6E6459]/30 text-sm font-light text-[#E6DFD3]/90">
            <div className="text-xs uppercase tracking-[0.24em] text-[#C9A961] font-semibold">
              Private Ateliers:
            </div>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-[#C9A961] shrink-0 mt-0.5" />
              <span>Surat Private Atelier, Gujarat</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="w-4 h-4 text-center text-[#C9A961] font-serif shrink-0 text-base leading-none">◇</span>
              <span>Virtual Concierge Worldwide (High Definition)</span>
            </div>
          </div>
        </div>

        {/* Col 2: Collections & Edits */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm tracking-[0.24em] uppercase text-[#C9A961] mb-3 font-semibold">
            Collections
          </div>
          <ul className="space-y-3 font-light text-sm sm:text-[15px] text-[#E6DFD3]">
            <li><Link href="/collections/rings" className="hover:text-[#C9A961] transition-colors">Solitaires & Rings</Link></li>
            <li><Link href="/collections/necklaces" className="hover:text-[#C9A961] transition-colors">Chokers & Necklaces</Link></li>
            <li><Link href="/collections/earrings" className="hover:text-[#C9A961] transition-colors">Sculptural Earrings</Link></li>
            <li><Link href="/collections/bracelets" className="hover:text-[#C9A961] transition-colors">Bangles & Cuffs</Link></li>
            <li><Link href="/collections/bridal" className="hover:text-[#C9A961] transition-colors">Bridal & Ceremony</Link></li>
            <li><Link href="/occasions/engagement" className="hover:text-[#C9A961] transition-colors">Engagement Edit</Link></li>
          </ul>
        </div>

        {/* Col 3: Atelier Services & Education */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm tracking-[0.24em] uppercase text-[#C9A961] mb-3 font-semibold">
            Atelier & Craft
          </div>
          <ul className="space-y-3 text-sm sm:text-[15px] font-light text-[#E6DFD3]">
            <li><Link href="/collections/rings" className="hover:text-[#C9A961] transition-colors">Rings & Solitaires</Link></li>
            <li><Link href="/collections/bracelets" className="hover:text-[#C9A961] transition-colors">Bracelets & Cuffs</Link></li>
            <li><Link href="/collections/necklaces" className="hover:text-[#C9A961] transition-colors">Necklaces & Strands</Link></li>
            <li><Link href="/collections/pendants" className="hover:text-[#C9A961] transition-colors">Pendants & Lockets</Link></li>
            <li><Link href="/collections/bridal" className="hover:text-[#C9A961] transition-colors">Bridal Suites</Link></li>
            <li><Link href="/collections/earrings" className="hover:text-[#C9A961] transition-colors">Earrings & Drops</Link></li>
            <li><Link href="/collections" className="hover:text-[#C9A961] transition-colors font-medium text-[#C9A961]">Browse All Creations →</Link></li>
          </ul>
        </div>

        {/* Col 4: The Atelier */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm uppercase tracking-[0.24em] text-[#C9A961] font-semibold mb-3">
            The Atelier
          </div>
          <ul className="space-y-3 text-sm sm:text-[15px] font-light text-[#E6DFD3]">
            <li><Link href="/about" className="hover:text-[#C9A961] transition-colors">Our Philosophy</Link></li>
            <li><Link href="/craft" className="hover:text-[#C9A961] transition-colors">Craftsmanship</Link></li>
            <li><Link href="/bespoke" className="hover:text-[#C9A961] transition-colors">Bespoke Commissions</Link></li>
            <li><Link href="/certification" className="hover:text-[#C9A961] transition-colors">Certification & Hallmarking</Link></li>
            <li><Link href="/journal" className="hover:text-[#C9A961] transition-colors">The Journal</Link></li>
            <li><Link href="/size-guide" className="hover:text-[#C9A961] transition-colors">Ring Size Guide</Link></li>
          </ul>
        </div>

        {/* Col 5: Client Concierge */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm uppercase tracking-[0.24em] text-[#C9A961] font-semibold mb-3">
            Client Concierge
          </div>
          <div className="space-y-3.5 text-sm sm:text-[15px] text-[#E6DFD3]/90 font-light">
            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-[#C9A961] shrink-0" />
              <a href="tel:+918866077237" className="hover:text-[#C9A961] transition-colors">+91 88660 77237</a>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-[#C9A961] shrink-0" />
              <a href="mailto:concierge@civarajewels.com" className="hover:text-[#C9A961] transition-colors break-all">concierge@civarajewels.com</a>
            </div>
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-[#C9A961] shrink-0" />
              <a href="https://wa.me/918866077237" target="_blank" rel="noopener noreferrer" className="hover:text-[#C9A961] transition-colors">WhatsApp Concierge</a>
            </div>
            <div className="pt-2 text-xs sm:text-sm text-[#A89F91] leading-relaxed">
              Monday through Saturday<br />
              10:00 AM – 7:00 PM IST
            </div>
          </div>
        </div>

        {/* Col 6: Client Care & Policies */}
        <div className="space-y-4">
          <div className="text-xs sm:text-sm uppercase tracking-[0.24em] text-[#C9A961] font-semibold mb-3">
            Assurance
          </div>
          <ul className="space-y-2.5 text-sm sm:text-[15px] text-[#E6DFD3]/90 font-light">
            <li>✓ Hallmarked Fine Metals</li>
            <li>✓ IGI &amp; GIA Certified</li>
            <li>✓ Fully Insured Transit</li>
            <li>✓ Lifetime Care &amp; Clean</li>
          </ul>

          <div className="pt-4 border-t border-[#6E6459]/40 space-y-2 text-xs sm:text-sm">
            <div><Link href="/shipping-and-returns" className="hover:text-[#C9A961] transition-colors">Shipping & Delivery</Link></div>
            <div><Link href="/faq" className="hover:text-[#C9A961] transition-colors">Frequently Asked Questions</Link></div>
            <div><Link href="/privacy" className="hover:text-[#C9A961] transition-colors">Privacy Policy</Link></div>
            <div><Link href="/terms" className="hover:text-[#C9A961] transition-colors">Terms of Service</Link></div>
            <div className="pt-2 flex flex-col gap-2">
              <Link
                href="/seller/login"
                className="text-[#C9A961] hover:underline inline-flex items-center gap-1.5 font-medium tracking-wider uppercase text-xs"
              >
                <DollarSign className="w-4 h-4" /> Seller Desk
              </Link>
              {isAdminAllowed && (
                <Link
                  href="/admin/login"
                  className="text-[#E6DFD3]/70 hover:text-[#C9A961] hover:underline inline-flex items-center gap-1.5 font-medium tracking-wider uppercase text-xs"
                >
                  <ShieldCheck className="w-4 h-4" /> Master Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#6E6459]/40 px-6 lg:px-14 py-8 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm tracking-[0.18em] uppercase text-[#A89F91] gap-4">
        <div>© Civara Jewels {new Date().getFullYear()}</div>
        <div className="text-center sm:text-right flex items-center flex-wrap justify-center gap-4">
          <span>Surat, Gujarat · Virtual Concierge Worldwide</span>
          <Link href="/seller/login" className="text-[#C9A961]/80 hover:text-[#C9A961] underline text-xs">
            Seller Desk
          </Link>
          {isAdminAllowed && (
            <>
              <span className="text-[#6E6459]">•</span>
              <Link href="/admin/login" className="text-[#C9A961]/80 hover:text-[#C9A961] underline text-xs">
                Admin Portal
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
};
