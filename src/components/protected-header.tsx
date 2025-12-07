"use client"

import { useState, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { NotificationBell } from "@/components/notification-bell"
import { RefreshCw, Sun, Moon, Search, X } from "lucide-react"

// Route to display name mapping
const routeNames: Record<string, { parent: string; current: string }> = {
    "/dashboard": { parent: "Overview", current: "Dashboard" },
    "/inventory/vehicles": { parent: "Operations", current: "Vehicle Inventory" },
    "/inventory/spare-parts": { parent: "Operations", current: "Spare Parts" },
    "/sales/leads": { parent: "Sales", current: "Leads" },
    "/sales/test-drives": { parent: "Sales", current: "Test Drives" },
    "/sales/quotations": { parent: "Sales", current: "Quotations" },
    "/sales/bookings": { parent: "Sales", current: "Bookings" },
    "/sales/delivery": { parent: "Sales", current: "Delivery" },
    "/hr": { parent: "Operations", current: "HR & Team" },
    "/service/appointments": { parent: "Service", current: "Appointments" },
    "/service/job-cards": { parent: "Service", current: "Job Cards" },
    "/service/history": { parent: "Service", current: "History" },
    "/reports": { parent: "Business", current: "Reports & Analytics" },
    "/finance": { parent: "Business", current: "Finance & Accounting" },
    "/fi": { parent: "Business", current: "Finance & Insurance" },
    "/crm": { parent: "Business", current: "CRM & Loyalty" },
    "/admin": { parent: "Settings", current: "Administration" },
    "/posh": { parent: "HR", current: "POSH" },
}

// Search modules data
const SEARCH_MODULES = [
    { name: "Dashboard", path: "/dashboard", keywords: ["home", "overview", "stats"] },
    { name: "Leads", path: "/sales/leads", keywords: ["customers", "prospects", "sales"] },
    { name: "Quotations", path: "/sales/quotations", keywords: ["quote", "proposal", "price"] },
    { name: "Bookings", path: "/sales/bookings", keywords: ["orders", "confirmed"] },
    { name: "Test Drives", path: "/sales/test-drives", keywords: ["demo", "trial"] },
    { name: "Vehicles", path: "/inventory/vehicles", keywords: ["stock", "cars", "inventory"] },
    { name: "Spare Parts", path: "/inventory/spare-parts", keywords: ["parts", "accessories"] },
    { name: "Appointments", path: "/service/appointments", keywords: ["service", "booking"] },
    { name: "Job Cards", path: "/service/job-cards", keywords: ["work", "service", "repair"] },
    { name: "Reports", path: "/reports", keywords: ["analytics", "data", "export"] },
    { name: "HR & Team", path: "/hr", keywords: ["employees", "staff", "team"] },
    { name: "Finance", path: "/finance", keywords: ["accounts", "money", "payments"] },
]

export function ProtectedHeader() {
    const pathname = usePathname()
    const router = useRouter()
    const { setTheme, resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    // Search state
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    // Get route info or use fallback
    const routeInfo = routeNames[pathname] || {
        parent: "Nexus DMS",
        current: pathname.split("/").pop()?.replace(/-/g, " ").replace(/\b\w/g, l => l.toUpperCase()) || "Page"
    }

    // Filter modules based on search query
    const filteredModules = query.trim()
        ? SEARCH_MODULES.filter(m =>
            m.name.toLowerCase().includes(query.toLowerCase()) ||
            m.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
        )
        : SEARCH_MODULES.slice(0, 6)

    const handleSelect = (path: string) => {
        router.push(path)
        setQuery('')
        setIsOpen(false)
    }

    const headerClass = isDarkMode
        ? "border-b border-white/10 bg-[#050505] text-white"
        : "border-b border-black/5 bg-white text-gray-900"

    const triggerClass = isDarkMode
        ? "text-white hover:bg-white/10"
        : "text-gray-700 hover:bg-black/5"

    const separatorClass = isDarkMode
        ? "bg-white/20"
        : "bg-black/10"

    const parentLinkClass = isDarkMode
        ? "text-gray-400 hover:text-white"
        : "text-gray-500 hover:text-gray-900"

    const currentPageClass = isDarkMode
        ? "text-white font-medium"
        : "text-gray-900 font-medium"

    const separatorTextClass = isDarkMode
        ? "text-gray-600"
        : "text-gray-400"

    const iconButtonClass = isDarkMode
        ? "p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        : "p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-black/5 transition-colors"

    const handleRefresh = () => {
        router.refresh()
    }

    const toggleTheme = () => {
        setTheme(isDarkMode ? "light" : "dark")
    }

    return (
        <header className={`flex h-16 shrink-0 items-center justify-between gap-2 transition-all duration-300 ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 ${headerClass}`}>
            {/* Left: Sidebar trigger + Breadcrumb */}
            <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className={`-ml-1 ${triggerClass}`} />
                <Separator orientation="vertical" className={`mr-2 h-4 ${separatorClass}`} />
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem className="hidden md:block">
                            <BreadcrumbLink href="/dashboard" className={parentLinkClass}>
                                {routeInfo.parent}
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className={`hidden md:block ${separatorTextClass}`} />
                        <BreadcrumbItem>
                            <BreadcrumbPage className={currentPageClass}>{routeInfo.current}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-md mx-4 relative hidden sm:block">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                    ${isOpen
                        ? isDarkMode ? 'border-white/20 bg-white/5' : 'border-gray-300 bg-gray-50'
                        : isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-gray-200 bg-gray-50'
                    }`}>
                    <Search size={14} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search modules..."
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
                        onFocus={() => setIsOpen(true)}
                        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                        className={`flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500
                            ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
                            <X size={14} />
                        </button>
                    )}
                </div>

                {/* Search Dropdown */}
                {isOpen && (
                    <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg border shadow-xl z-50 overflow-hidden
                        ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            {query ? 'Results' : 'Quick Access'}
                        </div>
                        {filteredModules.map((mod) => (
                            <button
                                key={mod.path}
                                onClick={() => handleSelect(mod.path)}
                                className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors
                                    ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}
                            >
                                <span className={`text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mod.name}</span>
                                <span className={`ml-auto text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{mod.path}</span>
                            </button>
                        ))}
                        {query && filteredModules.length === 0 && (
                            <div className={`px-3 py-4 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                No modules found
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 px-4">
                <button
                    onClick={handleRefresh}
                    className={iconButtonClass}
                    title="Refresh page"
                >
                    <RefreshCw className="h-4 w-4" />
                </button>
                <button
                    onClick={toggleTheme}
                    className={iconButtonClass}
                    title="Toggle theme"
                >
                    {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </button>
                <NotificationBell />
            </div>
        </header>
    )
}
