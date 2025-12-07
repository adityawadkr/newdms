import { db } from "@/db";
import { quotations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { email } = body;

        if (!id || !email) {
            return NextResponse.json({ error: "Missing ID or Email" }, { status: 400 });
        }

        const quotation = await db.query.quotations.findFirst({
            where: eq(quotations.id, Number(id))
        });

        if (!quotation) {
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        }

        // Try sending real email if API key exists
        if (resend) {
            try {
                let lineItemsHtml = '';
                try {
                    const items = JSON.parse(quotation.lineItems);
                    lineItemsHtml = items.map((item: any) => `
                        <tr>
                            <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; color: #3f3f46;">${item.description}</td>
                            <td style="padding: 12px; border-bottom: 1px solid #e4e4e7; text-align: right; color: #3f3f46;">₹${Number(item.amount).toLocaleString()}</td>
                        </tr>
                    `).join('');
                } catch (e) {
                    lineItemsHtml = `<tr><td colspan="2" style="padding: 12px; color: #ef4444;">Error loading items</td></tr>`;
                }

                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">
                        <header style="background: #18181b; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">AutoFlow</h1>
                            <p style="color: #a1a1aa; margin: 8px 0 0 0; font-size: 14px;">Quotation #${quotation.number}</p>
                        </header>
                        <div style="padding: 32px 24px; background: #ffffff;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b;">Dear <strong>${quotation.customer}</strong>,</p>
                            <p style="margin: 0 0 24px 0; line-height: 1.5; color: #52525b;">
                                Thank you for your interest in the <strong>${quotation.vehicle}</strong>. We are pleased to provide you with the following quotation, valid until ${quotation.validUntil || 'further notice'}.
                            </p>
                            
                            <table style="width: 100%; border-collapse: collapse; margin: 0 0 24px 0;">
                                <thead>
                                    <tr style="background: #f4f4f5;">
                                        <th style="padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 600;">Description</th>
                                        <th style="padding: 12px; text-align: right; font-size: 12px; text-transform: uppercase; color: #71717a; font-weight: 600;">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${lineItemsHtml}
                                </tbody>
                                <tfoot>
                                    <tr style="background: #f4f4f5;">
                                        <td style="padding: 16px 12px; font-weight: 700; font-size: 18px; color: #18181b;">Total</td>
                                        <td style="padding: 16px 12px; text-align: right; font-weight: 700; font-size: 18px; color: #18181b;">₹${quotation.total.toLocaleString()}</td>
                                    </tr>
                                </tfoot>
                            </table>

                            <div style="text-align: center; margin-top: 32px;">
                                <a href="#" style="display: inline-block; background: #18181b; color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px;">View Full Details</a>
                            </div>
                        </div>
                        <footer style="background: #f4f4f5; padding: 24px; text-align: center; font-size: 12px; color: #a1a1aa;">
                            <p style="margin: 0;">&copy; ${new Date().getFullYear()} AutoFlow Inc. All rights reserved.</p>
                            <p style="margin: 8px 0 0 0;">This is an automated message. Please do not reply.</p>
                        </footer>
                    </div>
                `;

                // Use custom domain if configured, otherwise use Resend's test domain
                const senderEmail = process.env.RESEND_FROM_EMAIL || 'no-reply@resend.dev';
                const senderName = process.env.RESEND_FROM_NAME || 'AutoFlow Sales';

                const result = await resend.emails.send({
                    from: `${senderName} <${senderEmail}>`,
                    to: email,
                    subject: `Quotation #${quotation.number} - ${quotation.vehicle}`,
                    html: emailHtml
                });
                console.log(`📧 Email sent to ${email} via Resend:`, result);
            } catch (emailError: any) {
                console.error("❌ Failed to send email via Resend:", emailError);
                // Check for common Resend errors
                const errorMessage = emailError?.message || emailError?.name || "Email send failed";

                // Provide helpful error messages
                if (errorMessage.includes("verify") || errorMessage.includes("domain") || emailError?.statusCode === 403) {
                    return NextResponse.json({
                        error: "Email not sent - domain verification required",
                        details: "On Resend free tier, emails can only be sent to your verified email address. To send to customers, please verify a custom domain in Resend dashboard.",
                        hint: "Set RESEND_FROM_EMAIL in your .env to use a verified domain email"
                    }, { status: 400 });
                }

                return NextResponse.json({
                    error: errorMessage,
                    details: emailError?.statusCode ? `Status: ${emailError.statusCode}` : "Check Resend dashboard for details",
                    hint: "On free tier, you can only send to your own verified email address"
                }, { status: 400 });
            }
        } else {
            console.log(`📧 [SIMULATION] Email would be sent to ${email}`);
            console.log(`   Subject: Quotation #${quotation.number}`);
            console.log(`   Body: Total ₹${quotation.total}`);
            // Simulate delay
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Update status to Sent
        const [updatedQuotation] = await db.update(quotations)
            .set({ status: "Sent" })
            .where(eq(quotations.id, Number(id)))
            .returning();

        return NextResponse.json({ success: true, data: updatedQuotation });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
