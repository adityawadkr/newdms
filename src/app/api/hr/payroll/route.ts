import { db } from "@/db"
import { employees, payroll } from "@/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const employeeId = searchParams.get("employeeId")
        const month = searchParams.get("month") // e.g., "2023-10"

        let query = db.select({
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
        })
            .from(payroll)
            .leftJoin(employees, eq(payroll.employeeId, employees.id))
            .orderBy(desc(payroll.month))

        const data = await query

        let filtered = data.map(d => ({
            ...d,
            employeeName: d.employeeName ? `${d.employeeName} ${d.employeeLastName}` : "Unknown"
        }))

        if (employeeId) {
            filtered = filtered.filter(p => p.employeeId === parseInt(employeeId))
        }
        if (month) {
            filtered = filtered.filter(p => p.month === month)
        }

        return NextResponse.json({ data: filtered })
    } catch (error) {
        console.error("Error fetching payroll:", error)
        return NextResponse.json({ error: "Failed to fetch payroll" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { month } = body // "2023-10"

        if (!month) {
            return NextResponse.json({ error: "Month is required" }, { status: 400 })
        }

        // 1. Get all active employees
        const activeEmployees = await db.select().from(employees).where(eq(employees.status, "Active"))

        const generatedPayroll = []

        // 2. Generate payroll for each employee
        for (const employee of activeEmployees) {
            // Check if already generated
            const existing = await db.select().from(payroll)
                .where(and(eq(payroll.employeeId, employee.id), eq(payroll.month, month)))
                .get()

            if (existing) continue

            // Simple calculation logic (can be enhanced)
            const basicSalary = employee.salary
            const allowances = Math.round(basicSalary * 0.2) // 20% allowances
            const deductions = Math.round(basicSalary * 0.1) // 10% deductions (PF, Tax)
            const netSalary = basicSalary + allowances - deductions

            const newPayroll = await db.insert(payroll).values({
                employeeId: employee.id,
                month,
                basicSalary,
                allowances,
                deductions,
                netSalary,
                status: "Pending",
                createdAt: new Date(),
            }).returning()

            generatedPayroll.push(newPayroll[0])
        }

        return NextResponse.json({
            message: `Generated payroll for ${generatedPayroll.length} employees`,
            data: generatedPayroll
        })
    } catch (error) {
        console.error("Error generating payroll:", error)
        return NextResponse.json({ error: "Failed to generate payroll" }, { status: 500 })
    }
}
