import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";
import { Catalog } from "../catalog";

export function getDataDir(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const tmpDataDir = path.join(os.tmpdir(), "civara_data");
    if (!fs.existsSync(tmpDataDir)) {
      try {
        fs.mkdirSync(tmpDataDir, { recursive: true });
      } catch {
        // ignore
      }
    }
    return tmpDataDir;
  }

  const localDataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(localDataDir)) {
    try {
      fs.mkdirSync(localDataDir, { recursive: true });
    } catch {
      return path.join(os.tmpdir(), "civara_data");
    }
  }
  return localDataDir;
}

export function getUploadsDir(): string {
  const dataDir = getDataDir();
  const uploadsDir = path.join(dataDir, "uploads");
  if (!fs.existsSync(uploadsDir)) {
    try {
      fs.mkdirSync(uploadsDir, { recursive: true });
    } catch {
      // ignore
    }
  }
  return uploadsDir;
}

// Global singleton to prevent multiple connections in dev hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __civaraDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __civaraDbMigrated: boolean | undefined;
}

function getDatabase(): Database.Database {
  if (!global.__civaraDb) {
    const dataDir = getDataDir();
    getUploadsDir();

    const dbPath = path.join(dataDir, "civara.db");
    const db = new Database(dbPath);

    // Pragma setup
    try {
      db.pragma("journal_mode = WAL");
    } catch {
      db.pragma("journal_mode = DELETE");
    }
    db.pragma("foreign_keys = ON");

    global.__civaraDb = db;
  }
  return global.__civaraDb;
}

export const db = getDatabase();

