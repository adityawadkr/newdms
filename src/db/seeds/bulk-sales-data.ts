import 'dotenv/config';
import { db } from '@/db';
import { testDrives, bookings, deliveries, leads, user, quotations } from '@/db/schema';
import { faker } from '@faker-js/faker';

async function main() {
    console.log('🌱 Starting bulk seed...');

    // 1. Get existing users and leads to link to
    const allUsers = await db.select().from(user);
    const allLeads = await db.select().from(leads);
    const allQuotations = await db.select().from(quotations);

    if (allUsers.length === 0 || allLeads.length === 0) {
        console.error('❌ No users or leads found. Please seed them first.');
        return;
    }

    // 2. Seed Test Drives (50 entries)
    console.log('🚗 Seeding Test Drives...');
    const testDriveData = [];
    for (let i = 0; i < 50; i++) {
        const lead = faker.helpers.arrayElement(allLeads);
        const assignedUser = faker.helpers.arrayElement(allUsers);
        const status = faker.helpers.arrayElement(['Scheduled', 'In Progress', 'Completed', 'Cancelled']);

        let vehicleModel = 'Generic Car';
        try {
            if (lead.vehicleInterest) {
                // Try parsing as JSON
                const interest = JSON.parse(lead.vehicleInterest);
                vehicleModel = interest.model || 'Unknown Car';
            }
        } catch (e) {
            // If parse fails, assume it's a plain string
            vehicleModel = lead.vehicleInterest || 'Generic Car';
        }

        testDriveData.push({
            leadId: lead.id,
            customerName: lead.name,
            vehicle: vehicleModel,
            date: faker.date.recent({ days: 30 }).toISOString().split('T')[0],
            time: `${faker.number.int({ min: 9, max: 18 })}:00`,
            duration: 30,
            status: status,
            notes: faker.lorem.sentence(),
            assignedTo: assignedUser.id,
            feedback: status === 'Completed' ? faker.lorem.sentence() : null,
            rating: status === 'Completed' ? faker.number.int({ min: 3, max: 5 }) : null,
            createdAt: Date.now(),
        });
    }
    await db.insert(testDrives).values(testDriveData);

    // 3. Seed Bookings (40 entries)
    console.log('📅 Seeding Bookings...');
    const bookingData = [];
    for (let i = 0; i < 40; i++) {
        const quote = faker.helpers.arrayElement(allQuotations);
        if (!quote) continue;

        const status = faker.helpers.arrayElement(['Confirmed', 'Delivered', 'Cancelled']);

        bookingData.push({
            leadId: quote.leadId || null,
            quotationId: quote.id,
            customer: quote.customer,
            vehicle: quote.vehicle,
            quotationNo: quote.number,
            bookingAmount: Number(faker.finance.amount({ min: 10000, max: 50000, dec: 0 })),
            paymentStatus: faker.helpers.arrayElement(['Paid', 'Pending', 'Partial']),
            paymentMode: faker.helpers.arrayElement(['UPI', 'Card', 'Transfer', 'Cash']),
            deliveryDate: faker.date.future({ years: 0.2 }).toISOString().split('T')[0],
            status: status,
            createdAt: Date.now(),
        });
    }

    if (bookingData.length > 0) {
        const createdBookings = await db.insert(bookings).values(bookingData).returning();

        // 4. Seed Deliveries (Linked to Bookings)
        console.log('🎁 Seeding Deliveries...');
        const deliveryData = [];
        for (const booking of createdBookings) {
            if (booking.status === 'Delivered' || booking.status === 'Confirmed') {
                const isCompleted = booking.status === 'Delivered';
                deliveryData.push({
                    bookingId: booking.id,
                    pdiStatus: isCompleted ? 'Passed' : faker.helpers.arrayElement(['Pending', 'Passed']),
                    checklist: JSON.stringify({ keys: true, manual: true, accessories: true, cleanliness: true, documents: true }),
                    feedback: isCompleted ? faker.lorem.sentence() : null,
                    status: isCompleted ? 'Completed' : 'Scheduled',
                    deliveryDate: booking.deliveryDate ? new Date(booking.deliveryDate) : new Date(),
                    createdAt: Date.now(),
                });
            }
        }
        if (deliveryData.length > 0) {
            await db.insert(deliveries).values(deliveryData);
        }
    }

    console.log('✅ Bulk seed completed!');
}

main().catch((error) => {
    console.error('❌ Bulk seed failed:', error);
});
