import { db } from "@/db";
import { payroll, employees } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { email } = body; // Optional override, otherwise use employee email

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const record = await db.select({
            id: payroll.id,
            month: payroll.month,
            basicSalary: payroll.basicSalary,
            allowances: payroll.allowances,
            deductions: payroll.deductions,
            netSalary: payroll.netSalary,
            employeeName: employees.firstName,
            employeeLastName: employees.lastName,
            employeeEmail: employees.email,
        })
            .from(payroll)
            .leftJoin(employees, eq(payroll.employeeId, employees.id))
            .where(eq(payroll.id, Number(id)))
            .get();

        if (!record) {
            return NextResponse.json({ error: "Payroll record not found" }, { status: 404 });
        }

        const targetEmail = email || record.employeeEmail;

        if (!targetEmail) {
            return NextResponse.json({ error: "No email address found for employee" }, { status: 400 });
        }

        // Try sending real email if API key exists
        if (resend) {
            try {
                const emailHtml = `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 8px; overflow: hidden;">
                        <header style="background: #18181b; padding: 24px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Acme Corp</h1>
                            <p style="color: #a1a1aa; margin: 8px 0 0 0; font-size: 14px;">Payslip for ${record.month}</p>
                        </header>
                        <div style="padding: 32px 24px; background: #ffffff;">
                            <p style="margin: 0 0 16px 0; font-size: 16px; color: #18181b;">Dear <strong>${record.employeeName} ${record.employeeLastName}</strong>,</p>
                            <p style="margin: 0 0 24px 0; font-size: 14px; color: #52525b; line-height: 1.5;">
                                Please find below the details of your salary for the month of <strong>${record.month}</strong>.
                            </p>

                            <div style="background: #f4f4f5; border-radius: 8px; padding: 24px; margin-bottom: 24px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Basic Salary</td>
                                        <td style="padding: 8px 0; text-align: right; color: #18181b; font-weight: 500;">₹${record.basicSalary.toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Allowances</td>
                                        <td style="padding: 8px 0; text-align: right; color: #059669; font-weight: 500;">+₹${(record.allowances ?? 0).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #71717a; font-size: 14px;">Deductions</td>
                                        <td style="padding: 8px 0; text-align: right; color: #e11d48; font-weight: 500;">-₹${(record.deductions ?? 0).toLocaleString()}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="border-top: 1px solid #d4d4d8; margin: 12px 0;"></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0 0 0; color: #18181b; font-weight: 600; font-size: 16px;">Net Salary</td>
                                        <td style="padding: 12px 0 0 0; text-align: right; color: #18181b; font-weight: 700; font-size: 18px;">₹${record.netSalary.toLocaleString()}</td>
                                    </tr>
                                </table>
                            </div>

                            <p style="margin: 0; font-size: 14px; color: #71717a; text-align: center;">
                                This is a computer generated slip.
                            </p>
                        </div>
                        <footer style="background: #f4f4f5; padding: 24px; text-align: center;">
                            <p style="margin: 0; font-size: 12px; color: #a1a1aa;">© ${new Date().getFullYear()} Acme Corp. All rights reserved.</p>
                        </footer>
                    </div>
                `;

                await resend.emails.send({
                    from: 'Acme HR <hr@resend.dev>',
                    to: targetEmail,
                    subject: `Payslip for ${record.month} - ${record.employeeName}`,
                    html: emailHtml
                });

                return NextResponse.json({ success: true, message: "Payslip sent successfully" });
            } catch (error) {
                console.error("Resend error:", error);
                return NextResponse.json({ error: "Failed to send email via Resend" }, { status: 500 });
            }
        }

        // Mock success if no API key
        console.log(`[MOCK EMAIL] Sending payslip to ${targetEmail} for ${record.month}`);
        return NextResponse.json({ success: true, message: "Mock email sent (configure RESEND_API_KEY for real emails)" });

    } catch (error) {
        console.error("Error sending payslip:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
