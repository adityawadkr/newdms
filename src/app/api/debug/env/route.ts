import { NextResponse } from "next/server";

export async function GET() {
    const vars = {
        TURSO_CONNECTION_URL: !!process.env.TURSO_CONNECTION_URL,
        TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        EMAIL_FROM: !!process.env.EMAIL_FROM,
        BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL, // Show value to check for mismatch
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL, // Show value
        NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
        status: "ok",
        env: vars,
        message: "If any value is false, that environment variable is missing."
    });
}
