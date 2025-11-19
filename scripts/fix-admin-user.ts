import "dotenv/config";
import { db } from "../src/db/index";
import { user, account } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function fixAdmin() {
    const email = "dankkpablo@gmail.com";
    const newPassword = "Admin@123456";

    console.log(`Fixing user: ${email}...`);

    // 1. Update Role
    try {
        const users = await db.select().from(user).where(eq(user.email, email));
        if (users.length === 0) {
            console.error("❌ User not found!");
            return;
        }

        const targetUser = users[0];
        console.log(`Found user: ${targetUser.name} (${targetUser.role})`);

        await db.update(user)
            .set({ role: "admin" })
            .where(eq(user.id, targetUser.id));

        console.log("✅ Role updated to 'admin'");

        // 2. Check Account
        const accounts = await db.select().from(account).where(eq(account.userId, targetUser.id));
        if (accounts.length === 0) {
            console.log("⚠️ No account record found. User might need to sign up again or use Forgot Password.");
        } else {
            console.log("✅ Account record found.");
        }

        console.log("\nTo set the password to 'Admin@123456':");
        console.log("1. Ensure your local server is running (npm run dev).");
        console.log("2. I will try to generate a hash using a dummy user.");

        try {
            // Try to create a dummy user to get a valid hash
            const dummyEmail = "temp_hash_gen@test.com";
            const signupRes = await fetch("http://localhost:3000/api/auth/sign-up/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: dummyEmail,
                    password: newPassword,
                    name: "Temp Hash"
                })
            });

            if (signupRes.ok) {
                // Get the hash from the dummy user
                const dummyUsers = await db.select().from(user).where(eq(user.email, dummyEmail));
                if (dummyUsers.length > 0) {
                    const dummyUser = dummyUsers[0];
                    const dummyAccounts = await db.select().from(account).where(eq(account.userId, dummyUser.id));

                    if (dummyAccounts.length > 0) {
                        const hash = dummyAccounts[0].password;

                        // Update target user with this hash
                        await db.update(account)
                            .set({ password: hash })
                            .where(eq(account.userId, targetUser.id));

                        console.log(`✅ Password updated to: ${newPassword}`);

                        // Cleanup
                        await db.delete(user).where(eq(user.id, dummyUser.id));
                        // Account cascades? or delete manually
                        await db.delete(account).where(eq(account.userId, dummyUser.id));
                        console.log("🧹 Cleanup done.");
                    }
                }
            } else {
                console.log("⚠️ Could not generate hash (Server might be down or signup failed).");
                console.log("👉 Please use the 'Forgot Password' link on the login page. It is fixed now!");
            }
        } catch (e) {
            console.log("⚠️ Could not connect to local server to generate hash.");
            console.log("👉 Please use the 'Forgot Password' link on the login page. It is fixed now!");
        }

    } catch (error) {
        console.error("❌ Error:", error);
    }
}

fixAdmin();
