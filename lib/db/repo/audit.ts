import db from "../client";

export interface AuditLogEntry {
  id: number;
  timestamp: string;
  action: string;
  entity: string;
  entity_id: string | null;
  admin_email: string | null;
  ip_address: string | null;
  details: string | null;
}

export const AuditRepo = {
  log(params: {
    action: string;
    entity: string;
    entityId?: string | number | null;
    adminEmail?: string | null;
    ipAddress?: string | null;
    details?: string | Record<string, any> | null;
  }): void {
    try {
      const detailsStr =
        typeof params.details === "object" && params.details !== null
          ? JSON.stringify(params.details)
          : params.details || null;

      const entityIdStr = params.entityId !== undefined && params.entityId !== null ? String(params.entityId) : null;

      db.prepare(`
        INSERT INTO audit_logs (action, entity, entity_id, admin_email, ip_address, details, timestamp)
        VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
      `).run(
        params.action,
        params.entity,
        entityIdStr,
        params.adminEmail || "System",
        params.ipAddress || null,
        detailsStr
      );
    } catch (err) {
      console.error("[AuditLog Error]", err);
    }
  },

  listLogs(options: { limit?: number; offset?: number; entity?: string; action?: string } = {}): {
    logs: AuditLogEntry[];
    total: number;
  } {
    const limit = options.limit || 50;
    const offset = options.offset || 0;
    const whereClauses: string[] = [];
    const params: any[] = [];

    if (options.entity) {
      whereClauses.push("entity = ?");
      params.push(options.entity);
    }
    if (options.action) {
      whereClauses.push("action = ?");
      params.push(options.action);
    }

    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const countRow = db.prepare(`SELECT COUNT(*) as count FROM audit_logs ${whereSql}`).get(...params) as {
      count: number;
    };
    const total = countRow ? countRow.count : 0;

    const rows = db.prepare(`
      SELECT * FROM audit_logs 
      ${whereSql}
      ORDER BY id DESC
      LIMIT ? OFFSET ?
    `).all(...params, limit, offset) as AuditLogEntry[];

    return { logs: rows, total };
  },
};
