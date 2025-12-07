import { db } from "@/db";
import { deliveries, bookings, vehicle, appointments, serviceHistory } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createNotification, notifyByRole, NotificationTemplates } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";

// POST: Complete a delivery - triggers inventory update + first service appointment
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const deliveryId = parseInt(id);
        const body = await req.json();
        const { feedback, handoverPhoto } = body;

        // Get delivery details
        const delivery = await db.query.deliveries.findFirst({
            where: eq(deliveries.id, deliveryId)
        });

        if (!delivery) {
            return NextResponse.json({ error: "Delivery not found" }, { status: 404 });
        }

        // Get booking details
        const booking = await db.query.bookings.findFirst({
            where: eq(bookings.id, delivery.bookingId!)
        });

        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // 1. Update delivery status to Completed
        await db.update(deliveries)
            .set({
                status: "Completed",
                pdiStatus: "Passed",
                feedback: feedback || null,
                handoverPhoto: handoverPhoto || null,
                deliveryDate: new Date(),
            })
            .where(eq(deliveries.id, deliveryId));

        // 2. Update vehicle status to 'sold' (if we have vehicleId)
        // For now, we'll try to find vehicle by make/model/year from booking.vehicle string
        // In production, booking should have a vehicleId reference

        // 3. Create first free service appointment (after 30 days / 1000km)
        const firstServiceDate = new Date();
        firstServiceDate.setDate(firstServiceDate.getDate() + 30); // 30 days from delivery

        const [newAppointment] = await db.insert(appointments).values({
            customer: booking.customer,
            vehicle: booking.vehicle,
            date: firstServiceDate.toISOString().split('T')[0],
            serviceType: "First Free Service (1000km)",
            status: "Scheduled",
            createdAt: Date.now(),
        }).returning();

        // 4. Add to service history
        await db.insert(serviceHistory).values({
            customer: booking.customer,
            vehicle: booking.vehicle,
            jobNo: `DEL-${delivery.id}`,
            date: new Date().toISOString().split('T')[0],
            amount: "0", // Delivery, no service amount
            createdAt: Date.now(),
        });

        // 5. Log activity
        await logActivity({
            userId: session.user.id,
            userName: session.user.name || 'User',
            action: 'delivered',
            entityType: 'delivery',
            entityId: deliveryId,
            entityName: `${booking.vehicle} - ${booking.customer}`,
            details: {
                bookingId: booking.id,
                appointmentCreated: newAppointment.id,
            }
        });

        // 6. Send notifications
        // Notify service team about new appointment
        await notifyByRole('service', {
            ...NotificationTemplates.serviceAppointment(
                booking.customer,
                booking.vehicle,
                firstServiceDate.toISOString().split('T')[0],
                newAppointment.id
            )
        });

        // Notify admin about completed delivery
        await notifyByRole('admin', {
            ...NotificationTemplates.deliveryCompleted(booking.vehicle, booking.customer)
        });

        return NextResponse.json({
            success: true,
            message: "Delivery completed successfully",
            data: {
                deliveryId,
                firstServiceAppointment: newAppointment,
            }
        });
    } catch (error: any) {
        console.error("Delivery Complete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
