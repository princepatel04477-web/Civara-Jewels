import db from "../client";
import { CreateProductInput, UpdateProductInput } from "../schemas/product";
import { AuditRepo } from "./audit";
import fs from "fs";
import path from "path";

export interface DbProduct {
  id: number;
  slug: string;
  sku: string | null;
  name: string;
  collection_id: number | null;
  collection_name?: string;
  collection_slug?: string;
  description: string | null;
  short_description: string | null;
  price_inr: number; // in paise
  sale_price_inr: number | null;
  pricing_mode: string; // 'MANUAL' | 'CALCULATED'
  metal: string;
  purity: string;
  metal_weight_g: number | null;
  stone_type: string | null;
  stone_weight_ct: number | null;
  diamond_carat: number | null;
  diamond_clarity: string | null;
  diamond_colour: string | null;
  making_charges: number | null;
  other_charges: number | null;
  metal_rate_ref: string | null;
  gst_percent: number;
  available_sizes: string | null; // JSON string
  stock_quantity: number;
  stock_status: string;
  is_featured: number;
  is_published: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  primary_image?: string;
  images?: DbProductImage[];
}

export interface DbProductImage {
  id: number;
  product_id: number;
  path: string;
  alt: string | null;
  is_primary: number;
  sort_order: number;
}

export interface ListProductsFilter {
  published?: boolean | number;
  featured?: boolean | number;
  collectionId?: number;
  collectionSlug?: string;
  search?: string;
  metal?: string;
  purity?: string;
  stockStatus?: string;
  sortBy?: "newest" | "oldest" | "price-asc" | "price-desc" | "name-asc" | "name-desc" | "sort-order";
  limit?: number;
  offset?: number;
}

