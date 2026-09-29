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
    const detailsStr =
      typeof params.details === "object" && params.details !== null
        ? JSON.stringify(params.details)
        : params.details || null;

    const entityIdStr = params.entityId !== undefined && params.entityId !== null ? String(params.entityId) : null;

    db.execute(
      `INSERT INTO audit_logs (action, entity, entity_id, admin_email, ip_address, details, timestamp)
       VALUES (?, ?, ?, ?, ?, ?, datetime('now'))`,
      [
        params.action,
        params.entity,
        entityIdStr,
        params.adminEmail || "System",
        params.ipAddress || null,
        detailsStr,
      ]
    ).catch((err) => {
      console.error("[AuditLog Error]", err);
    });
  },

  async listLogs(options: { limit?: number; offset?: number; entity?: string; action?: string } = {}): Promise<{
    logs: AuditLogEntry[];
    total: number;
  }> {
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

    const countRow = await db.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM audit_logs ${whereSql}`,
      params
    );
    const total = countRow ? countRow.count : 0;

    const rows = await db.query<AuditLogEntry>(
      `SELECT * FROM audit_logs 
       ${whereSql}
       ORDER BY id DESC
       LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );

    return { logs: rows, total };
  },
};
