import { NextResponse } from "next/server"
import { db } from "@/db"
import { invitation } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { nanoid } from "nanoid"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || (session.user.role !== "admin" && session.user.role !== "guest_admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitations = await db.select().from(invitation)

    return NextResponse.json({ invitations })
}

export async function POST(req: Request) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session || session.user.role !== "admin") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, role } = await req.json()

    if (!email || !role) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 })
    }

    const token = nanoid(32)
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    try {
        await db.insert(invitation).values({
            id: nanoid(),
            email,
            role,
            token,
            expiresAt,
            inviterId: session.user.id,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        // Send email
        // Determine base URL from headers to ensure correct domain in production
        const host = req.headers.get("host")
        const protocol = req.headers.get("x-forwarded-proto") || "https"
        const baseUrl = `${protocol}://${host}`
        const inviteLink = `${baseUrl}/register?token=${token}`

        await transporter.sendMail({
            from: process.env.EMAIL_FROM || "noreply@example.com",
            to: email,
            subject: "You have been invited to join Dealership DMS",
            html: `
        <p>Hello,</p>
        <p>You have been invited to join the Dealership DMS as a <strong>${role}</strong>.</p>
        <p>Click the link below to accept the invitation and set up your account:</p>
        <a href="${inviteLink}">${inviteLink}</a>
        <p>This link expires in 7 days.</p>
      `,
        })

        return NextResponse.json({ success: true })
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
