import "dotenv/config"
import { drizzle } from "drizzle-orm/libsql"
import { createClient } from "@libsql/client"
import * as schema from "../src/db/schema"

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
})

const db = drizzle(client, { schema })

// ============================================================================
// DATA GENERATORS
// ============================================================================

const randomPick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
const randomDate = (daysAgo: number) => {
    const d = new Date()
    d.setDate(d.getDate() - Math.floor(Math.random() * daysAgo))
    return d.toISOString().split("T")[0]
}

// Names
const firstNames = ["Rajesh", "Priya", "Amit", "Sneha", "Vikram", "Ananya", "Karan", "Neha", "Arjun", "Kavita", "Sanjay", "Ritu", "Deepak", "Pooja", "Rahul", "Swati", "Anil", "Meera", "Suresh", "Divya"]
const lastNames = ["Kumar", "Sharma", "Patel", "Singh", "Gupta", "Reddy", "Nair", "Menon", "Iyer", "Shah", "Joshi", "Mehta", "Agarwal", "Verma", "Rao", "Mishra", "Kapoor", "Malhotra", "Chopra", "Bansal"]
const randomName = () => `${randomPick(firstNames)} ${randomPick(lastNames)}`
const randomPhone = () => `+91 ${randomInt(70000, 99999)} ${randomInt(10000, 99999)}`
const randomEmail = (name: string) => `${name.toLowerCase().replace(" ", ".")}${randomInt(1, 999)}@gmail.com`

// Vehicles
const luxuryMakes = [
    { make: "Mercedes-Benz", models: ["S-Class S500", "E-Class E300", "GLE 450", "GLC 300", "A-Class A200"] },
    { make: "BMW", models: ["7 Series 740Li", "5 Series 530d", "X5 xDrive40i", "X3 xDrive30i", "3 Series 330i"] },
    { make: "Audi", models: ["A8 L", "A6 45 TFSI", "Q7 55 TFSI", "Q5 45 TFSI", "A4 45 TFSI"] },
    { make: "Porsche", models: ["Cayenne", "Macan", "Panamera", "911 Carrera", "Taycan"] },
    { make: "Range Rover", models: ["Autobiography", "Sport HSE", "Velar", "Evoque", "Defender"] },
]
const standardMakes = [
    { make: "Hyundai", models: ["Creta SX", "Venue S+", "i20 Asta", "Tucson", "Verna SX"] },
    { make: "Kia", models: ["Seltos HTK+", "Sonet GTX+", "Carens Luxury+", "EV6", "Carnival Limousine"] },
    { make: "Tata", models: ["Nexon XZ+", "Harrier XZA+", "Safari Adventure", "Punch Creative", "Altroz XZ+"] },
    { make: "Mahindra", models: ["XUV700 AX7", "Thar LX", "Scorpio-N Z8", "XUV300 W8", "Bolero Neo"] },
    { make: "Maruti", models: ["Grand Vitara Alpha+", "Brezza ZXI+", "Baleno Alpha", "Ertiga ZXI+", "XL6 Alpha+"] },
]
const colors = ["Pearl White", "Phantom Black", "Lunar Silver", "Sapphire Blue", "Ruby Red", "Forest Green", "Champagne Gold", "Graphite Grey"]

// Parts
const partCategories = [
    { category: "Engine", parts: ["Oil Filter", "Air Filter", "Spark Plug Set", "Timing Belt", "Engine Oil 5W40"] },
    { category: "Brakes", parts: ["Front Brake Pads", "Rear Brake Pads", "Brake Disc Front", "Brake Disc Rear"] },
    { category: "Electrical", parts: ["Battery 60AH", "Alternator", "Starter Motor", "Headlight Bulb"] },
    { category: "Suspension", parts: ["Front Shock Absorber", "Rear Shock Absorber", "Coil Spring", "Control Arm"] },
    { category: "Lubricants", parts: ["Engine Oil 5W30", "Engine Oil 0W20", "Gear Oil", "Brake Fluid"] },
    { category: "Filters", parts: ["Cabin Air Filter", "Fuel Filter", "Transmission Filter", "Oil Filter Premium"] },
    { category: "Tyres", parts: ["Bridgestone 205/55R16", "Michelin 215/60R17", "MRF ZVTV 195/65R15"] },
    { category: "Accessories", parts: ["Floor Mats", "Seat Covers", "Perfume Set", "Phone Mount", "Dash Cam"] },
]
const suppliers = ["Bosch India", "Denso", "NGK", "Valeo", "Continental", "ZF", "Mahle", "Mann Filter"]

