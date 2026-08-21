-- 002_admin_enhancements.sql
-- Expand products table columns if not exists
-- Note: SQLite ALTER TABLE ADD COLUMN is used for backwards compatibility

-- Ensure metal_rates table exists
CREATE TABLE IF NOT EXISTS metal_rates (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  metal         TEXT NOT NULL,              -- e.g. 'Gold', 'Silver', 'Platinum'
  purity        TEXT NOT NULL,              -- e.g. '18 KT', '14 KT', '10 KT', 'Silver'
  rate_inr      INTEGER NOT NULL,           -- rate in Rupees
  is_active     INTEGER NOT NULL DEFAULT 1,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_by    TEXT NOT NULL DEFAULT 'System'
);

-- Ensure metal_rate_history table exists for auditability
CREATE TABLE IF NOT EXISTS metal_rate_history (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  metal_rate_id INTEGER REFERENCES metal_rates(id) ON DELETE SET NULL,
  metal         TEXT NOT NULL,
  purity        TEXT NOT NULL,
  old_rate      INTEGER NOT NULL,
  new_rate      INTEGER NOT NULL,
  changed_at    TEXT NOT NULL DEFAULT (datetime('now')),
  changed_by    TEXT NOT NULL DEFAULT 'Admin',
  ip_address    TEXT
);

-- Ensure ring_sizes table exists for ring configuration
CREATE TABLE IF NOT EXISTS ring_sizes (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  min_size      REAL NOT NULL DEFAULT 3.0,
  max_size      REAL NOT NULL DEFAULT 15.0,
  increment     REAL NOT NULL DEFAULT 0.5,
  pricing_mode  TEXT NOT NULL DEFAULT 'SAME_PRICE', -- 'SAME_PRICE' | 'VARIABLE'
  is_active     INTEGER NOT NULL DEFAULT 1,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Ensure audit_logs table exists
CREATE TABLE IF NOT EXISTS audit_logs (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  timestamp     TEXT NOT NULL DEFAULT (datetime('now')),
  action        TEXT NOT NULL,              -- e.g. 'LOGIN', 'PRODUCT_CREATE', 'RATE_UPDATE', etc.
  entity        TEXT NOT NULL,              -- e.g. 'Product', 'MetalRate', 'Category', 'Auth'
  entity_id     TEXT,
  admin_email   TEXT,
  ip_address    TEXT,
  details       TEXT
);

-- Ensure settings table exists
CREATE TABLE IF NOT EXISTS settings (
  key           TEXT PRIMARY KEY,
  value         TEXT NOT NULL,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_metal_rates_active ON metal_rates(is_active);
CREATE INDEX IF NOT EXISTS idx_metal_rate_history_date ON metal_rate_history(changed_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON audit_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity ON audit_logs(entity, entity_id);
