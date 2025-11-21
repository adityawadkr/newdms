import { createClient } from '@libsql/client';
import 'dotenv/config';

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL || process.env.DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN || process.env.DATABASE_AUTH_TOKEN,
});

const email = process.argv[2];

if (!email) {
    console.error('Please provide an email address.');
    process.exit(1);
}

console.log(`\n🔍 Verifying email for user: ${email}...\n`);

try {
    // Update user to set emailVerified to true
    await client.execute({
        sql: 'UPDATE user SET email_verified = 1 WHERE email = ?',
        args: [email],
    });

    const result = await client.execute({
        sql: 'SELECT * FROM user WHERE email = ?',
        args: [email],
    });

    if (result.rows.length > 0) {
        console.log('✅ User updated successfully:');
        console.log(`   - Email: ${result.rows[0].email}`);
        console.log(`   - Verified: ${result.rows[0].email_verified ? 'Yes' : 'No'}`);
        console.log(`   - Role: ${result.rows[0].role}`);
    } else {
        console.error('❌ User not found.');
    }

} catch (error) {
    console.error('❌ Error:', error.message);
}
