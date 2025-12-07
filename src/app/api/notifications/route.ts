import { db } from "@/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch user's notifications
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const unreadOnly = url.searchParams.get('unread') === 'true';
        const limit = parseInt(url.searchParams.get('limit') || '20');

        let query = db.query.notifications.findMany({
            where: unreadOnly
                ? and(eq(notifications.userId, session.user.id), eq(notifications.read, false))
                : eq(notifications.userId, session.user.id),
            orderBy: [desc(notifications.createdAt)],
            limit,
        });

        const userNotifications = await query;

        // Get unread count
        const unreadCount = await db.query.notifications.findMany({
            where: and(eq(notifications.userId, session.user.id), eq(notifications.read, false)),
        });

        return NextResponse.json({
            data: userNotifications,
            unreadCount: unreadCount.length
        });
    } catch (error: any) {
        console.error("Notifications GET Error:", error);
        if (error.message?.includes("no such table")) {
            return NextResponse.json({ data: [], unreadCount: 0 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH: Mark notifications as read
export async function PATCH(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { ids, markAll } = body;

        if (markAll) {
            // Mark all user's notifications as read
            await db.update(notifications)
                .set({ read: true })
                .where(eq(notifications.userId, session.user.id));
        } else if (ids && Array.isArray(ids)) {
            // Mark specific notifications as read
            for (const id of ids) {
                await db.update(notifications)
                    .set({ read: true })
                    .where(and(
                        eq(notifications.id, id),
                        eq(notifications.userId, session.user.id)
                    ));
            }
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Notifications PATCH Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// DELETE: Delete notifications
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const id = url.searchParams.get('id');

        if (id) {
            await db.delete(notifications)
                .where(and(
                    eq(notifications.id, parseInt(id)),
                    eq(notifications.userId, session.user.id)
                ));
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Notifications DELETE Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
