import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Ensure data directories exist
const dataDir = path.join(process.cwd(), "data");
const uploadsDir = path.join(dataDir, "uploads");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const dbPath = path.join(dataDir, "civara.db");

// Global singleton to prevent multiple connections in dev hot-reloading
declare global {
  // eslint-disable-next-line no-var
  var __civaraDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __civaraDbMigrated: boolean | undefined;
}

function getDatabase(): Database.Database {
  if (!global.__civaraDb) {
    const db = new Database(dbPath, {
      // verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
    });

    // Pragma setup
    db.pragma("journal_mode = WAL");
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
  } catch (err) {
    console.error("[Database Schema Ensure Error]", err);
  }

  global.__civaraDbMigrated = true;
}

// Automatically apply migrations on initialization
runMigrations(db);

export default db;
