import { db } from "@/db"
import { vehicle } from "@/db/schema"
import { NextResponse } from "next/server"

const MAKES = ["Toyota", "Honda", "Ford", "BMW", "Mercedes", "Audi", "Tesla", "Hyundai", "Kia", "Tata"]
const MODELS = {
    "Toyota": ["Camry", "Corolla", "RAV4", "Fortuner"],
    "Honda": ["Civic", "Accord", "CR-V", "City"],
    "Ford": ["Mustang", "F-150", "Explorer", "Endeavour"],
    "BMW": ["3 Series", "5 Series", "X5", "X3"],
    "Mercedes": ["C-Class", "E-Class", "GLE", "GLC"],
    "Audi": ["A4", "A6", "Q5", "Q7"],
    "Tesla": ["Model 3", "Model Y", "Model S", "Model X"],
    "Hyundai": ["Creta", "Tucson", "Verna", "Ioniq 5"],
    "Kia": ["Seltos", "Sonet", "EV6", "Carnival"],
    "Tata": ["Nexon", "Harrier", "Safari", "Punch"]
}
const COLORS = ["Black", "White", "Silver", "Grey", "Red", "Blue", "Green"]
const LOCATIONS = ["Stockyard", "Showroom"]
const STATUSES = ["in_stock", "reserved", "sold"]

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function GET() {
    try {
        const newVehicles = []

        for (let i = 0; i < 50; i++) {
            const make = getRandomElement(MAKES)
            const model = getRandomElement(MODELS[make as keyof typeof MODELS])
            const year = getRandomInt(2022, 2024)
            const category = ["SUV", "Sedan", "Hatchback", "Luxury"][getRandomInt(0, 3)]
            const color = getRandomElement(COLORS)
            const price = getRandomInt(20000, 80000) * 100
            const costPrice = Math.round(price * 0.85)
            const stock = 1
            const reorderPoint = 5
            const location = getRandomElement(LOCATIONS)
            const status = getRandomElement(STATUSES)
            const daysInStock = getRandomInt(1, 120)
            const vin = `VIN${getRandomInt(10000000, 99999999)}`

            const v = await db.insert(vehicle).values({
                vin,
                make,
                model,
                year,
                category,
                color,
                price,
                stock,
                reorderPoint,
                status,
                location,
                daysInStock,
                costPrice,
                createdAt: new Date(),
                updatedAt: new Date()
            }).returning()

            newVehicles.push(v[0])
        }

        return NextResponse.json({ message: `Seeded ${newVehicles.length} vehicles` })
    } catch (error) {
        console.error("Seeding error:", error)
        return NextResponse.json({ error: "Failed to seed vehicles: " + (error as Error).message }, { status: 500 })
    }
}
