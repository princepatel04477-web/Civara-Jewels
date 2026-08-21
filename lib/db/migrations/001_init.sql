CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  name          TEXT,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS collections (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  cover_image TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   INTEGER NOT NULL DEFAULT 1,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS products (
  id                INTEGER PRIMARY KEY AUTOINCREMENT,
  slug              TEXT NOT NULL UNIQUE,
  name              TEXT NOT NULL,
  collection_id     INTEGER REFERENCES collections(id) ON DELETE SET NULL,
  description       TEXT,
  price_inr         INTEGER NOT NULL,        -- in paise (₹1 = 100)
  metal             TEXT NOT NULL DEFAULT '18k Yellow Gold',
  metal_weight_g    REAL,
  diamond_carat     REAL,
  diamond_clarity   TEXT,
  diamond_colour    TEXT,
  making_charges    INTEGER,                  -- in paise
  gst_percent       REAL NOT NULL DEFAULT 3,
  available_sizes   TEXT,                     -- JSON array as text
  stock_status      TEXT NOT NULL DEFAULT 'made-to-order',
  is_featured       INTEGER NOT NULL DEFAULT 0,
  is_published      INTEGER NOT NULL DEFAULT 0,
  sort_order        INTEGER NOT NULL DEFAULT 0,
  created_at        TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at        TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS product_images (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  path        TEXT NOT NULL,                  -- /uploads/xxxx.webp
  alt         TEXT,
  is_primary  INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_products_collection ON products(collection_id);
CREATE INDEX IF NOT EXISTS idx_products_published  ON products(is_published);
CREATE INDEX IF NOT EXISTS idx_products_featured   ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_images_product      ON product_images(product_id);
