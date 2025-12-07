"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, ClipboardList, Gauge, LineChart as LineChartIcon, Package, Receipt, Settings2, Users, HandCoins, HeartHandshake, CalendarCheck, Wrench, ShieldCheck } from "lucide-react"
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

import { useTheme } from "next-themes"

export function AppSidebar() {
    const pathname = usePathname()
    const { data: session } = authClient.useSession()
    const userRole = (session?.user as any)?.role as Role || "user"
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    // Dynamic Theme Colors
    const activeClass = isDarkMode
        ? "border-l-[3px] border-[#D4AF37] bg-gradient-to-r from-[#D4AF37]/10 to-transparent text-white font-bold"
        : "border-l-[3px] border-[#003366] bg-gradient-to-r from-[#003366]/10 to-transparent text-[#003366] font-bold"

    const inactiveClass = isDarkMode
        ? "border-l-[3px] border-transparent text-gray-400 hover:text-white hover:bg-white/5"
        : "border-l-[3px] border-transparent text-gray-600 hover:text-[#003366] hover:bg-black/5"

    const sidebarClass = isDarkMode
        ? "border-r border-white/10 bg-[#050505] text-white"
        : "border-r border-black/5 bg-white text-gray-900"

    const headerClass = isDarkMode
        ? "bg-[#050505] border-b border-white/10"
        : "bg-white border-b border-black/5"

    const contentClass = isDarkMode
        ? "bg-[#050505] scrollbar-hide"
        : "bg-white scrollbar-hide"

    const footerClass = isDarkMode
        ? "bg-[#050505] border-t border-white/10"
        : "bg-white border-t border-black/5"

    const iconActiveClass = isDarkMode ? "text-[#D4AF37]" : "text-[#003366]"
    const textClass = isDarkMode ? "text-white" : "text-[#003366]"
    const subTextClass = isDarkMode ? "text-gray-400" : "text-gray-500"

    return (
        <Sidebar variant="inset" collapsible="icon" className={sidebarClass} >
            <SidebarHeader className={headerClass}>
                <div className="flex items-center gap-3 px-2 py-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDarkMode ? 'bg-white text-black' : 'bg-[#003366] text-white'}`}>
                        <span className="font-serif italic font-bold text-lg">N</span>
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                        <span className={`font-serif font-bold tracking-widest uppercase ${textClass}`}>NEXUS</span>
                        <span className={`text-[10px] opacity-50 tracking-wider uppercase ${subTextClass}`}>Dealer Systems</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarContent className={contentClass}>
                <SidebarGroup>
                    <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] mt-4 ${subTextClass}`}>Overview</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/dashboard") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/dashboard"} className={`transition-all duration-300 ${pathname === "/dashboard" ? activeClass : inactiveClass}`}>
                                        <Link href="/dashboard">
                                            <Gauge className={pathname === "/dashboard" ? iconActiveClass : ""} />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator className={isDarkMode ? "bg-white/5" : "bg-black/5"} />

                <SidebarGroup>
                    <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] ${subTextClass}`}>Operations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/inventory") && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/inventory/vehicles"} className={`transition-all duration-300 ${pathname === "/inventory/vehicles" ? activeClass : inactiveClass}`}>
                                            <Link href="/inventory/vehicles">
                                                <Car className={pathname === "/inventory/vehicles" ? iconActiveClass : ""} />
                                                <span>Vehicle Inventory</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/inventory/spare-parts"} className={`transition-all duration-300 ${pathname === "/inventory/spare-parts" ? activeClass : inactiveClass}`}>
                                            <Link href="/inventory/spare-parts">
                                                <Package className={pathname === "/inventory/spare-parts" ? iconActiveClass : ""} />
                                                <span>Spare Parts</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}

                            {hasAccess(userRole, "/sales") && (
                                <SidebarMenuItem>
                                    <SidebarGroup className="p-0">
                                        <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] px-2 py-2 ${subTextClass}`}>Sales</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/leads"} className={`transition-all duration-300 ${pathname === "/sales/leads" ? activeClass : inactiveClass}`}>
                                                        <Link href="/sales/leads">
                                                            <Users className={pathname === "/sales/leads" ? iconActiveClass : ""} />
                                                            <span>Leads</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/test-drives"} className={`transition-all duration-300 ${pathname === "/sales/test-drives" ? activeClass : inactiveClass}`}>
                                                        <Link href="/sales/test-drives">
                                                            <Car className={pathname === "/sales/test-drives" ? iconActiveClass : ""} />
                                                            <span>Test Drives</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/quotations"} className={`transition-all duration-300 ${pathname === "/sales/quotations" ? activeClass : inactiveClass}`}>
                                                        <Link href="/sales/quotations">
                                                            <Receipt className={pathname === "/sales/quotations" ? iconActiveClass : ""} />
                                                            <span>Quotations</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/bookings"} className={`transition-all duration-300 ${pathname === "/sales/bookings" ? activeClass : inactiveClass}`}>
                                                        <Link href="/sales/bookings">
                                                            <ClipboardList className={pathname === "/sales/bookings" ? iconActiveClass : ""} />
                                                            <span>Bookings</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/sales/delivery"} className={`transition-all duration-300 ${pathname === "/sales/delivery" ? activeClass : inactiveClass}`}>
                                                        <Link href="/sales/delivery">
                                                            <ClipboardList className={pathname === "/sales/delivery" ? iconActiveClass : ""} />
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
                                    <SidebarMenuButton asChild isActive={pathname === "/hr"} className={`transition-all duration-300 ${pathname === "/hr" ? activeClass : inactiveClass}`}>
                                        <Link href="/hr">
                                            <Users className={pathname === "/hr" ? iconActiveClass : ""} />
                                            <span>HR & Team</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}

                            {/* POSH - For Female Employees */}
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild isActive={pathname === "/posh"} className={`transition-all duration-300 ${pathname === "/posh" ? activeClass : inactiveClass}`}>
                                    <Link href="/posh">
                                        <HeartHandshake className={pathname === "/posh" ? iconActiveClass : ""} />
                                        <span>POSH</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {hasAccess(userRole, "/service") && (
                                <SidebarMenuItem>
                                    <SidebarGroup className="p-0">
                                        <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] px-2 py-2 ${subTextClass}`}>Service</SidebarGroupLabel>
                                        <SidebarGroupContent>
                                            <SidebarMenu>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/appointments"} className={`transition-all duration-300 ${pathname === "/service/appointments" ? activeClass : inactiveClass}`}>
                                                        <Link href="/service/appointments">
                                                            <CalendarCheck className={pathname === "/service/appointments" ? iconActiveClass : ""} />
                                                            <span>Appointments</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/job-cards"} className={`transition-all duration-300 ${pathname === "/service/job-cards" ? activeClass : inactiveClass}`}>
                                                        <Link href="/service/job-cards">
                                                            <Wrench className={pathname === "/service/job-cards" ? iconActiveClass : ""} />
                                                            <span>Job Cards</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                                <SidebarMenuItem>
                                                    <SidebarMenuButton asChild isActive={pathname === "/service/history"} className={`transition-all duration-300 ${pathname === "/service/history" ? activeClass : inactiveClass}`}>
                                                        <Link href="/service/history">
                                                            <ClipboardList className={pathname === "/service/history" ? iconActiveClass : ""} />
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
                    <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] ${subTextClass}`}>Business</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {hasAccess(userRole, "/reports") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/reports"} className={`transition-all duration-300 ${pathname === "/reports" ? activeClass : inactiveClass}`}>
                                        <Link href="/reports">
                                            <LineChartIcon className={pathname === "/reports" ? iconActiveClass : ""} />
                                            <span>Reports & Analytics</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                            {hasAccess(userRole, "/finance") && (
                                <>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/finance"} className={`transition-all duration-300 ${pathname === "/finance" ? activeClass : inactiveClass}`}>
                                            <Link href="/finance">
                                                <Receipt className={pathname === "/finance" ? iconActiveClass : ""} />
                                                <span>Finance & Accounting</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/fi"} className={`transition-all duration-300 ${pathname === "/fi" ? activeClass : inactiveClass}`}>
                                            <Link href="/fi">
                                                <HandCoins className={pathname === "/fi" ? iconActiveClass : ""} />
                                                <span>Finance & Insurance</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </>
                            )}
                            {hasAccess(userRole, "/crm") && (
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild isActive={pathname === "/crm"} className={`transition-all duration-300 ${pathname === "/crm" ? activeClass : inactiveClass}`}>
                                        <Link href="/crm">
                                            <HeartHandshake className={pathname === "/crm" ? iconActiveClass : ""} />
                                            <span>CRM & Loyalty</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* Admin Section - Only visible to admins */}
                {userRole === "admin" && (
                    <>
                        <SidebarSeparator className={isDarkMode ? "bg-white/5" : "bg-black/5"} />
                        <SidebarGroup>
                            <SidebarGroupLabel className={`text-[10px] font-mono opacity-40 uppercase tracking-[0.2em] ${subTextClass}`}>Admin</SidebarGroupLabel>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild isActive={pathname === "/admin/approvals"} className={`transition-all duration-300 ${pathname === "/admin/approvals" ? activeClass : inactiveClass}`}>
                                            <Link href="/admin/approvals">
                                                <ShieldCheck className={pathname === "/admin/approvals" ? iconActiveClass : ""} />
                                                <span>Admin Panel</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>
            <SidebarFooter className={footerClass}>
                {session?.user ? (
                    <UserNav user={session.user} />
                ) : (
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild className={inactiveClass}>
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
