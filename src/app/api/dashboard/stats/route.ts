import { db } from "@/db";
import { user, vehicle } from "@/db/schema";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [userCount] = await db.select({ count: count() }).from(user);
        const [vehicleCount] = await db.select({ count: count() }).from(vehicle);
        const [inStockCount] = await db.select({ count: count() }).from(vehicle).where(eq(vehicle.status, "in_stock"));

        return NextResponse.json({
            users: userCount?.count || 0,
            inventory: vehicleCount?.count || 0,
            inStock: inStockCount?.count || 0,
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
