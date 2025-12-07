/**
 * Seed Data Script for DMS Dashboard
 * Populates the database with realistic sample data for demonstration
 * 
 * Run with: npx tsx scripts/seed-data.ts
 */

import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '../src/db/schema';
import 'dotenv/config';

const url = process.env.TURSO_CONNECTION_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;

if (!url || !authToken) {
    console.error("❌ Missing TURSO_CONNECTION_URL or TURSO_AUTH_TOKEN");
    process.exit(1);
}

const client = createClient({ url, authToken });
const db = drizzle(client, { schema });

// Helper to generate random date in past N days
const randomPastDate = (days: number) => Math.floor((Date.now() - Math.random() * days * 24 * 60 * 60 * 1000) / 1000);

async function seedVehicles() {
    console.log("🚗 Seeding vehicles...");

    const vehicles = [
        { vin: "WDD2129321A123456", make: "Mercedes-Benz", model: "S-Class S500", year: 2024, category: "Sedan", color: "Obsidian Black", price: 16500000, stock: 3, status: "in-stock", location: "Showroom", daysInStock: 12, costPrice: 15200000, reorderPoint: 2 },
        { vin: "WBA15AP02RCK98765", make: "BMW", model: "7 Series 740i", year: 2024, category: "Sedan", color: "Alpine White", price: 17200000, stock: 2, status: "in-stock", location: "Showroom", daysInStock: 8, costPrice: 15800000, reorderPoint: 2 },
        { vin: "WAUZZZ4G6RN112233", make: "Audi", model: "A8 L", year: 2024, category: "Sedan", color: "Glacier White", price: 14500000, stock: 1, status: "booked", location: "Stockyard", daysInStock: 22, costPrice: 13200000, reorderPoint: 1 },
        { vin: "WP0ZZZ99ZRS445566", make: "Porsche", model: "Cayenne Turbo", year: 2024, category: "SUV", color: "Jet Black", price: 19800000, stock: 2, status: "in-stock", location: "Showroom", daysInStock: 5, costPrice: 18100000, reorderPoint: 1 },
        { vin: "SALGS2SE5NA778899", make: "Range Rover", model: "Autobiography", year: 2024, category: "SUV", color: "Santorini Black", price: 32500000, stock: 1, status: "in-transit", location: "In Transit", daysInStock: 0, costPrice: 29800000, reorderPoint: 1 },
        { vin: "WDD2534621A234567", make: "Mercedes-Benz", model: "GLS 450", year: 2024, category: "SUV", color: "Iridium Silver", price: 13200000, stock: 2, status: "in-stock", location: "Stockyard", daysInStock: 18, costPrice: 12100000, reorderPoint: 2 },
        { vin: "WBA33CE05RCM34567", make: "BMW", model: "X7 xDrive40i", year: 2024, category: "SUV", color: "Carbon Black", price: 14900000, stock: 1, status: "booked", location: "Showroom", daysInStock: 14, costPrice: 13700000, reorderPoint: 1 },
        { vin: "WVWZZZ3CZRE567890", make: "Volkswagen", model: "Tiguan R-Line", year: 2024, category: "SUV", color: "Pure White", price: 3800000, stock: 4, status: "in-stock", location: "Stockyard", daysInStock: 30, costPrice: 3400000, reorderPoint: 3 },
        { vin: "MA3FB31S7R0123456", make: "Hyundai", model: "Creta SX(O)", year: 2024, category: "SUV", color: "Phantom Black", price: 1650000, stock: 5, status: "in-stock", location: "Stockyard", daysInStock: 7, costPrice: 1480000, reorderPoint: 4 },
        { vin: "MA1SN41S2R0987654", make: "Kia", model: "Seltos GTX+", year: 2024, category: "SUV", color: "Imperial Blue", price: 1890000, stock: 3, status: "in-stock", location: "Showroom", daysInStock: 10, costPrice: 1720000, reorderPoint: 3 },
    ];

    for (const v of vehicles) {
        await db.insert(schema.vehicle).values({
            ...v,
            createdAt: new Date(randomPastDate(90) * 1000),
            updatedAt: new Date(),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${vehicles.length} vehicles`);
}

async function seedLeads() {
    console.log("👥 Seeding leads...");

    const leads = [
        { name: "Rajesh Kumar", phone: "9876543210", email: "rajesh.kumar@email.com", source: "Walk-in", status: "Qualified", vehicleInterest: "Mercedes-Benz S-Class", temperature: "Hot", score: 85 },
        { name: "Priya Sharma", phone: "9876543211", email: "priya.sharma@email.com", source: "Website", status: "New", vehicleInterest: "BMW 7 Series", temperature: "Warm", score: 65 },
        { name: "Amit Patel", phone: "9876543212", email: "amit.patel@email.com", source: "Referral", status: "Contacted", vehicleInterest: "Audi A8 L", temperature: "Hot", score: 90 },
        { name: "Sneha Reddy", phone: "9876543213", email: "sneha.reddy@email.com", source: "Social Media", status: "Qualified", vehicleInterest: "Porsche Cayenne", temperature: "Warm", score: 70 },
        { name: "Vikram Singh", phone: "9876543214", email: "vikram.singh@email.com", source: "Walk-in", status: "New", vehicleInterest: "Range Rover", temperature: "Hot", score: 88 },
        { name: "Ananya Gupta", phone: "9876543215", email: "ananya.gupta@email.com", source: "Website", status: "Contacted", vehicleInterest: "Mercedes-Benz GLS", temperature: "Warm", score: 62 },
        { name: "Rohit Mehta", phone: "9876543216", email: "rohit.mehta@email.com", source: "Exhibition", status: "Qualified", vehicleInterest: "BMW X7", temperature: "Hot", score: 82 },
        { name: "Kavita Joshi", phone: "9876543217", email: "kavita.joshi@email.com", source: "Referral", status: "New", vehicleInterest: "Hyundai Creta", temperature: "Cold", score: 45 },
        { name: "Arjun Nair", phone: "9876543218", email: "arjun.nair@email.com", source: "Walk-in", status: "Contacted", vehicleInterest: "Kia Seltos", temperature: "Warm", score: 58 },
        { name: "Deepika Iyer", phone: "9876543219", email: "deepika.iyer@email.com", source: "Website", status: "Qualified", vehicleInterest: "VW Tiguan", temperature: "Hot", score: 78 },
        { name: "Sanjay Verma", phone: "9876543220", email: "sanjay.verma@email.com", source: "Social Media", status: "New", vehicleInterest: "Mercedes-Benz S-Class", temperature: "Warm", score: 55 },
        { name: "Meera Krishnan", phone: "9876543221", email: "meera.k@email.com", source: "Exhibition", status: "Contacted", vehicleInterest: "BMW 7 Series", temperature: "Cold", score: 40 },
        { name: "Karan Malhotra", phone: "9876543222", email: "karan.m@email.com", source: "Referral", status: "Qualified", vehicleInterest: "Porsche Cayenne", temperature: "Hot", score: 92 },
        { name: "Nisha Agarwal", phone: "9876543223", email: "nisha.a@email.com", source: "Walk-in", status: "New", vehicleInterest: "Audi A8 L", temperature: "Warm", score: 60 },
        { name: "Rahul Saxena", phone: "9876543224", email: "rahul.s@email.com", source: "Website", status: "Contacted", vehicleInterest: "Range Rover", temperature: "Hot", score: 87 },
    ];

    for (const lead of leads) {
        await db.insert(schema.leads).values({
            ...lead,
            createdAt: randomPastDate(60),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${leads.length} leads`);
}

async function seedQuotationsAndBookings() {
    console.log("📋 Seeding quotations and bookings...");

    const quotations = [
        { number: "QT-2024-0001", customer: "Rajesh Kumar", vehicle: "Mercedes-Benz S-Class S500", model: "S500", variant: "Premium Plus", color: "Obsidian Black", exShowroomPrice: 16500000, registrationAmount: 180000, insuranceAmount: 320000, accessoriesAmount: 150000, discountAmount: 200000, subtotal: 16950000, tax: 3050000, total: 20000000, status: "Accepted", lineItems: "[]" },
        { number: "QT-2024-0002", customer: "Amit Patel", vehicle: "Audi A8 L", model: "A8 L", variant: "Technology", color: "Glacier White", exShowroomPrice: 14500000, registrationAmount: 160000, insuranceAmount: 280000, accessoriesAmount: 100000, discountAmount: 150000, subtotal: 14890000, tax: 2680000, total: 17570000, status: "Accepted", lineItems: "[]" },
        { number: "QT-2024-0003", customer: "Karan Malhotra", vehicle: "Porsche Cayenne Turbo", model: "Cayenne", variant: "Turbo", color: "Jet Black", exShowroomPrice: 19800000, registrationAmount: 210000, insuranceAmount: 390000, accessoriesAmount: 180000, discountAmount: 250000, subtotal: 20330000, tax: 3660000, total: 23990000, status: "Accepted", lineItems: "[]" },
        { number: "QT-2024-0004", customer: "Deepika Iyer", vehicle: "VW Tiguan R-Line", model: "Tiguan", variant: "R-Line", color: "Pure White", exShowroomPrice: 3800000, registrationAmount: 45000, insuranceAmount: 75000, accessoriesAmount: 50000, discountAmount: 80000, subtotal: 3890000, tax: 700000, total: 4590000, status: "Sent", lineItems: "[]" },
        { number: "QT-2024-0005", customer: "Rahul Saxena", vehicle: "Range Rover Autobiography", model: "Autobiography", variant: "LWB", color: "Santorini Black", exShowroomPrice: 32500000, registrationAmount: 350000, insuranceAmount: 620000, accessoriesAmount: 280000, discountAmount: 400000, subtotal: 33350000, tax: 6000000, total: 39350000, status: "Accepted", lineItems: "[]" },
    ];

    for (const q of quotations) {
        await db.insert(schema.quotations).values({
            ...q,
            createdAt: randomPastDate(45),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${quotations.length} quotations`);

    const bookings = [
        { customer: "Rajesh Kumar", vehicle: "Mercedes-Benz S-Class S500", quotationNo: "QT-2024-0001", bookingAmount: 500000, paymentStatus: "Paid", paymentMode: "Transfer", status: "Delivered" },
        { customer: "Amit Patel", vehicle: "Audi A8 L", quotationNo: "QT-2024-0002", bookingAmount: 400000, paymentStatus: "Paid", paymentMode: "Transfer", status: "Delivered" },
        { customer: "Karan Malhotra", vehicle: "Porsche Cayenne Turbo", quotationNo: "QT-2024-0003", bookingAmount: 600000, paymentStatus: "Paid", paymentMode: "UPI", status: "Delivered" },
    ];

    for (const b of bookings) {
        await db.insert(schema.bookings).values({
            ...b,
            createdAt: randomPastDate(30),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${bookings.length} bookings`);
}

async function seedServiceData() {
    console.log("🔧 Seeding service data...");

    const jobCards = [
        { jobNo: "JC-2024-0001", technician: "Manoj Kumar", status: "Completed", notes: "Regular service - oil change, filter replacement", laborCharges: 8500, totalAmount: 15200 },
        { jobNo: "JC-2024-0002", technician: "Suresh Yadav", status: "In Progress", notes: "Brake pad replacement and wheel alignment", laborCharges: 12000, totalAmount: 28500 },
        { jobNo: "JC-2024-0003", technician: "Manoj Kumar", status: "Scheduled", notes: "AC service and coolant top-up", laborCharges: 5500, totalAmount: 9800 },
        { jobNo: "JC-2024-0004", technician: "Ramesh Patil", status: "Completed", notes: "Full body inspection and detailing", laborCharges: 15000, totalAmount: 22000 },
        { jobNo: "JC-2024-0005", technician: "Suresh Yadav", status: "Completed", notes: "Engine diagnostics and sensor replacement", laborCharges: 18000, totalAmount: 45000 },
    ];

    for (const jc of jobCards) {
        await db.insert(schema.jobCards).values({
            ...jc,
            createdAt: randomPastDate(20),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${jobCards.length} job cards`);

    const spareParts = [
        { sku: "OIL-5W30-SYN", name: "Synthetic Engine Oil 5W-30 (4L)", category: "Lubricants", stock: 25, reorderPoint: 10, costPrice: 2800, sellingPrice: 3500, supplier: "Castrol India" },
        { sku: "FLT-AIR-UNIV", name: "Air Filter - Universal", category: "Filters", stock: 8, reorderPoint: 15, costPrice: 450, sellingPrice: 650, supplier: "Mann Filter" },
        { sku: "BRK-PAD-PREM", name: "Premium Brake Pads (Set)", category: "Brakes", stock: 4, reorderPoint: 8, costPrice: 4200, sellingPrice: 5800, supplier: "Brembo India" },
        { sku: "BAT-60AH-MF", name: "60Ah Maintenance-Free Battery", category: "Electrical", stock: 6, reorderPoint: 5, costPrice: 5500, sellingPrice: 7200, supplier: "Exide" },
        { sku: "WPR-BLD-22", name: "Wiper Blade 22-inch", category: "Accessories", stock: 18, reorderPoint: 10, costPrice: 350, sellingPrice: 550, supplier: "Bosch India" },
        { sku: "COOL-ANTI-2L", name: "Antifreeze Coolant (2L)", category: "Lubricants", stock: 12, reorderPoint: 8, costPrice: 650, sellingPrice: 900, supplier: "Shell India" },
        { sku: "SPK-PLG-IRID", name: "Iridium Spark Plug", category: "Engine", stock: 3, reorderPoint: 10, costPrice: 890, sellingPrice: 1250, supplier: "NGK India" },
        { sku: "TYR-205-R16", name: "Tyre 205/55 R16", category: "Tyres", stock: 8, reorderPoint: 6, costPrice: 6800, sellingPrice: 8500, supplier: "MRF Ltd" },
        { sku: "FLT-FUEL-PFI", name: "Fuel Filter - PFI", category: "Filters", stock: 5, reorderPoint: 8, costPrice: 1200, sellingPrice: 1650, supplier: "Bosch India" },
        { sku: "BELT-SERP-V6", name: "Serpentine Belt - V6", category: "Engine", stock: 2, reorderPoint: 5, costPrice: 2100, sellingPrice: 2900, supplier: "Gates India" },
    ];

    for (const sp of spareParts) {
        await db.insert(schema.spareParts).values({
            ...sp,
            createdAt: new Date(),
            updatedAt: new Date(),
        }).onConflictDoNothing();
    }
    console.log(`  ✓ Added ${spareParts.length} spare parts`);
}

async function main() {
    console.log("\n🌱 Starting database seeding...\n");

    try {
        await seedVehicles();
        await seedLeads();
        await seedQuotationsAndBookings();
        await seedServiceData();

        console.log("\n✅ Database seeding completed successfully!\n");
    } catch (error) {
        console.error("\n❌ Seeding failed:", error);
        process.exit(1);
    }

    process.exit(0);
}

main();
