export type Role = "admin" | "sales" | "service" | "technician" | "user" | "guest_admin";

export const ROLES: Record<string, Role> = {
    ADMIN: "admin",
    SALES: "sales",
    SERVICE: "service",
    TECHNICIAN: "technician",
    USER: "user",
    GUEST_ADMIN: "guest_admin",
};

export const ROLE_PERMISSIONS: Record<Role, string[]> = {
    admin: ["*"], // Access to everything
    guest_admin: ["*"], // Read-only access to everything (enforced by UI/API logic if needed, or just full access for now as requested)
    sales: ["/sales", "/dashboard", "/inventory", "/crm"],
    service: ["/service", "/dashboard", "/inventory"],
    technician: ["/service/job-cards", "/dashboard"],
    user: ["/dashboard"],
};

export function hasAccess(role: Role, path: string): boolean {
    if (role === "admin") return true;
    const allowedPaths = ROLE_PERMISSIONS[role] || [];
    return allowedPaths.some((p) => path.startsWith(p));
}
