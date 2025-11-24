import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error("CRITICAL: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing in production environment.");
  } else {
    console.warn("WARNING: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing. Using dummy values for local development/build.");
  }
} else {
  // Log success only in dev or if needed for debugging (be careful with logs in prod)
  if (process.env.NODE_ENV !== 'production') {
    console.log("Database configuration loaded successfully.");
  }
}

const client = createClient({
  url: url || "http://127.0.0.1:9999", // Fail fast connection refused
  authToken: authToken || "dummy-token",
});

export const db = drizzle(client, { schema });

export type Database = typeof db;