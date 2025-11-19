import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

const email = 'dankkpablo@gmail.com';

console.log(`\n🔄 Updating ${email} to admin role...\n`);

const result = await client.execute({
    sql: 'UPDATE user SET role = ? WHERE email = ?',
    args: ['admin', email]
});

console.log(`✅ Updated ${result.rowsAffected} user(s)`);

// Verify the change
const verify = await client.execute({
    sql: 'SELECT id, email, name, role FROM user WHERE email = ?',
    args: [email]
});

if (verify.rows.length > 0) {
    const user = verify.rows[0];
    console.log('\n📊 User details:');
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log('\n✅ You can now access the HR Dashboard at /hr');
} else {
    console.log('❌ User not found');
}
