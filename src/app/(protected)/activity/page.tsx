"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { useTheme } from "next-themes"
import { useRouter } from 'next/navigation'
import {
    LucideActivity,
    LucideSearch,
    LucideFilter,
    LucideRefreshCw,
    LucideAlertCircle,
    LucideCheckCircle,
    LucideMessageSquare,
    LucideArrowRight,
    LucideChevronDown,
    LucideUsers,
    LucideCar,
    LucideFileText,
    LucideWrench,
    LucidePackage,
    LucideCalendar,
    LucideClipboardList,
    LucideBriefcase,
    LucideUserCheck,
    LucideShield,
    LucideLoader2
} from 'lucide-react'

// Entity type to icon mapping
const entityIcons: Record<string, any> = {
    lead: LucideUsers,
    quotation: LucideFileText,
    booking: LucideCalendar,
    delivery: LucideCar,
    appointment: LucideCalendar,
    job_card: LucideClipboardList,
    vehicle: LucideCar,
    spare_part: LucidePackage,
    employee: LucideBriefcase,
    leave_request: LucideUserCheck,
    payroll: LucideFileText,
    posh_complaint: LucideShield,
    user: LucideUsers,
}

// Entity type to route mapping
const entityRoutes: Record<string, string> = {
    lead: '/sales/leads',
    quotation: '/sales/quotations',
    booking: '/sales/bookings',
    delivery: '/sales/delivery',
    appointment: '/service/appointments',
    job_card: '/service/job-cards',
    vehicle: '/inventory/vehicles',
    spare_part: '/inventory/spare-parts',
    employee: '/hr/employees',
    leave_request: '/hr/leaves',
    payroll: '/hr/payroll',
    posh_complaint: '/posh',
    user: '/admin/approvals',
}

// Filter options
const filterOptions = [
    { value: 'all', label: 'All Activity' },
    { value: 'lead', label: 'Leads' },
    { value: 'quotation', label: 'Quotations' },
    { value: 'booking', label: 'Bookings' },
    { value: 'job_card', label: 'Job Cards' },
    { value: 'vehicle', label: 'Vehicles' },
    { value: 'spare_part', label: 'Spare Parts' },
    { value: 'employee', label: 'Employees' },
    { value: 'leave_request', label: 'Leaves' },
    { value: 'payroll', label: 'Payroll' },
]

interface Activity {
    id: number
    title: string
    message: string
    time: string
    type: 'info' | 'success' | 'alert'
    userName: string
    action: string
    entityType: string
    entityId: number
    entityName?: string
    details?: Record<string, any>
    createdAt: Date | number
}

