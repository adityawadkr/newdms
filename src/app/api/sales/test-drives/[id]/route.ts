import { db } from "@/db";
import { testDrives } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { status, notes, feedback, rating } = body;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const updateData: any = {};
        if (status) updateData.status = status;
        if (notes) updateData.notes = notes;
        if (feedback) updateData.feedback = feedback;
        if (rating) updateData.rating = rating;

        const [updatedDrive] = await db.update(testDrives)
            .set(updateData)
            .where(eq(testDrives.id, Number(id)))
            .returning();

        if (!updatedDrive) {
            return NextResponse.json({ error: "Test Drive not found" }, { status: 404 });
        }

        return NextResponse.json({ data: updatedDrive });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await db.delete(testDrives).where(eq(testDrives.id, Number(id)));
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
