import { db } from "@/db";
import { leads } from "@/db/schema";
import { NextResponse } from "next/server";

const NAMES = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Avyaan", "Vivaan", "Aryan", "Diya", "Saanvi", "Ananya", "Aadhya", "Pari", "Kiara", "Myra", "Aamna", "Fatima", "Zoya"];
const SURNAMES = ["Patel", "Sharma", "Singh", "Kumar", "Gupta", "Verma", "Shah", "Mehta", "Joshi", "Nair", "Khan", "Ali", "Ahmed", "Siddiqui", "Rao", "Reddy", "Gowda", "Yadav", "Das", "Banerjee"];
const CARS = ["Hyundai Creta", "Kia Seltos", "Tata Nexon", "Maruti Brezza", "Mahindra XUV700", "Toyota Fortuner", "Honda City", "Skoda Slavia", "VW Virtus", "MG Hector"];
const SOURCES = ["Walk-in", "Website", "Referral", "Social Media"];
const STATUSES = ["New", "Contacted", "Test Drive", "Negotiation", "Won", "Lost"];

function getRandom(arr: string[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomPhone() {
    return "9" + Math.floor(100000000 + Math.random() * 900000000).toString();
}

export async function GET() {
    try {
        const newLeads = [];

        for (let i = 0; i < 50; i++) {
            const name = `${getRandom(NAMES)} ${getRandom(SURNAMES)}`;
            const status = getRandom(STATUSES);

            // Logic to make data realistic
            let score = Math.floor(Math.random() * 60) + 20; // 20-80 base
            if (status === "Won" || status === "Negotiation") score += 20;
            if (status === "Lost") score = 10;

            let temperature = "Cold";
            if (score >= 80) temperature = "Hot";
            else if (score >= 50) temperature = "Warm";

            const vehicleInterest = {
                model: getRandom(CARS),
                budget: (Math.floor(Math.random() * 20) + 10) + " Lakhs"
            };

            newLeads.push({
                name,
                phone: getRandomPhone(),
                email: `${name.toLowerCase().replace(" ", ".")}@example.com`,
                source: getRandom(SOURCES),
                status,
                vehicleInterest: JSON.stringify(vehicleInterest),
                temperature,
                score,
                createdAt: Date.now() - Math.floor(Math.random() * 1000000000), // Random time in past
                nextAction: "Follow up",
                nextActionDate: new Date(Date.now() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString()
            });
        }

        await db.insert(leads).values(newLeads);

        return NextResponse.json({ message: "Successfully seeded 50 leads!", count: 50 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
