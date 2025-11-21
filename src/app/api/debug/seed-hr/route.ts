import { db } from "@/db"
import { employees, attendance, leaveRequests, payroll } from "@/db/schema"
import { NextResponse } from "next/server"

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "HR", "Finance", "Operations"]
const DESIGNATIONS = ["Associate", "Senior Associate", "Manager", "Director", "VP", "Intern"]
const STATUSES = ["Active", "Inactive", "On Leave"]

const FIRST_NAMES = ["Aarav", "Vihaan", "Aditya", "Sai", "Arjun", "Reyansh", "Muhammad", "Avyaan", "Vivaan", "Aryan", "Diya", "Saanvi", "Ananya", "Aadhya", "Kiara", "Pari", "Myra", "Riya", "Anvi", "Aarya"]
const LAST_NAMES = ["Sharma", "Verma", "Gupta", "Malhotra", "Bhatia", "Saxena", "Mehta", "Jain", "Singh", "Kaur", "Patel", "Reddy", "Nair", "Rao", "Desai", "Joshi", "Kulkarni", "Shukla", "Tiwari", "Mishra"]

function getRandomElement(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export async function GET() {
    try {
        const newEmployees = []

        // 1. Create 50 Employees
        for (let i = 0; i < 50; i++) {
            const firstName = getRandomElement(FIRST_NAMES)
            const lastName = getRandomElement(LAST_NAMES)
            const department = getRandomElement(DEPARTMENTS)
            const designation = getRandomElement(DESIGNATIONS)

            // Salary based on designation
            let baseSalary = 30000
            if (designation.includes("Senior")) baseSalary = 60000
            if (designation.includes("Manager")) baseSalary = 100000
            if (designation.includes("Director")) baseSalary = 200000
            if (designation.includes("VP")) baseSalary = 300000

            const salary = baseSalary + getRandomInt(0, 10000)

            const employee = await db.insert(employees).values({
                firstName,
                lastName,
                email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${getRandomInt(1, 999)}@acme.com`,
                phone: `98${getRandomInt(10000000, 99999999)}`,
                designation,
                department,
                salary,
                joiningDate: new Date(2020, 0, 1).toISOString().split('T')[0],
                status: "Active",
                createdAt: new Date(),
            }).returning()

            newEmployees.push(employee[0])
        }

        // 2. Create Attendance for last 7 days
        const today = new Date()
        for (const emp of newEmployees) {
            for (let d = 0; d < 7; d++) {
                const date = new Date(today)
                date.setDate(date.getDate() - d)

                // Skip weekends
                if (date.getDay() === 0 || date.getDay() === 6) continue

                // 90% chance of being present
                if (Math.random() > 0.1) {
                    await db.insert(attendance).values({
                        employeeId: emp.id,
                        date: date.toISOString().split('T')[0],
                        checkIn: "09:00",
                        checkOut: "18:00",
                        status: "Present",
                        createdAt: new Date(),
                    })
                } else {
                    await db.insert(attendance).values({
                        employeeId: emp.id,
                        date: date.toISOString().split('T')[0],
                        status: "Absent",
                        createdAt: new Date(),
                    })
                }
            }
        }

        return NextResponse.json({ message: "Seeded 50 employees and attendance records" })
    } catch (error) {
        console.error("Seeding error:", error)
        return NextResponse.json({ error: "Failed to seed data" }, { status: 500 })
    }
}
