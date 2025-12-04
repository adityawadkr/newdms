import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import "dotenv/config"; // ensure env vars are loaded
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

import nodemailer from "nodemailer";

// Validation for required environment variables
if (!process.env.BETTER_AUTH_SECRET) {
    console.error("CRITICAL: BETTER_AUTH_SECRET is missing.");
}
if (!process.env.BETTER_AUTH_URL && process.env.NODE_ENV === 'production') {
    console.error("CRITICAL: BETTER_AUTH_URL is missing in production.");
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

// Verify SMTP connection on startup (optional, good for debugging)
if (process.env.SMTP_HOST) {
    transporter.verify(function (error, success) {
        if (error) {
            console.warn("SMTP Connection Error:", error);
        } else {
            console.log("SMTP Server is ready to take our messages");
        }
    });
} else {
    console.warn("WARNING: SMTP_HOST is missing. Email sending will fail.");
}

const baseURL = process.env.NODE_ENV === "development" ? "http://localhost:3000" : (process.env.BETTER_AUTH_URL || "https://newdms.netlify.app");

export const auth = betterAuth({
    baseURL: baseURL,
    secret: process.env.BETTER_AUTH_SECRET || "dev-secret",
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: schema,
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "user",
                input: true, // Allow user to choose their role
            },
        },
    },
    emailAndPassword: {
        enabled: true,
        autoSignIn: false, // Disable auto sign-in to force verification
        requireEmailVerification: true,
        async sendResetPassword({ user, url, token }) {
            try {
                await transporter.sendMail({
                    from: process.env.EMAIL_FROM || "noreply@example.com",
                    to: user.email,
                    subject: "Reset your password",
                    html: `<p>Click the link below to reset your password:</p><a href="${url}">${url}</a>`,
                });
            } catch (error) {
                console.error("Error sending reset password email:", error);
                throw error;
            }
        },
    },
    plugins: [
        emailOTP({
            async sendVerificationOTP({ email, otp, type }) {
                try {
                    await transporter.sendMail({
                        from: process.env.EMAIL_FROM || "noreply@example.com",
                        to: email,
                        subject: "Verify your email address",
                        html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
                    });
                } catch (error) {
                    console.error("Error sending verification OTP:", error);
                    throw error;
                }
            },
            sendVerificationOnSignUp: true,
        }),
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60, // 5 minutes
        },
    },
    trustedOrigins: [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://localhost:3003",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002",
        "http://127.0.0.1:3003",
        "https://a-dms.netlify.app",
        "https://newdms.netlify.app",
        process.env.BETTER_AUTH_URL || "",
        process.env.NEXT_PUBLIC_APP_URL || ""
    ].filter(Boolean), // Remove empty strings
    onAPIError: {
        onError: async (error: any, ctx: any) => {
            console.error("Better Auth API Error:", {
                message: error?.message || "Unknown error",
                status: error?.status || 500,
                path: ctx?.path || "Unknown path",
                body: ctx?.body || "No body"
            });
        },
    },
});

