import { db } from "@/db"
import { attendance, employees } from "@/db/schema"
import { and, desc, eq, gte, lte } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const employeeId = searchParams.get("employeeId")
        const date = searchParams.get("date")
        const startDate = searchParams.get("startDate")
        const endDate = searchParams.get("endDate")

        let query = db.select({
            id: attendance.id,
            employeeId: attendance.employeeId,
            date: attendance.date,
            checkIn: attendance.checkIn,
            checkOut: attendance.checkOut,
            status: attendance.status,
            employeeName: employees.firstName, // We might want to join to get name
        })
            .from(attendance)
            .leftJoin(employees, eq(attendance.employeeId, employees.id))
            .orderBy(desc(attendance.date))

        // Note: Drizzle query building with dynamic where clauses is a bit verbose.
        // For now, we'll fetch and filter or use basic conditions if simple.
        // Let's try to construct a basic where clause if possible, or just filter in memory for MVP scale.

        const data = await query

        let filtered = data.map(d => ({
            ...d,
            employeeName: d.employeeName ? d.employeeName : "Unknown"
        }))

        if (employeeId) {
            filtered = filtered.filter(a => a.employeeId === parseInt(employeeId))
        }
        if (date) {
            filtered = filtered.filter(a => a.date === date)
        }
        if (startDate && endDate) {
            filtered = filtered.filter(a => a.date >= startDate && a.date <= endDate)
        }

        return NextResponse.json({ data: filtered })
    } catch (error) {
        console.error("Error fetching attendance:", error)
        return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { employeeId, action, time, date } = body // action: "check-in" | "check-out"

        if (!employeeId || !action || !date) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Check if record exists for this day
        const existingRecord = await db.select().from(attendance)
            .where(and(eq(attendance.employeeId, employeeId), eq(attendance.date, date)))
            .get()

        if (action === "check-in") {
            if (existingRecord) {
                return NextResponse.json({ error: "Already checked in for today" }, { status: 400 })
            }

            // Determine status based on time (e.g., after 10:00 AM is Late)
            let status = "Present"
            if (time > "10:00") status = "Late"

            const newRecord = await db.insert(attendance).values({
                employeeId,
                date,
                checkIn: time,
                status,
                createdAt: new Date(),
            }).returning()

            return NextResponse.json({ data: newRecord[0] })
        } else if (action === "check-out") {
            if (!existingRecord) {
                return NextResponse.json({ error: "Cannot check out without checking in" }, { status: 400 })
            }

            const updatedRecord = await db.update(attendance)
                .set({ checkOut: time })
                .where(eq(attendance.id, existingRecord.id))
                .returning()

            return NextResponse.json({ data: updatedRecord[0] })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Error updating attendance:", error)
        return NextResponse.json({ error: "Failed to update attendance" }, { status: 500 })
    }
}
