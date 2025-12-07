import { db } from "@/db";
import { activityLog } from "@/db/schema";

export type EntityType =
    | 'lead'
    | 'quotation'
    | 'booking'
    | 'delivery'
    | 'appointment'
    | 'job_card'
    | 'vehicle'
    | 'spare_part'
    | 'employee'
    | 'leave_request'
    | 'payroll'
    | 'posh_complaint'
    | 'user';

export type ActionType =
    | 'created'
    | 'updated'
    | 'deleted'
    | 'completed'
    | 'cancelled'
    | 'sent'
    | 'approved'
    | 'rejected'
    | 'assigned'
    | 'converted'
    | 'reserved'
    | 'booked'
    | 'delivered'
    | 'paid';

export interface LogActivityInput {
    userId?: string;
    userName?: string;
    action: ActionType;
    entityType: EntityType;
    entityId: number;
    entityName?: string;
    details?: Record<string, any>;
    ipAddress?: string;
}

/**
 * Log an activity to the activity log
 */
export async function logActivity(input: LogActivityInput) {
    try {
        const [activity] = await db.insert(activityLog).values({
            userId: input.userId || null,
            userName: input.userName || 'System',
            action: input.action,
            entityType: input.entityType,
            entityId: input.entityId,
            entityName: input.entityName || null,
            details: input.details ? JSON.stringify(input.details) : null,
            ipAddress: input.ipAddress || null,
        }).returning();

        return activity;
    } catch (error) {
        console.error("Failed to log activity:", error);
        return null;
    }
}

/**
 * Helper to get action description for display
 */
export function getActionDescription(action: ActionType, entityType: EntityType): string {
    const entityLabels: Record<EntityType, string> = {
        lead: 'lead',
        quotation: 'quotation',
        booking: 'booking',
        delivery: 'delivery',
        appointment: 'appointment',
        job_card: 'job card',
        vehicle: 'vehicle',
        spare_part: 'spare part',
        employee: 'employee',
        leave_request: 'leave request',
        payroll: 'payroll',
        posh_complaint: 'POSH complaint',
        user: 'user',
    };

    const actionLabels: Record<ActionType, string> = {
        created: 'created',
        updated: 'updated',
        deleted: 'deleted',
        completed: 'completed',
        cancelled: 'cancelled',
        sent: 'sent',
        approved: 'approved',
        rejected: 'rejected',
        assigned: 'assigned',
        converted: 'converted',
        reserved: 'reserved',
        booked: 'booked',
        delivered: 'delivered',
        paid: 'marked as paid',
    };

    return `${actionLabels[action]} ${entityLabels[entityType]}`;
}

/**
 * Get activity icon based on action
 */
export function getActivityIcon(action: ActionType): string {
    const icons: Record<ActionType, string> = {
        created: '➕',
        updated: '✏️',
        deleted: '🗑️',
        completed: '✅',
        cancelled: '❌',
        sent: '📤',
        approved: '👍',
        rejected: '👎',
        assigned: '👤',
        converted: '🔄',
        reserved: '🔒',
        booked: '📋',
        delivered: '🚗',
        paid: '💰',
    };

    return icons[action] || '📌';
}
