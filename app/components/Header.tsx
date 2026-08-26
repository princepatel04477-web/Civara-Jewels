"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { BookViewingDialog } from "./header/BookViewingDialog";
import { Catalog } from "../../lib/catalog";
import { getWishlistIds } from "../../lib/wishlist";
import { Menu, X, Search, Heart, ChevronDown } from "lucide-react";

export const Header = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [savedCount, setSavedCount] = useState(0);

  const megaMenuCategories = [
    { name: "Rings", href: "/collections/rings", image: "/images/home-m-cc/Rings-m.png" },
    { name: "Necklaces", href: "/collections/necklaces", image: "/images/home-m-cc/Necklaces-m.png" },
    { name: "Earrings", href: "/collections/earrings", image: "/images/home-m-cc/earrings-m.png" },
    { name: "Bracelets", href: "/collections/bracelets", image: "/images/home-m-cc/bracelets-m.png" },
    { name: "Bridal", href: "/collections/bridal", image: "/images/home-m-cc/bridal-m.png" },
    { name: "Pendants", href: "/collections/pendants", image: "/images/home-m-cc/pendants-m.png" },
  ];

  const updateCount = () => {
    setSavedCount(getWishlistIds().length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("wishlist-updated", updateCount);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { name: "Jewellery", href: "/jewellery", hasMega: true },
    { name: "Curated Edits", href: "/collections" },
    { name: "The Atelier", href: "/about" },
    { name: "Bespoke", href: "/bespoke" },
    { name: "Journal", href: "/journal" },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full"
      onMouseLeave={() => setIsMegaMenuOpen(false)}
    >
      <nav
        className={`bg-[#FBF7F0]/95 backdrop-blur-md transition-all duration-320 ${
          isScrolled
            ? "py-3 border-b border-[#E6DFD3] shadow-sm"
            : "py-5 border-b border-[#E6DFD3]/60"
        } px-6 lg:px-14 flex items-center justify-between gap-6 relative`}
      >
        {/* Logo */}
        <Link
          href="/"
          className={`font-serif tracking-[0.3em] font-medium text-[#241F1B] transition-transform duration-320 ${
            isScrolled ? "scale-90 text-xl lg:text-[21px]" : "scale-100 text-2xl lg:text-[23px]"
          }`}
        >
          CIVARA <span className="text-[#C9A961]">JEWELS</span>
        </Link>

        {/* Desktop Navigation Links with Gold Left-Drawing Underline */}
        <div className="hidden lg:flex items-center gap-7 text-xs tracking-[0.13em] uppercase">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.hasMega && pathname.startsWith("/collections"));
            return (
              <div
                key={item.name}
                className="relative py-1 group"
                onMouseEnter={() => {
                  if (item.hasMega) setIsMegaMenuOpen(true);
                  else setIsMegaMenuOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  className={`transition-colors py-1 flex items-center gap-1 ${
                    isActive ? "text-[#9E7F3C] font-medium" : "text-[#241F1B] hover:text-[#9E7F3C]"
                  }`}
                >
                  {item.name}
                  {item.hasMega && <ChevronDown className="w-3 h-3 text-[#9E7F3C]" />}
                </Link>
                {/* Left-drawing Gold Underline */}
                <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#C9A961] transition-all duration-320 ease-quiet group-hover:w-full" />
              </div>
            );
          })}
        </div>

        {/* Right Actions: Search, Wishlist Badge, Viewing CTA */}
        <div className="flex items-center gap-4">
          <Link
            href="/search"
            className="p-2 text-[#241F1B] hover:text-[#9E7F3C] transition-colors"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </Link>

          <Link
            href="/wishlist"
            className="p-2 text-[#241F1B] hover:text-[#9E7F3C] transition-colors relative"
            title="Saved Pieces"
          >
            <Heart className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#C9A961] text-[#241F1B] text-[9px] font-bold flex items-center justify-center">
                {savedCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => setIsViewingOpen(true)}
            className="hidden sm:block border border-[#C9A961] text-[#9E7F3C] rounded-full px-5 py-2 text-xs tracking-[0.16em] uppercase hover:bg-[#241F1B] hover:text-[#FBF7F0] hover:border-[#241F1B] transition-all whitespace-nowrap"
          >
            Book a viewing
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-[#241F1B] lg:hidden"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mega-Menu Dropdown for Collections Navigation Strip (Directly attached flush under navbar) */}
        {isMegaMenuOpen && (
          <div
            onMouseEnter={() => setIsMegaMenuOpen(true)}
            onMouseLeave={() => setIsMegaMenuOpen(false)}
            className="absolute top-full left-0 right-0 z-50 bg-[#FAF7F0]/98 backdrop-blur-xl border-b border-[#E6DFD3] py-6 px-6 lg:px-14 hidden lg:block shadow-2xl animate-fadeIn"
          >
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between border-b border-[#E6DFD3]/70 pb-3">
                <div className="text-[10.5px] uppercase tracking-[0.24em] text-[#9E7F3C] font-semibold">
                  Private Atelier High Jewellery Curation
                </div>
                <Link
                  href="/collections"
                  onClick={() => setIsMegaMenuOpen(false)}
                  className="text-[11px] uppercase tracking-[0.18em] text-[#241F1B] hover:text-[#9E7F3C] transition-colors font-medium inline-flex items-center gap-1"
                >
                  View All Collections →
                </Link>
              </div>
              <div className="grid grid-cols-6 gap-3.5 xl:gap-4">
                {megaMenuCategories.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setIsMegaMenuOpen(false)}
                    className="group flex flex-col gap-2"
                  >
                    <div className="relative overflow-hidden aspect-[16/9] border border-[#E6DFD3] group-hover:border-[#C9A961] transition-all duration-300 rounded-[3px] shadow-xs group-hover:shadow-lg block bg-[#F4EDE2]">
                      <Image
                        src={c.image}
                        alt={`Civara ${c.name} Collection`}
                        fill
                        sizes="16vw"
                        priority
                        className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                      {/* Subtle luxury edge glow on hover */}
                      <div className="absolute inset-0 border border-transparent group-hover:border-[#C9A961]/70 transition-colors duration-300 pointer-events-none" />
                    </div>
                    <div className="text-center">
                      <div className="font-serif text-sm font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                        {c.name}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Mobile Haute Joaillerie Atelier Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-[60px] sm:top-[70px] z-50 bg-[#181412]/70 backdrop-blur-md lg:hidden flex flex-col justify-start animate-fadeIn">
          <div className="bg-[#FAF7F0] border-b border-[#C9A961]/40 shadow-2xl max-h-[88vh] overflow-y-auto p-6 space-y-6 animate-slideDown">
            {/* Atelier Header Tag */}
            <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
              <div className="text-[10px] uppercase font-mono tracking-[0.25em] text-[#9E7F3C] font-semibold flex items-center gap-1.5">
                <span>✦</span> Civara Fine Jewellery · Surat Atelier
              </div>
              <div className="text-[9px] uppercase font-mono text-[#6E6459] tracking-widest bg-[#F4EDE2] px-2.5 py-1 rounded-full border border-[#E6DFD3]">
                BIS 750 Certified
              </div>
            </div>

            {/* Horizontal Swipeable Category Gallery */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-[#241F1B] font-medium">
                <span>Curated Categories</span>
                <Link
                  href="/collections"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-[10px] text-[#9E7F3C] hover:underline"
                >
                  View All →
                </Link>
              </div>
              <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 pt-1 -mx-2 px-2 scroll-smooth">
                {megaMenuCategories.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group shrink-0 w-36 flex flex-col gap-1.5 active:scale-95 transition-transform"
                  >
                    <div className="relative aspect-[16/9] w-full rounded-[3px] border border-[#E6DFD3] overflow-hidden bg-[#F4EDE2] shadow-xs">
                      <Image
                        src={c.image}
                        alt={c.name}
                        fill
                        sizes="144px"
                        className="object-cover object-center"
                      />
                    </div>
                    <span className="font-serif text-xs font-medium text-center text-[#241F1B] group-hover:text-[#9E7F3C]">
                      {c.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Numbered Editorial Navigation */}
            <div className="space-y-1 border-t border-[#E6DFD3] pt-4">
              {navItems.map((item, idx) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between py-2.5 border-b border-[#E6DFD3]/40 transition-colors ${
                      isActive ? "text-[#9E7F3C] font-semibold" : "text-[#241F1B]"
                    }`}
                  >
                    <span className="text-xs uppercase tracking-[0.18em]">{item.name}</span>
                    <span className="text-[10px] font-mono text-[#9E7F3C]/80">0{idx + 1}</span>
                  </Link>
                );
              })}
              <Link
                href="/size-guide"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 border-b border-[#E6DFD3]/40 text-[#6E6459]"
              >
                <span className="text-xs uppercase tracking-[0.18em]">Sizing & Fit Guide</span>
                <span className="text-[10px] font-mono text-[#6E6459]">06</span>
              </Link>
            </div>

            {/* Quick Actions Strip */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsViewingOpen(true);
                }}
                className="w-full bg-[#241F1B] text-[#C9A961] py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-medium shadow-md active:scale-98 transition-transform cursor-pointer"
              >
                Book Surat Private Viewing
              </button>

              <a
                href="https://wa.me/918866077237?text=Hello%20Civara%20Atelier%2C%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20piece"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full border border-[#C9A961] text-[#9E7F3C] py-3 rounded-full text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 hover:bg-[#F4EDE2] active:scale-98 transition-transform"
              >
                WhatsApp Atelier Concierge
              </a>
            </div>

            {/* Bottom Surat Atelier Note */}
            <div className="text-center pt-2 text-[10px] font-mono text-[#9E9385] uppercase tracking-widest">
              Civara High Jewellery Atelier · Surat, Gujarat
            </div>
          </div>

          {/* Backdrop tap to close */}
          <div
            className="flex-1"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </div>
      )}

      {/* Viewing Modal */}
      <BookViewingDialog isOpen={isViewingOpen} onClose={() => setIsViewingOpen(false)} />
    </header>
  );
};
