import { NextRequest, NextResponse } from "next/server"
import { db } from "@/db"
import { spareParts } from "@/db/schema"
import { desc, eq, like, or } from "drizzle-orm"

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams
        const query = searchParams.get("q")
        const category = searchParams.get("category")
        const lowStock = searchParams.get("lowStock") === "true"

        let dbQuery = db.select().from(spareParts).orderBy(desc(spareParts.createdAt))

        const data = await dbQuery

        let filtered = data

        if (query) {
            const lowerQuery = query.toLowerCase()
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerQuery) ||
                p.sku.toLowerCase().includes(lowerQuery)
            )
        }

        if (category && category !== "all") {
            filtered = filtered.filter(p => p.category === category)
        }

        if (lowStock) {
            filtered = filtered.filter(p => p.stock <= p.reorderPoint)
        }

        return NextResponse.json({ data: filtered })
    } catch (error) {
        console.error("Error fetching spare parts:", error)
        return NextResponse.json({ error: "Failed to fetch spare parts" }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()

        // Basic validation
        if (!body.sku || !body.name) {
            return NextResponse.json({ error: "SKU and Name are required" }, { status: 400 })
        }

        const newPart = await db.insert(spareParts).values({
            sku: body.sku,
            name: body.name,
            category: body.category || "General",
            stock: body.stock || 0,
            reorderPoint: body.reorderPoint || 5,
            location: body.location,
            costPrice: body.costPrice || 0,
            sellingPrice: body.sellingPrice || 0,
            supplier: body.supplier,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).returning()

        return NextResponse.json({ data: newPart[0] })
    } catch (error: any) {
        console.error("Error creating spare part:", error)
        if (error.message.includes("UNIQUE constraint failed")) {
            return NextResponse.json({ error: "SKU already exists" }, { status: 400 })
        }
        return NextResponse.json({ error: "Failed to create spare part" }, { status: 500 })
    }
}
