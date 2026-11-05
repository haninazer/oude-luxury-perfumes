import pg from 'pg';
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Pool } = pg;

let pool = null;
let sqliteDb = null;
let isPostgres = false;

// If DATABASE_URL is set, connect to PostgreSQL (Neon, Render, Supabase, local PostgreSQL)
if (process.env.DATABASE_URL) {
  try {
    const isSslRequired = !process.env.DATABASE_URL.includes('localhost') && !process.env.DATABASE_URL.includes('127.0.0.1');
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: isSslRequired ? { rejectUnauthorized: false } : false,
    });
    isPostgres = true;
    console.log('💎 Connected to PostgreSQL database via DATABASE_URL');
  } catch (err) {
    console.error('⚠️ Failed to initialize PostgreSQL pool, falling back to local SQLite:', err.message);
    pool = null;
    isPostgres = false;
  }
}

// Fallback to SQLite if PostgreSQL connection is not defined
if (!pool) {
  const dataDir = path.resolve(__dirname, '../../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const dbPath = path.join(dataDir, 'oude_store.sqlite');
  sqliteDb = new Database(dbPath);
  sqliteDb.pragma('journal_mode = WAL');
  sqliteDb.pragma('foreign_keys = ON');
  // Register PostgreSQL helper functions in SQLite
  try {
    sqliteDb.function('GREATEST', (...args) => Math.max(...args));
    sqliteDb.function('LEAST', (...args) => Math.min(...args));
  } catch (fnErr) {
    // Ignore if already registered
  }
  console.log(`📦 Using local SQLite database at: ${dbPath}`);
}

/**
 * Universal Query Adapter
 * Supports $1, $2, ... PostgreSQL parameter syntax on both Postgres and SQLite.
 * Returns standard { rows, rowCount } result object.
 */
export async function query(text, params = []) {
  if (isPostgres && pool) {
    const client = await pool.connect();
    try {
      const res = await client.query(text, params);
      return {
        rows: res.rows || [],
        rowCount: res.rowCount || (res.rows ? res.rows.length : 0),
      };
    } finally {
      client.release();
    }
  } else {
    // Translate $1, $2, $3 to ? for SQLite
    let sqliteQuery = text.replace(/\$(\d+)/g, '?');

    // Handle standard PostgreSQL syntax differences for SQLite
    // e.g. NOW() -> CURRENT_TIMESTAMP
    sqliteQuery = sqliteQuery.replace(/NOW\(\)/gi, 'CURRENT_TIMESTAMP');
    sqliteQuery = sqliteQuery.replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
    sqliteQuery = sqliteQuery.replace(/TIMESTAMP WITH TIME ZONE/gi, 'DATETIME');

    // Check if query is SELECT or returns rows
    const isSelect = /^\s*(SELECT|PRAGMA)/i.test(sqliteQuery);
    const hasReturning = /RETURNING/i.test(sqliteQuery);

    // Sanitize params for SQLite (convert booleans to 1/0, undefined to null)
    const sanitizedParams = params.map(val => {
      if (typeof val === 'boolean') return val ? 1 : 0;
      if (val === undefined) return null;
      return val;
    });

    try {
      if (isSelect) {
        const stmt = sqliteDb.prepare(sqliteQuery);
        const rows = stmt.all(...sanitizedParams);
        return { rows, rowCount: rows.length };
      } else if (hasReturning) {
        // SQLite 3.35+ supports RETURNING
        try {
          const stmt = sqliteDb.prepare(sqliteQuery);
          const rows = stmt.all(...sanitizedParams);
          return { rows, rowCount: rows.length };
        } catch (retErr) {
          // Fallback if older SQLite without RETURNING
          const cleanQuery = sqliteQuery.replace(/RETURNING\s+[\w\s,*]+/i, '');
          const stmt = sqliteDb.prepare(cleanQuery);
          const info = stmt.run(...sanitizedParams);
          return {
            rows: [{ id: info.lastInsertRowid }],
            rowCount: info.changes,
          };
        }
      } else {
        const stmt = sqliteDb.prepare(sqliteQuery);
        const info = stmt.run(...sanitizedParams);
        return {
          rows: [],
          rowCount: info.changes,
          lastInsertRowid: info.lastInsertRowid,
        };
      }
    } catch (err) {
      console.error('Database query error:', err.message, '\nQuery:', sqliteQuery);
      throw err;
    }
  }
}

export function isPostgresEngine() {
  return isPostgres;
}

export default {
  query,
  isPostgresEngine,
};
