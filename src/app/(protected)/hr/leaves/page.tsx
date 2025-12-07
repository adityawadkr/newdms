"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
    Plus, Calendar, Clock, CheckCircle2, XCircle, AlertCircle, X,
    CalendarOff, CalendarCheck, Timer, RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { format, parseISO, differenceInDays } from "date-fns"

interface LeaveRequest {
    id: number
    employeeId: number
    employeeName: string
    leaveType: string
    startDate: string
    endDate: string
    reason: string
    status: string
    createdAt: number
}

interface Employee {
    id: number
    firstName: string
    lastName: string
    casualLeaveBalance: number
    sickLeaveBalance: number
    earnedLeaveBalance: number
}

const LEAVE_TYPES = [
    { value: "Casual", label: "Casual Leave", color: "blue" },
    { value: "Sick", label: "Sick Leave", color: "amber" },
    { value: "Earned", label: "Earned Leave", color: "emerald" },
]

export default function PremiumLeavesPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [requests, setRequests] = useState<LeaveRequest[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [filterStatus, setFilterStatus] = useState("all")

    const [formData, setFormData] = useState({
        employeeId: "",
        leaveType: "Casual",
        startDate: format(new Date(), "yyyy-MM-dd"),
        endDate: format(new Date(), "yyyy-MM-dd"),
        reason: ""
    })

    useEffect(() => {
        fetchRequests()
        fetchEmployees()
    }, [])

    async function fetchRequests() {
        setLoading(true)
        try {
            const res = await fetch("/api/hr/leaves")
            const data = await res.json()
            if (data.data) setRequests(data.data)
        } finally {
            setLoading(false)
        }
    }

    async function fetchEmployees() {
        const res = await fetch("/api/hr/employees")
        const data = await res.json()
        if (data.data) setEmployees(data.data)
    }

    async function submitRequest(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch("/api/hr/leaves", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                ...formData,
                employeeId: parseInt(formData.employeeId)
            })
        })

        if (res.ok) {
            toast.success("Leave request submitted!")
            setShowModal(false)
            fetchRequests()
            setFormData({
                employeeId: "", leaveType: "Casual",
                startDate: format(new Date(), "yyyy-MM-dd"),
                endDate: format(new Date(), "yyyy-MM-dd"), reason: ""
            })
        } else {
            const data = await res.json()
            toast.error(data.error || "Failed to submit")
        }
    }

    async function updateStatus(id: number, status: string) {
        const res = await fetch(`/api/hr/leaves/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status })
        })

        if (res.ok) {
            toast.success(`Leave ${status.toLowerCase()}`)
            fetchRequests()
        }
    }

    // Stats
    const stats = {
        total: requests.length,
        pending: requests.filter(r => r.status === "Pending").length,
        approved: requests.filter(r => r.status === "Approved").length,
        rejected: requests.filter(r => r.status === "Rejected").length
    }

    const filteredRequests = requests.filter(r =>
        filterStatus === "all" || r.status === filterStatus
    ).sort((a, b) => b.createdAt - a.createdAt)

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className="p-6">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                    <div>
                        <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                            HR
                        </span>
                        <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Leave Management
                        </h1>
                    </div>

                    <button
                        onClick={() => setShowModal(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isDarkMode
                                ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                    >
                        <Plus className="h-4 w-4" />
                        Request Leave
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Requests", value: stats.total, icon: Calendar },
                        { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
                        { label: "Approved", value: stats.approved, icon: CheckCircle2, color: "text-emerald-500" },
                        { label: "Rejected", value: stats.rejected, icon: XCircle, color: "text-red-500" },
                    ].map((stat, i) => (
                        <div key={i} className={`p-4 rounded-xl border transition-all hover:scale-[1.02]
              ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {stat.label}
                                </span>
                                <stat.icon className={`h-4 w-4 ${stat.color || (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />
                            </div>
                            <p className={`text-2xl font-bold ${stat.color || (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    {["all", "Pending", "Approved", "Rejected"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors
                ${filterStatus === status
                                    ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                                    : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            {status === "all" ? "All Requests" : status}
                        </button>
                    ))}
                </div>

                {/* Requests List */}
                <div className="space-y-3">
                    {loading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className={`h-24 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                        ))
                    ) : filteredRequests.length === 0 ? (
                        <div className={`text-center py-16 rounded-xl border-2 border-dashed
              ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                            <CalendarOff className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No leave requests</p>
                        </div>
                    ) : (
                        filteredRequests.map((request) => (
                            <LeaveCard
                                key={request.id}
                                request={request}
                                isDarkMode={isDarkMode}
                                onApprove={() => updateStatus(request.id, "Approved")}
                                onReject={() => updateStatus(request.id, "Rejected")}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Request Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Request Leave
                            </h2>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <form onSubmit={submitRequest} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Employee *
                                </label>
                                <select
                                    required
                                    value={formData.employeeId}
                                    onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                        ? 'bg-white/5 border border-white/10 text-white'
                                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                                        } focus:outline-none`}
                                >
                                    <option value="">Select...</option>
                                    {employees.map(e => (
                                        <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Leave Type
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {LEAVE_TYPES.map((type) => (
                                        <button
                                            key={type.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, leaveType: type.value })}
                                            className={`py-2 rounded-lg text-xs font-medium transition-colors
                        ${formData.leaveType === type.value
                                                    ? type.color === 'blue'
                                                        ? 'bg-blue-500 text-white'
                                                        : type.color === 'amber'
                                                            ? 'bg-amber-500 text-white'
                                                            : 'bg-emerald-500 text-white'
                                                    : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Start Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        End Date *
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Reason *
                                </label>
                                <textarea
                                    required
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    rows={3}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${isDarkMode
                                        ? 'bg-white/5 border border-white/10 text-white'
                                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                                        } focus:outline-none`}
                                    placeholder="Reason for leave..."
                                />
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-xl font-medium transition-colors
                  ${isDarkMode
                                        ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                        : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                            >
                                Submit Request
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

// Leave Card Component
function LeaveCard({
    request,
    isDarkMode,
    onApprove,
    onReject
}: {
    request: LeaveRequest
    isDarkMode: boolean
    onApprove: () => void
    onReject: () => void
}) {
    const days = differenceInDays(parseISO(request.endDate), parseISO(request.startDate)) + 1

    const statusConfig: Record<string, { bg: string, text: string, border: string }> = {
        "Pending": { bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", text: "text-amber-500", border: "border-amber-500/20" },
        "Approved": { bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-500/20" },
        "Rejected": { bg: isDarkMode ? "bg-red-500/10" : "bg-red-50", text: "text-red-500", border: "border-red-500/20" }
    }
    const config = statusConfig[request.status] || statusConfig["Pending"]

    const typeColors: Record<string, string> = {
        "Casual": "text-blue-500",
        "Sick": "text-amber-500",
        "Earned": "text-emerald-500"
    }

    return (
        <div className={`rounded-xl p-4 transition-all hover:scale-[1.005]
      ${isDarkMode
                ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                : 'bg-white border border-gray-200 hover:shadow-md'}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
            ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                        {request.employeeName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            {request.employeeName}
                        </p>
                        <p className={`text-xs ${typeColors[request.leaveType] || 'text-gray-500'}`}>
                            {request.leaveType} Leave • {days} day{days > 1 ? 's' : ''}
                        </p>
                    </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}>
                    {request.status}
                </span>
            </div>

            <div className={`flex items-center gap-4 text-xs p-2.5 rounded-lg mb-3
        ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-1.5">
                    <CalendarCheck className={`h-3.5 w-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {format(parseISO(request.startDate), "MMM d")} - {format(parseISO(request.endDate), "MMM d, yyyy")}
                    </span>
                </div>
            </div>

            <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {request.reason}
            </p>

            {request.status === "Pending" && (
                <div className="flex gap-2">
                    <button
                        onClick={onApprove}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
              ${isDarkMode
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approve
                    </button>
                    <button
                        onClick={onReject}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
              ${isDarkMode
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-red-600 text-white hover:bg-red-700'}`}
                    >
                        <XCircle className="h-3.5 w-3.5" />
                        Reject
                    </button>
                </div>
            )}
        </div>
    )
}
