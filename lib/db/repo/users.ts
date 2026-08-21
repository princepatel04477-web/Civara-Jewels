import db from "../client";

export interface DbUser {
  id: number;
  email: string;
  password_hash: string;
  name: string | null;
  role: string;
  created_at: string;
}

export const UserRepo = {
  findByEmail(email: string): DbUser | null {
    const row = db.prepare("SELECT * FROM users WHERE LOWER(email) = LOWER(?)").get(email.trim()) as DbUser | undefined;
    return row || null;
  },

  findById(id: number): DbUser | null {
    const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as DbUser | undefined;
    return row || null;
  },

  createUser(input: { email: string; passwordHash: string; name?: string | null; role?: string }): DbUser {
    const stmt = db.prepare(`
      INSERT INTO users (email, password_hash, name, role, created_at)
      VALUES (LOWER(?), ?, ?, ?, datetime('now'))
    `);
    const result = stmt.run(
      input.email.trim(),
      input.passwordHash,
      input.name ?? null,
      input.role ?? "admin"
    );

    return this.findById(Number(result.lastInsertRowid))!;
  },

  upsertAdmin(input: { email: string; passwordHash: string; name?: string | null }): DbUser {
    const existing = this.findByEmail(input.email);
    if (existing) {
      db.prepare(`
        UPDATE users 
        SET password_hash = ?, name = COALESCE(?, name)
        WHERE id = ?
      `).run(input.passwordHash, input.name ?? null, existing.id);
      return this.findById(existing.id)!;
    } else {
      return this.createUser(input);
    }
  },

  countUsers(): number {
    const row = db.prepare("SELECT COUNT(*) as c FROM users").get() as { c: number };
    return row ? row.c : 0;
  },
};