// Activity Item Component
const ActivityItem = ({ activity, isDarkMode, onClick }: { activity: Activity, isDarkMode: boolean, onClick: () => void }) => {
    const Icon = entityIcons[activity.entityType] || LucideActivity

    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-4 p-4 rounded-xl transition-all cursor-pointer group border
        ${isDarkMode
                    ? 'border-white/5 hover:border-white/10 hover:bg-white/[0.03]'
                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/50'}
      `}
        >
            {/* Icon */}
            <div className={`mt-0.5 p-2.5 rounded-xl transition-all group-hover:scale-110 
        ${activity.type === 'alert'
                    ? 'bg-red-500/10 text-red-500'
                    : activity.type === 'success'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : isDarkMode
                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                            : 'bg-[#003366]/10 text-[#003366]'
                }`}
            >
                <Icon size={16} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h4 className={`text-sm font-semibold mb-0.5 group-hover:underline truncate 
              ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        >
                            {activity.title}
                        </h4>
                        <p className={`text-xs leading-relaxed truncate 
              ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        >
                            {activity.message}
                        </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="text-right">
                            <span className={`text-[10px] font-mono block 
                ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}
                            >
                                {activity.time}
                            </span>
                            <span className={`text-[9px] font-medium block mt-0.5
                ${isDarkMode ? 'text-gray-700' : 'text-gray-400'}`}
                            >
                                by {activity.userName}
                            </span>
                        </div>
                        <LucideArrowRight
                            size={12}
                            className={`opacity-0 group-hover:opacity-100 transition-opacity 
                ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

// Main Page Component
export default function RecentActivityPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"
    const router = useRouter()

    const [activities, setActivities] = useState<Activity[]>([])
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const [mounted, setMounted] = useState(false)
    const [filter, setFilter] = useState('all')
    const [search, setSearch] = useState('')
    const [showFilterDropdown, setShowFilterDropdown] = useState(false)
    const [meta, setMeta] = useState({ total: 0, limit: 20, offset: 0, hasMore: false })

    useEffect(() => {
        setMounted(true)
    }, [])

    const fetchActivities = useCallback(async (reset = false) => {
        if (reset) {
            setLoading(true)
            setActivities([])
        } else {
            setLoadingMore(true)
        }

        try {
            const offset = reset ? 0 : meta.offset + meta.limit
            const params = new URLSearchParams({
                limit: '20',
                offset: offset.toString(),
                ...(filter !== 'all' && { filter }),
                ...(search && { search }),
            })

            const response = await fetch(`/api/activity?${params}`)
            const result = await response.json()

            if (result.data) {
                setActivities(prev => reset ? result.data : [...prev, ...result.data])
                setMeta(result.meta)
            }
        } catch (error) {
            console.error('Failed to fetch activities:', error)
        } finally {
            setLoading(false)
            setLoadingMore(false)
        }
    }, [filter, search, meta.offset, meta.limit])

    useEffect(() => {
        if (mounted) {
            fetchActivities(true)
        }
    }, [mounted, filter])

    // Debounced search
    useEffect(() => {
        if (!mounted) return
        const timer = setTimeout(() => {
            fetchActivities(true)
        }, 300)
        return () => clearTimeout(timer)
    }, [search])

    const handleActivityClick = (activity: Activity) => {
        const route = entityRoutes[activity.entityType] || '/dashboard'
        router.push(route)
    }

    if (!mounted) return null

    return (
        <div className={`relative min-h-screen
      ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}
    `}>
            <div className="relative z-10 p-4 sm:p-6 lg:p-8 pb-12">
                <div className="max-w-4xl mx-auto">

                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#D4AF37]/10' : 'bg-[#003366]/10'}`}>
                                <LucideActivity size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                            </div>
                            <div>
                                <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight 
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                                >
                                    Recent Activity
                                </h1>
                                <p className={`text-xs font-mono uppercase tracking-widest mt-0.5
                  ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                >
                                    System Activity Log
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className={`p-4 rounded-xl mb-6 border
            ${isDarkMode
                            ? 'bg-white/[0.02] border-white/5'
                            : 'bg-white border-gray-200 shadow-sm'}
          `}>
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="flex-1 relative">
                                <LucideSearch
                                    size={16}
                                    className={`absolute left-3 top-1/2 -translate-y-1/2 
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}
                                />
                                <input
                                    type="text"
                                    placeholder="Search activity..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm outline-none transition-all
                    ${isDarkMode
                                            ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus:border-[#D4AF37]/50'
                                            : 'bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-400 focus:border-[#003366]/30'}
                  `}
                                />
                            </div>

                            {/* Filter Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                    ${isDarkMode
                                            ? 'bg-white/5 border-white/10 hover:border-white/20'
                                            : 'bg-gray-50 border-gray-200 hover:border-gray-300'}
                  `}
                                >
                                    <LucideFilter size={14} />
                                    <span>{filterOptions.find(f => f.value === filter)?.label || 'Filter'}</span>
                                    <LucideChevronDown size={14} />
                                </button>

                                {showFilterDropdown && (
                                    <div className={`absolute right-0 top-full mt-2 w-48 rounded-xl border shadow-xl z-50 overflow-hidden
                    ${isDarkMode
                                            ? 'bg-[#0a0a0a] border-white/10'
                                            : 'bg-white border-gray-200'}
                  `}>
                                        {filterOptions.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => {
                                                    setFilter(option.value)
                                                    setShowFilterDropdown(false)
                                                }}
                                                className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          ${filter === option.value
                                                        ? isDarkMode
                                                            ? 'bg-[#D4AF37]/10 text-[#D4AF37]'
                                                            : 'bg-[#003366]/5 text-[#003366]'
                                                        : isDarkMode
                                                            ? 'hover:bg-white/5'
                                                            : 'hover:bg-gray-50'}
                        `}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Refresh Button */}
                            <button
                                onClick={() => fetchActivities(true)}
                                disabled={loading}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all
                  ${isDarkMode
                                        ? 'bg-[#D4AF37]/10 border-[#D4AF37]/20 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                                        : 'bg-[#003366]/5 border-[#003366]/10 text-[#003366] hover:bg-[#003366]/10'}
                `}
                            >
                                <LucideRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Activity List */}
                    <div className={`rounded-xl border overflow-hidden
            ${isDarkMode
                            ? 'bg-white/[0.02] border-white/5'
                            : 'bg-white border-gray-200 shadow-sm'}
          `}>
                        {/* Header */}
                        <div className={`px-4 py-3 border-b flex items-center justify-between
              ${isDarkMode ? 'border-white/5' : 'border-gray-100'}
            `}>
                            <span className={`text-xs font-mono uppercase tracking-wider
                ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}
              `}>
                                {meta.total} Activities
                            </span>
                        </div>

                        {/* List */}
                        <div className="p-2">
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <div className={`w-10 h-10 rounded-full border-2 border-t-transparent animate-spin mb-4
                    ${isDarkMode ? 'border-[#D4AF37]' : 'border-[#003366]'}
                  `} />
                                    <span className={`text-xs font-mono uppercase tracking-wider
                    ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}
                  `}>
                                        Loading activities...
                                    </span>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16">
                                    <LucideActivity size={40} className={`mb-4 ${isDarkMode ? 'text-gray-700' : 'text-gray-300'}`} />
                                    <p className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No activity found
                                    </p>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                        {search ? 'Try a different search term' : 'Activity will appear here as you use the system'}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {activities.map(activity => (
                                        <ActivityItem
                                            key={activity.id}
                                            activity={activity}
                                            isDarkMode={isDarkMode}
                                            onClick={() => handleActivityClick(activity)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Load More */}
                        {meta.hasMore && !loading && (
                            <div className={`px-4 py-3 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}>
                                <button
                                    onClick={() => fetchActivities(false)}
                                    disabled={loadingMore}
                                    className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                    ${isDarkMode
                                            ? 'bg-white/5 hover:bg-white/10 text-gray-300'
                                            : 'bg-gray-50 hover:bg-gray-100 text-gray-600'}
                  `}
                                >
                                    {loadingMore ? (
                                        <>
                                            <LucideLoader2 size={14} className="animate-spin" />
                                            Loading...
                                        </>
                                    ) : (
                                        <>Load More</>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Close filter dropdown when clicking outside */}
            {showFilterDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowFilterDropdown(false)}
                />
            )}
        </div>
    )
}
