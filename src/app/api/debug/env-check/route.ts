import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";

export const dynamic = 'force-dynamic';

export async function GET() {
    const envStatus = {
        TURSO_CONNECTION_URL: !!process.env.TURSO_CONNECTION_URL,
        TURSO_AUTH_TOKEN: !!process.env.TURSO_AUTH_TOKEN,
        BETTER_AUTH_SECRET: !!process.env.BETTER_AUTH_SECRET,
        BETTER_AUTH_URL: !!process.env.BETTER_AUTH_URL,
        SMTP_HOST: !!process.env.SMTP_HOST,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!process.env.SMTP_USER,
        SMTP_PASS: !!process.env.SMTP_PASS,
        NODE_ENV: process.env.NODE_ENV,
    };

    let dbStatus = "unknown";
    let dbError = null;

    try {
        // Simple query to check DB connection
        await db.run(sql`SELECT 1`);
        dbStatus = "connected";
    } catch (error: any) {
        dbStatus = "error";
        dbError = error.message;
    }

    return NextResponse.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        env: envStatus,
        database: {
            status: dbStatus,
            error: dbError,
        },
    });
}
