import { db } from "@/db"
import { payroll, employees } from "@/db/schema"
import { eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

// GET single payroll record
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const record = await db.select({
            id: payroll.id,
            employeeId: payroll.employeeId,
            month: payroll.month,
            basicSalary: payroll.basicSalary,
            allowances: payroll.allowances,
            deductions: payroll.deductions,
            netSalary: payroll.netSalary,
            status: payroll.status,
            paymentDate: payroll.paymentDate,
            employeeName: employees.firstName,
            employeeLastName: employees.lastName,
            email: employees.email,
        })
            .from(payroll)
            .leftJoin(employees, eq(payroll.employeeId, employees.id))
            .where(eq(payroll.id, parseInt(id)))
            .get()

        if (!record) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 })
        }

        return NextResponse.json({
            data: {
                ...record,
                employeeName: `${record.employeeName} ${record.employeeLastName}`
            }
        })
    } catch (error) {
        console.error("Error fetching payroll:", error)
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
    }
}

// PUT - Update payroll (mark as paid)
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()
        const { status } = body

        // Find existing record
        const existing = await db.select().from(payroll).where(eq(payroll.id, parseInt(id))).get()
        if (!existing) {
            return NextResponse.json({ error: "Record not found" }, { status: 404 })
        }

        // Update the record
        const updateData: Record<string, unknown> = {}

        if (status) {
            updateData.status = status
            if (status === "Paid") {
                updateData.paymentDate = new Date()
            }
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: "No update data provided" }, { status: 400 })
        }

        await db.update(payroll)
            .set(updateData)
            .where(eq(payroll.id, parseInt(id)))

        const updated = await db.select().from(payroll).where(eq(payroll.id, parseInt(id))).get()

        return NextResponse.json({ data: updated, message: "Payroll updated" })
    } catch (error) {
        console.error("Error updating payroll:", error)
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }
}

// DELETE payroll record
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        await db.delete(payroll).where(eq(payroll.id, parseInt(id)))
        return NextResponse.json({ message: "Deleted" })
    } catch (error) {
        console.error("Error deleting payroll:", error)
        return NextResponse.json({ error: "Failed to delete" }, { status: 500 })
    }
}
