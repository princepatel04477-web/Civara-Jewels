"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, History, ShieldCheck } from "lucide-react";

interface RateHistoryItem {
  id: number;
  rate_id: number;
  old_rate_inr: number | null;
  new_rate_inr: number;
  changed_by: string;
  ip_address: string;
  timestamp: string;
}

export default function AdminRateHistoryPage() {
  const [history, setHistory] = useState<RateHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/pricing/history?limit=100")
      .then((res) => res.json())
      .then((data) => {
        setHistory(data.history || []);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div className="space-y-1">
          <Link
            href="/admin/pricing"
            className="text-xs uppercase tracking-wider text-[#6E6459] hover:text-[#241F1B] inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Metal Rates
          </Link>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Metal Rate History & Audit Ledger
          </h1>
        </div>

        <div className="text-xs text-[#6E6459] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
          <span>Immutable SQLite Rate Ledger</span>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading rate audit ledger...</div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">
            No rate modifications logged yet. Initial rates active.
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                <th className="py-3.5 px-4">Rate ID</th>
                <th className="py-3.5 px-4">Previous Rate</th>
                <th className="py-3.5 px-4">Updated Rate</th>
                <th className="py-3.5 px-4">Difference</th>
                <th className="py-3.5 px-4">Admin Email</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Date & Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60">
              {history.map((h) => {
                const diff = h.old_rate_inr ? h.new_rate_inr - h.old_rate_inr : 0;
                return (
                  <tr key={h.id} className="hover:bg-[#FAF7F0] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6459]">
                      #{h.rate_id}
                    </td>

                    <td className="py-3.5 px-4 font-serif text-xs text-[#6E6459]">
                      {h.old_rate_inr ? `₹${h.old_rate_inr.toLocaleString("en-IN")}` : "Initial"}
                    </td>

                    <td className="py-3.5 px-4 font-serif text-sm font-medium text-[#241F1B]">
                      ₹{h.new_rate_inr.toLocaleString("en-IN")}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-xs">
                      {diff > 0 ? (
                        <span className="text-emerald-700 font-medium">+₹{diff.toLocaleString("en-IN")}</span>
                      ) : diff < 0 ? (
                        <span className="text-red-700 font-medium">-₹{Math.abs(diff).toLocaleString("en-IN")}</span>
                      ) : (
                        <span className="text-[#6E6459]">0</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#241F1B] font-medium">
                      {h.changed_by}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6459]">
                      {h.ip_address}
                    </td>

                    <td className="py-3.5 px-4 text-[#6E6459]">
                      {new Date(h.timestamp).toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
