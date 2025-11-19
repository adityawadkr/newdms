import { NextResponse } from "next/server"
import { db } from "@/db"
import { user, vehicle } from "@/db/schema"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { count, lt, desc } from "drizzle-orm"

export async function GET() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    try {
        // 1. Total Users
        const userCountResult = await db.select({ value: count() }).from(user)
        const totalUsers = userCountResult[0].value

        // 2. Total Vehicles
        const vehicleCountResult = await db.select({ value: count() }).from(vehicle)
        const totalVehicles = vehicleCountResult[0].value

        // 3. Low Stock Vehicles (stock < reorderPoint)
        const lowStockResult = await db.select({ value: count() })
            .from(vehicle)
            .where(lt(vehicle.stock, vehicle.reorderPoint))
        const lowStockVehicles = lowStockResult[0].value

        // 4. Recent Vehicles (limit 5)
        const recentVehicles = await db.select()
            .from(vehicle)
            .orderBy(desc(vehicle.createdAt))
            .limit(5)

        return NextResponse.json({
            totalUsers,
            totalVehicles,
            lowStockVehicles,
            recentVehicles
        })
    } catch (error: any) {
        console.error("Dashboard stats error:", error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
