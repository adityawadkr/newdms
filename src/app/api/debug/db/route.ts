import { NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { count } from "drizzle-orm";

export async function GET() {
    try {
        const result = await db.select({ count: count() }).from(user);
        return NextResponse.json({ status: "ok", userCount: result[0].count });
    } catch (error: any) {
        console.error("DB Connection Error:", error);
        return NextResponse.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
    }
}
