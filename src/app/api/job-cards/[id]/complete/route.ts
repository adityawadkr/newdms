import { db } from "@/db";
import { jobCards, spareParts, serviceHistory, appointments } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createNotification, notifyByRole, NotificationTemplates } from "@/lib/notifications";
import { logActivity } from "@/lib/activity";

interface PartUsed {
    partId: number;
    quantity: number;
    price: number;
    name: string;
}

// POST: Complete a job card - deducts spare parts, updates status, notifies
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
        const jobCardId = parseInt(id);
        const body = await req.json();
        const { laborCharges, notes } = body;

        // Get job card details
        const jobCard = await db.query.jobCards.findFirst({
            where: eq(jobCards.id, jobCardId)
        });

        if (!jobCard) {
            return NextResponse.json({ error: "Job card not found" }, { status: 404 });
        }

        if (jobCard.status === "Completed") {
            return NextResponse.json({ error: "Job card already completed" }, { status: 400 });
        }

        // Parse parts data
        let partsUsed: PartUsed[] = [];
        let partsTotal = 0;

        if (jobCard.partsData) {
            try {
                partsUsed = JSON.parse(jobCard.partsData);
                partsTotal = partsUsed.reduce((sum, p) => sum + (p.price * p.quantity), 0);
            } catch (e) {
                console.error("Failed to parse parts data:", e);
            }
        }

        // Calculate total
        const labor = laborCharges || jobCard.laborCharges || 0;
        const totalAmount = partsTotal + labor;

        // 1. Deduct parts from inventory
        const stockUpdates: { partId: number; newStock: number; partName: string }[] = [];

        for (const part of partsUsed) {
            const sparePart = await db.query.spareParts.findFirst({
                where: eq(spareParts.id, part.partId)
            });

            if (sparePart) {
                const newStock = Math.max(0, sparePart.stock - part.quantity);

                await db.update(spareParts)
                    .set({
                        stock: newStock,
                        updatedAt: new Date()
                    })
                    .where(eq(spareParts.id, part.partId));

                stockUpdates.push({
                    partId: part.partId,
                    newStock,
                    partName: sparePart.name
                });

                // Check if low stock - send notification
                if (newStock <= sparePart.reorderPoint) {
                    await notifyByRole('admin', {
                        ...NotificationTemplates.lowStock(sparePart.name, newStock, part.partId)
                    });
                }
            }
        }

        // 2. Update job card status to Completed
        await db.update(jobCards)
            .set({
                status: "Completed",
                laborCharges: labor,
                totalAmount,
                invoiceStatus: "Generated",
                notes: notes || jobCard.notes,
                completedAt: new Date(),
            })
            .where(eq(jobCards.id, jobCardId));

        // 3. Get appointment to find customer/vehicle info
        let customerName = "Customer";
        let vehicleInfo = "Vehicle";

        if (jobCard.appointmentId) {
            const appointment = await db.query.appointments.findFirst({
                where: eq(appointments.id, jobCard.appointmentId)
            });
            if (appointment) {
                customerName = appointment.customer;
                vehicleInfo = appointment.vehicle;

                // Add to service history
                await db.insert(serviceHistory).values({
                    customer: customerName,
                    vehicle: vehicleInfo,
                    jobNo: jobCard.jobNo,
                    date: new Date().toISOString().split('T')[0],
                    amount: String(totalAmount),
                    createdAt: Date.now(),
                });
            }
        }

        // 4. Log activity
        await logActivity({
            userId: session.user.id,
            userName: session.user.name || 'User',
            action: 'completed',
            entityType: 'job_card',
            entityId: jobCardId,
            entityName: jobCard.jobNo,
            details: {
                laborCharges: labor,
                partsTotal,
                totalAmount,
                partsDeducted: stockUpdates.length,
            }
        });

        // 5. Send notifications
        await notifyByRole('service', {
            ...NotificationTemplates.jobCardCompleted(jobCard.jobNo, jobCardId, vehicleInfo)
        });

        return NextResponse.json({
            success: true,
            message: "Job card completed successfully",
            data: {
                jobCardId,
                jobNo: jobCard.jobNo,
                laborCharges: labor,
                partsTotal,
                totalAmount,
                partsDeducted: stockUpdates,
            }
        });
    } catch (error: any) {
        console.error("Job Card Complete Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
