import { db } from "@/db";
import { deliveries, bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { pdiStatus, checklist, feedback, handoverPhoto, status } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updateData: any = {};
        if (pdiStatus) updateData.pdiStatus = pdiStatus;
        if (checklist) updateData.checklist = checklist; // Expecting JSON string
        if (feedback) updateData.feedback = feedback;
        if (handoverPhoto) updateData.handoverPhoto = handoverPhoto;
        if (status) updateData.status = status;

        const [updatedDelivery] = await db.update(deliveries)
            .set(updateData)
            .where(eq(deliveries.id, Number(id)))
            .returning();

        if (!updatedDelivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        // If delivery is completed, update booking status too
        if (status === "Completed" && updatedDelivery.bookingId) {
            await db.update(bookings)
                .set({ status: "Delivered" })
                .where(eq(bookings.id, updatedDelivery.bookingId));
        }

        return NextResponse.json({ data: updatedDelivery });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
