import db from "../client";
import { AuditRepo } from "./audit";

export interface DbRingSizeConfig {
  id: number;
  min_size: number;
  max_size: number;
  increment: number;
  pricing_mode: string; // 'SAME_PRICE' | 'VARIABLE'
  is_active: number;
  updated_at: string;
}

export const RingSizesRepo = {
  getConfig(): DbRingSizeConfig {
    let row = db.prepare("SELECT * FROM ring_sizes WHERE is_active = 1 ORDER BY id DESC LIMIT 1").get() as
      | DbRingSizeConfig
      | undefined;

    if (!row) {
      // Seed default config (3 to 15, step 0.5, SAME_PRICE)
      db.prepare(`
        INSERT INTO ring_sizes (min_size, max_size, increment, pricing_mode, is_active, updated_at)
        VALUES (3.0, 15.0, 0.5, 'SAME_PRICE', 1, datetime('now'))
      `).run();

      row = db.prepare("SELECT * FROM ring_sizes WHERE is_active = 1 ORDER BY id DESC LIMIT 1").get() as DbRingSizeConfig;
    }

    return row;
  },

  generateSizeList(config?: DbRingSizeConfig): string[] {
    const cfg = config || this.getConfig();
    const sizes: string[] = [];
    const min = cfg.min_size || 3.0;
    const max = cfg.max_size || 15.0;
    const step = cfg.increment || 0.5;

    for (let s = min; s <= max + 0.0001; s += step) {
      // Format cleanly: 3, 3.5, 4, 4.5
      const formatted = Number(s.toFixed(2)).toString();
      sizes.push(formatted);
    }
    return sizes;
  },

  updateConfig(input: {
    min_size: number;
    max_size: number;
    increment: number;
    pricing_mode?: string;
    adminEmail?: string;
    ipAddress?: string | null;
  }): DbRingSizeConfig {
    const current = this.getConfig();
    const pricingMode = input.pricing_mode || current.pricing_mode || "SAME_PRICE";

    db.prepare(`
      UPDATE ring_sizes 
      SET min_size = ?, max_size = ?, increment = ?, pricing_mode = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(input.min_size, input.max_size, input.increment, pricingMode, current.id);

    AuditRepo.log({
      action: "RING_SIZES_CONFIG_UPDATED",
      entity: "RingSizeConfig",
      entityId: current.id,
      adminEmail: input.adminEmail || "Admin",
      ipAddress: input.ipAddress || null,
      details: { min_size: input.min_size, max_size: input.max_size, increment: input.increment, pricingMode },
    });

    return this.getConfig();
  },
};
