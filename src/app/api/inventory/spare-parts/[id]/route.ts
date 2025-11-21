import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { spareParts } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params
        const body = await req.json()

        const updatedPart = await db.update(spareParts)
            .set({
                ...body,
                updatedAt: new Date(),
            })
            .where(eq(spareParts.id, parseInt(id)))
            .returning()

        if (!updatedPart.length) {
            return NextResponse.json({ error: "Part not found" }, { status: 404 })
        }

        return NextResponse.json({ data: updatedPart[0] })
    } catch (error) {
        console.error("Error updating spare part:", error)
        return NextResponse.json({ error: "Failed to update spare part" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params

        await db.delete(spareParts).where(eq(spareParts.id, parseInt(id)))

        return NextResponse.json({ message: "Part deleted" })
    } catch (error) {
        console.error("Error deleting spare part:", error)
        return NextResponse.json({ error: "Failed to delete spare part" }, { status: 500 })
    }
}
