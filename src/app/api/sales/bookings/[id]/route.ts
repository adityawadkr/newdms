import { db } from "@/db";
import { bookings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { paymentStatus, deliveryDate, status, receiptUrl } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updateData: any = {};
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
        if (deliveryDate) updateData.deliveryDate = deliveryDate;
        if (status) updateData.status = status;
        if (receiptUrl) updateData.receiptUrl = receiptUrl;

        const [updatedBooking] = await db.update(bookings)
            .set(updateData)
            .where(eq(bookings.id, Number(id)))
            .returning();

        if (!updatedBooking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedBooking });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.delete(bookings).where(eq(bookings.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
