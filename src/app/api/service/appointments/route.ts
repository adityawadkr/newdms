import { db } from "@/db";
import { appointments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");

        let query = db.select().from(appointments).orderBy(desc(appointments.createdAt));

        if (status && status !== "all") {
            // @ts-ignore - dynamic where clause
            query = query.where(eq(appointments.status, status));
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
        const { customer, vehicle, date, serviceType } = body;

        if (!customer || !vehicle || !date || !serviceType) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const [newAppointment] = await db.insert(appointments).values({
            customer,
            vehicle,
            date,
            serviceType,
            status: "Scheduled",
            createdAt: Date.now(), // Using timestamp as integer
        }).returning();

        return NextResponse.json({ data: newAppointment }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
