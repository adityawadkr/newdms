import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

console.log('\n🔄 Renaming vehicles table to vehicle...\n');

try {
    // SQLite uses ALTER TABLE ... RENAME TO
    await client.execute('ALTER TABLE vehicles RENAME TO vehicle');

    console.log('✅ Table renamed successfully!');

    // Verify
    const result = await client.execute('SELECT COUNT(*) as count FROM vehicle');
    console.log(`✅ Verified: vehicle table exists with ${result.rows[0].count} records\n`);

} catch (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('no such table')) {
        console.log('ℹ️  The table might already be renamed or not exist.');
    }
}
