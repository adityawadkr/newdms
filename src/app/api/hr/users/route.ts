import { NextResponse } from "next/server"
import { db } from "@/db"
import { user } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || (session.user.role !== "admin" && session.user.role !== "guest_admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const users = await db.select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
    }).from(user)

    return NextResponse.json({ users })
}
