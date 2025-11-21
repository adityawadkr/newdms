import { db } from "@/db";
import { deliveries, bookings } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const allDeliveries = await db.select({
            id: deliveries.id,
            bookingId: deliveries.bookingId,
            pdiStatus: deliveries.pdiStatus,
            checklist: deliveries.checklist,
            feedback: deliveries.feedback,
            handoverPhoto: deliveries.handoverPhoto,
            status: deliveries.status,
            deliveryDate: deliveries.deliveryDate,
            customer: bookings.customer,
            vehicle: bookings.vehicle,
        })
            .from(deliveries)
            .leftJoin(bookings, eq(deliveries.bookingId, bookings.id))
            .orderBy(desc(deliveries.deliveryDate));

        return NextResponse.json({ data: allDeliveries });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { bookingId, deliveryDate } = body;

        if (!bookingId) {
            return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
        }

        const [newDelivery] = await db.insert(deliveries).values({
            bookingId: Number(bookingId),
            deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
            status: "Scheduled",
            pdiStatus: "Pending",
            createdAt: Date.now(),
        }).returning();

        return NextResponse.json({ data: newDelivery });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