export function runMigrations(database: Database.Database = db) {
  if (global.__civaraDbMigrated) return;

  database.exec(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const migrationsDir = path.join(process.cwd(), "lib", "db", "migrations");
  if (fs.existsSync(migrationsDir)) {
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    const isAppliedStmt = database.prepare(
      "SELECT id FROM _migrations WHERE filename = ?"
    );
    const recordMigrationStmt = database.prepare(
      "INSERT INTO _migrations (filename) VALUES (?)"
    );

    const applyMigrationsTx = database.transaction(() => {
      for (const file of migrationFiles) {
        const row = isAppliedStmt.get(file);
        if (!row) {
          const filePath = path.join(migrationsDir, file);
          const sql = fs.readFileSync(filePath, "utf8");
          database.exec(sql);
          recordMigrationStmt.run(file);
          console.log(`[Database Migration] Applied: ${file}`);
        }
      }
    });

    applyMigrationsTx();
  }

  // Ensure products table has all extended columns
  try {
    const tableInfo = database.prepare("PRAGMA table_info(products)").all() as Array<{ name: string }>;
    const existingCols = new Set(tableInfo.map((c) => c.name));

    const alterCols: Array<{ name: string; type: string }> = [
      { name: "sku", type: "TEXT" },
      { name: "short_description", type: "TEXT" },
      { name: "pricing_mode", type: "TEXT DEFAULT 'MANUAL'" },
      { name: "sale_price_inr", type: "INTEGER" },
      { name: "purity", type: "TEXT DEFAULT '18 KT'" },
      { name: "stone_type", type: "TEXT" },
      { name: "stone_weight_ct", type: "REAL" },
      { name: "other_charges", type: "INTEGER" },
      { name: "metal_rate_ref", type: "TEXT" },
      { name: "stock_quantity", type: "INTEGER DEFAULT 10" },
    ];

    for (const col of alterCols) {
      if (!existingCols.has(col.name)) {
        database.exec(`ALTER TABLE products ADD COLUMN ${col.name} ${col.type};`);
        console.log(`[Database Schema] Added column: products.${col.name}`);
      }
    }

    // Ensure ring_sizes table has chart_image_url column
    const ringTableInfo = database.prepare("PRAGMA table_info(ring_sizes)").all() as Array<{ name: string }>;
    const existingRingCols = new Set(ringTableInfo.map((c) => c.name));
    if (!existingRingCols.has("chart_image_url")) {
      database.exec("ALTER TABLE ring_sizes ADD COLUMN chart_image_url TEXT;");
      console.log("[Database Schema] Added column: ring_sizes.chart_image_url");
    }
  } catch (err) {
    console.error("[Database Schema Ensure Error]", err);
  }

  // Ensure all seed data is populated
  seedDatabaseIfNeeded(database);

  global.__civaraDbMigrated = true;
}

function seedDatabaseIfNeeded(database: Database.Database) {
  try {
    // 1. Seed & Sync Users (Verified bcrypt hashes)
    // PAM_262127 -> $2b$10$g4LBdnGHbdj.5QVTMKOZ.udR7Vcmm2gqRss2i3doHrfykjCW1bTA6
    // civara18k! -> $2b$10$Awxmbk4wqCLHGRA.aGnnj.PiHmymKkfxvGgCOl6ekCD.qzOF8bLIu
    database.prepare(`
      INSERT INTO users (email, password_hash, name, role, created_at)
      VALUES 
        ('varunyatechnologies@gmail.com', '$2b$10$g4LBdnGHbdj.5QVTMKOZ.udR7Vcmm2gqRss2i3doHrfykjCW1bTA6', 'Varunya Technologies Admin', 'admin', datetime('now')),
        ('admin@civarajewels.com', '$2b$10$Awxmbk4wqCLHGRA.aGnnj.PiHmymKkfxvGgCOl6ekCD.qzOF8bLIu', 'Civara Master Admin', 'admin', datetime('now'))
      ON CONFLICT(email) DO UPDATE SET 
        password_hash = excluded.password_hash,
        name = excluded.name;
    `).run();

    // 2. Seed 6 Categories
    const colCount = (database.prepare("SELECT COUNT(*) as c FROM collections").get() as { c: number })?.c || 0;
    const categoryMap: Record<string, number> = {};

    if (colCount === 0) {
      const defaultCollections = [
        { slug: "rings", name: "Rings", description: "Solitaires cut to catch the room rather than the camera. Handcrafted in 18k gold.", cover_image: "/images/home-cc/Rings-cc.png", sort_order: 1 },
        { slug: "bracelets", name: "Bracelets", description: "Hinged bangles and open diamond cuffs with tempered gold memory core.", cover_image: "/images/home-cc/Bracelets-cc.png", sort_order: 2 },
        { slug: "necklaces", name: "Necklace", description: "Liquid diamond tennis strands and architectural gold collars.", cover_image: "/images/home-cc/Necklaces-cc.png", sort_order: 3 },
        { slug: "pendants", name: "Pendant", description: "Geometric cages and constellation lockets suspended in 18k gold chains.", cover_image: "/images/home-cc/Pendants=cc.png", sort_order: 4 },
        { slug: "bridal", name: "Bridal", description: "Heirloom wedding sets and kundan choker suites crafted for generations.", cover_image: "/images/home-m-cc/bridal-m.png", sort_order: 5 },
        { slug: "earrings", name: "Earrings", description: "Hollow-core ergonomic hoops and diamond waterfall drops.", cover_image: "/images/home-cc/Earrings-cc.png", sort_order: 6 },
      ];

      const insertCol = database.prepare(`
        INSERT INTO collections (slug, name, description, cover_image, sort_order, is_active)
        VALUES (?, ?, ?, ?, ?, 1)
      `);

      for (const col of defaultCollections) {
        const res = insertCol.run(col.slug, col.name, col.description, col.cover_image, col.sort_order);
        categoryMap[col.slug] = Number(res.lastInsertRowid);
      }
    } else {
      const allCols = database.prepare("SELECT id, slug FROM collections").all() as Array<{ id: number; slug: string }>;
      allCols.forEach((c) => { categoryMap[c.slug] = c.id; });
    }

    // 3. Seed & Sync Metal Rates (Official Atelier Benchmarks)
    const initialRates = [
      { metal: "Gold", purity: "18 KT", rate_inr: 69999 },
      { metal: "Gold", purity: "16 KT", rate_inr: 62221 },
      { metal: "Gold", purity: "14 KT", rate_inr: 55999 },
      { metal: "Gold", purity: "10 KT", rate_inr: 42999 },
      { metal: "Silver", purity: "Silver", rate_inr: 26999 },
    ];
    for (const r of initialRates) {
      const existing = database.prepare("SELECT id FROM metal_rates WHERE purity = ?").get(r.purity) as { id: number } | undefined;
      if (!existing) {
        database.prepare(`
          INSERT INTO metal_rates (metal, purity, rate_inr, updated_by, updated_at)
          VALUES (?, ?, ?, 'System Initializer', datetime('now'))
        `).run(r.metal, r.purity, r.rate_inr);
      } else {
        database.prepare(`
          UPDATE metal_rates SET rate_inr = ?, is_active = 1, updated_at = datetime('now') WHERE purity = ?
        `).run(r.rate_inr, r.purity);
      }
    }

    // 4. Seed & Sync Ring Size Config (Size 3 to 15 in 0.5 increments + Chart Image)
    const existingRing = database.prepare("SELECT id, chart_image_url FROM ring_sizes WHERE id = 1").get() as { id: number; chart_image_url?: string | null } | undefined;
    if (!existingRing) {
      database.prepare(`
        INSERT INTO ring_sizes (id, min_size, max_size, increment, pricing_mode, chart_image_url, updated_at)
        VALUES (1, 3.0, 15.0, 0.5, 'SAME_PRICE', '/images/Civaraa_Ring_size.png', datetime('now'))
      `).run();
    } else if (!existingRing.chart_image_url || existingRing.chart_image_url === '/images/ring-size-chart.svg') {
      database.prepare(`
        UPDATE ring_sizes SET chart_image_url = '/images/Civaraa_Ring_size.png' WHERE id = 1
      `).run();
    }

    // 5. Seed Catalog Products with 6-8 photos each if products table is empty
    const productCount = (database.prepare("SELECT COUNT(*) as c FROM products").get() as { c: number })?.c || 0;
    if (productCount === 0) {
      const ringSizes = JSON.stringify([
        "3", "3.5", "4", "4.5", "5", "5.5", "6", "6.5", "7", "7.5", "8", "8.5", "9", "9.5", "10", "10.5", "11", "11.5", "12", "12.5", "13", "13.5", "14", "14.5", "15"
      ]);

      const insertProd = database.prepare(`
        INSERT INTO products (
          slug, sku, name, collection_id, description, short_description,
          price_inr, sale_price_inr, pricing_mode, metal, purity, metal_weight_g,
          stone_type, stone_weight_ct, diamond_carat, diamond_clarity, diamond_colour,
          making_charges, other_charges, metal_rate_ref, gst_percent, available_sizes,
          stock_quantity, stock_status, is_featured, is_published, sort_order, created_at, updated_at
        ) VALUES (
          ?, ?, ?, ?, ?, ?,
          ?, ?, 'MANUAL', ?, '18 KT', 4.8,
          ?, ?, ?, 'VS1', 'E-F',
          ?, 150000, '18 KT', 3, ?,
          12, 'made-to-order', ?, 1, 0, datetime('now'), datetime('now')
        )
      `);

      const insertImg = database.prepare(`
        INSERT INTO product_images (product_id, path, alt, is_primary, sort_order)
        VALUES (?, ?, ?, ?, ?)
      `);

      for (const p of Catalog.products) {
        const colId = categoryMap[p.category] || null;
        const pricePaise = p.priceINR * 100;
        const isFeatured = ["elara-solitaire", "nira-stacking-band", "aethel-emerald-ring", "celeste-diamond-tennis-necklace"].includes(p.id) ? 1 : 0;
        const sku = `CIV-${p.id.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}`;
        const stoneWeight = p.id.includes("solitaire") ? 1.0 : 0.5;
        const sizes = p.sizeType === "ring" ? ringSizes : JSON.stringify(p.sizeOptions || ["10", "11", "12", "13", "14", "15", "16"]);

        const res = insertProd.run(
          p.id, sku, p.name, colId, p.description, p.tagline || null,
          pricePaise, null, p.metalOptions?.[0] || "18k Yellow Gold",
          p.stoneType || "Natural Diamond", stoneWeight, stoneWeight,
          Math.round(pricePaise * 0.12), sizes, isFeatured
        );

        const newProdId = Number(res.lastInsertRowid);

        // 6 to 8 photos pool
        const baseImages = p.thumbnails || [p.mainImage || "/images/home-cc/Rings-cc.png"];
        const galleryPool = [
          p.mainImage || "/images/elara-solitaire-main.jpg",
          p.altImage || "/images/home-cc/Rings-cc.png",
          "/images/home-m-cc/Rings-m.png",
          "/images/home-cc/Necklaces-cc.png",
          "/images/home-cc/Earrings-cc.png",
          "/images/home-cc/Bracelets-cc.png",
          "/images/home-cc/bridal-cc.png",
          "/images/home-cc/Pendants=cc.png",
        ];

        const photos: string[] = [];
        for (const img of baseImages) {
          if (img && !photos.includes(img)) photos.push(img);
        }
        for (const poolImg of galleryPool) {
          if (photos.length >= 6) break;
          if (!photos.includes(poolImg)) photos.push(poolImg);
        }

        photos.forEach((imgPath, idx) => {
          insertImg.run(
            newProdId,
            imgPath,
            `${p.name} — View ${idx + 1}`,
            idx === 0 ? 1 : 0,
            idx
          );
        });
      }
    }
  } catch (seedErr) {
    console.error("[Database Auto-Seed Error]", seedErr);
  }
}

// Automatically apply migrations and seeds on initialization
runMigrations(db);

export default db;