// Statuses
const leadStatuses = ["New", "Contacted", "Test Drive", "Negotiation", "Won", "Lost"]
const leadSources = ["Walk-in", "Website", "Referral", "Social Media", "OLX", "CarDekho"]
const temperatures = ["Hot", "Warm", "Cold"]

// ============================================================================
// SEED FUNCTIONS
// ============================================================================

async function seedVehicles(count: number = 50) {
    console.log(`🚗 Seeding ${count} vehicles...`)

    for (let i = 0; i < count; i++) {
        const isLuxury = i < 20
        const brandData = randomPick(isLuxury ? luxuryMakes : standardMakes)
        const model = randomPick(brandData.models)
        const basePrice = isLuxury ? randomInt(4000000, 20000000) : randomInt(800000, 3500000)
        const costPrice = Math.round(basePrice * 0.85)

        await db.insert(schema.vehicle).values({
            vin: `VIN${String(i + 1).padStart(6, "0")}${randomInt(1000, 9999)}`,
            make: brandData.make,
            model: model,
            year: randomInt(2022, 2025),
            category: isLuxury ? "Luxury" : randomPick(["SUV", "Sedan", "Hatchback"]),
            color: randomPick(colors),
            price: basePrice,
            costPrice: costPrice,
            stock: 1,
            reorderPoint: 1,
            status: randomPick(["in_stock", "reserved", "sold"]),
            location: randomPick(["Stockyard", "Showroom"]),
            daysInStock: randomInt(0, 120),
        })
    }
    console.log(`  ✓ ${count} vehicles created`)
}

async function seedSpareParts(count: number = 100) {
    console.log(`🔧 Seeding ${count} spare parts...`)

    for (let i = 0; i < count; i++) {
        const catData = randomPick(partCategories)
        const partName = randomPick(catData.parts)
        const costPrice = randomInt(100, 15000)
        const markup = 1 + (randomInt(20, 60) / 100)

        await db.insert(schema.spareParts).values({
            sku: `SP${String(i + 1).padStart(5, "0")}`,
            name: `${partName} - ${randomPick(["OEM", "Premium", "Standard"])}`,
            category: catData.category,
            stock: randomInt(0, 100),
            reorderPoint: randomInt(5, 20),
            location: `Rack ${String.fromCharCode(65 + randomInt(0, 5))}-${randomInt(1, 20)}`,
            costPrice: costPrice,
            sellingPrice: Math.round(costPrice * markup),
            supplier: randomPick(suppliers),
        })
    }
    console.log(`  ✓ ${count} spare parts created`)
}

