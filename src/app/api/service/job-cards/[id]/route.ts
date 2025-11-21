import { db } from "@/db";
import { jobCards, appointments, spareParts } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, partsUsed, notes, partsData, laborCharges, totalAmount, invoiceStatus } = body;

        const updateData: any = {
            status,
            partsUsed, // Legacy
            notes,
            partsData: partsData ? JSON.stringify(partsData) : undefined,
            laborCharges,
            totalAmount,
            invoiceStatus,
        };

        if (status === "Completed") {
            updateData.completedAt = new Date();
        }

        const [updatedJobCard] = await db.update(jobCards)
            .set(updateData)
            .where(eq(jobCards.id, Number(id)))
            .returning();

        if (!updatedJobCard) {
            return NextResponse.json({ error: "Job card not found" }, { status: 404 });
        }

        // If job card is completed, update appointment status and deduct stock
        if (status === "Completed") {
            if (updatedJobCard.appointmentId) {
                await db.update(appointments)
                    .set({ status: "Completed" })
                    .where(eq(appointments.id, updatedJobCard.appointmentId));
            }

            // Deduct stock
            if (partsData && Array.isArray(partsData)) {
                for (const part of partsData) {
                    if (part.partId && part.quantity) {
                        await db.update(spareParts)
                            .set({
                                stock: sql`${spareParts.stock} - ${part.quantity}`,
                                updatedAt: new Date()
                            })
                            .where(eq(spareParts.id, part.partId));
                    }
                }
            }
        }

        return NextResponse.json({ data: updatedJobCard });
    } catch (error: any) {
        console.error("Error updating job card:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
