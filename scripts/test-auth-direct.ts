import "dotenv/config";
import { auth } from "../src/lib/auth";

async function testAuth() {
    console.log("Testing Auth Logic Directly...");

    const email = "adityxw@gmail.com"; // Using the email from SMTP test

    try {
        console.log(`Attempting to send password reset to ${email}...`);
        // Note: forgetPassword might return void or status
        const res = await auth.api.forgetPassword({
            body: {
                email: email,
                redirectTo: "/reset-password"
            }
        });
        console.log("✅ Forget Password Call Successful!", res);
    } catch (error) {
        console.error("❌ Forget Password Failed:", error);
    }
}

testAuth();