async function seedLeads(count: number = 100) {
    console.log(`👥 Seeding ${count} leads...`)

    for (let i = 0; i < count; i++) {
        const name = randomName()
        const status = randomPick(leadStatuses)
        const brandData = randomPick([...luxuryMakes, ...standardMakes])

        await db.insert(schema.leads).values({
            name: name,
            phone: randomPhone(),
            email: randomEmail(name),
            source: randomPick(leadSources),
            status: status,
            vehicleInterest: `${brandData.make} ${randomPick(brandData.models)}`,
            temperature: randomPick(temperatures),
            score: randomInt(20, 100),
            nextAction: randomPick(["Follow up call", "Send quotation", "Schedule test drive", "Negotiate price"]),
            nextActionDate: randomDate(30),
            lastContacted: randomDate(14),
            financeStatus: Math.random() > 0.7 ? "Pre-Approved" : null,
            lostReason: status === "Lost" ? randomPick(["Price too high", "Bought competitor", "Not ready to buy"]) : null,
            createdAt: Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} leads created`)
}

async function seedQuotations(count: number = 50) {
    console.log(`📄 Seeding ${count} quotations...`)

    for (let i = 0; i < count; i++) {
        const name = randomName()
        const brandData = randomPick([...luxuryMakes, ...standardMakes])
        const model = randomPick(brandData.models)
        const vehicle = `${brandData.make} ${model}`
        const exShowroom = randomInt(1000000, 15000000)
        const registration = Math.round(exShowroom * 0.1)
        const insurance = Math.round(exShowroom * 0.04)
        const discount = randomInt(0, 50000)
        const total = exShowroom + registration + insurance - discount

        const lineItems = JSON.stringify([
            { description: `Ex-Showroom (${vehicle})`, amount: exShowroom },
            { description: "Registration & RTO", amount: registration },
            { description: "Insurance (1 Year)", amount: insurance },
            { description: "Discount", amount: -discount },
        ])

        await db.insert(schema.quotations).values({
            number: `QT${new Date().getFullYear()}${String(i + 1).padStart(4, "0")}`,
            customer: name,
            vehicle: vehicle,
            lineItems: lineItems,
            subtotal: exShowroom + registration + insurance,
            tax: 0,
            total: total,
            status: randomPick(["Draft", "Sent", "Accepted", "Rejected", "Expired"]),
            validUntil: randomDate(-7),
            createdAt: Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} quotations created`)
}

async function seedBookings(count: number = 30) {
    console.log(`📋 Seeding ${count} bookings...`)

    for (let i = 0; i < count; i++) {
        const name = randomName()
        const brandData = randomPick([...luxuryMakes, ...standardMakes])
        const model = randomPick(brandData.models)
        const vehicle = `${brandData.make} ${model}`

        await db.insert(schema.bookings).values({
            customer: name,
            vehicle: vehicle,
            quotationNo: `QT${new Date().getFullYear()}${String(randomInt(1, 50)).padStart(4, "0")}`,
            bookingAmount: randomInt(50000, 500000),
            paymentStatus: randomPick(["Pending", "Partial", "Paid"]),
            paymentMode: randomPick(["Cash", "Card", "UPI", "Transfer"]),
            deliveryDate: randomDate(-30),
            status: randomPick(["Confirmed", "Processing", "Ready", "Delivered", "Cancelled"]),
            createdAt: Date.now() - randomInt(0, 90) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} bookings created`)
}

async function seedAppointments(count: number = 40) {
    console.log(`📅 Seeding ${count} appointments...`)

    const serviceTypes = ["Regular Service", "Major Service", "Brake Service", "AC Service", "Body Work"]

    for (let i = 0; i < count; i++) {
        const name = randomName()
        const brandData = randomPick([...luxuryMakes, ...standardMakes])

        await db.insert(schema.appointments).values({
            customer: name,
            vehicle: `${brandData.make} ${randomPick(brandData.models)}`,
            date: randomDate(60),
            serviceType: randomPick(serviceTypes),
            status: randomPick(["Scheduled", "In Progress", "Completed", "Cancelled"]),
            createdAt: Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} appointments created`)
}

async function seedJobCards(count: number = 50) {
    console.log(`🔧 Seeding ${count} job cards...`)

    for (let i = 0; i < count; i++) {
        const labor = randomInt(1000, 15000)

        await db.insert(schema.jobCards).values({
            jobNo: `JC${new Date().getFullYear()}${String(i + 1).padStart(4, "0")}`,
            technician: randomName(),
            partsUsed: null,
            partsData: JSON.stringify([]),
            laborCharges: labor,
            totalAmount: labor + randomInt(500, 30000),
            invoiceStatus: randomPick(["Pending", "Generated", "Paid"]),
            notes: randomPick(["Regular maintenance", "Customer complaint resolved", "Parts replaced"]),
            status: randomPick(["Open", "In Progress", "Completed", "Invoiced"]),
            createdAt: Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} job cards created`)
}

async function seedServiceHistory(count: number = 100) {
    console.log(`📜 Seeding ${count} service history records...`)

    for (let i = 0; i < count; i++) {
        const brandData = randomPick([...luxuryMakes, ...standardMakes])

        await db.insert(schema.serviceHistory).values({
            customer: randomName(),
            vehicle: `${brandData.make} ${randomPick(brandData.models)}`,
            jobNo: `JC${new Date().getFullYear()}${String(randomInt(1, 50)).padStart(4, "0")}`,
            date: randomDate(365),
            amount: String(randomInt(2000, 50000)),
            createdAt: Date.now() - randomInt(0, 365) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} service history records created`)
}

async function seedEmployees(count: number = 20) {
    console.log(`👔 Seeding ${count} employees...`)

    const departments = ["Sales", "Service", "Finance", "HR", "Admin", "Marketing"]
    const designations = ["Manager", "Executive", "Technician", "Consultant", "Analyst", "Coordinator"]

    for (let i = 0; i < count; i++) {
        const firstName = randomPick(firstNames)
        const lastName = randomPick(lastNames)

        await db.insert(schema.employees).values({
            firstName: firstName,
            lastName: lastName,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@autoflow.com`,
            phone: randomPhone(),
            designation: randomPick(designations),
            department: randomPick(departments),
            joiningDate: randomDate(1825),
            salary: randomInt(25000, 150000),
            status: Math.random() > 0.1 ? "Active" : "Inactive",
            sickLeaveBalance: randomInt(5, 12),
            casualLeaveBalance: randomInt(5, 12),
            earnedLeaveBalance: randomInt(10, 20),
            createdAt: new Date(),
        })
    }
    console.log(`  ✓ ${count} employees created`)
}

async function seedTestDrives(count: number = 40) {
    console.log(`🚙 Seeding ${count} test drives...`)

    for (let i = 0; i < count; i++) {
        const name = randomName()
        const brandData = randomPick([...luxuryMakes, ...standardMakes])

        await db.insert(schema.testDrives).values({
            customerName: name,
            vehicle: `${brandData.make} ${randomPick(brandData.models)}`,
            date: randomDate(60),
            time: randomPick(["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM", "4:00 PM"]),
            duration: randomInt(15, 60),
            status: randomPick(["Scheduled", "Completed", "Cancelled", "No Show"]),
            notes: randomPick(["First time buyer", "Upgrading", "Corporate client", "Comparing with competitor"]),
            createdAt: Date.now() - randomInt(0, 60) * 24 * 60 * 60 * 1000,
        })
    }
    console.log(`  ✓ ${count} test drives created`)
}

// ============================================================================
// MAIN EXECUTION
// ============================================================================

async function main() {
    console.log("\n" + "=".repeat(60))
    console.log("🚀 BULK DATA SEEDING SCRIPT")
    console.log("=".repeat(60) + "\n")

    const startTime = Date.now()

    try {
        await seedVehicles(50)
        await seedSpareParts(100)
        await seedLeads(100)
        await seedQuotations(50)
        await seedBookings(30)
        await seedAppointments(40)
        await seedJobCards(50)
        await seedServiceHistory(100)
        await seedEmployees(20)
        await seedTestDrives(40)

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)

        console.log("\n" + "=".repeat(60))
        console.log(`✅ SEEDING COMPLETE in ${elapsed}s`)
        console.log("=".repeat(60))
        console.log("\nTotal: ~580 records created\n")

    } catch (error) {
        console.error("\n❌ Seeding failed:", error)
        process.exit(1)
    }

    process.exit(0)
}

main()
