import { db } from "@/db";
import { testDrives, leads, user } from "@/db/schema";
import { eq, and, gte, lte, or } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const drives = await db.select({
            id: testDrives.id,
            customerName: testDrives.customerName,
            vehicle: testDrives.vehicle,
            date: testDrives.date,
            time: testDrives.time,
            duration: testDrives.duration,
            status: testDrives.status,
            notes: testDrives.notes,
            feedback: testDrives.feedback,
            rating: testDrives.rating,
            leadId: testDrives.leadId,
            leadName: leads.name,
            assignedToName: user.name,
            assignedToImage: user.image,
        })
            .from(testDrives)
            .leftJoin(leads, eq(testDrives.leadId, leads.id))
            .leftJoin(user, eq(testDrives.assignedTo, user.id))
            .orderBy(testDrives.date, testDrives.time);

        return NextResponse.json({ data: drives });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { leadId, vehicle, date, time, duration = 30, assignedTo, notes } = body;

        // Conflict Detection
        // Check if the same vehicle is booked at the same time
        // Simple check: exact date and time match for now. 
        // Ideally, we should check time ranges, but for MVP exact slot match is a good start.
        const existingDrive = await db.select().from(testDrives).where(
            and(
                eq(testDrives.vehicle, vehicle),
                eq(testDrives.date, date),
                eq(testDrives.time, time),
                or(
                    eq(testDrives.status, "Scheduled"),
                    eq(testDrives.status, "In Progress")
                )
            )
        ).limit(1);

        if (existingDrive.length > 0) {
            return NextResponse.json({
                error: "Vehicle Conflict",
                message: `The vehicle ${vehicle} is already booked for ${date} at ${time}.`
            }, { status: 409 });
        }

        // Fetch lead details to populate customerName if not provided
        let customerName = body.customerName;
        if (!customerName && leadId) {
            const lead = await db.query.leads.findFirst({
                where: eq(leads.id, leadId)
            });
            if (lead) customerName = lead.name;
        }

        const [newDrive] = await db.insert(testDrives).values({
            leadId: leadId ? Number(leadId) : null,
            customerName: customerName || "Walk-in Customer",
            vehicle,
            date,
            time,
            duration,
            assignedTo,
            status: "Scheduled",
            notes,
            createdAt: Date.now(),
        }).returning();

        return NextResponse.json({ data: newDrive });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
