"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
    Clock, Calendar, CheckCircle2, XCircle, LogIn, LogOut, Users,
    Timer, AlertCircle, TrendingUp
} from "lucide-react"
import { toast } from "sonner"
import { format, parseISO, differenceInHours, differenceInMinutes } from "date-fns"

interface AttendanceRecord {
    id: number
    employeeId: number
    employeeName: string
    date: string
    checkIn: string
    checkOut: string | null
    status: string
}

interface Employee {
    id: number
    firstName: string
    lastName: string
    department?: string
}

export default function PremiumAttendancePage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedEmployee, setSelectedEmployee] = useState("")
    const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"))
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        fetchRecords()
        fetchEmployees()
    }, [selectedDate])

    async function fetchRecords() {
        setLoading(true)
        try {
            const res = await fetch(`/api/hr/attendance?date=${selectedDate}`)
            const data = await res.json()
            if (data.data) setRecords(data.data)
        } finally {
            setLoading(false)
        }
    }

    async function fetchEmployees() {
        const res = await fetch("/api/hr/employees")
        const data = await res.json()
        if (data.data) setEmployees(data.data)
    }

    async function handleAttendance(action: "check-in" | "check-out") {
        if (!selectedEmployee) {
            toast.error("Please select an employee")
            return
        }

        setProcessing(true)
        try {
            const res = await fetch("/api/hr/attendance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    employeeId: parseInt(selectedEmployee),
                    action,
                    date: selectedDate
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success(action === "check-in" ? "Checked in!" : "Checked out!")
                fetchRecords()
                setSelectedEmployee("")
            } else {
                toast.error(data.error || "Action failed")
            }
        } finally {
            setProcessing(false)
        }
    }

    // Calculate duration
    const getDuration = (checkIn: string | null, checkOut: string | null) => {
        if (!checkIn || !checkOut) return "Ongoing"
        try {
            const start = parseISO(checkIn)
            const end = parseISO(checkOut)
            const hours = differenceInHours(end, start)
            const mins = differenceInMinutes(end, start) % 60
            return `${hours}h ${mins}m`
        } catch {
            return "—"
        }
    }

    // Safe parseISO helper
    const safeParseTime = (dateStr: string | null) => {
        if (!dateStr) return null
        try {
            return parseISO(dateStr)
        } catch {
            return null
        }
    }

    // Stats
    const stats = {
        total: employees.length,
        present: records.filter(r => r.status === "Present").length,
        late: records.filter(r => {
            if (!r.checkIn) return false
            const time = safeParseTime(r.checkIn)
            return time ? time.getHours() > 9 : false
        }).length,
        absent: employees.length - records.length
    }

    const attendanceRate = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0

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
                            Attendance
                        </h1>
                    </div>

                    <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
            ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                        <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className={`bg-transparent outline-none text-sm
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Staff", value: stats.total, icon: Users },
                        { label: "Present", value: stats.present, icon: CheckCircle2, color: "text-emerald-500" },
                        { label: "Late", value: stats.late, icon: AlertCircle, color: "text-amber-500" },
                        { label: "Absent", value: stats.absent, icon: XCircle, color: "text-red-500" },
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

                {/* Attendance Rate + Quick Actions */}
                <div className="grid lg:grid-cols-2 gap-4 mb-6">
                    {/* Attendance Rate */}
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Today's Attendance
                            </h3>
                            <TrendingUp className={`h-5 w-5 ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`} />
                        </div>

                        {/* Circular Progress */}
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24">
                                <svg className="w-24 h-24 transform -rotate-90">
                                    <circle
                                        cx="48" cy="48" r="40"
                                        fill="none"
                                        stroke={isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
                                        strokeWidth="8"
                                    />
                                    <circle
                                        cx="48" cy="48" r="40"
                                        fill="none"
                                        stroke={isDarkMode ? "#D4AF37" : "#003366"}
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${attendanceRate * 2.51} 251`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {attendanceRate}%
                                    </span>
                                </div>
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Present</span>
                                    <span className="text-emerald-500 font-medium">{stats.present}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Absent</span>
                                    <span className="text-red-500 font-medium">{stats.absent}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Late</span>
                                    <span className="text-amber-500 font-medium">{stats.late}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className={`p-6 rounded-xl border ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                        <h3 className={`font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Quick Check In/Out
                        </h3>

                        <div className="space-y-4">
                            <select
                                value={selectedEmployee}
                                onChange={(e) => setSelectedEmployee(e.target.value)}
                                className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                    ? 'bg-white/5 border border-white/10 text-white'
                                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                                    } focus:outline-none`}
                            >
                                <option value="">Select Employee...</option>
                                {employees.map(e => (
                                    <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>
                                ))}
                            </select>

                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleAttendance("check-in")}
                                    disabled={processing || !selectedEmployee}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors
                    ${isDarkMode
                                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:opacity-50'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50'}`}
                                >
                                    <LogIn className="h-4 w-4" />
                                    Check In
                                </button>
                                <button
                                    onClick={() => handleAttendance("check-out")}
                                    disabled={processing || !selectedEmployee}
                                    className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-colors
                    ${isDarkMode
                                            ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 disabled:opacity-50'
                                            : 'bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-50'}`}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Check Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Records Table */}
                <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                    <div className={`px-4 py-3 border-b font-semibold text-sm ${isDarkMode ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'}`}>
                        Attendance Records - {selectedDate ? format(new Date(selectedDate), "MMMM d, yyyy") : "Select Date"}
                    </div>

                    <div className="divide-y" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                        {loading ? (
                            [1, 2, 3].map(i => (
                                <div key={i} className={`h-16 animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
                            ))
                        ) : records.length === 0 ? (
                            <div className={`text-center py-12 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                <p>No attendance records for this date</p>
                            </div>
                        ) : (
                            records.map((record) => (
                                <div key={record.id} className={`p-4 flex items-center justify-between
                  ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                      ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                                            {record.employeeName.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                {record.employeeName}
                                            </p>
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                {record.date ? format(new Date(record.date), "EEE, MMM d") : "—"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Check In</p>
                                            <p className={`font-mono font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {record.checkIn ? format(new Date(record.checkIn), "hh:mm a") : "—"}
                                            </p>
                                        </div>
                                        <div className="text-center">
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Check Out</p>
                                            <p className={`font-mono font-medium ${record.checkOut ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') : (isDarkMode ? 'text-gray-600' : 'text-gray-400')}`}>
                                                {record.checkOut ? format(new Date(record.checkOut), "hh:mm a") : "—"}
                                            </p>
                                        </div>
                                        <div className="text-center min-w-[60px]">
                                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Duration</p>
                                            <p className={`font-mono font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                                {getDuration(record.checkIn, record.checkOut)}
                                            </p>
                                        </div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                      ${record.status === "Present"
                                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                : 'bg-red-500/10 text-red-500 border border-red-500/20'
                                            }`}>
                                            {record.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
