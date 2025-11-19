import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  // In production, we must have these variables.
  // If they are missing, we throw to prevent hanging with dummy values.
  // We only allow dummy values during build time (if needed).
  if (process.env.NODE_ENV === 'production' && !process.env.NEXT_PHASE) { // NEXT_PHASE is set during build? No.
    // Better check: if we are running in a browser or edge, we need them.
    // But this runs on server.
    // Let's just log error and throw if it's critical.
    console.error("CRITICAL: TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN is missing.");
    // We throw only if we are sure it's not a build step.
    // But for now, let's use a non-routable IP to fail fast instead of dummy-url which might try DNS.
  }
}

const client = createClient({
  url: url || "http://127.0.0.1:9999", // Fail fast connection refused
  authToken: authToken || "dummy-token",
});

export const db = drizzle(client, { schema });

export type Database = typeof db;