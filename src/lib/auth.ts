import { betterAuth } from "better-auth";
import { emailOTP } from "better-auth/plugins";
import "dotenv/config"; // ensure env vars are loaded
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import * as schema from "@/db/schema";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.example.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER || "user",
        pass: process.env.SMTP_PASS || "pass",
    },
});

export const auth = betterAuth({
    secret: process.env.BETTER_AUTH_SECRET || "dev-secret",
    database: drizzleAdapter(db, {
        provider: "sqlite",
        schema: schema,
    }),
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
});
