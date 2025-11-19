import "dotenv/config";
import { db } from "../src/db/index";
import { user } from "../src/db/schema";
import { count } from "drizzle-orm";

async function testDB() {
    console.log("Testing DB Connection...");
    console.log("URL:", process.env.TURSO_CONNECTION_URL);

    try {
        const result = await db.select({ count: count() }).from(user);
        const users = await db.select().from(user);
        console.log("✅ DB Connection Successful!");
        console.log("User count:", result[0].count);
        console.log("Users:", users.map(u => ({ email: u.email, role: u.role })));
    } catch (error) {
        console.error("❌ DB Connection Failed:", error);
    }
}

testDB();
