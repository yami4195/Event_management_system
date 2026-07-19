import pool from "../config/db.js";

/**
 * Lightweight schema guards for columns the app expects.
 * Safe to run on every startup (IF NOT EXISTS).
 */
export async function ensureSchema() {
  try {
    await pool.query(`
      ALTER TABLE events
      ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 0
    `);
  } catch (error) {
    console.error("ensureSchema error:", error.message);
  }
}
