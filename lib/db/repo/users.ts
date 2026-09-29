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
  async findByEmail(email: string): Promise<DbUser | null> {
    return await db.queryOne<DbUser>(
      "SELECT * FROM users WHERE LOWER(email) = LOWER(?)",
      [email.trim()]
    );
  },

  async findById(id: number): Promise<DbUser | null> {
    return await db.queryOne<DbUser>("SELECT * FROM users WHERE id = ?", [id]);
  },

  async createUser(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
    role?: string;
  }): Promise<DbUser> {
    const result = await db.execute(
      `INSERT INTO users (email, password_hash, name, role, created_at)
       VALUES (LOWER(?), ?, ?, ?, datetime('now'))`,
      [input.email.trim(), input.passwordHash, input.name ?? null, input.role ?? "admin"]
    );

    return (await this.findById(Number(result.lastInsertRowid)))!;
  },

  async upsertAdmin(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }): Promise<DbUser> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      await db.execute(
        `UPDATE users 
         SET password_hash = ?, name = COALESCE(?, name)
         WHERE id = ?`,
        [input.passwordHash, input.name ?? null, existing.id]
      );
      return (await this.findById(existing.id))!;
    } else {
      return await this.createUser(input);
    }
  },

  async upsertSeller(input: {
    email: string;
    passwordHash: string;
    name?: string | null;
  }): Promise<DbUser> {
    const existing = await this.findByEmail(input.email);
    if (existing) {
      await db.execute(
        `UPDATE users 
         SET password_hash = ?, name = COALESCE(?, name), role = 'seller'
         WHERE id = ?`,
        [input.passwordHash, input.name ?? null, existing.id]
      );
      return (await this.findById(existing.id))!;
    } else {
      return await this.createUser({ ...input, role: "seller" });
    }
  },

  async listSellers(): Promise<Omit<DbUser, "password_hash">[]> {
    return await db.query<Omit<DbUser, "password_hash">>(
      "SELECT id, email, name, role, created_at FROM users WHERE role = 'seller' ORDER BY id ASC"
    );
  },

  async listAllUsers(): Promise<Omit<DbUser, "password_hash">[]> {
    return await db.query<Omit<DbUser, "password_hash">>(
      "SELECT id, email, name, role, created_at FROM users ORDER BY role ASC, id ASC"
    );
  },

  async deleteUser(id: number): Promise<boolean> {
    const res = await db.execute("DELETE FROM users WHERE id = ?", [id]);
    return res.changes > 0;
  },

  async countUsers(): Promise<number> {
    const row = await db.queryOne<{ c: number }>("SELECT COUNT(*) as c FROM users");
    return row ? row.c : 0;
  },
};
