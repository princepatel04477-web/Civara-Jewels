# CIVARA JEWELS — ADMIN PANEL PROMPT

Single self-contained prompt for Antigravity / Claude Code / Cursor.
Stack: Next.js 14 App Router · TypeScript · Tailwind · better-sqlite3.

---

## DEPLOYMENT REALITY CHECK — read this first

SQLite on the local filesystem does **not** persist writes on Vercel or any
serverless platform. The filesystem is ephemeral and instances are recycled.

You have three viable paths. Pick one before running the prompt:

1. **Self-host the whole site** on a VPS (Hetzner ₹500/mo, Railway,
   Fly.io with a mounted volume). Then `./data/civara.db` persists.
   *Recommended for this scope — matches your "no external DB" intent
   and your 192.168.29.44 admin-network idea.*
2. **Keep the public site on Vercel** and run only the admin on a
   VPS (subdomain `admin.civarajewels.com`). Sync the SQLite file to
   the public build at build time as a read-only asset. Cheapest but
   two deployments.
3. **Use LibSQL / Turso** — SQLite-compatible, embedded driver, works
   on Vercel. Free tier is generous. This bends your "no external DB"
   rule but keeps the SQLite mental model and syntax verbatim. Switch
   the driver from `better-sqlite3` to `@libsql/client` in the prompt
   below — everything else is identical.

Assume path 1 (self-hosted) unless you say otherwise. The prompt uses
`better-sqlite3` for that reason.

---

## THE PROMPT

