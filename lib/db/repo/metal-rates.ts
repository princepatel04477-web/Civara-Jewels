import db from "../client";
import { AuditRepo } from "./audit";

export interface DbMetalRate {
  id: number;
  metal: string;
  purity: string;
  rate_inr: number;
  is_active: number;
  updated_at: string;
  updated_by: string;
}

export interface DbMetalRateHistory {
  id: number;
  metal_rate_id: number | null;
  metal: string;
  purity: string;
  old_rate: number;
  new_rate: number;
  changed_at: string;
  changed_by: string;
  ip_address: string | null;
}

export const MetalRatesRepo = {
  async listRates(activeOnly: boolean = false): Promise<DbMetalRate[]> {
    const query = activeOnly
      ? "SELECT * FROM metal_rates WHERE is_active = 1 ORDER BY metal ASC, rate_inr DESC, id ASC"
      : "SELECT * FROM metal_rates ORDER BY is_active DESC, metal ASC, rate_inr DESC, id ASC";
    return await db.query<DbMetalRate>(query);
  },

  async getRateById(id: number): Promise<DbMetalRate | null> {
    return await db.queryOne<DbMetalRate>("SELECT * FROM metal_rates WHERE id = ?", [id]);
  },

  async getRateByPurity(purity: string): Promise<DbMetalRate | null> {
    return await db.queryOne<DbMetalRate>(
      "SELECT * FROM metal_rates WHERE purity = ? AND is_active = 1 LIMIT 1",
      [purity]
    );
  },

  async createRate(input: {
    metal: string;
    purity: string;
    rate_inr: number;
    updated_by?: string;
    ip_address?: string | null;
  }): Promise<DbMetalRate> {
    const updatedBy = input.updated_by || "Admin";

    const result = await db.execute(
      `INSERT INTO metal_rates (metal, purity, rate_inr, is_active, updated_at, updated_by)
       VALUES (?, ?, ?, 1, datetime('now'), ?)`,
      [input.metal.trim(), input.purity.trim(), Math.round(input.rate_inr), updatedBy]
    );
    const newId = Number(result.lastInsertRowid);

    // Record initial history
    await db.execute(
      `INSERT INTO metal_rate_history (metal_rate_id, metal, purity, old_rate, new_rate, changed_at, changed_by, ip_address)
       VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?)`,
      [newId, input.metal.trim(), input.purity.trim(), 0, Math.round(input.rate_inr), updatedBy, input.ip_address || null]
    );

    AuditRepo.log({
      action: "METAL_RATE_CREATED",
      entity: "MetalRate",
      entityId: newId,
      adminEmail: updatedBy,
      ipAddress: input.ip_address || null,
      details: { metal: input.metal, purity: input.purity, rate_inr: input.rate_inr },
    });

    return (await this.getRateById(newId))!;
  },

  async updateRate(
    id: number,
    input: {
      rate_inr?: number;
      is_active?: number;
      metal?: string;
      purity?: string;
      updated_by?: string;
      ip_address?: string | null;
    }
  ): Promise<DbMetalRate | null> {
    const existing = await this.getRateById(id);
    if (!existing) return null;

    const updatedBy = input.updated_by || "Admin";
    const oldRate = existing.rate_inr;
    const newRate = input.rate_inr !== undefined ? Math.round(input.rate_inr) : oldRate;
    const isActive = input.is_active !== undefined ? input.is_active : existing.is_active;
    const metal = input.metal || existing.metal;
    const purity = input.purity || existing.purity;

    await db.execute(
      `UPDATE metal_rates 
       SET metal = ?, purity = ?, rate_inr = ?, is_active = ?, updated_at = datetime('now'), updated_by = ?
       WHERE id = ?`,
      [metal, purity, newRate, isActive, updatedBy, id]
    );

    // If rate changed, log in immutable history ledger
    if (oldRate !== newRate) {
      await db.execute(
        `INSERT INTO metal_rate_history (metal_rate_id, metal, purity, old_rate, new_rate, changed_at, changed_by, ip_address)
         VALUES (?, ?, ?, ?, ?, datetime('now'), ?, ?)`,
        [id, metal, purity, oldRate, newRate, updatedBy, input.ip_address || null]
      );
    }

    AuditRepo.log({
      action: "METAL_RATE_UPDATED",
      entity: "MetalRate",
      entityId: id,
      adminEmail: updatedBy,
      ipAddress: input.ip_address || null,
      details: {
        metal,
        purity,
        oldRate,
        newRate,
        isActive,
      },
    });

    return await this.getRateById(id);
  },

  async listHistory(limit: number = 50): Promise<DbMetalRateHistory[]> {
    return await db.query<DbMetalRateHistory>(
      `SELECT * FROM metal_rate_history 
       ORDER BY changed_at DESC, id DESC 
       LIMIT ?`,
      [limit]
    );
  },
};
