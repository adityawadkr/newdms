import { db } from "@/db";
import { quotations, leads } from "@/db/schema";
import { eq, desc, like } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const allQuotations = await db.select().from(quotations).orderBy(desc(quotations.createdAt));
        return NextResponse.json({ data: allQuotations });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            leadId, customer, vehicle, lineItems, validUntil,
            model, variant, color, exShowroomPrice, registrationAmount,
            insuranceAmount, insuranceType, accessoriesAmount, accessoriesData,
            discountAmount, approvalStatus
        } = body;

        // Parse line items to calculate totals server-side for security
        const items = typeof lineItems === 'string' ? JSON.parse(lineItems) : lineItems;

        let subtotal = 0;
        let tax = 0;

        items.forEach((item: any) => {
            subtotal += Number(item.amount);
            if (item.taxRate) {
                tax += Number(item.amount) * (Number(item.taxRate) / 100);
            }
        });

        const total = subtotal + tax;

        // Generate Quotation Number: QT-{YYYY}-{SEQ}
        const currentYear = new Date().getFullYear();
        const lastQuotation = await db.select().from(quotations)
            .where(like(quotations.number, `QT-${currentYear}-%`))
            .orderBy(desc(quotations.id))
            .limit(1);

        let sequence = 1;
        if (lastQuotation.length > 0) {
            const lastNumber = lastQuotation[0].number;
            const parts = lastNumber.split('-');
            if (parts.length === 3) {
                sequence = parseInt(parts[2]) + 1;
            }
        }

        const number = `QT-${currentYear}-${String(sequence).padStart(3, '0')}`;

        const [newQuotation] = await db.insert(quotations).values({
            number,
            leadId: leadId ? Number(leadId) : null,
            customer,
            vehicle,
            lineItems: JSON.stringify(items),
            subtotal: Math.round(subtotal),
            tax: Math.round(tax),
            total: Math.round(total),
            validUntil,
            status: "Draft",
            createdAt: Date.now(),
            // New Fields
            model, variant, color,
            exShowroomPrice: exShowroomPrice || 0,
            registrationAmount: registrationAmount || 0,
            insuranceAmount: insuranceAmount || 0,
            insuranceType: insuranceType || "1yr",
            accessoriesAmount: accessoriesAmount || 0,
            accessoriesData: accessoriesData ? JSON.stringify(accessoriesData) : null,
            discountAmount: discountAmount || 0,
            approvalStatus: approvalStatus || "Approved"
        }).returning();

        return NextResponse.json({ data: newQuotation });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
