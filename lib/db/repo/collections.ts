import db from "../client";
import { CreateCollectionInput, UpdateCollectionInput } from "../schemas/collection";
import { AuditRepo } from "./audit";

export interface DbCollection {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export const CollectionRepo = {
  listCollections(options: { activeOnly?: boolean; search?: string } = {}): DbCollection[] {
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (options.activeOnly) {
      whereClauses.push("c.is_active = 1");
    }

    if (options.search && options.search.trim()) {
      whereClauses.push("(c.name LIKE ? OR c.slug LIKE ?)");
      const term = `%${options.search.trim()}%`;
      params.push(term, term);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const query = `
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM products p WHERE p.collection_id = c.id) as product_count
      FROM collections c
      ${whereSql}
      ORDER BY c.sort_order ASC, c.id ASC
    `;

    return db.prepare(query).all(...params) as DbCollection[];
  },

  getCollectionById(id: number): DbCollection | null {
    const row = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM products p WHERE p.collection_id = c.id) as product_count
      FROM collections c
      WHERE c.id = ?
    `).get(id) as DbCollection | undefined;

    return row || null;
  },

  getCollectionBySlug(slug: string): DbCollection | null {
    const row = db.prepare(`
      SELECT 
        c.*,
        (SELECT COUNT(*) FROM products p WHERE p.collection_id = c.id) as product_count
      FROM collections c
      WHERE c.slug = ?
    `).get(slug.toLowerCase().trim()) as DbCollection | undefined;

    return row || null;
  },

  createCollection(input: CreateCollectionInput, adminEmail?: string, ipAddress?: string | null): DbCollection {
    const stmt = db.prepare(`
      INSERT INTO collections (
        slug, name, description, cover_image, sort_order, is_active,
        created_at, updated_at
      ) VALUES (
        ?, ?, ?, ?, ?, ?,
        datetime('now'), datetime('now')
      )
    `);

    const result = stmt.run(
      input.slug.toLowerCase().trim(),
      input.name.trim(),
      input.description ?? null,
      input.cover_image ?? null,
      input.sort_order ?? 0,
      input.is_active ?? 1
    );

    const newId = Number(result.lastInsertRowid);

    AuditRepo.log({
      action: "CATEGORY_CREATED",
      entity: "Category",
      entityId: newId,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { name: input.name, slug: input.slug },
    });

    return this.getCollectionById(newId)!;
  },

  updateCollection(
    id: number,
    input: UpdateCollectionInput,
    adminEmail?: string,
    ipAddress?: string | null
  ): DbCollection | null {
    const existing = this.getCollectionById(id);
    if (!existing) return null;

    const fields: string[] = [];
    const values: any[] = [];

    if (input.slug !== undefined) { fields.push("slug = ?"); values.push(input.slug.toLowerCase().trim()); }
    if (input.name !== undefined) { fields.push("name = ?"); values.push(input.name.trim()); }
    if (input.description !== undefined) { fields.push("description = ?"); values.push(input.description); }
    if (input.cover_image !== undefined) { fields.push("cover_image = ?"); values.push(input.cover_image); }
    if (input.sort_order !== undefined) { fields.push("sort_order = ?"); values.push(input.sort_order); }
    if (input.is_active !== undefined) { fields.push("is_active = ?"); values.push(input.is_active); }

    fields.push("updated_at = datetime('now')");

    if (fields.length > 1) {
      values.push(id);
      db.prepare(`UPDATE collections SET ${fields.join(", ")} WHERE id = ?`).run(...values);
    }

    AuditRepo.log({
      action: "CATEGORY_UPDATED",
      entity: "Category",
      entityId: id,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { name: input.name || existing.name, isActive: input.is_active },
    });

    return this.getCollectionById(id);
  },

  deleteCollection(
    id: number,
    adminEmail?: string,
    ipAddress?: string | null
  ): { success: boolean; error?: string } {
    const existing = this.getCollectionById(id);
    if (!existing) return { success: false, error: "Category not found" };

    if (existing.product_count && existing.product_count > 0) {
      return {
        success: false,
        error: `Cannot delete "${existing.name}" because ${existing.product_count} product(s) are assigned to it. Reassign products first.`,
      };
    }

    const result = db.prepare("DELETE FROM collections WHERE id = ?").run(id);

    AuditRepo.log({
      action: "CATEGORY_DELETED",
      entity: "Category",
      entityId: id,
      adminEmail: adminEmail || "Admin",
      ipAddress: ipAddress || null,
      details: { name: existing.name, slug: existing.slug },
    });

    return { success: result.changes > 0 };
  },

  reorderCollections(categoryIds: number[]): boolean {
    const updateTx = db.transaction(() => {
      categoryIds.forEach((id, index) => {
        db.prepare("UPDATE collections SET sort_order = ? WHERE id = ?").run(index + 1, id);
      });
    });
    updateTx();
    return true;
  },
};
