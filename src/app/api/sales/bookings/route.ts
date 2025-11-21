import { db } from "@/db";
import { bookings, quotations, leads } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const allBookings = await db.select({
            id: bookings.id,
            customer: bookings.customer,
            vehicle: bookings.vehicle,
            quotationNo: bookings.quotationNo,
            bookingAmount: bookings.bookingAmount,
            paymentStatus: bookings.paymentStatus,
            paymentMode: bookings.paymentMode,
            deliveryDate: bookings.deliveryDate,
            status: bookings.status,
            createdAt: bookings.createdAt,
            leadId: bookings.leadId,
            quotationId: bookings.quotationId,
        })
            .from(bookings)
            .orderBy(desc(bookings.createdAt));

        return NextResponse.json({ data: allBookings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { leadId, quotationId, customer, vehicle, quotationNo, bookingAmount, paymentMode, deliveryDate } = body;

        if (!bookingAmount || bookingAmount <= 0) {
            return NextResponse.json({ error: "Invalid booking amount" }, { status: 400 });
        }

        const [newBooking] = await db.insert(bookings).values({
            leadId: leadId ? Number(leadId) : null,
            quotationId: quotationId ? Number(quotationId) : null,
            customer,
            vehicle,
            quotationNo: quotationNo || "DIRECT",
            bookingAmount: Number(bookingAmount),
            paymentStatus: "Pending", // Default to Pending until verified
            paymentMode,
            deliveryDate,
            status: "Confirmed",
            createdAt: Date.now(),
        }).returning();

        // If linked to a quotation, update its status to Accepted
        if (quotationId) {
            await db.update(quotations)
                .set({ status: "Accepted" })
                .where(eq(quotations.id, Number(quotationId)));
        }

        // If linked to a lead, update its status to Won
        if (leadId) {
            await db.update(leads)
                .set({ status: "Won" })
                .where(eq(leads.id, Number(leadId)));
        }

        return NextResponse.json({ data: newBooking });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
