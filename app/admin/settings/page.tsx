"use client";

import React, { useEffect, useState } from "react";
import { ShieldCheck, Database, Lock, Server, Key, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/admin/ui";

export default function AdminSettingsPage() {
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [ipStatus, setIpStatus] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/auth/logout")
      .then((r) => r.json())
      .then((d) => setSessionUser(d.user))
      .catch(() => {});

    fetch("/api/auth/ip-check")
      .then((r) => r.json())
      .then((d) => setIpStatus(d))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="pb-6 border-b border-[#E6DFD3]">
        <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
          System Administration
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
          Admin Access & Infrastructure Settings
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security & IP-Only Gating */}
        <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#9E7F3C]">
            <Lock className="w-5 h-5" />
            <h3 className="font-serif text-lg font-medium text-[#241F1B]">IP-Only Access Boundary</h3>
          </div>
          <p className="text-xs text-[#6E6459] leading-relaxed">
            All <code>/admin</code> routes and <code>/api/admin/*</code> endpoints are strictly restricted to IPs specified in <code>ADMIN_ALLOWED_IPS</code> environment configuration.
          </p>

          <div className="p-3 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[#6E6459]">Your Connection IP:</span>
              <span className="font-mono font-medium text-[#241F1B]">{ipStatus?.ip || "Detected via headers"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6E6459]">Allowlist Status:</span>
              <span className="text-emerald-700 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Authorized Admin
              </span>
            </div>
          </div>
        </div>

        {/* Database Engine: SQLite WAL Mode */}
        <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4">
          <div className="flex items-center gap-2 text-[#9E7F3C]">
            <Database className="w-5 h-5" />
            <h3 className="font-serif text-lg font-medium text-[#241F1B]">SQLite WAL Database</h3>
          </div>
          <p className="text-xs text-[#6E6459] leading-relaxed">
            Civara Jewels operates on <code>better-sqlite3</code> at <code>data/civara.db</code> with Write-Ahead Logging (WAL) and foreign key integrity enabled.
          </p>

          <div className="p-3 bg-[#FAF7F0] border border-[#E6DFD3] space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[#6E6459]">Journal Mode:</span>
              <span className="text-[#241F1B]">WAL (Write-Ahead-Log)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6E6459]">Foreign Keys:</span>
              <span className="text-[#241F1B]">ON</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6E6459]">Storage Path:</span>
              <span className="text-[#241F1B]">./data/civara.db</span>
            </div>
          </div>
        </div>

        {/* Authentication & Session */}
        <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-6 space-y-4 md:col-span-2">
          <div className="flex items-center gap-2 text-[#9E7F3C]">
            <Key className="w-5 h-5" />
            <h3 className="font-serif text-lg font-medium text-[#241F1B]">Session & Cryptography</h3>
          </div>
          <p className="text-xs text-[#6E6459] leading-relaxed">
            Encrypted sealed sessions powered by <code>iron-session</code> (AES-256-GCM) with <code>bcryptjs</code> salted password verification.
          </p>

          <div className="p-3 bg-[#FAF7F0] border border-[#E6DFD3] grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-[#6E6459] block text-[10px] uppercase">Active User:</span>
              <strong className="text-[#241F1B]">{sessionUser?.name || "Civara Master Administrator"}</strong>
            </div>
            <div>
              <span className="text-[#6E6459] block text-[10px] uppercase">User Email:</span>
              <span className="font-mono text-[#241F1B]">{sessionUser?.email || "admin@civarajewels.com"}</span>
            </div>
            <div>
              <span className="text-[#6E6459] block text-[10px] uppercase">Session Security:</span>
              <span className="text-emerald-700 font-medium">HttpOnly • Secure • SameSite</span>
            </div>
          </div>
        </div>

        {/* Dedicated Seller Portal & Accounts Section */}
        <div className="bg-[#FFFFFF] border border-[#C9A961]/50 p-6 space-y-5 md:col-span-2 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E6DFD3] pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-[#9E7F3C]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-serif text-lg font-medium text-[#241F1B]">
                  Seller Portal &amp; Client Access
                </h3>
              </div>
              <p className="text-xs text-[#6E6459]">
                Provide your client with dedicated seller access to update daily gold rates at <code>/seller</code> without master system permissions.
              </p>
            </div>

            <a
              href="/seller"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#241F1B] text-[#C9A961] hover:bg-[#181412] px-4 py-2 text-xs font-medium uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              Open Seller Portal ↗
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Default Master Seller Credentials Info */}
            <div className="bg-[#FAF7F0] border border-[#E6DFD3] p-4 space-y-2 text-xs">
              <span className="font-serif text-sm font-medium text-[#241F1B] block">
                Default Master Seller Credentials
              </span>
              <div className="space-y-1 font-mono text-[11px] text-[#6E6459]">
                <div>Email: <strong className="text-[#241F1B]">seller@civarajewels.com</strong></div>
                <div>Password: <strong className="text-[#241F1B]">seller18k!</strong></div>
                <div>Role: <strong className="text-[#9E7F3C]">seller (Daily Gold Rates Desk)</strong></div>
                <div>Login URL: <a href="/seller/login" target="_blank" className="text-[#9E7F3C] underline">/seller/login</a></div>
              </div>
              <p className="text-[11px] text-[#6E6459]/80 pt-1">
                Share these credentials with your client so they can enter daily gold rates from their mobile or desktop.
              </p>
            </div>

            {/* Seller Feature Highlights */}
            <div className="bg-[#FAF7F0] border border-[#E6DFD3] p-4 space-y-2 text-xs">
              <span className="font-serif text-sm font-medium text-[#241F1B] block">
                Seller Panel Capabilities
              </span>
              <ul className="list-disc list-inside space-y-1 text-[#6E6459] text-[11px]">
                <li>One-click daily gold rate entry for all purities (24K, 22K, 18K, 14K, 10K, Silver).</li>
                <li>Quick 24K benchmark auto-calculator with standard hallmark proportions.</li>
                <li>Real-time price recalculation across the entire online catalogue.</li>
                <li>Immutable rate change audit trail with timestamps.</li>
                <li>Restricted access: cannot modify system settings, API keys, or IP allowlists.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
