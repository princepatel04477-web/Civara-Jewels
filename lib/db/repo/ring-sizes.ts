import db from "../client";
import { AuditRepo } from "./audit";

export interface DbRingSizeConfig {
  id: number;
  min_size: number;
  max_size: number;
  increment: number;
  pricing_mode: string; // 'SAME_PRICE' | 'VARIABLE'
  chart_image_url?: string | null;
  is_active: number;
  updated_at: string;
}

export const RingSizesRepo = {
  getConfig(): DbRingSizeConfig {
    let row = db.prepare("SELECT * FROM ring_sizes WHERE is_active = 1 ORDER BY id DESC LIMIT 1").get() as
      | DbRingSizeConfig
      | undefined;

    if (!row) {
      // Seed default config (3 to 15, step 0.5, SAME_PRICE, /images/Civaraa_Ring_size.png)
      db.prepare(`
        INSERT INTO ring_sizes (min_size, max_size, increment, pricing_mode, chart_image_url, is_active, updated_at)
        VALUES (3.0, 15.0, 0.5, 'SAME_PRICE', '/images/Civaraa_Ring_size.png', 1, datetime('now'))
      `).run();

      row = db.prepare("SELECT * FROM ring_sizes WHERE is_active = 1 ORDER BY id DESC LIMIT 1").get() as DbRingSizeConfig;
    }

    if (row && !row.chart_image_url) {
      row.chart_image_url = "/images/Civaraa_Ring_size.png";
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
    chart_image_url?: string | null;
    adminEmail?: string;
    ipAddress?: string | null;
  }): DbRingSizeConfig {
    const current = this.getConfig();
    const pricingMode = input.pricing_mode || current.pricing_mode || "SAME_PRICE";
    const chartImageUrl = input.chart_image_url !== undefined ? input.chart_image_url : (current.chart_image_url || "/images/Civaraa_Ring_size.png");

    db.prepare(`
      UPDATE ring_sizes 
      SET min_size = ?, max_size = ?, increment = ?, pricing_mode = ?, chart_image_url = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(input.min_size, input.max_size, input.increment, pricingMode, chartImageUrl, current.id);

    AuditRepo.log({
      action: "RING_SIZES_CONFIG_UPDATED",
      entity: "RingSizeConfig",
      entityId: current.id,
      adminEmail: input.adminEmail || "Admin",
      ipAddress: input.ipAddress || null,
      details: { min_size: input.min_size, max_size: input.max_size, increment: input.increment, pricingMode, chartImageUrl },
    });

    return this.getConfig();
  },
};
