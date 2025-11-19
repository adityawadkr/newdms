"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, ClipboardList, Gauge, LineChart as LineChartIcon, Package, Receipt, Settings2, Users, HandCoins, HeartHandshake, CalendarCheck, Wrench } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from "@/components/ui/sidebar"
import { UserNav } from "@/components/user-nav"
import { authClient } from "@/lib/auth-client"
import { hasAccess, Role } from "@/lib/roles"

export function AppSidebar() {
    const pathname = usePathname()
    const { data: session } = authClient.useSession()
    const userRole = (session?.user as any)?.role as Role || "user"

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader>
                <div className="flex items-center gap-2 px-2 py-1.5">
                    <Car className="size-5" />
                    <span className="font-semibold">Dealership DMS</span>
                </div>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/dashboard") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/dashboard"}>
                                        <Link href="/dashboard">
                                            <Gauge />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel>Operations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/inventory") && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/inventory/vehicles"}>
                                            <Link href="/inventory/vehicles">
                                                <Package />
                                                <span>Vehicle Inventory</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/inventory/spare-parts"}>
                                            <Link href="/inventory/spare-parts">
                                                <Package />
                                                <span>Spare Parts</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}

                            {hasAccess(userRole, "/sales") && (
                                <SidebarMenuItem>
                                    <SidebarGroup>
                                        <SidebarGroupLabel>Sales</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/leads"}>
                                                        <Link href="/sales/leads">
                                                            <Users />
                                                            <span>Leads</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/test-drives"}>
                                                        <Link href="/sales/test-drives">
                                                            <Car />
                                                            <span>Test Drives</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/quotations"}>
                                                        <Link href="/sales/quotations">
                                                            <Receipt />
                                                            <span>Quotations</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/bookings"}>
                                                        <Link href="/sales/bookings">
                                                            <ClipboardList />
                                                            <span>Bookings</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/delivery"}>
                                                        <Link href="/sales/delivery">
                                                            <ClipboardList />
                                                            <span>Delivery</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </SidebarGroup>
                                </SidebarMenuItem>
                            )}

                            {hasAccess(userRole, "/hr") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/hr"}>
                                        <Link href="/hr">
                                            <Users />
                                            <span>HR & Team</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {hasAccess(userRole, "/service") && (
                                <SidebarMenuItem>
                                    <SidebarGroup>
                                        <SidebarGroupLabel>Service</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/appointments"}>
                                                        <Link href="/service/appointments">
                                                            <CalendarCheck />
                                                            <span>Appointments</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/job-cards"}>
                                                        <Link href="/service/job-cards">
                                                            <Wrench />
                                                            <span>Job Cards</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/history"}>
                                                        <Link href="/service/history">
                                                            <ClipboardList />
                                                            <span>History</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </SidebarGroup>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Business</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/reports") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/reports"}>
                                        <Link href="/reports">
                                            <LineChartIcon />
                                            <span>Reports & Analytics</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {hasAccess(userRole, "/finance") && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/finance"}>
                                            <Link href="/finance">
                                                <Receipt />
                                                <span>Finance & Accounting</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/fi"}>
                                            <Link href="/fi">
                                                <HandCoins />
                                                <span>Finance & Insurance</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}
                            {hasAccess(userRole, "/crm") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/crm"}>
                                        <Link href="/crm">
                                            <HeartHandshake />
                                            <span>CRM & Loyalty</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                {session?.user ? (
                    <UserNav user={session.user} />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/login">
                                    <Users />
                                    <span>Sign In</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                )}
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}
