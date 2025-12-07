import { db } from "@/db"
import { user, session, account } from "@/db/schema"
import { eq, desc } from "drizzle-orm"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

// GET - List pending approval users (admin only)
export async function GET(req: NextRequest) {
    try {
        // Check if user is admin
        const authSession = await auth.api.getSession({ headers: await headers() })
        if (!authSession?.user || authSession.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const users = await db.select({
            id: user.id,
            name: user.name,
            email: user.email,
            emailVerified: user.emailVerified,
            role: user.role,
            approved: user.approved,
            createdAt: user.createdAt,
        })
            .from(user)
            .orderBy(desc(user.createdAt))

        // Separate pending and approved
        const pending = users.filter(u => !u.approved)
        const approved = users.filter(u => u.approved)

        return NextResponse.json({
            pending,
            approved,
            stats: {
                total: users.length,
                pending: pending.length,
                approved: approved.length
            }
        })
    } catch (error) {
        console.error("Error fetching users:", error)
        return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
    }
}

// POST - Approve, reject, freeze or delete a user
export async function POST(req: NextRequest) {
    try {
        // Check if user is admin
        const authSession = await auth.api.getSession({ headers: await headers() })
        if (!authSession?.user || authSession.user.role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const body = await req.json()
        const { userId, action, role } = body // action: "approve" | "reject" | "freeze" | "delete"

        if (!userId || !action) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Prevent self-deletion
        if ((action === "reject" || action === "delete") && userId === authSession.user.id) {
            return NextResponse.json({ error: "Cannot delete yourself" }, { status: 400 })
        }

        if (action === "approve") {
            await db.update(user)
                .set({
                    approved: true,
                    role: role || "user",
                    updatedAt: new Date()
                })
                .where(eq(user.id, userId))

            return NextResponse.json({ message: "User approved" })
        } else if (action === "freeze") {
            // Freeze = set approved to false (revoke access)
            await db.update(user)
                .set({
                    approved: false,
                    updatedAt: new Date()
                })
                .where(eq(user.id, userId))

            // Also delete their sessions to log them out
            await db.delete(session).where(eq(session.userId, userId))

            return NextResponse.json({ message: "User frozen" })
        } else if (action === "reject" || action === "delete") {
            // Delete related records first to avoid foreign key issues
            try {
                await db.delete(session).where(eq(session.userId, userId))
            } catch (e) { /* ignore if no sessions */ }

            try {
                await db.delete(account).where(eq(account.userId, userId))
            } catch (e) { /* ignore if no accounts */ }

            // Now delete the user
            await db.delete(user).where(eq(user.id, userId))

            return NextResponse.json({ message: action === "reject" ? "User rejected and deleted" : "User deleted" })
        }

        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    } catch (error) {
        console.error("Error processing approval:", error)
        return NextResponse.json({ error: "Failed to process: " + (error as Error).message }, { status: 500 })
    }
}
