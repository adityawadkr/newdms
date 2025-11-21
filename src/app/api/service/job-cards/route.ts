import { db } from "@/db";
import { jobCards, appointments } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const technician = searchParams.get("technician");

        let query = db.select().from(jobCards).orderBy(desc(jobCards.createdAt));

        if (status && status !== "all") {
            // @ts-ignore
            query = query.where(eq(jobCards.status, status));
        }

        // Note: In a real app, we'd filter by technician ID, but schema uses name currently
        if (technician) {
            // @ts-ignore
            query = query.where(eq(jobCards.technician, technician));
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
        const { appointmentId, technician, notes } = body;

        if (!appointmentId || !technician) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Generate a Job No (e.g., JOB-1234)
        const jobNo = `JOB-${nanoid(6).toUpperCase()}`;

        const [newJobCard] = await db.insert(jobCards).values({
            jobNo,
            appointmentId,
            technician,
            notes: notes || "",
            status: "In Progress",
            createdAt: Date.now(),
        }).returning();

        // Update appointment status
        await db.update(appointments)
            .set({ status: "In Progress" })
            .where(eq(appointments.id, appointmentId));

        return NextResponse.json({ data: newJobCard }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
