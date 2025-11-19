import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { user } from './src/db/schema.ts';
import { hashSync } from 'bcrypt';

// Connect to your database
const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

const db = drizzle(client);

// Check if any admin exists
const existingUsers = await db.select().from(user);
const existingAdmins = existingUsers.filter(u => u.role === 'admin');

console.log(`\n📊 Current users: ${existingUsers.length}`);
console.log(`👑 Current admins: ${existingAdmins.length}\n`);

if (existingAdmins.length > 0) {
    console.log('✅ Admin users found:');
    existingAdmins.forEach(a => console.log(`   - ${a.email} (${a.name || 'No name'})`));
} else {
    console.log('❌ No admin users found!');
    console.log('\n📝 To create your first admin user:');
    console.log('   1. Run the development server: npm run dev');
    console.log('   2. Create a test invite manually OR temporarily allow registration');
    console.log('   3. Update the user's role to "admin" in the database\n');
}
