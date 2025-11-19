import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

console.log('\n🔨 Creating invitation table in Turso...\n');

try {
    await client.execute(`
    CREATE TABLE IF NOT EXISTS invitation (
      id TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at INTEGER NOT NULL,
      inviter_id TEXT,
      status TEXT DEFAULT 'pending' NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

    console.log('✅ invitation table created successfully!');

    // Verify
    const result = await client.execute('SELECT COUNT(*) as count FROM invitation');
    console.log(`✅ Verified: invitation table exists with ${result.rows[0].count} records\n`);

} catch (error) {
    console.error('❌ Error:', error.message);
}
