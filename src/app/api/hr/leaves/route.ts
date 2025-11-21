import { db } from "@/db"
import { employees, leaveRequests } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const employeeId = searchParams.get("employeeId")
        const status = searchParams.get("status")

        let query = db.select({
            id: leaveRequests.id,
            employeeId: leaveRequests.employeeId,
            type: leaveRequests.type,
            startDate: leaveRequests.startDate,
            endDate: leaveRequests.endDate,
            reason: leaveRequests.reason,
            status: leaveRequests.status,
            employeeName: employees.firstName,
            employeeLastName: employees.lastName,
        })
            .from(leaveRequests)
            .leftJoin(employees, eq(leaveRequests.employeeId, employees.id))
            .orderBy(desc(leaveRequests.createdAt))

        const data = await query

        let filtered = data.map(d => ({
            ...d,
            employeeName: d.employeeName ? `${d.employeeName} ${d.employeeLastName}` : "Unknown"
        }))

        if (employeeId) {
            filtered = filtered.filter(l => l.employeeId === parseInt(employeeId))
        }
        if (status && status !== "All") {
            filtered = filtered.filter(l => l.status === status)
        }

        return NextResponse.json({ data: filtered })
    } catch (error) {
        console.error("Error fetching leaves:", error)
        return NextResponse.json({ error: "Failed to fetch leaves" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { employeeId, type, startDate, endDate, reason } = body

        if (!employeeId || !type || !startDate || !endDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check balance
        const employee = await db.select().from(employees).where(eq(employees.id, employeeId)).get()
        if (!employee) {
            return NextResponse.json({ error: "Employee not found" }, { status: 404 })
        }

        const daysRequested = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1

        let hasBalance = false
        if (type === "Sick" && employee.sickLeaveBalance >= daysRequested) hasBalance = true
        if (type === "Casual" && employee.casualLeaveBalance >= daysRequested) hasBalance = true
        if (type === "Earned" && employee.earnedLeaveBalance >= daysRequested) hasBalance = true

        if (!hasBalance) {
            return NextResponse.json({ error: `Insufficient ${type} Leave Balance` }, { status: 400 })
        }

        const newLeave = await db.insert(leaveRequests).values({
            employeeId,
            type,
            startDate,
            endDate,
            reason: reason || "",
            status: "Pending",
            createdAt: new Date(),
        }).returning()

        return NextResponse.json({ data: newLeave[0] })
    } catch (error) {
        console.error("Error creating leave request:", error)
        return NextResponse.json({ error: "Failed to create leave request" }, { status: 500 })
    }
}
