"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Layers,
  DollarSign,
  Boxes,
  Image as ImageIcon,
  History,
  Shield,
  ExternalLink,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Sparkles,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login" || pathname === "/admin/forbidden";

  useEffect(() => {
    if (!isLoginPage) {
      fetch("/api/admin/auth/logout") // check session
        .then((res) => {
          if (res.ok) return res.json();
          throw new Error("Unauthenticated");
        })
        .then((data) => {
          if (data && data.user) {
            setAdminUser(data.user);
          }
        })
        .catch(() => {});
    }
  }, [isLoginPage]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/logout", { method: "POST" });
      router.push("/admin/login");
    } catch {
      router.push("/admin/login");
    }
  };

  // If on login or forbidden page, render clean container without sidebar
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#FAF7F0] text-[#211C15] font-sans">{children}</div>;
  }

  interface NavItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    exact?: boolean;
  }

  interface NavSection {
    title: string;
    items: NavItem[];
  }

  const navSections: NavSection[] = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: "CATALOG",
      items: [
        { label: "All Designs", href: "/admin/products", icon: Package },
        { label: "Categories", href: "/admin/categories", icon: Layers },
      ],
    },
    {
      title: "PRICING & METALS",
      items: [
        { label: "Metal Rates", href: "/admin/pricing", icon: DollarSign },
        { label: "Rate History", href: "/admin/pricing/history", icon: History },
      ],
    },
    {
      title: "INVENTORY",
      items: [
        { label: "Stock Levels", href: "/admin/inventory", icon: Boxes },
        { label: "Ring Sizing", href: "/admin/inventory/ring-sizes", icon: Sparkles },
      ],
    },
    {
      title: "MEDIA & LOGS",
      items: [
        { label: "Product Photos", href: "/admin/media", icon: ImageIcon },
        { label: "Audit Logs", href: "/admin/activity", icon: History },
        { label: "Admin Settings", href: "/admin/settings", icon: Shield },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#211C15] flex flex-col md:flex-row font-sans">
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-[#241F1B] text-[#FBF7F0] px-6 py-4 flex items-center justify-between border-b border-[#6E6459]/30">
        <Link href="/admin" className="font-serif text-xl tracking-[0.25em] text-[#FBF7F0]">
          CIVARA <span className="text-[#C9A961]">ATELIER</span>
        </Link>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-[#C9A961]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Left Rail (Desktop 260px, Mobile drawer) */}
      <aside
        className={`${
          mobileMenuOpen ? "block" : "hidden"
        } md:flex flex-col w-full md:w-64 bg-[#241F1B] text-[#E6DFD3] border-r border-[#6E6459]/30 shrink-0 md:min-h-screen justify-between z-40`}
      >
        <div className="overflow-y-auto">
          {/* Brand Header */}
          <div className="p-6 border-b border-[#6E6459]/30">
            <Link href="/admin" className="block">
              <div className="font-serif text-2xl tracking-[0.28em] font-medium text-[#FBF7F0]">
                CIVARA
              </div>
              <div className="text-[9.5px] uppercase tracking-[0.3em] text-[#C9A961] mt-0.5 font-medium">
                Atelier Administration
              </div>
            </Link>
          </div>

          {/* Navigation Sections */}
          <nav className="p-4 space-y-6 text-xs">
            {navSections.map((sec) => (
              <div key={sec.title} className="space-y-1.5">
                <div className="px-3 text-[9.5px] uppercase tracking-[0.25em] text-[#C9A961]/70 font-semibold">
                  {sec.title}
                </div>
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === item.href
                    : pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3.5 py-2.5 uppercase tracking-[0.14em] text-[11px] font-medium transition-all ${
                        isActive
                          ? "bg-[#FAF7F0] text-[#241F1B] shadow-sm font-semibold"
                          : "text-[#E6DFD3]/80 hover:text-[#C9A961] hover:bg-[#181412]"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#9E7F3C]" : "text-[#C9A961]"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer / User Session / Sign out */}
        <div className="p-4 border-t border-[#6E6459]/30 space-y-2 bg-[#181412]/50">
          <div className="px-3 py-1.5 text-[10px] text-[#E6DFD3]/70 flex items-center justify-between">
            <span className="truncate">{adminUser?.name || "Atelier Admin"}</span>
            <span className="text-[#C9A961] font-mono text-[9px]">SQLite WAL</span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-[11px] uppercase tracking-[0.16em] text-red-400 hover:text-red-300 hover:bg-[#241F1B] transition-colors font-medium text-left"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 bg-[#FBF7F0] border-b border-[#E6DFD3]">
          <div className="flex items-center gap-3 text-xs text-[#6E6459]">
            <span className="text-[11px] uppercase tracking-wider text-[#9E7F3C] font-semibold">
              Civara Atelier Console
            </span>
            <span>•</span>
            <span className="text-[11px]">Database: Local SQLite (Data-Driven)</span>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.18em] text-[#241F1B] hover:text-[#9E7F3C] transition-colors font-medium border-b border-[#C9A961]/60 pb-0.5"
            >
              <span>Preview Storefront</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        {/* Dynamic Main Body Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto animate-fadeIn">
          {children}
        </main>
      </div>
    </div>
  );
}
