"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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

  const collectionsList = Object.values(Catalog.collections);

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
    { name: "Studio", href: "/studio" },
    { name: "Journal", href: "/journal" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-40 bg-[#FBF7F0]/95 backdrop-blur-md transition-all duration-320 ${
          isScrolled
            ? "py-3 border-b border-[#E6DFD3] shadow-sm"
            : "py-5 border-b border-[#E6DFD3]/60"
        } px-6 lg:px-14 flex items-center justify-between gap-6`}
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
                onMouseEnter={() => item.hasMega && setIsMegaMenuOpen(true)}
                onMouseLeave={() => item.hasMega && setIsMegaMenuOpen(false)}
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
      </nav>

      {/* Mega-Menu Dropdown for Collections */}
      {isMegaMenuOpen && (
        <div
          onMouseEnter={() => setIsMegaMenuOpen(true)}
          onMouseLeave={() => setIsMegaMenuOpen(false)}
          className="fixed inset-x-0 top-[70px] z-30 bg-[#F4EDE2] border-b border-[#E6DFD3] p-10 hidden lg:block shadow-xl animate-fadeIn"
        >
          <div className="max-w-6xl mx-auto grid grid-cols-6 gap-6 text-center">
            {collectionsList.map((c) => (
              <Link
                key={c.slug}
                href={`/collections/${c.slug}`}
                onClick={() => setIsMegaMenuOpen(false)}
                className="group p-4 bg-[#FBF7F0] border border-[#E6DFD3] hover:border-[#C9A961] transition-all"
              >
                <div className="font-serif text-lg font-medium text-[#241F1B] group-hover:text-[#9E7F3C] transition-colors">
                  {c.name}
                </div>
                <div className="text-[10px] uppercase tracking-widest text-[#6E6459] mt-1">
                  {c.count} pieces
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-x-0 top-[70px] z-30 bg-[#FBF7F0] border-b border-[#E6DFD3] p-6 lg:hidden shadow-xl space-y-4">
          <div className="flex flex-col gap-3 text-xs tracking-[0.16em] uppercase">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-2 border-b border-[#E6DFD3]/60 text-[#241F1B]"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/viewings"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#E6DFD3]/60 text-[#9E7F3C]"
            >
              Private Viewings
            </Link>
            <Link
              href="/size-guide"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2 border-b border-[#E6DFD3]/60 text-[#6E6459]"
            >
              Sizing & Fit Guide
            </Link>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsViewingOpen(true);
              }}
              className="mt-2 w-full bg-[#241F1B] text-[#C9A961] py-3 text-xs uppercase tracking-[0.2em]"
            >
              Book a viewing
            </button>
          </div>
        </div>
      )}

      {/* Viewing Modal */}
      <BookViewingDialog isOpen={isViewingOpen} onClose={() => setIsViewingOpen(false)} />
    </>
  );
};
