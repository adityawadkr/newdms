import { db } from "@/db";
import { quotations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const {
            status, pdfUrl, validUntil,
            model, variant, color, exShowroomPrice, registrationAmount,
            insuranceAmount, insuranceType, accessoriesAmount, accessoriesData,
            discountAmount, approvalStatus, total, subtotal, tax, lineItems
        } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (pdfUrl) updateData.pdfUrl = pdfUrl;
        if (validUntil) updateData.validUntil = validUntil;

        // New Fields
        if (model) updateData.model = model;
        if (variant) updateData.variant = variant;
        if (color) updateData.color = color;
        if (exShowroomPrice !== undefined) updateData.exShowroomPrice = exShowroomPrice;
        if (registrationAmount !== undefined) updateData.registrationAmount = registrationAmount;
        if (insuranceAmount !== undefined) updateData.insuranceAmount = insuranceAmount;
        if (insuranceType) updateData.insuranceType = insuranceType;
        if (accessoriesAmount !== undefined) updateData.accessoriesAmount = accessoriesAmount;
        if (accessoriesData) updateData.accessoriesData = JSON.stringify(accessoriesData);
        if (discountAmount !== undefined) updateData.discountAmount = discountAmount;
        if (approvalStatus) updateData.approvalStatus = approvalStatus;

        // Allow updating totals if recalculated
        if (total !== undefined) updateData.total = total;
        if (subtotal !== undefined) updateData.subtotal = subtotal;
        if (tax !== undefined) updateData.tax = tax;
        if (lineItems) updateData.lineItems = typeof lineItems === 'string' ? lineItems : JSON.stringify(lineItems);

        const [updatedQuotation] = await db.update(quotations)
            .set(updateData)
            .where(eq(quotations.id, Number(id)))
            .returning();

        if (!updatedQuotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedQuotation });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.delete(quotations).where(eq(quotations.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
