import { db } from "@/db"
import { poshComplaints, employees } from "@/db/schema"
import { desc, eq } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// GET - List all POSH complaints (admin only)
export async function GET(req: NextRequest) {
    try {
        // Check if user is admin
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user || (session.user.role !== "admin" && session.user.role !== "hr")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        // Get all complaints for admin view
        const complaints = await db.query.poshComplaints.findMany({
            orderBy: [desc(poshComplaints.createdAt)]
        })

        // Transform data for display
        const data = complaints.map(c => ({
            id: c.id,
            complaintNo: c.complaintNo,
            type: `Against: ${c.respondentName}`,
            description: c.description,
            status: c.status,
            createdAt: c.createdAt,
            employeeName: c.complainantName,
            incidentDate: c.incidentDate,
            incidentLocation: c.incidentLocation
        }))

        return NextResponse.json({ data })
    } catch (error: any) {
        console.error("Error fetching POSH complaints:", error)
        // Return empty array if table doesn't exist
        if (error.message?.includes("no such table")) {
            return NextResponse.json({ data: [] })
        }
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
    }
}

// PUT - Update complaint status (admin only)
export async function PUT(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() })
        if (!session?.user || (session.user.role !== "admin" && session.user.role !== "hr")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const body = await req.json()
        const { complaintId, status, notes } = body

        if (!complaintId || !status) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        await db.update(poshComplaints)
            .set({
                status,
                ...(notes && { adminNotes: notes }),
                updatedAt: Date.now()
            })
            .where(eq(poshComplaints.id, complaintId))

        return NextResponse.json({ message: "Complaint updated" })
    } catch (error) {
        console.error("Error updating POSH complaint:", error)
        return NextResponse.json({ error: "Failed to update" }, { status: 500 })
    }
}