export const ProductRepo = {
  listProducts(filter: ListProductsFilter = {}): { products: DbProduct[]; total: number } {
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (filter.published !== undefined) {
      whereClauses.push("p.is_published = ?");
      params.push(typeof filter.published === "boolean" ? (filter.published ? 1 : 0) : filter.published);
    }

    if (filter.featured !== undefined) {
      whereClauses.push("p.is_featured = ?");
      params.push(typeof filter.featured === "boolean" ? (filter.featured ? 1 : 0) : filter.featured);
    }

    if (filter.collectionId !== undefined && filter.collectionId !== null) {
      whereClauses.push("p.collection_id = ?");
      params.push(filter.collectionId);
    }

    if (filter.collectionSlug) {
      whereClauses.push("c.slug = ?");
      params.push(filter.collectionSlug.toLowerCase());
    }

    if (filter.metal) {
      whereClauses.push("p.metal LIKE ?");
      params.push(`%${filter.metal}%`);
    }

    if (filter.purity) {
      whereClauses.push("p.purity LIKE ?");
      params.push(`%${filter.purity}%`);
    }

    if (filter.stockStatus) {
      whereClauses.push("p.stock_status = ?");
      params.push(filter.stockStatus);
    }

    if (filter.search && filter.search.trim()) {
      whereClauses.push("(p.name LIKE ? OR p.slug LIKE ? OR p.sku LIKE ? OR p.description LIKE ?)");
      const term = `%${filter.search.trim()}%`;
      params.push(term, term, term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    // Total count
    const countRow = db.prepare(`
      SELECT COUNT(*) as count 
      FROM products p 
      LEFT JOIN collections c ON p.collection_id = c.id
      ${whereSql}
    `).get(...params) as { count: number };
    const total = countRow ? countRow.count : 0;

    // Sorting
    let orderSql = "ORDER BY p.sort_order ASC, p.id DESC";
    if (filter.sortBy === "newest") orderSql = "ORDER BY p.id DESC";
    else if (filter.sortBy === "oldest") orderSql = "ORDER BY p.id ASC";
    else if (filter.sortBy === "price-asc") orderSql = "ORDER BY p.price_inr ASC";
    else if (filter.sortBy === "price-desc") orderSql = "ORDER BY p.price_inr DESC";
    else if (filter.sortBy === "name-asc") orderSql = "ORDER BY p.name ASC";
    else if (filter.sortBy === "name-desc") orderSql = "ORDER BY p.name DESC";

    // Fetch products
    let query = `
      SELECT 
        p.*, 
        c.name as collection_name,
        c.slug as collection_slug,
        (
          SELECT path FROM product_images 
          WHERE product_id = p.id 
          ORDER BY is_primary DESC, sort_order ASC, id ASC 
          LIMIT 1
        ) as primary_image
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      ${whereSql}
      ${orderSql}
    `;

    if (filter.limit !== undefined) {
      query += ` LIMIT ?`;
      params.push(filter.limit);
      if (filter.offset !== undefined) {
        query += ` OFFSET ?`;
        params.push(filter.offset);
      }
    }

    const rows = db.prepare(query).all(...params) as DbProduct[];

    // Hydrate image galleries
    for (const r of rows) {
      r.images = this.listProductImages(r.id);
    }

    return { products: rows, total };
  },

  getProductById(id: number): DbProduct | null {
    const row = db.prepare(`
      SELECT 
        p.*, 
        c.name as collection_name,
        c.slug as collection_slug
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.id = ?
    `).get(id) as DbProduct | undefined;

    if (!row) return null;
    row.images = this.listProductImages(id);
    row.primary_image = row.images.find((img) => img.is_primary === 1)?.path || row.images[0]?.path;
    return row;
  },

  getProductBySlug(slug: string): DbProduct | null {
    const row = db.prepare(`
      SELECT 
        p.*, 
        c.name as collection_name,
        c.slug as collection_slug
      FROM products p
      LEFT JOIN collections c ON p.collection_id = c.id
      WHERE p.slug = ?
    `).get(slug) as DbProduct | undefined;

    if (!row) return null;
    row.images = this.listProductImages(row.id);
    row.primary_image = row.images.find((img) => img.is_primary === 1)?.path || row.images[0]?.path;
    return row;
  },

  createProduct(input: CreateProductInput, adminEmail?: string, ipAddress?: string | null): DbProduct {
    const sizes = Array.isArray(input.available_sizes)
      ? JSON.stringify(input.available_sizes)
      : input.available_sizes || null;

    const sku = input.sku?.trim() || `CIV-${(input.slug || "DES").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10)}`;

    const stmt = db.prepare(`
      INSERT INTO products (
        slug, sku, name, collection_id, description, short_description, price_inr, sale_price_inr, pricing_mode,
        metal, purity, metal_weight_g, stone_type, stone_weight_ct, diamond_carat, diamond_clarity, diamond_colour,
        making_charges, other_charges, metal_rate_ref, gst_percent, available_sizes, stock_quantity, stock_status,
        is_featured, is_published, sort_order, created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, datetime('now'), datetime('now')
      )
    `);

    const result = stmt.run(
      input.slug,
      sku,
      input.name,
      input.collection_id ?? null,
      input.description ?? null,
      input.short_description ?? null,
      input.price_inr,
      input.sale_price_inr ?? null,
      input.pricing_mode ?? "MANUAL",
      input.metal ?? "18k Yellow Gold",
      input.purity ?? "18 KT",
      input.metal_weight_g ?? null,
      input.stone_type ?? null,
      input.stone_weight_ct ?? null,
      input.diamond_carat ?? null,
      input.diamond_clarity ?? null,
      input.diamond_colour ?? null,
      input.making_charges ?? null,
      input.other_charges ?? null,
      input.metal_rate_ref ?? null,
      input.gst_percent ?? 3,
      sizes,
      input.stock_quantity ?? 10,
      input.stock_status ?? "made-to-order",
      input.is_featured ?? 0,
      input.is_published ?? 0,
      input.sort_order ?? 0
    );

    const newId = Number(result.lastInsertRowid);

    AuditRepo.log({
      action: "PRODUCT_CREATED",
      entity: "Product",
      entityId: newId,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { name: input.name, slug: input.slug, priceINR: input.price_inr / 100 },
    });

    return this.getProductById(newId)!;
  },

  updateProduct(
    id: number,
    input: UpdateProductInput,
    adminEmail?: string,
    ipAddress?: string | null
  ): DbProduct | null {
    const existing = this.getProductById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (input.slug !== undefined) { fields.push("slug = ?"); values.push(input.slug); }
    if (input.sku !== undefined) { fields.push("sku = ?"); values.push(input.sku); }
    if (input.name !== undefined) { fields.push("name = ?"); values.push(input.name); }
    if (input.collection_id !== undefined) { fields.push("collection_id = ?"); values.push(input.collection_id); }
    if (input.description !== undefined) { fields.push("description = ?"); values.push(input.description); }
    if (input.short_description !== undefined) { fields.push("short_description = ?"); values.push(input.short_description); }
    if (input.price_inr !== undefined) { fields.push("price_inr = ?"); values.push(input.price_inr); }
    if (input.sale_price_inr !== undefined) { fields.push("sale_price_inr = ?"); values.push(input.sale_price_inr); }
    if (input.pricing_mode !== undefined) { fields.push("pricing_mode = ?"); values.push(input.pricing_mode); }
    if (input.metal !== undefined) { fields.push("metal = ?"); values.push(input.metal); }
    if (input.purity !== undefined) { fields.push("purity = ?"); values.push(input.purity); }
    if (input.metal_weight_g !== undefined) { fields.push("metal_weight_g = ?"); values.push(input.metal_weight_g); }
    if (input.stone_type !== undefined) { fields.push("stone_type = ?"); values.push(input.stone_type); }
    if (input.stone_weight_ct !== undefined) { fields.push("stone_weight_ct = ?"); values.push(input.stone_weight_ct); }
    if (input.diamond_carat !== undefined) { fields.push("diamond_carat = ?"); values.push(input.diamond_carat); }
    if (input.diamond_clarity !== undefined) { fields.push("diamond_clarity = ?"); values.push(input.diamond_clarity); }
    if (input.diamond_colour !== undefined) { fields.push("diamond_colour = ?"); values.push(input.diamond_colour); }
    if (input.making_charges !== undefined) { fields.push("making_charges = ?"); values.push(input.making_charges); }
    if (input.other_charges !== undefined) { fields.push("other_charges = ?"); values.push(input.other_charges); }
    if (input.metal_rate_ref !== undefined) { fields.push("metal_rate_ref = ?"); values.push(input.metal_rate_ref); }
    if (input.gst_percent !== undefined) { fields.push("gst_percent = ?"); values.push(input.gst_percent); }
    if (input.available_sizes !== undefined) {
      const sizes = Array.isArray(input.available_sizes)
        ? JSON.stringify(input.available_sizes)
        : input.available_sizes;
      fields.push("available_sizes = ?");
      values.push(sizes);
    }
    if (input.stock_quantity !== undefined) { fields.push("stock_quantity = ?"); values.push(input.stock_quantity); }
    if (input.stock_status !== undefined) { fields.push("stock_status = ?"); values.push(input.stock_status); }
    if (input.is_featured !== undefined) { fields.push("is_featured = ?"); values.push(input.is_featured); }
    if (input.is_published !== undefined) { fields.push("is_published = ?"); values.push(input.is_published); }
    if (input.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(input.sort_order); }

    fields.push("updated_at = datetime('now')");

    if (fields.length > 1) {
      values.push(id);
      db.prepare(`UPDATE products SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    }

    AuditRepo.log({
      action: "PRODUCT_UPDATED",
      entity: "Product",
      entityId: id,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: {
        id,
        priceINR: input.price_inr ? input.price_inr / 100 : undefined,
        isPublished: input.is_published,
        name: input.name,
      },
    });

    return this.getProductById(id);
  },

  duplicateProduct(id: number, adminEmail?: string, ipAddress?: string | null): DbProduct | null {
    const orig = this.getProductById(id);
    if (!orig) return null;

    const newSlug = `${orig.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newName = `${orig.name} (Copy)`;
    const newSku = orig.sku ? `${orig.sku}-C` : `CIV-CPY-${Date.now().toString().slice(-4)}`;

    const newProduct = this.createProduct(
      {
        slug: newSlug,
        sku: newSku,
        name: newName,
        collection_id: orig.collection_id,
        description: orig.description,
        short_description: orig.short_description,
        price_inr: orig.price_inr,
        sale_price_inr: orig.sale_price_inr,
        pricing_mode: orig.pricing_mode as any,
        metal: orig.metal,
        purity: orig.purity,
        metal_weight_g: orig.metal_weight_g,
        stone_type: orig.stone_type,
        stone_weight_ct: orig.stone_weight_ct,
        diamond_carat: orig.diamond_carat,
        diamond_clarity: orig.diamond_clarity,
        diamond_colour: orig.diamond_colour,
        making_charges: orig.making_charges,
        other_charges: orig.other_charges,
        metal_rate_ref: orig.metal_rate_ref,
        gst_percent: orig.gst_percent,
        available_sizes: orig.available_sizes,
        stock_quantity: orig.stock_quantity,
        stock_status: orig.stock_status as any,
        is_featured: 0,
        is_published: 0, // start as draft
        sort_order: (orig.sort_order || 0) + 1,
      },
      adminEmail,
      ipAddress
    );

    // Clone images
    if (orig.images && orig.images.length > 0) {
      for (const img of orig.images) {
        this.addProductImage(newProduct.id, img.path, img.alt, img.is_primary, img.sort_order);
      }
    }

    AuditRepo.log({
      action: "PRODUCT_DUPLICATED",
      entity: "Product",
      entityId: newProduct.id,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { originalId: id, newId: newProduct.id, name: newName },
    });

    return this.getProductById(newProduct.id);
  },

  deleteProduct(id: number, adminEmail?: string, ipAddress?: string | null): boolean {
    const existing = this.getProductById(id);
    const images = this.listProductImages(id);

    const result = db.prepare("DELETE FROM products WHERE id = ?").run(id);

    // Clean up local uploaded files if in /uploads/
    for (const img of images) {
      if (img.path && img.path.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "data", img.path);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch {
            // best-effort
          }
        }
      }
    }

    AuditRepo.log({
      action: "PRODUCT_DELETED",
      entity: "Product",
      entityId: id,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { name: existing?.name, slug: existing?.slug },
    });

    return result.changes > 0;
  },

  listProductImages(productId: number): DbProductImage[] {
    return db.prepare(`
      SELECT * FROM product_images 
      WHERE product_id = ? 
      ORDER BY is_primary DESC, sort_order ASC, id ASC
    `).all(productId) as DbProductImage[];
  },

  addProductImage(
    productId: number,
    path: string,
    alt: string | null = null,
    isPrimary: number = 0,
    sortOrder: number = 0
  ): DbProductImage {
    if (isPrimary === 1) {
      db.prepare("UPDATE product_images SET is_primary = 0 WHERE product_id = ?").run(productId);
    } else {
      const count = db.prepare("SELECT COUNT(*) as c FROM product_images WHERE product_id = ?").get(productId) as { c: number };
      if (count.c === 0) {
        isPrimary = 1;
      }
    }

    const stmt = db.prepare(`
      INSERT INTO product_images (product_id, path, alt, is_primary, sort_order)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(productId, path, alt, isPrimary, sortOrder);

    return db.prepare("SELECT * FROM product_images WHERE id = ?").get(result.lastInsertRowid) as DbProductImage;
  },

  removeProductImage(imageId: number, adminEmail?: string, ipAddress?: string | null): boolean {
    const img = db.prepare("SELECT * FROM product_images WHERE id = ?").get(imageId) as DbProductImage | undefined;
    if (!img) return false;

    const result = db.prepare("DELETE FROM product_images WHERE id = ?").run(imageId);

    // If was primary, promote next available image
    if (img.is_primary === 1) {
      db.prepare(`
        UPDATE product_images 
        SET is_primary = 1 
        WHERE id = (
          SELECT id FROM product_images 
          WHERE product_id = ? 
          ORDER BY sort_order ASC, id ASC 
          LIMIT 1
        )
      `).run(img.product_id);
    }

    // Clean up file if local
    if (img.path && img.path.startsWith("/uploads/")) {
      const filePath = path.join(process.cwd(), "data", img.path);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch {
          // best-effort
        }
      }
    }

    AuditRepo.log({
      action: "IMAGE_DELETED",
      entity: "ProductImage",
      entityId: imageId,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { productId: img.product_id, path: img.path },
    });

    return result.changes > 0;
  },

  setPrimaryImage(productId: number, imageId: number): boolean {
    const updateTx = db.transaction(() => {
      db.prepare("UPDATE product_images SET is_primary = 0 WHERE product_id = ?").run(productId);
      db.prepare("UPDATE product_images SET is_primary = 1 WHERE id = ? AND product_id = ?").run(imageId, productId);
    });
    updateTx();
    return true;
  },

  reorderImages(productId: number, imageIds: number[]): boolean {
    const updateTx = db.transaction(() => {
      imageIds.forEach((id, index) => {
        db.prepare("UPDATE product_images SET sort_order = ? WHERE id = ? AND product_id = ?").run(index, id, productId);
      });
    });
    updateTx();
    return true;
  },
};
