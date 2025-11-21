import { db } from "@/db"
import { employees } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params
        const id = parseInt(idStr)
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

        const employee = await db.select().from(employees).where(eq(employees.id, id)).get()

        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 })
        }

        return NextResponse.json({ data: employee })
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch employee" }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params
        const id = parseInt(idStr)
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

        const body = await req.json()

        const updated = await db.update(employees).set({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone,
            designation: body.designation,
            department: body.department,
            joiningDate: body.joiningDate,
            salary: body.salary,
            status: body.status,
        }).where(eq(employees.id, id)).returning()

        return NextResponse.json({ data: updated[0] })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update employee" }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params
        const id = parseInt(idStr)
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

        // Instead of hard delete, we might want to just set status to Inactive, 
        // but for now let's support delete or soft delete.
        // Let's do a soft delete by setting status to Inactive for safety, 
        // or actually delete if requested. Let's stick to actual delete for this CRUD,
        // but in a real HR app we'd archive.

        await db.delete(employees).where(eq(employees.id, id))

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete employee" }, { status: 500 })
    }
}
