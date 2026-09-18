"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DollarSign,
  Store,
  LogOut,
  Sparkles,
  Shield,
  Clock,
  Menu,
  X,
  ExternalLink,
  Gem,
} from "lucide-react";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === "/seller/login";
  const [sellerUser, setSellerUser] = useState<{ name: string; email: string; role?: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [checkingAuth, setCheckingAuth] = useState(!isLoginPage);

  useEffect(() => {
    if (!isLoginPage) {
      setCheckingAuth(true);
      fetch("/api/seller/auth/session")
        .then(async (res) => {
          if (!res.ok) {
            const fallbackRes = await fetch("/api/admin/auth/logout");
            if (!fallbackRes.ok) throw new Error("Unauthenticated");
            return fallbackRes.json();
          }
          return res.json();
        })
        .then((data) => {
          if (data && data.isLoggedIn && data.user) {
            setSellerUser(data.user);
            setCheckingAuth(false);
          } else {
            window.location.href = "/seller/login";
          }
        })
        .catch(() => {
          window.location.href = "/seller/login";
        });
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch("/api/seller/auth/logout", { method: "POST" });
    } catch {
      try {
        await fetch("/api/admin/auth/logout", { method: "POST" });
      } catch {
        // ignore
      }
    }
    setSellerUser(null);
    window.location.href = "/seller/login";
  };

  // If on login page, render clean container without header
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#FAF7F0] text-[#241F1B] font-sans">{children}</div>;
  }

  // If verifying session, prevent protected dashboard flash
  if (checkingAuth && !sellerUser) {
    return (
      <div className="min-h-screen bg-[#FAF7F0] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs uppercase tracking-[0.2em] text-[#9E7F3C] font-mono">Verifying Seller Desk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#241F1B] flex flex-col font-sans">
      {/* Top Seller Bar */}
      <header className="sticky top-0 z-40 bg-[#241F1B] text-[#FBF7F0] border-b border-[#6E6459]/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand & Portal Title */}
          <div className="flex items-center gap-4">
            <Link href="/seller" className="flex items-center gap-2 group">
              <span className="font-serif text-xl sm:text-2xl tracking-[0.25em] text-[#FBF7F0] font-medium">
                CIVARA
              </span>
              <span className="text-[10px] uppercase tracking-[0.28em] text-[#C9A961] font-semibold hidden sm:inline-block border-l border-[#6E6459]/40 pl-3">
                Seller Desk
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-6 text-xs">
            <Link
              href="/seller"
              className={`inline-flex items-center gap-1.5 py-1 px-2.5 transition-colors ${
                pathname === "/seller"
                  ? "text-[#C9A961] font-medium border-b-2 border-[#C9A961]"
                  : "text-[#E6DFD3] hover:text-[#FFFFFF]"
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Bullion &amp; Diamond Carat Rates</span>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#E6DFD3] hover:text-[#C9A961] transition-colors py-1 px-2.5"
            >
              <Store className="w-3.5 h-3.5" />
              View Online Storefront
              <ExternalLink className="w-3 h-3 opacity-70" />
            </Link>
          </nav>

          {/* Right User Status & Logout */}
          <div className="hidden md:flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-[#181412] px-3 py-1.5 border border-[#6E6459]/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[#E6DFD3] font-mono text-[11px]">
                {sellerUser?.email || "seller@civarajewels.com"}
              </span>
              <span className="text-[9px] uppercase font-semibold bg-[#9E7F3C]/30 text-[#C9A961] px-1.5 py-0.5 rounded-xs">
                {sellerUser?.role === "admin" ? "Admin" : "Seller"}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="text-[#E6DFD3] hover:text-[#C9A961] p-1.5 transition-colors cursor-pointer flex items-center gap-1"
              title="Sign Out of Seller Portal"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-[11px]">Sign Out</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#C9A961] p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#181412] border-b border-[#6E6459]/30 px-4 py-4 space-y-3 text-xs">
            <div className="pb-2 border-b border-[#6E6459]/30 text-[11px] text-[#E6DFD3] flex items-center justify-between">
              <span>Logged in as:</span>
              <span className="font-mono text-[#C9A961]">{sellerUser?.email || "seller@civarajewels.com"}</span>
            </div>
            <Link
              href="/seller"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#C9A961] font-medium"
            >
              Daily Bullion &amp; Diamond Carat Rates
            </Link>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-[#E6DFD3] hover:text-[#C9A961]"
            >
              View Online Storefront ↗
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left py-2 text-rose-300 hover:text-rose-100 flex items-center gap-2 cursor-pointer border-t border-[#6E6459]/30 pt-3"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        )}
      </header>

      {/* Main Page Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E6DFD3] bg-[#FFFFFF] py-4 text-center text-xs text-[#6E6459]">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Civara Jewels Atelier Seller Management Desk</span>
          <span className="font-mono text-[11px]">Secure SSL Sealed Connection</span>
        </div>
      </footer>
    </div>
  );
}
