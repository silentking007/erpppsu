import bcrypt from 'bcryptjs';
import { createClient } from '@libsql/client';

const url = process.env.TURSO_DATABASE_URL || 'file:./data/ppsu.db';
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
export const db = createClient({ url, authToken });

let schemaReady;
export async function ensureSchema() {
  if (!schemaReady) {
    schemaReady = (async () => {
      await db.batch([
        `CREATE TABLE IF NOT EXISTS admins (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, name TEXT NOT NULL, status TEXT DEFAULT 'Not On Roll (Backlog)', course TEXT DEFAULT '', enrollment TEXT DEFAULT '', phone TEXT DEFAULT '', dob TEXT DEFAULT '', student_mobile TEXT DEFAULT '', father TEXT DEFAULT '', email TEXT DEFAULT '', profile_image TEXT DEFAULT '/assets/profile-reference.jpg', upcoming_jobs INTEGER DEFAULT 0, applied_jobs INTEGER DEFAULT 0, created_at TEXT DEFAULT CURRENT_TIMESTAMP)`,
        `CREATE TABLE IF NOT EXISTS fees (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, semester TEXT NOT NULL, fees_collected REAL DEFAULT 0, previously_paid REAL DEFAULT 0, paid_amount REAL DEFAULT 0, outstanding_amount REAL DEFAULT 0, can_pay INTEGER DEFAULT 0, FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE)`,
        `CREATE INDEX IF NOT EXISTS idx_fees_user_id ON fees(user_id)`
      ], 'write');

      // Seed a default admin automatically on a brand-new database.
      // You can override these with Vercel environment variables.
      const existingAdmin = await db.execute('SELECT id FROM admins LIMIT 1');
      if (existingAdmin.rows.length === 0) {
        const username = process.env.DEFAULT_ADMIN_USERNAME || 'admin';
        const password = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
        const passwordHash = await bcrypt.hash(password, 12);
        await db.execute({
          sql: 'INSERT INTO admins (username, password_hash) VALUES (?, ?)',
          args: [username, passwordHash]
        });
      }
    })();
  }
  return schemaReady;
}
