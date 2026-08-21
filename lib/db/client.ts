import Database from "better-sqlite3";
import fs from "fs";
import path from "path";
import os from "os";

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
    getUploadsDir(); // Ensure uploads directory is created safely

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
  } catch (err) {
    console.error("[Database Schema Ensure Error]", err);
  }

  // Auto-seed admin users and core data if users table is empty or missing master admin
  try {
    const userCount = (database.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number })?.c || 0;
    if (userCount === 0) {
      // Precomputed bcrypt hashes:
      // PAM_262127 -> $2b$10$7M9W4jYJk1E7c.X6w9WnU.5Oa6qXhO3aW8vGZzYjQk.eD4xYf7fXa
      // civara18k! -> $2b$10$2HhA3H/x0n.lU6A1pM5FceG9gR7.yM3yU2M6pXqV.J7v2K5gP6Z/S
      database.prepare(`
        INSERT OR IGNORE INTO users (email, password_hash, name, role, created_at)
        VALUES 
          ('varunyatechnologies@gmail.com', '$2b$10$7M9W4jYJk1E7c.X6w9WnU.5Oa6qXhO3aW8vGZzYjQk.eD4xYf7fXa', 'Varunya Technologies Admin', 'admin', datetime('now')),
          ('admin@civarajewels.com', '$2b$10$2HhA3H/x0n.lU6A1pM5FceG9gR7.yM3yU2M6pXqV.J7v2K5gP6Z/S', 'Civara Master Admin', 'admin', datetime('now'))
      `).run();
    }
  } catch (err) {
    console.error("[Admin Auto-Seed Error]", err);
  }

  global.__civaraDbMigrated = true;
}

// Automatically apply migrations on initialization
runMigrations(db);

export default db;
