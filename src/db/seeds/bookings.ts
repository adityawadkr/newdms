import { db } from '@/db';
import { bookings } from '@/db/schema';

async function main() {
    const sampleBookings = [
        {
            customer: "Rahul Sharma",
            vehicle: "Hyundai Creta SX(O)",
            quotationNo: "QT-2024-001",
            bookingAmount: 25000,
            paymentStatus: "Paid",
            paymentMode: "UPI",
            deliveryDate: "2024-04-15",
            status: "Confirmed",
            createdAt: Math.floor(Date.now() / 1000),
        },
        {
            customer: "Priya Patel",
            vehicle: "Kia Seltos GTX+",
            quotationNo: "QT-2024-002",
            bookingAmount: 25000,
            paymentStatus: "Pending",
            paymentMode: "Card",
            deliveryDate: "2024-04-20",
            status: "Confirmed",
            createdAt: Math.floor(Date.now() / 1000),
        },
        {
            customer: "Amit Singh",
            vehicle: "Mahindra XUV700 AX7",
            quotationNo: "QT-2024-003",
            bookingAmount: 50000,
            paymentStatus: "Paid",
            paymentMode: "Transfer",
            deliveryDate: "2024-05-01",
            status: "Delivered",
            createdAt: Math.floor(Date.now() / 1000),
        },
        {
            customer: 'Pooja Nair',
            vehicle: '2024 Mahindra Scorpio-N',
            quotationNo: 'Q2024-004',
            bookingAmount: 25000,
            paymentStatus: "Pending",
            paymentMode: "UPI",
            deliveryDate: '2024-12-02',
            status: 'Cancelled',
            createdAt: Math.floor(new Date('2024-11-28').getTime() / 1000),
        },
        {
            customer: 'Arjun Verma',
            vehicle: '2024 Hyundai Venue',
            quotationNo: 'Q2024-005',
            bookingAmount: 10000,
            paymentStatus: "Paid",
            paymentMode: "Cash",
            deliveryDate: '2024-11-30',
            status: 'Delivered',
            createdAt: Math.floor(new Date('2024-11-20').getTime() / 1000),
        },
        {
            customer: 'Deepika Pillai',
            vehicle: '2024 Kia Sonet',
            quotationNo: 'Q2024-006',
            bookingAmount: 15000,
            paymentStatus: "Paid",
            paymentMode: "Card",
            deliveryDate: '2024-12-08',
            status: 'Delivered',
            createdAt: Math.floor(new Date('2024-12-01').getTime() / 1000),
        }
    ];

    await db.insert(bookings).values(sampleBookings);

    console.log('✅ Bookings seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});