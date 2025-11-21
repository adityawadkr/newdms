import { db } from '@/db';
import { quotations } from '@/db/schema';

async function main() {
    const sampleQuotations = [
        {
            number: "QT-2024-001",
            customer: "Rahul Sharma",
            vehicle: "Hyundai Creta SX(O)",
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 1800000, taxRate: 18 },
                { description: "Insurance (Zero Dep)", amount: 50000, taxRate: 18 },
                { description: "RTO Registration", amount: 150000, taxRate: 0 },
                { description: "Extended Warranty", amount: 25000, taxRate: 18 },
                { description: "Essential Accessories Kit", amount: 15000, taxRate: 18 }
            ]),
            subtotal: 2040000,
            tax: 340200,
            total: 2380200,
            status: "Accepted",
            createdAt: Math.floor(Date.now() / 1000) - 86400 * 5, // 5 days ago
        },
        {
            number: "QT-2024-002",
            customer: "Priya Patel",
            vehicle: "Kia Seltos GTX+",
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 1900000, taxRate: 18 },
                { description: "Insurance", amount: 55000, taxRate: 18 },
                { description: "FastTag", amount: 500, taxRate: 0 }
            ]),
            subtotal: 1955500,
            tax: 351900,
            total: 2307400,
            status: "Sent",
            createdAt: Math.floor(Date.now() / 1000) - 86400 * 2, // 2 days ago
        },
        {
            number: "QT-2024-003",
            customer: "Amit Singh",
            vehicle: "Mahindra XUV700 AX7",
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 2500000, taxRate: 28 },
                { description: "TCS (1%)", amount: 25000, taxRate: 0 }
            ]),
            subtotal: 2525000,
            tax: 700000,
            total: 3225000,
            status: "Draft",
            createdAt: Math.floor(Date.now() / 1000),
        },
        {
            number: 'QT-2024-004',
            customer: 'Pooja Nair',
            vehicle: 'Mahindra Scorpio-N Z8',
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 2100000, taxRate: 28 },
                { description: "Insurance", amount: 65000, taxRate: 18 },
                { description: "RTO", amount: 200000, taxRate: 0 }
            ]),
            subtotal: 2365000,
            tax: 599700,
            total: 2964700,
            status: 'Draft',
            createdAt: Math.floor(Date.now() / 1000) - 86400 * 10,
        },
        {
            number: 'QT-2024-005',
            customer: 'Arjun Verma',
            vehicle: 'Hyundai Venue SX',
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 1200000, taxRate: 18 },
                { description: "Insurance", amount: 35000, taxRate: 18 },
                { description: "RTO", amount: 100000, taxRate: 0 }
            ]),
            subtotal: 1335000,
            tax: 222300,
            total: 1557300,
            status: 'Sent',
            createdAt: Math.floor(Date.now() / 1000) - 86400 * 1,
        },
        {
            number: 'QT-2024-006',
            customer: 'Deepika Pillai',
            vehicle: 'Kia Sonet HTX',
            lineItems: JSON.stringify([
                { description: "Ex-Showroom Price", amount: 1100000, taxRate: 18 },
                { description: "Accessories", amount: 20000, taxRate: 18 }
            ]),
            subtotal: 1120000,
            tax: 201600,
            total: 1321600,
            status: 'Accepted',
            createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
        }
    ];

    await db.insert(quotations).values(sampleQuotations);

    console.log('✅ Quotations seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});