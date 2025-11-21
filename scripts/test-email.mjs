import nodemailer from "nodemailer";
import "dotenv/config";

async function testEmail() {
    console.log("Testing SMTP Configuration...");
    console.log("Host:", process.env.SMTP_HOST);
    console.log("Port:", process.env.SMTP_PORT);
    console.log("User:", process.env.SMTP_USER);
    console.log("Secure:", process.env.SMTP_SECURE);

    if (!process.env.SMTP_HOST) {
        console.error("❌ SMTP_HOST is missing in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("✅ SMTP Connection Successful!");

        console.log("Sending test email...");
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || "test@example.com",
            to: process.env.EMAIL_FROM || "test@example.com", // Send to self
            subject: "Test Email from DMS",
            text: "If you see this, email is working!",
        });
        console.log("✅ Email sent:", info.messageId);
    } catch (error) {
        console.error("❌ SMTP Error:", error);
    }
}

testEmail();
