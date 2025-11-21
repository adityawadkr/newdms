import { db } from "@/db"
import { employees, leaveRequests } from "@/db/schema"
import { eq, sql } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id: idStr } = await params
        const id = parseInt(idStr)
        if (isNaN(id)) return NextResponse.json({ error: "Invalid ID" }, { status: 400 })

        const body = await req.json()
        const { status } = body // Approved, Rejected

        if (!status) {
            return NextResponse.json({ error: "Status is required" }, { status: 400 })
        }

        const leaveRequest = await db.select().from(leaveRequests).where(eq(leaveRequests.id, id)).get()
        if (!leaveRequest) {
            return NextResponse.json({ error: "Leave request not found" }, { status: 404 })
        }

        // If approving, deduct balance
        if (status === "Approved" && leaveRequest.status !== "Approved") {
            const days = Math.ceil((new Date(leaveRequest.endDate).getTime() - new Date(leaveRequest.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

            if (leaveRequest.employeeId) {
                if (leaveRequest.type === "Sick") {
                    await db.update(employees).set({ sickLeaveBalance: sql`${employees.sickLeaveBalance} - ${days}` }).where(eq(employees.id, leaveRequest.employeeId))
                } else if (leaveRequest.type === "Casual") {
                    await db.update(employees).set({ casualLeaveBalance: sql`${employees.casualLeaveBalance} - ${days}` }).where(eq(employees.id, leaveRequest.employeeId))
                } else if (leaveRequest.type === "Earned") {
                    await db.update(employees).set({ earnedLeaveBalance: sql`${employees.earnedLeaveBalance} - ${days}` }).where(eq(employees.id, leaveRequest.employeeId))
                }
            }
        }

        const updated = await db.update(leaveRequests)
            .set({ status })
            .where(eq(leaveRequests.id, id))
            .returning()

        return NextResponse.json({ data: updated[0] })
    } catch (error) {
        console.error("Error updating leave request:", error)
        return NextResponse.json({ error: "Failed to update leave request" }, { status: 500 })
    }
}
