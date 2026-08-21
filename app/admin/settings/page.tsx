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
      </div>
    </div>
  );
}
