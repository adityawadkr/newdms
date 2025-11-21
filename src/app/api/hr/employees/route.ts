import { db } from "@/db"
import { employees } from "@/db/schema"
import { desc, eq, like, or } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("q")
        const department = searchParams.get("department")
        const status = searchParams.get("status")

        let whereClause = undefined

        if (query) {
            whereClause = or(
                like(employees.firstName, `%${query}%`),
                like(employees.lastName, `%${query}%`),
                like(employees.email, `%${query}%`)
            )
        }

        // Note: Drizzle's simple query builder doesn't support complex dynamic filtering easily without raw SQL or helper functions,
        // so for now we'll filter by query if present, or just return all. 
        // For a production app, we'd build a proper dynamic where clause array.

        const data = await db.select().from(employees).orderBy(desc(employees.createdAt))

        // In-memory filtering for simplicity with multiple optional filters if needed, 
        // or we can enhance the query builder usage.
        let filtered = data
        if (query) {
            const lowerQuery = query.toLowerCase()
            filtered = filtered.filter(e =>
                e.firstName.toLowerCase().includes(lowerQuery) ||
                e.lastName.toLowerCase().includes(lowerQuery) ||
                e.email.toLowerCase().includes(lowerQuery)
            )
        }
        if (department && department !== "All") {
            filtered = filtered.filter(e => e.department === department)
        }
        if (status && status !== "All") {
            filtered = filtered.filter(e => e.status === status)
        }

        return NextResponse.json({ data: filtered })
    } catch (error) {
        console.error("Error fetching employees:", error)
        return NextResponse.json({ error: "Failed to fetch employees" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Basic validation
        if (!body.firstName || !body.lastName || !body.email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        const newEmployee = await db.insert(employees).values({
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            phone: body.phone || "",
            designation: body.designation || "Employee",
            department: body.department || "General",
            joiningDate: body.joiningDate || new Date().toISOString().split('T')[0],
            salary: body.salary || 0,
            status: body.status || "Active",
            createdAt: new Date(),
        }).returning()

        return NextResponse.json({ data: newEmployee[0] })
    } catch (error) {
        console.error("Error creating employee:", error)
        return NextResponse.json({ error: "Failed to create employee" }, { status: 500 })
    }
}
