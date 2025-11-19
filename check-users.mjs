import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
});

const result = await client.execute('SELECT id, email, name, role FROM user');

console.log('\n=== Current Users in Database ===\n');
if (result.rows.length === 0) {
    console.log('❌ No users found in database');
    console.log('\n📝 You need to create an admin user to start using the invite system.');
    console.log('   Options:');
    console.log('   1. Temporarily enable public registration and create an admin user');
    console.log('   2. Directly insert an admin user via SQL');
    console.log('   3. Use the seed script (if you have one)');
} else {
    console.table(result.rows);

    const admins = result.rows.filter(u => u.role === 'admin');
    console.log(`\n✅ Found ${admins.length} admin user(s)`);
    admins.forEach(a => console.log(`   - ${a.email} (${a.name || 'No name'})`));
}
