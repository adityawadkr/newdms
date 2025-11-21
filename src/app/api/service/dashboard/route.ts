import { db } from "@/db";
import { jobCards, appointments } from "@/db/schema";
import { sql, eq, and, desc, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const today = new Date().toISOString().split('T')[0];
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);

        // 1. Appointments Today
        const appointmentsToday = await db.select({ count: sql<number>`count(*)` })
            .from(appointments)
            .where(eq(appointments.date, today));

        // 2. Vehicles in Service (In Progress)
        const inService = await db.select({ count: sql<number>`count(*)` })
            .from(jobCards)
            .where(eq(jobCards.status, "In Progress"));

        // 3. Revenue this Month
        const revenue = await db.select({ total: sql<number>`sum(${jobCards.totalAmount})` })
            .from(jobCards)
            .where(and(
                eq(jobCards.status, "Completed"),
                gte(jobCards.completedAt, startOfMonth),
                lte(jobCards.completedAt, endOfMonth)
            ));

        // 4. Recent Activity (Last 5 Job Cards)
        const recentJobs = await db.select()
            .from(jobCards)
            .orderBy(desc(jobCards.createdAt))
            .limit(5);

        // 5. Service Type Distribution (from Appointments)
        const serviceTypes = await db.select({
            type: appointments.serviceType,
            count: sql<number>`count(*)`
        })
            .from(appointments)
            .groupBy(appointments.serviceType);

        return NextResponse.json({
            data: {
                appointmentsToday: appointmentsToday[0].count,
                inService: inService[0].count,
                revenue: revenue[0].total || 0,
                recentJobs,
                serviceTypes
            }
        });
    } catch (error: any) {
        console.error("Error fetching service dashboard:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
