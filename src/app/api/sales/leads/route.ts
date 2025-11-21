import { db } from "@/db";
import { leads, user } from "@/db/schema";
import { desc, eq, or, getTableColumns } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let query = db.select().from(leads).orderBy(desc(leads.createdAt));

        if (status && status !== "all") {
            // @ts-ignore
            query = query.where(eq(leads.status, status));
        }

        const data = await query;
        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, phone, email, source, vehicleInterest } = body;

        if (!name || !phone || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Duplicate Detection
        const existing = await db.select().from(leads).where(
            or(eq(leads.email, email), eq(leads.phone, phone))
        ).limit(1);

        if (existing.length > 0) {
            return NextResponse.json({
                error: "Lead already exists",
                duplicate: true,
                leadId: existing[0].id
            }, { status: 409 });
        }

        // Intelligent Scoring & Temperature
        let score = 30; // Base score for walking in/contacting
        if (phone && phone.length >= 10) score += 20;
        if (email) score += 10;
        if (vehicleInterest) score += 30; // High intent if they know what they want
        if (source === "Referral") score += 10;

        let temperature = "Cold";
        if (score >= 80) temperature = "Hot";
        else if (score >= 50) temperature = "Warm";

        // Auto-Assignment (Round Robin / Random for now)
        const salesUsers = await db.select().from(user).where(or(eq(user.role, "sales"), eq(user.role, "admin")));
        let assignedTo = null;
        if (salesUsers.length > 0) {
            assignedTo = salesUsers[Math.floor(Math.random() * salesUsers.length)].id;
        }

        const [newLead] = await db.insert(leads).values({
            name,
            phone,
            email,
            source: source || "Direct",
            status: "New",
            vehicleInterest: typeof vehicleInterest === 'object' ? JSON.stringify(vehicleInterest) : vehicleInterest,
            temperature,
            score,
            assignedTo,
            createdAt: Date.now(),
            lastContacted: new Date().toISOString(),
            nextAction: "Initial Follow-up",
            nextActionDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // +1 day
        }).returning();

        return NextResponse.json({ data: newLead }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
