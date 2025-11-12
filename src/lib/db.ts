import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set");
}

export const sql = neon(connectionString);

export async function initUserSchema() {
  // Create a simple users table if it does not exist
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function initNotesSchema() {
  // Create notes table keyed to users
  // Ensure the users table exists before creating notes (FK dependency)
  await initUserSchema();
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT '',
      content TEXT NOT NULL DEFAULT '',
      folder_id TEXT NOT NULL DEFAULT 'notes',
      tags TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
  // Ensure pinned column exists for pinning notes
  await sql`
    ALTER TABLE notes
    ADD COLUMN IF NOT EXISTS pinned BOOLEAN NOT NULL DEFAULT FALSE;
  `;
}

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  const rows = await sql`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
  return (rows[0] as DbUser | undefined) ?? null;
}

export async function createUser(name: string, email: string, passwordHash: string): Promise<DbUser> {
  const rows = await sql`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING *
  `;
  return rows[0] as DbUser;
}

export async function ensureUserByEmail(name: string, email: string): Promise<DbUser> {
  // Ensure users table exists
  await initUserSchema();
  const existing = await getUserByEmail(email);
  if (existing) return existing;
  // Create a placeholder password for externally authenticated users
  const placeholderPasswordHash = '-';
  return await createUser(name || email.split('@')[0] || 'User', email, placeholderPasswordHash);
}