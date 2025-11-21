import { db } from "@/db";
import { leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, nextAction, nextActionDate, financeStatus, lostReason, assignedTo } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updateData: any = {};

        if (status) updateData.status = status;
        if (nextAction) updateData.nextAction = nextAction;
        if (nextActionDate) updateData.nextActionDate = nextActionDate;
        if (financeStatus !== undefined) updateData.financeStatus = financeStatus;
        if (lostReason) updateData.lostReason = lostReason;
        if (assignedTo) updateData.assignedTo = assignedTo;

        const [updatedLead] = await db.update(leads)
            .set(updateData)
            .where(eq(leads.id, Number(id)))
            .returning();

        if (!updatedLead) {
            return NextResponse.json({ error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedLead });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.delete(leads).where(eq(leads.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
