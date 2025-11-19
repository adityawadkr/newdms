import { NextResponse } from "next/server"
import { db } from "@/db"
import { invitation } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get("token")

    if (!token) {
        return NextResponse.json({ error: "Token required" }, { status: 400 })
    }

    const invite = await db.query.invitation.findFirst({
        where: eq(invitation.token, token),
    })

    if (!invite) {
        return NextResponse.json({ error: "Invalid invitation" }, { status: 404 })
    }

    if (invite.expiresAt < new Date()) {
        return NextResponse.json({ error: "Invitation expired" }, { status: 400 })
    }

    if (invite.status === "accepted") {
        return NextResponse.json({ error: "Invitation already accepted" }, { status: 400 })
    }

    return NextResponse.json({ email: invite.email, role: invite.role })
}
