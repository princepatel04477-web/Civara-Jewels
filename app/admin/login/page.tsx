"use client";

import React, { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, Input } from "../../components/admin/ui";
import { Lock, Shield, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams?.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      router.push(nextUrl);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-[#FBF7F0] border border-[#C9A961] p-8 sm:p-10 shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="font-serif text-3xl tracking-[0.28em] font-medium text-[#241F1B]">
          CIVARA
        </div>
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-medium">
          Atelier Administration Gateway
        </div>
      </div>

      <div className="w-16 h-[1px] bg-[#C9A961] mx-auto" />

      {errorMessage && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs leading-relaxed">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <Input
          label="Admin Email"
          type="email"
          required
          autoComplete="email"
          placeholder="admin@civarajewels.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            Enter Atelier Admin <ArrowRight className="w-3.5 h-3.5 ml-2" />
          </Button>
        </div>
      </form>

      <div className="pt-4 border-t border-[#E6DFD3] text-center space-y-1">
        <div className="text-[10.5px] text-[#6E6459] flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3 text-[#9E7F3C]" />
          <span>Restricted to Authorized Internal IP: 192.168.29.44</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#FAF7F0]">
      <Suspense fallback={<div className="text-xs text-[#6E6459]">Loading login gateway...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
