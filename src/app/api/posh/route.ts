import { db } from "@/db";
import { poshComplaints } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Generate complaint number
function generateComplaintNo() {
    const prefix = "POSH";
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${year}${month}-${random}`;
}

// GET: Fetch user's complaints
export async function GET(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user's complaints only (confidential)
        const complaints = await db.query.poshComplaints.findMany({
            where: eq(poshComplaints.complainantId, session.user.id),
            orderBy: [desc(poshComplaints.createdAt)]
        });

        return NextResponse.json({ data: complaints });
    } catch (error: any) {
        console.error("POSH GET Error:", error);
        // Return empty array if table doesn't exist yet
        if (error.message?.includes("no such table")) {
            return NextResponse.json({ data: [] });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST: Submit a new complaint
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({ headers: await headers() });
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { respondentName, incidentDate, incidentLocation, description, witnesses } = body;

        if (!respondentName || !incidentDate || !incidentLocation || !description) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const complaintNo = generateComplaintNo();

        // Insert complaint
        const [newComplaint] = await db.insert(poshComplaints).values({
            complaintNo,
            complainantId: session.user.id,
            complainantName: session.user.name || "Anonymous",
            complainantEmail: session.user.email,
            respondentName,
            incidentDate,
            incidentLocation,
            description,
            witnesses: witnesses || null,
            status: "Submitted",
            confidential: true,
        }).returning();

        // Send notification email to admin/POSH committee
        if (resend) {
            try {
                const adminEmail = process.env.POSH_ADMIN_EMAIL || process.env.ADMIN_EMAIL || "admin@company.com";

                await resend.emails.send({
                    from: 'POSH Committee <onboarding@resend.dev>',
                    to: adminEmail,
                    subject: `🔔 New POSH Complaint: ${complaintNo}`,
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">
                            <header style="background: #7c3aed; padding: 24px; text-align: center;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">🛡️ POSH Alert</h1>
                                <p style="color: #ddd6fe; margin: 8px 0 0 0; font-size: 14px;">New Complaint Received</p>
                            </header>
                            <div style="padding: 32px 24px; background: #ffffff;">
                                <div style="background: #faf5ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                    <p style="margin: 0; font-size: 14px; color: #6b21a8;">
                                        <strong>Complaint No:</strong> ${complaintNo}
                                    </p>
                                </div>
                                
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #6b7280; width: 40%;">Complainant</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #111827; font-weight: 500;">${session.user.name || 'Anonymous'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #6b7280;">Respondent</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #111827; font-weight: 500;">${respondentName}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #6b7280;">Incident Date</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #111827;">${incidentDate}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #6b7280;">Location</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #e4e4e7; color: #111827;">${incidentLocation}</td>
                                    </tr>
                                </table>

                                <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
                                    <p style="margin: 0 0 8px 0; font-size: 12px; color: #6b7280; text-transform: uppercase;">Description</p>
                                    <p style="margin: 0; color: #374151; line-height: 1.6;">${description.substring(0, 500)}${description.length > 500 ? '...' : ''}</p>
                                </div>

                                <div style="text-align: center; margin-top: 32px;">
                                    <p style="color: #dc2626; font-size: 12px; margin: 0;">
                                        ⚠️ This is a confidential complaint. Handle with care.
                                    </p>
                                </div>
                            </div>
                            <footer style="background: #f4f4f5; padding: 16px; text-align: center; font-size: 12px; color: #a1a1aa;">
                                <p style="margin: 0;">POSH Committee • Confidential</p>
                            </footer>
                        </div>
                    `
                });
                console.log(`📧 POSH notification sent to admin for complaint ${complaintNo}`);
            } catch (emailError) {
                console.error("Failed to send POSH notification email:", emailError);
                // Don't fail the request if email fails
            }
        } else {
            console.log(`📧 [SIMULATION] POSH notification would be sent for complaint ${complaintNo}`);
        }

        return NextResponse.json({
            success: true,
            data: newComplaint,
            message: "Complaint submitted successfully. Your complaint number is " + complaintNo
        });
    } catch (error: any) {
        console.error("POSH POST Error:", error);
        // If table doesn't exist, return helpful message
        if (error.message?.includes("no such table")) {
            return NextResponse.json({
                error: "POSH system is being set up. Please run database migration: npx drizzle-kit push"
            }, { status: 500 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
