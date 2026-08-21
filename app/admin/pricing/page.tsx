"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DollarSign, History, Plus, CheckCircle2, AlertCircle, Edit2, ArrowRight } from "lucide-react";
import { Button, Input, Select } from "../../components/admin/ui";

interface MetalRate {
  id: number;
  metal: string;
  purity: string;
  rate_inr: number;
  is_active: number;
  updated_at: string;
  updated_by: string | null;
}

export default function AdminMetalRatesPage() {
  const [rates, setRates] = useState<MetalRate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingRateId, setEditingRateId] = useState<number | null>(null);
  const [editRateValue, setEditRateValue] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // New rate modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMetal, setNewMetal] = useState("Gold");
  const [newPurity, setNewPurity] = useState("22 KT");
  const [newRateValue, setNewRateValue] = useState("");

  const fetchRates = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/pricing/rates");
      const data = await res.json();
      setRates(data.rates || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
  }, []);

  const handleStartEdit = (r: MetalRate) => {
    setEditingRateId(r.id);
    setEditRateValue(String(r.rate_inr));
    setErrorMessage("");
  };

  const handleSaveRate = async (rateId: number) => {
    const val = parseInt(editRateValue, 10);
    if (isNaN(val) || val <= 0) {
      setErrorMessage("Please enter a valid positive rate in INR.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/pricing/rates/${rateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rate_inr: val }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update rate");

      setEditingRateId(null);
      setSuccessMessage("Metal rate updated and logged to history ledger.");
      setTimeout(() => setSuccessMessage(""), 4000);
      fetchRates();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to save rate");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreateRate = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(newRateValue, 10);
    if (isNaN(val) || val <= 0) {
      setErrorMessage("Please enter a valid rate in INR.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/pricing/rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          metal: newMetal,
          purity: newPurity,
          rate_inr: val,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create rate");

      setIsAddModalOpen(false);
      setNewRateValue("");
      setSuccessMessage("New metal rate created.");
      setTimeout(() => setSuccessMessage(""), 4000);
      fetchRates();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create rate");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Bullion & Valuation
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Metal Rates (INR)
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/pricing/history">
            <Button variant="secondary" size="md" className="flex items-center gap-1.5">
              <History className="w-4 h-4" /> View Rate History
            </Button>
          </Link>
          <Button onClick={() => setIsAddModalOpen(true)} size="md" className="flex items-center gap-1.5 shadow-sm">
            <Plus className="w-4 h-4" /> Add Metal / Purity
          </Button>
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Overview Info Banner */}
      <div className="p-4 bg-[#F4EDE2] border border-[#E6DFD3] text-xs text-[#6E6459] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <strong className="text-[#241F1B]">Atelier Dynamic Valuation:</strong> Updating metal rates automatically recalculates live prices for all calculated catalog pieces and logs immutable audit trails with IP and admin timestamp.
        </div>
        <Link href="/admin/pricing/history" className="text-[#9E7F3C] hover:underline whitespace-nowrap font-medium flex items-center gap-1">
          Audit Ledger <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Metal Rates Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading metal rates from SQLite...</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                <th className="py-3.5 px-4">Purity & Metal</th>
                <th className="py-3.5 px-4">Current Rate (INR)</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4">Updated By</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60">
              {rates.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="py-4 px-4 font-medium text-[#241F1B]">
                    <div className="font-serif text-sm font-medium">{r.purity}</div>
                    <div className="text-[11px] text-[#6E6459]">{r.metal}</div>
                  </td>

                  <td className="py-4 px-4">
                    {editingRateId === r.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[#241F1B] font-serif text-sm">₹</span>
                        <input
                          type="number"
                          value={editRateValue}
                          onChange={(e) => setEditRateValue(e.target.value)}
                          className="w-32 p-1.5 bg-[#FAF7F0] border border-[#C9A961] text-xs font-mono font-medium text-[#241F1B] outline-none"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveRate(r.id)}
                          disabled={isSaving}
                          className="px-2.5 py-1.5 bg-[#241F1B] text-[#C9A961] text-[10px] uppercase tracking-wider font-medium"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingRateId(null)}
                          className="px-2 py-1.5 text-[#6E6459] text-[10px] uppercase"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="font-serif text-lg font-medium text-[#241F1B]">
                        ₹{r.rate_inr.toLocaleString("en-IN")}
                      </div>
                    )}
                  </td>

                  <td className="py-4 px-4 text-[#6E6459]">
                    {r.updated_at ? new Date(r.updated_at).toLocaleString() : "Initial"}
                  </td>

                  <td className="py-4 px-4 text-[#6E6459]">
                    {r.updated_by || "System Initializer"}
                  </td>

                  <td className="py-4 px-4 text-right">
                    {editingRateId !== r.id && (
                      <button
                        onClick={() => handleStartEdit(r)}
                        className="px-3 py-1 text-xs uppercase tracking-wider text-[#9E7F3C] hover:text-[#241F1B] border border-[#E6DFD3] hover:border-[#C9A961] transition-colors"
                      >
                        Edit Rate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Rate Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#181412]/75 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#FAF7F0] border border-[#C9A961]/50 p-6 sm:p-8 shadow-2xl space-y-6 text-[#241F1B]">
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-[0.28em] text-[#9E7F3C]">
                Bullion Configuration
              </div>
              <h3 className="font-serif text-2xl font-medium">Add Metal / Purity Rate</h3>
            </div>

            <form onSubmit={handleCreateRate} className="space-y-4">
              <Input
                label="Metal Name *"
                placeholder="Gold / Platinum / Silver"
                value={newMetal}
                onChange={(e) => setNewMetal(e.target.value)}
                required
              />

              <Input
                label="Purity Identifier *"
                placeholder="22 KT / 18 KT / PT950"
                value={newPurity}
                onChange={(e) => setNewPurity(e.target.value)}
                required
              />

              <Input
                label="Initial Rate in INR (₹) *"
                type="number"
                placeholder="e.g. 78500"
                value={newRateValue}
                onChange={(e) => setNewRateValue(e.target.value)}
                required
              />

              <div className="pt-4 flex justify-end gap-3 border-t border-[#E6DFD3]">
                <Button type="button" variant="secondary" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving}>
                  Create Metal Rate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
