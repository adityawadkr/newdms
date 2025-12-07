import { db } from "@/db";
import { notifications, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export type NotificationType =
    | 'lead'
    | 'quotation'
    | 'booking'
    | 'delivery'
    | 'service'
    | 'hr'
    | 'posh'
    | 'inventory'
    | 'system';

export interface CreateNotificationInput {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    link?: string;
    entityType?: string;
    entityId?: number;
    sendEmail?: boolean;
}

/**
 * Create an in-app notification for a user
 */
export async function createNotification(input: CreateNotificationInput) {
    try {
        const [notification] = await db.insert(notifications).values({
            userId: input.userId,
            type: input.type,
            title: input.title,
            message: input.message,
            link: input.link || null,
            entityType: input.entityType || null,
            entityId: input.entityId || null,
            read: false,
            emailSent: false,
        }).returning();

        // Optionally send email notification
        if (input.sendEmail && resend) {
            try {
                const userData = await db.query.user.findFirst({
                    where: eq(user.id, input.userId)
                });

                if (userData?.email) {
                    await resend.emails.send({
                        from: 'AutoFlow DMS <onboarding@resend.dev>',
                        to: userData.email,
                        subject: `🔔 ${input.title}`,
                        html: `
              <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
                <h2 style="margin: 0 0 16px; color: #18181b;">${input.title}</h2>
                <p style="margin: 0 0 24px; color: #52525b; line-height: 1.5;">${input.message}</p>
                ${input.link ? `
                  <a href="${input.link}" style="display: inline-block; background: #18181b; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                    View Details
                  </a>
                ` : ''}
                <hr style="margin: 32px 0; border: none; border-top: 1px solid #e4e4e7;">
                <p style="margin: 0; color: #a1a1aa; font-size: 12px;">AutoFlow DMS • Automated Notification</p>
              </div>
            `
                    });

                    // Mark email as sent
                    await db.update(notifications)
                        .set({ emailSent: true })
                        .where(eq(notifications.id, notification.id));
                }
            } catch (emailError) {
                console.error("Failed to send notification email:", emailError);
            }
        }

        return notification;
    } catch (error) {
        console.error("Failed to create notification:", error);
        return null;
    }
}

/**
 * Notify multiple users at once
 */
export async function notifyUsers(userIds: string[], input: Omit<CreateNotificationInput, 'userId'>) {
    const results = await Promise.all(
        userIds.map(userId => createNotification({ ...input, userId }))
    );
    return results.filter(Boolean);
}

/**
 * Notify all users with a specific role
 */
export async function notifyByRole(role: string, input: Omit<CreateNotificationInput, 'userId'>) {
    try {
        const users = await db.query.user.findMany({
            where: eq(user.role, role)
        });

        return notifyUsers(users.map(u => u.id), input);
    } catch (error) {
        console.error("Failed to notify by role:", error);
        return [];
    }
}

/**
 * Common notification templates
 */
export const NotificationTemplates = {
    leadAssigned: (leadName: string, leadId: number) => ({
        type: 'lead' as NotificationType,
        title: 'New Lead Assigned',
        message: `You have been assigned a new lead: ${leadName}`,
        link: `/sales/leads?highlight=${leadId}`,
        entityType: 'lead',
        entityId: leadId,
    }),

    quotationNeedsApproval: (quotationNo: string, quotationId: number, customerName: string) => ({
        type: 'quotation' as NotificationType,
        title: 'Quotation Needs Approval',
        message: `Quotation ${quotationNo} for ${customerName} requires your approval`,
        link: `/sales/quotations?highlight=${quotationId}`,
        entityType: 'quotation',
        entityId: quotationId,
        sendEmail: true,
    }),

    bookingConfirmed: (quotationNo: string, bookingId: number, vehicle: string) => ({
        type: 'booking' as NotificationType,
        title: 'Booking Confirmed',
        message: `Booking for ${vehicle} (${quotationNo}) has been confirmed`,
        link: `/sales/bookings`,
        entityType: 'booking',
        entityId: bookingId,
    }),

    deliveryScheduled: (bookingId: number, vehicle: string, date: string) => ({
        type: 'delivery' as NotificationType,
        title: 'Delivery Scheduled',
        message: `Delivery for ${vehicle} scheduled on ${date}`,
        link: `/sales/delivery`,
        entityType: 'delivery',
        entityId: bookingId,
    }),

    deliveryCompleted: (vehicle: string, customerName: string) => ({
        type: 'delivery' as NotificationType,
        title: 'Delivery Completed',
        message: `${vehicle} successfully delivered to ${customerName}`,
        link: `/sales/delivery`,
        entityType: 'delivery',
        entityId: 0,
        sendEmail: true,
    }),

    serviceAppointment: (customerName: string, vehicle: string, date: string, appointmentId: number) => ({
        type: 'service' as NotificationType,
        title: 'Service Appointment',
        message: `${customerName} - ${vehicle} scheduled for ${date}`,
        link: `/service/appointments`,
        entityType: 'appointment',
        entityId: appointmentId,
    }),

    jobCardCompleted: (jobNo: string, jobCardId: number, vehicle: string) => ({
        type: 'service' as NotificationType,
        title: 'Job Card Completed',
        message: `Job card ${jobNo} for ${vehicle} has been completed`,
        link: `/service/job-cards`,
        entityType: 'job_card',
        entityId: jobCardId,
    }),

    lowStock: (partName: string, currentStock: number, partId: number) => ({
        type: 'inventory' as NotificationType,
        title: 'Low Stock Alert',
        message: `${partName} is running low (${currentStock} remaining)`,
        link: `/inventory/spare-parts`,
        entityType: 'spare_part',
        entityId: partId,
        sendEmail: true,
    }),

    leaveRequest: (employeeName: string, leaveType: string, requestId: number) => ({
        type: 'hr' as NotificationType,
        title: 'Leave Request',
        message: `${employeeName} has requested ${leaveType} leave`,
        link: `/hr/leave`,
        entityType: 'leave_request',
        entityId: requestId,
    }),

    poshComplaint: (complaintNo: string, complaintId: number) => ({
        type: 'posh' as NotificationType,
        title: 'POSH Complaint Filed',
        message: `New confidential complaint ${complaintNo} requires attention`,
        link: `/posh`,
        entityType: 'posh_complaint',
        entityId: complaintId,
        sendEmail: true,
    }),
};