```
TARGET   civara-jewels repository (Next.js 14 App Router · TypeScript · Tailwind)
GOAL     Build a self-contained admin panel at /admin that lets me
         create, read, update, and delete Products, Collections, and
         Product Images, backed by a local SQLite database. Access to
         every /admin/* route must be restricted to a single LAN IP
         (192.168.29.44) with a second gate of email + password login.

────────────────────────────────────────────────────────────────────────
1 · DATABASE LAYER
────────────────────────────────────────────────────────────────────────

DEPENDENCIES
   pnpm add better-sqlite3
   pnpm add -D @types/better-sqlite3

DIRECTORY
   /data/                   (gitignored — mount as a Docker volume in prod)
   /data/civara.db          (SQLite file, created on first boot)
   /data/uploads/           (product images, served via /api/uploads/[…])

FILE   lib/db/client.ts
   - Export a singleton better-sqlite3 Database instance.
   - Enable WAL: db.pragma('journal_mode = WAL')
   - Enable foreign keys: db.pragma('foreign_keys = ON')
   - On boot, run all migrations in lib/db/migrations/*.sql in filename order.
   - Track applied migrations in a _migrations table.

FILE   lib/db/migrations/001_init.sql
   CREATE TABLE users (
     id            INTEGER PRIMARY KEY AUTOINCREMENT,
     email         TEXT NOT NULL UNIQUE,
     password_hash TEXT NOT NULL,
     name          TEXT,
     role          TEXT NOT NULL DEFAULT 'admin',
     created_at    TEXT NOT NULL DEFAULT (datetime('now'))
   );

   CREATE TABLE collections (
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

   CREATE TABLE products (
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

   CREATE TABLE product_images (
     id          INTEGER PRIMARY KEY AUTOINCREMENT,
     product_id  INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
     path        TEXT NOT NULL,                  -- /uploads/xxxx.webp
     alt         TEXT,
     is_primary  INTEGER NOT NULL DEFAULT 0,
     sort_order  INTEGER NOT NULL DEFAULT 0
   );

   CREATE INDEX idx_products_collection ON products(collection_id);
   CREATE INDEX idx_products_published  ON products(is_published);
   CREATE INDEX idx_products_featured   ON products(is_featured);
   CREATE INDEX idx_images_product      ON product_images(product_id);

FILE   lib/db/repo/products.ts
   Typed repository functions (no ORM):
     listProducts({ published, featured, collectionId, limit, offset })
     getProductBySlug(slug)
     getProductById(id)
     createProduct(input)
     updateProduct(id, input)
     deleteProduct(id)
     listProductImages(productId)
     addProductImage(productId, path, alt, isPrimary)
     removeProductImage(imageId)
     setPrimaryImage(productId, imageId)

FILE   lib/db/repo/collections.ts   (same shape as products)
FILE   lib/db/repo/users.ts         (findByEmail, verifyPassword, create)

VALIDATION
   Every write goes through a Zod schema in lib/db/schemas/*.ts.
   The repo layer accepts already-validated input; the API route layer
   is where Zod parses the raw request body.

────────────────────────────────────────────────────────────────────────
2 · IP ALLOWLIST + AUTH GATE
────────────────────────────────────────────────────────────────────────

FILE   middleware.ts   (repo root)
   Runs on every /admin/* and /api/admin/* request.

   Logic:
     1. Read the client IP from:
          - x-forwarded-for (first entry, trimmed)
          - x-real-ip
          - fall back to request.ip
     2. Allowed IPs come from env: ADMIN_ALLOWED_IPS="192.168.29.44,127.0.0.1"
        Split on comma, trim, compare.
     3. If IP is not in the allowlist:
          return NextResponse.rewrite(new URL('/404', request.url))
        (Rewrite, do NOT respond 403 — the admin URL should look
         invisible from the wrong network.)
     4. If IP is allowed but there is no valid session cookie AND the
        path is not /admin/login:
          redirect to /admin/login?next=<current path>
     5. Otherwise: NextResponse.next()

   Config:
     export const config = {
       matcher: ['/admin/:path*', '/api/admin/:path*'],
     };

ENV FILE   .env.local
   ADMIN_ALLOWED_IPS=192.168.29.44,127.0.0.1
   SESSION_SECRET=<generate 64-char hex>
   NODE_ENV=development

DEPENDENCIES
   pnpm add iron-session bcryptjs
   pnpm add -D @types/bcryptjs

FILE   lib/auth/session.ts
   - iron-session config (cookieName: 'civara_admin', ttl: 8h,
     cookieOptions: httpOnly, sameSite:'lax', secure in prod).
   - Session shape: { userId: number, email: string, name: string }.

FILE   lib/auth/password.ts
   - hash(password): bcrypt with 12 rounds.
   - verify(password, hash).

FILE   scripts/create-admin.ts
   CLI script:  pnpm tsx scripts/create-admin.ts
   Prompts for email, name, password (masked).
   Hashes password, inserts into users table.
   Idempotent — updates if email already exists.

────────────────────────────────────────────────────────────────────────
3 · API ROUTES (App Router)
────────────────────────────────────────────────────────────────────────

Every route below runs behind the middleware, so IP + auth are already
enforced. Each handler still validates input with Zod.

   app/api/admin/auth/login/route.ts       POST  { email, password }
   app/api/admin/auth/logout/route.ts      POST

   app/api/admin/collections/route.ts      GET  list, POST create
   app/api/admin/collections/[id]/route.ts GET, PATCH, DELETE

   app/api/admin/products/route.ts         GET  list, POST create
   app/api/admin/products/[id]/route.ts    GET, PATCH, DELETE

   app/api/admin/products/[id]/images/route.ts        POST upload
   app/api/admin/products/[id]/images/[imageId]/route.ts DELETE, PATCH (primary)

UPLOADS
   pnpm add sharp
   - Accept image/jpeg | image/png | image/webp | image/avif, max 8 MB.
   - Convert to .webp at quality 82, resize longest edge to 2000px.
   - Save to /data/uploads/<uuid>.webp.
   - Return { path: '/uploads/<uuid>.webp', width, height }.

STATIC SERVE
   FILE app/uploads/[...file]/route.ts
   - Read from /data/uploads/*, stream with correct content-type,
     Cache-Control: public, max-age=31536000, immutable.

────────────────────────────────────────────────────────────────────────
4 · ADMIN UI
────────────────────────────────────────────────────────────────────────

Design language must match the public site:
   Cream #FAF7F0 · Warm bone #211C15 · Champagne #C9A961
   Deep gold #9E7F3C · Void #241F1B
   Cormorant Garamond (display) · Jost (UI)

Layout:
   app/admin/layout.tsx
   - Left rail (240px): Civara wordmark, then nav:
       Dashboard · Products · Collections · Uploads · Sign out
   - Top bar: current admin name, current LAN IP (small, muted),
     "Preview site" link (opens / in new tab).
   - Content: max-width 1200px, generous padding.

Pages:
   app/admin/login/page.tsx
       Two-field card, email + password. On success push to /admin.

   app/admin/page.tsx  (Dashboard)
       Four count cards: Products (total / published / featured),
       Collections, Images, Recent updates (last 10 rows across tables).

   app/admin/products/page.tsx
       Table: Image thumb · Name · Collection · Price · Published?
              Featured? · Updated · Actions (Edit / Delete)
       Filters: collection, published, featured, search-by-name.
       "New product" button top-right.

   app/admin/products/new/page.tsx
   app/admin/products/[id]/page.tsx
       Full form with three tabs:
         1. Details    — name, slug (auto from name, editable),
                         description, collection, price, metal,
                         weight, GST, sizes (chip input), stock.
         2. Images     — drag-drop upload, reorder by drag,
                         set primary, delete with confirm.
         3. Publish    — is_published, is_featured, sort order,
                         preview link.
       Auto-save every 8s while dirty; explicit Save button too.

   app/admin/collections/page.tsx      (same shape as products list)
   app/admin/collections/[id]/page.tsx (name, slug, cover, sort)

UI PRIMITIVES
   Build minimal versions in components/admin/ui/*:
     Button, Input, Textarea, Select, Switch, Modal, Table,
     TabBar, ImageDropzone, ChipInput, Toast.
   No Material, no shadcn drop-in — keep it thin and on-brand.

────────────────────────────────────────────────────────────────────────
5 · PUBLIC SITE INTEGRATION
────────────────────────────────────────────────────────────────────────

Replace all hardcoded product/collection data on the public site
with reads from the same lib/db/repo functions. Every public read
uses `revalidate = 60` (ISR) so the admin publishes propagate.

   app/(marketing)/page.tsx        — featured products from DB
   app/collections/[slug]/page.tsx — one collection + its products
   app/products/[slug]/page.tsx    — one product + its images

If a product has no images, do NOT render it publicly.
If a product has is_published = 0, do NOT render it publicly.

────────────────────────────────────────────────────────────────────────
6 · SEED SCRIPT
────────────────────────────────────────────────────────────────────────

FILE   scripts/seed.ts
   Idempotent. Creates:
     - Six collections (Rings, Necklaces, Earrings, Bracelets,
       Bridal, Pendants) matching the existing homepage tiles.
     - Four featured products (Elara, Nira, Aethel, Celeste) with
       real prices and metal specs from the current site.
     - Copies /public/images/* into /data/uploads/ and links them
       as product_images with is_primary set.
   Run with: pnpm tsx scripts/seed.ts
   Safe to re-run — uses INSERT OR IGNORE on slug.

────────────────────────────────────────────────────────────────────────
7 · SCRIPTS + PACKAGE.JSON
────────────────────────────────────────────────────────────────────────

   "scripts": {
     "dev":           "next dev",
     "build":         "next build",
     "start":         "next start",
     "db:migrate":    "tsx scripts/migrate.ts",
     "db:seed":       "tsx scripts/seed.ts",
     "admin:create":  "tsx scripts/create-admin.ts",
     "db:reset":      "rm -f data/civara.db && pnpm db:migrate && pnpm db:seed"
   }

   Add to .gitignore:
     /data/
     .env.local

────────────────────────────────────────────────────────────────────────
8 · SECURITY DEFAULTS
────────────────────────────────────────────────────────────────────────

   - CSRF: iron-session cookies are sameSite=lax; every mutating
     admin endpoint also checks Origin === request host.
   - Rate limit /api/admin/auth/login to 5 attempts / 10 min / IP
     using a small in-memory LRU (fine for one-admin scale).
   - Never log passwords, never echo them back in errors.
   - Session cookie is Secure in production only.
   - When ADMIN_ALLOWED_IPS is empty in production, refuse to boot
     (throw at startup) — fail closed, never open.

────────────────────────────────────────────────────────────────────────
9 · ACCEPTANCE CRITERIA
────────────────────────────────────────────────────────────────────────

   1. Visiting /admin from any IP that is not in ADMIN_ALLOWED_IPS
      returns the site's 404 page. No 403, no login form, no leak.
   2. Visiting /admin from 192.168.29.44 without a session redirects
      to /admin/login.
   3. Logging in with valid credentials lands on /admin and the
      dashboard shows real counts from SQLite.
   4. Creating a product with three images, marking it published +
      featured, then visiting / shows it in the featured strip and
      /products/<slug> renders it with all images.
   5. Deleting a product cascades and removes its images from the
      database. Files on disk are also removed (async, best-effort).
   6. Wrong-password login is rate-limited after 5 tries per IP.
   7. `pnpm db:reset` wipes and reseeds cleanly.
   8. Running the project on a fresh clone: `pnpm install`,
      `pnpm db:migrate`, `pnpm admin:create`, `pnpm dev` — admin
      accessible from localhost.
```

---

## AFTER THE AGENT SHIPS THIS — first-time boot on your machine

```
pnpm install
cp .env.example .env.local           # fill in ADMIN_ALLOWED_IPS + SESSION_SECRET
pnpm db:migrate                       # creates /data/civara.db
pnpm admin:create                     # sets up your admin login
pnpm db:seed                          # optional — seeds the 6 collections + 4 products
pnpm dev
```

Open `http://192.168.29.44:3000/admin` from your dev machine.
From your phone on the same Wi-Fi (a different IP), `/admin` returns 404 —
proving the gate works.

---

## WHEN YOU DEPLOY (self-hosted)

Docker Compose sketch to keep in mind — the DB and uploads must live on a
mounted volume, not inside the container:

```yaml
services:
  civara:
    build: .
    ports: ["3000:3000"]
    volumes:
      - civara-data:/app/data
    environment:
      ADMIN_ALLOWED_IPS: "192.168.29.44,203.0.113.4"   # add your public IP later
      SESSION_SECRET: "<64 hex>"
      NODE_ENV: production
volumes:
  civara-data:
```

That's the whole thing. When you're ready to add the "one more"
(a second admin? a customer-viewing dashboard? an order pipeline?)
your sentence trailed off — say the word and I'll extend this prompt.
