"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";

export default function SellerLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password.trim()) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Authentication failed. Please check your credentials.");
      }

      // Success
      router.push(data.redirectUrl || "/seller");
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "Unable to sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickFill = () => {
    setEmail("seller@civarajewels.com");
    setPassword("seller18k!");
    setErrorMessage("");
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] text-[#241F1B] flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block group">
            <span className="font-serif text-3xl sm:text-4xl tracking-[0.25em] text-[#241F1B] font-medium block">
              CIVARA
            </span>
            <span className="text-[11px] uppercase tracking-[0.35em] text-[#9E7F3C] font-semibold block mt-1">
              SELLER ATELIER PORTAL
            </span>
          </Link>
          <p className="text-xs text-[#6E6459] font-light max-w-xs mx-auto pt-2">
            Daily Gold Rate Management &amp; Storefront Pricing Desk
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E6DFD3] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-[#E6DFD3] pb-3">
            <div className="flex items-center gap-2 text-[#9E7F3C]">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#241F1B]">
                Seller Access
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider bg-[#FAF7F0] px-2 py-0.5 border border-[#E6DFD3] text-[#6E6459]">
              Rate Portal
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] font-medium">
                Seller Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seller@civarajewels.com"
                  required
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD3] focus:border-[#9E7F3C] text-[#241F1B] pl-9 pr-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                />
                <Mail className="w-4 h-4 text-[#9E7F3C] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] uppercase tracking-[0.16em] text-[#6E6459] font-medium">
                Portal Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-[#FAF7F0] border border-[#E6DFD3] focus:border-[#9E7F3C] text-[#241F1B] pl-9 pr-3.5 py-2.5 text-xs focus:outline-none transition-colors"
                />
                <Lock className="w-4 h-4 text-[#9E7F3C] absolute left-3 top-3 pointer-events-none" />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#241F1B] text-[#C9A961] hover:bg-[#181412] py-3.5 px-4 text-xs uppercase tracking-[0.2em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2 shadow-xs"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Enter Seller Panel</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick-fill helper for instant access */}
          <div className="pt-2 border-t border-[#E6DFD3] text-center">
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-[11px] text-[#9E7F3C] hover:text-[#241F1B] underline font-medium cursor-pointer"
            >
              Use Default Seller Credentials (seller@civarajewels.com)
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between text-xs text-[#6E6459] px-2">
          <Link href="/" className="hover:text-[#241F1B] transition-colors">
            ← Return to Boutique
          </Link>
          <Link href="/admin/login" className="hover:text-[#241F1B] transition-colors">
            Master Admin Login →
          </Link>
        </div>
      </div>
    </div>
  );
}
