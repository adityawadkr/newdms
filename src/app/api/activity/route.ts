import { db } from "@/db";
import { activityLog } from "@/db/schema";
import { desc, like, or, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

// GET: Fetch activity logs with pagination and filtering
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const url = new URL(req.url);
        const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
        const offset = parseInt(url.searchParams.get('offset') || '0');
        const filter = url.searchParams.get('filter'); // entityType filter
        const search = url.searchParams.get('search'); // search query

        // Build query with filters
        let whereConditions: any[] = [];

        if (filter && filter !== 'all') {
            whereConditions.push(sql`${activityLog.entityType} = ${filter}`);
        }

        if (search) {
            whereConditions.push(
                or(
                    like(activityLog.entityName, `%${search}%`),
                    like(activityLog.userName, `%${search}%`),
                    like(activityLog.action, `%${search}%`)
                )
            );
        }

        // Get total count
        const countResult = await db
            .select({ count: sql<number>`count(*)` })
            .from(activityLog);
        const total = countResult[0]?.count || 0;

        // Get activities with pagination
        let query = db
            .select()
            .from(activityLog)
            .orderBy(desc(activityLog.createdAt))
            .limit(limit)
            .offset(offset);

        const activities = await query;

        // Format time ago
        const formatTimeAgo = (timestamp: Date | number) => {
            const now = Date.now();
            const time = typeof timestamp === 'number' ? timestamp * 1000 : new Date(timestamp).getTime();
            const diff = Math.floor((now - time) / 1000);

            if (diff < 60) return 'Just now';
            if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
            if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
            if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
            return new Date(time).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
        };

        // Format activities for frontend
        const formattedActivities = activities.map(activity => {
            // Parse details if available
            let details: any = {};
            try {
                details = activity.details ? JSON.parse(activity.details) : {};
            } catch (e) {
                details = {};
            }

            // Determine activity type for styling
            let type: 'info' | 'success' | 'alert' = 'info';
            if (['completed', 'approved', 'paid', 'delivered'].includes(activity.action)) {
                type = 'success';
            } else if (['deleted', 'cancelled', 'rejected'].includes(activity.action)) {
                type = 'alert';
            }

            // Build display message
            const actionLabels: Record<string, string> = {
                created: 'created',
                updated: 'updated',
                deleted: 'deleted',
                completed: 'completed',
                cancelled: 'cancelled',
                sent: 'sent',
                approved: 'approved',
                rejected: 'rejected',
                assigned: 'assigned to',
                converted: 'converted',
                reserved: 'reserved',
                booked: 'booked',
                delivered: 'delivered',
                paid: 'marked as paid',
            };

            const entityLabels: Record<string, string> = {
                lead: 'Lead',
                quotation: 'Quotation',
                booking: 'Booking',
                delivery: 'Delivery',
                appointment: 'Appointment',
                job_card: 'Job Card',
                vehicle: 'Vehicle',
                spare_part: 'Spare Part',
                employee: 'Employee',
                leave_request: 'Leave Request',
                payroll: 'Payroll',
                posh_complaint: 'POSH Complaint',
                user: 'User',
            };

            const actionText = actionLabels[activity.action] || activity.action;
            const entityText = entityLabels[activity.entityType] || activity.entityType;

            return {
                id: activity.id,
                title: `${entityText} ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
                message: activity.entityName
                    ? `${activity.entityName}${details.assignee ? ` - ${details.assignee}` : ''}`
                    : `${entityText} #${activity.entityId}`,
                time: formatTimeAgo(activity.createdAt),
                type,
                userName: activity.userName || 'System',
                action: activity.action,
                entityType: activity.entityType,
                entityId: activity.entityId,
                entityName: activity.entityName,
                details,
                createdAt: activity.createdAt,
            };
        });

        return NextResponse.json({
            data: formattedActivities,
            meta: {
                total,
                limit,
                offset,
                hasMore: offset + limit < total,
            }
        });
    } catch (error: any) {
        console.error("Activity GET Error:", error);
        if (error.message?.includes("no such table")) {
            return NextResponse.json({ data: [], meta: { total: 0, limit: 20, offset: 0, hasMore: false } });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
