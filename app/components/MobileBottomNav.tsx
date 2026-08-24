"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getWishlistIds } from "../../lib/wishlist";
import { BookViewingDialog } from "./header/BookViewingDialog";
import { 
  Sparkles, 
  Grid, 
  BookOpen, 
  Heart, 
  Calendar,
  Compass
} from "lucide-react";

export const MobileBottomNav = () => {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const [isViewingOpen, setIsViewingOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const updateCount = () => {
    setSavedCount(getWishlistIds().length);
  };

  useEffect(() => {
    updateCount();
    window.addEventListener("wishlist-updated", updateCount);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      // Auto-hide when scrolling down fast, show when scrolling up or near top
      if (currentScrollY < 100) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 12) {
        setIsVisible(false);
      } else if (lastScrollY - currentScrollY > 8) {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("wishlist-updated", updateCount);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  const navItems = [
    {
      name: "Atelier",
      href: "/",
      icon: Compass,
      isActive: pathname === "/",
    },
    {
      name: "Edits",
      href: "/collections",
      icon: Grid,
      isActive: pathname.startsWith("/collections") || pathname.startsWith("/jewellery"),
    },
    {
      name: "Journal",
      href: "/journal",
      icon: BookOpen,
      isActive: pathname.startsWith("/journal"),
    },
    {
      name: "Saved",
      href: "/wishlist",
      icon: Heart,
      isActive: pathname === "/wishlist",
      badge: savedCount,
    },
  ];

  return (
    <>
      <nav
        aria-label="Mobile Bottom Atelier Navigation"
        className={`fixed bottom-4 inset-x-3 sm:inset-x-6 z-40 lg:hidden transition-all duration-400 ease-out transform ${
          isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-[#181412]/94 backdrop-blur-2xl border border-[#C9A961]/40 rounded-full px-3 py-2 shadow-2xl flex items-center justify-between gap-1 max-w-md mx-auto">
          {/* Navigation Tab Links */}
          <div className="flex items-center justify-around flex-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all relative ${
                    item.isActive
                      ? "text-[#C9A961] bg-[#241F1B]"
                      : "text-[#B8AEA2] hover:text-[#FAF7F0] active:scale-90"
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-4 h-4" />
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="absolute -top-1.5 -right-2.5 w-3.5 h-3.5 rounded-full bg-[#C9A961] text-[#181412] text-[8px] font-bold flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] uppercase tracking-[0.14em] font-medium mt-0.5 font-mono">
                    {item.name}
                  </span>
                  {item.isActive && (
                    <span className="absolute -bottom-0.5 w-1.5 h-1.5 rounded-full bg-[#C9A961]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Book Viewing Quick Action Button */}
          <button
            type="button"
            onClick={() => setIsViewingOpen(true)}
            className="bg-gradient-to-r from-[#9E7F3C] via-[#C9A961] to-[#D4B66E] text-[#181412] px-3.5 py-2 rounded-full text-[10px] uppercase tracking-[0.16em] font-semibold flex items-center gap-1.5 shadow-md active:scale-95 transition-transform shrink-0"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Salon</span>
          </button>
        </div>
      </nav>

      {/* Book Viewing Modal instance */}
      <BookViewingDialog isOpen={isViewingOpen} onClose={() => setIsViewingOpen(false)} />
    </>
  );
};
