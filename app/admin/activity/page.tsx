"use client";

import React, { useEffect, useState } from "react";
import { History, Search, ShieldCheck, Filter } from "lucide-react";

interface AuditLog {
  id: number;
  action: string;
  entity: string;
  entity_id: number | null;
  admin_email: string;
  ip_address: string;
  details: string | null;
  timestamp: string;
}

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("all");
  const [actionFilter, setActionFilter] = useState("all");

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (entityFilter !== "all") params.set("entity", entityFilter);
      if (actionFilter !== "all") params.set("action", actionFilter);
      params.set("limit", "100");

      const res = await fetch(`/api/admin/activity?${params.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [entityFilter, actionFilter]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E6DFD3]">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-[#9E7F3C] font-semibold">
            Security & Operations
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium text-[#241F1B]">
            Atelier Audit Logs
          </h1>
        </div>

        <div className="text-xs text-[#6E6459] flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#C9A961]" />
          <span>Tamper-Resistant SQLite Journal</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] p-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2 text-xs text-[#6E6459]">
          <Filter className="w-3.5 h-3.5 text-[#9E7F3C]" />
          <span className="uppercase tracking-wider text-[10px] font-medium">Filter Entity:</span>
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="p-1.5 bg-[#FAF7F0] border border-[#E6DFD3] text-xs text-[#241F1B] outline-none"
          >
            <option value="all">All Entities</option>
            <option value="Product">Product</option>
            <option value="Collection">Collection</option>
            <option value="MetalRate">Metal Rate</option>
            <option value="RingSizesConfig">Ring Sizes</option>
            <option value="ProductImage">Product Image</option>
            <option value="AdminSession">Admin Session</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-[#FBF7F0] border border-[#E6DFD3] overflow-hidden">
        {isLoading ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">Loading activity logs...</div>
        ) : logs.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#6E6459]">No audit logs recorded for this criteria.</div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#F4EDE2] border-b border-[#E6DFD3] text-[10px] uppercase tracking-widest text-[#6E6459]">
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity</th>
                <th className="py-3 px-4">Admin</th>
                <th className="py-3 px-4">IP Address</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6DFD3]/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF7F0] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-medium text-[11px] text-[#241F1B]">
                    <span className="px-2 py-0.5 bg-[#F4EDE2] border border-[#E6DFD3]">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-medium text-[#241F1B]">
                    {log.entity} {log.entity_id ? `#${log.entity_id}` : ""}
                  </td>

                  <td className="py-3.5 px-4 text-[#6E6459]">
                    {log.admin_email}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[11px] text-[#6E6459]">
                    {log.ip_address}
                  </td>

                  <td className="py-3.5 px-4 text-[#6E6459] max-w-xs truncate font-mono text-[10px]">
                    {log.details || "—"}
                  </td>

                  <td className="py-3.5 px-4 text-right text-[#6E6459]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
