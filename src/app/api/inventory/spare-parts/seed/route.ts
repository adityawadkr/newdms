import { NextResponse } from "next/server"
import { db } from "@/db"
import { spareParts } from "@/db/schema"

const SAMPLE_PARTS = [
    { sku: "OIL-FLTR-001", name: "Oil Filter", category: "Engine", stock: 12, reorderPoint: 8, location: "Shelf A-1", costPrice: 150, sellingPrice: 350, supplier: "Bosch" },
    { sku: "BRK-PAD-SET02", name: "Brake Pads Set", category: "Brakes", stock: 5, reorderPoint: 10, location: "Shelf B-3", costPrice: 1200, sellingPrice: 2500, supplier: "Brembo" },
    { sku: "BAT-12V-AGM", name: "12V AGM Battery", category: "Electrical", stock: 3, reorderPoint: 5, location: "Floor Area", costPrice: 4500, sellingPrice: 6500, supplier: "Exide" },
    { sku: "SPK-PLG-NGK", name: "Spark Plug", category: "Engine", stock: 40, reorderPoint: 20, location: "Shelf A-2", costPrice: 80, sellingPrice: 200, supplier: "NGK" },
    { sku: "AIR-FLTR-005", name: "Air Filter", category: "Engine", stock: 15, reorderPoint: 10, location: "Shelf A-1", costPrice: 250, sellingPrice: 600, supplier: "Bosch" },
    { sku: "WPR-BLD-22", name: "Wiper Blade 22\"", category: "Exterior", stock: 25, reorderPoint: 10, location: "Shelf C-1", costPrice: 180, sellingPrice: 450, supplier: "Bosch" },
    { sku: "HDLGHT-LED", name: "LED Headlight Bulb", category: "Lighting", stock: 8, reorderPoint: 5, location: "Shelf C-2", costPrice: 800, sellingPrice: 1800, supplier: "Philips" },
    { sku: "TIM-BELT-KIT", name: "Timing Belt Kit", category: "Engine", stock: 2, reorderPoint: 3, location: "Shelf A-3", costPrice: 3500, sellingPrice: 5500, supplier: "Gates" },
    { sku: "CLTCH-KIT", name: "Clutch Kit", category: "Transmission", stock: 1, reorderPoint: 2, location: "Shelf B-1", costPrice: 5000, sellingPrice: 8500, supplier: "Valeo" },
    { sku: "SHK-ABS-FR", name: "Shock Absorber Front", category: "Suspension", stock: 4, reorderPoint: 4, location: "Shelf B-2", costPrice: 2200, sellingPrice: 4000, supplier: "Monroe" },
]

export async function GET() {
    try {
        // Clear existing (optional, for clean seed)
        // await db.delete(spareParts)

        const seeded = []
        for (const part of SAMPLE_PARTS) {
            try {
                const res = await db.insert(spareParts).values({
                    ...part,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                }).returning()
                seeded.push(res[0])
            } catch (e) {
                console.log(`Skipping ${part.sku}: already exists`)
            }
        }

        return NextResponse.json({ message: `Seeded ${seeded.length} parts`, data: seeded })
    } catch (error) {
        console.error("Seeding error:", error)
        return NextResponse.json({ error: "Failed to seed spare parts: " + (error as Error).message }, { status: 500 })
    }
}
