import { createClient, Client } from "@libsql/client";
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

// Global singletons
declare global {
  // eslint-disable-next-line no-var
  var __civaraTursoClient: Client | undefined;
  // eslint-disable-next-line no-var
  var __civaraLocalDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var __civaraDbMigrated: boolean | undefined;
}

export function isTursoConfigured(): boolean {
  return Boolean(
    (process.env.TURSO_DATABASE_URL || process.env.TURSO_URL) &&
    process.env.TURSO_AUTH_TOKEN
  );
}

export function getTursoClient(): Client | null {
  if (!isTursoConfigured()) return null;

  if (!global.__civaraTursoClient) {
    const url = (process.env.TURSO_DATABASE_URL || process.env.TURSO_URL)!;
    const authToken = process.env.TURSO_AUTH_TOKEN!;

    global.__civaraTursoClient = createClient({
      url,
      authToken,
    });
  }

  return global.__civaraTursoClient;
}

function getLocalDatabase(): Database.Database {
  if (!global.__civaraLocalDb) {
    const dataDir = getDataDir();
    getUploadsDir();

    const dbPath = path.join(dataDir, "civara.db");
    const localDb = new Database(dbPath);

    try {
      localDb.pragma("journal_mode = WAL");
    } catch {
      localDb.pragma("journal_mode = DELETE");
    }
    localDb.pragma("foreign_keys = ON");

    global.__civaraLocalDb = localDb;
  }
  return global.__civaraLocalDb;
}

export interface DbExecuteResult {
  changes: number;
  lastInsertRowid: number;
}

export const db = {
  isTurso(): boolean {
    return isTursoConfigured();
  },

  async query<T = any>(sql: string, args: any[] = []): Promise<T[]> {
    const turso = getTursoClient();
    if (turso) {
      const res = await turso.execute({ sql, args });
      return res.rows as unknown as T[];
    }
    const local = getLocalDatabase();
    return local.prepare(sql).all(...args) as T[];
  },

  async queryOne<T = any>(sql: string, args: any[] = []): Promise<T | null> {
    const turso = getTursoClient();
    if (turso) {
      const res = await turso.execute({ sql, args });
      return (res.rows[0] as unknown as T) || null;
    }
    const local = getLocalDatabase();
    return (local.prepare(sql).get(...args) as T) || null;
  },

  async execute(sql: string, args: any[] = []): Promise<DbExecuteResult> {
    const turso = getTursoClient();
    if (turso) {
      const res = await turso.execute({ sql, args });
      return {
        changes: res.rowsAffected,
        lastInsertRowid: Number(res.lastInsertRowid ?? 0),
      };
    }
    const local = getLocalDatabase();
    const res = local.prepare(sql).run(...args);
    return {
      changes: res.changes,
      lastInsertRowid: Number(res.lastInsertRowid),
    };
  },

  async executeMultiple(sql: string): Promise<void> {
    const turso = getTursoClient();
    if (turso) {
      await turso.executeMultiple(sql);
      return;
    }
    const local = getLocalDatabase();
    local.exec(sql);
  },

  async batch(stmts: Array<{ sql: string; args?: any[] }>): Promise<void> {
    const turso = getTursoClient();
    if (turso) {
      await turso.batch(stmts.map((s) => ({ sql: s.sql, args: s.args || [] })));
      return;
    }
    const local = getLocalDatabase();
    const tx = local.transaction(() => {
      for (const s of stmts) {
        local.prepare(s.sql).run(...(s.args || []));
      }
    });
    tx();
  },
};

export default db;
