import { NextResponse } from "next/server"
import { db } from "@/db"
import { invitation, user } from "@/db/schema"
import { eq } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function POST(req: Request) {
    const { token } = await req.json()

    if (!token) {
        return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const invite = await db.query.invitation.findFirst({
        where: eq(invitation.token, token),
    })

    if (!invite) {
        return NextResponse.json({ error: "Invalid invitation" }, { status: 404 })
    }

    // Get the currently logged in user (who just signed up)
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update user role
    await db.update(user)
        .set({ role: invite.role })
        .where(eq(user.id, session.user.id))

    // Update invitation status
    await db.update(invitation)
        .set({ status: "accepted" })
        .where(eq(invitation.id, invite.id))

    return NextResponse.json({ success: true })
}
