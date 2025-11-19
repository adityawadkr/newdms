import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  // During build, we might not have env vars, so we use a dummy to prevent build failure
  // but log a warning. In production/runtime, this should ideally fail or be handled.
  if (process.env.NODE_ENV === 'production') {
    console.warn("Warning: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing. Using dummy values for build.");
  }
}

const client = createClient({
  url: url || "libsql://dummy-url",
  authToken: authToken || "dummy-token",
});

export const db = drizzle(client, { schema });

export type Database = typeof db;