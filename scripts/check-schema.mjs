import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

console.log('\n🔍 Checking Turso database schema...\n');

// Check if invitation table exists
try {
    const invitations = await client.execute('SELECT COUNT(*) as count FROM invitation');
    console.log('✅ `invitation` table EXISTS in Turso');
    console.log(`   Found ${invitations.rows[0].count} invitation(s)`);
} catch (error) {
    console.log('❌ `invitation` table DOES NOT EXIST in Turso');
    console.log('   You need to run: npx drizzle-kit push');
}

// Check user table for role column
try {
    const users = await client.execute('SELECT id, email, role FROM user LIMIT 1');
    console.log('\n✅ `user.role` column EXISTS in Turso');
    if (users.rows.length > 0) {
        console.log(`   Sample: ${users.rows[0].email} has role '${users.rows[0].role}'`);
    }
} catch (error) {
    console.log('\n❌ `user.role` column might not exist');
}
