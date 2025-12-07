"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
    Plus, Calendar, DollarSign, CheckCircle2, Clock, Send, X,
    TrendingUp, Users, Wallet, Receipt, Download
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface PayrollRecord {
    id: number
    employeeId: number
    employeeName: string
    employeeEmail: string
    month: string
    basicSalary: number
    allowances: number
    deductions: number
    netSalary: number
    status: string
    createdAt: number
}

interface Employee {
    id: number
    firstName: string
    lastName: string
    email: string
    salary: number
    department: string
}

export default function PremiumPayrollPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [records, setRecords] = useState<PayrollRecord[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [selectedRecord, setSelectedRecord] = useState<PayrollRecord | null>(null)
    const [filterMonth, setFilterMonth] = useState(format(new Date(), "yyyy-MM"))
    const [sending, setSending] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        employeeId: "",
        month: format(new Date(), "yyyy-MM"),
        basicSalary: "",
        allowances: "0",
        deductions: "0"
    })

    useEffect(() => {
        fetchRecords()
        fetchEmployees()
    }, [])

    async function fetchRecords() {
        setLoading(true)
        try {
            const res = await fetch("/api/hr/payroll")
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

    function handleEmployeeSelect(id: string) {
        const emp = employees.find(e => e.id === parseInt(id))
        setFormData({
            ...formData,
            employeeId: id,
            basicSalary: emp ? Math.round(emp.salary / 12).toString() : ""
        })
    }

    async function generatePayroll(e: React.FormEvent) {
        e.preventDefault()
        const res = await fetch("/api/hr/payroll", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                employeeId: parseInt(formData.employeeId),
                month: formData.month,
                basicSalary: parseInt(formData.basicSalary) || 0,
                allowances: parseInt(formData.allowances) || 0,
                deductions: parseInt(formData.deductions) || 0
            })
        })

        if (res.ok) {
            toast.success("Payroll generated!")
            setShowModal(false)
            fetchRecords()
            setFormData({ employeeId: "", month: format(new Date(), "yyyy-MM"), basicSalary: "", allowances: "0", deductions: "0" })
        } else {
            const data = await res.json()
            toast.error(data.error || "Failed to generate")
        }
    }

    async function sendPayslip(record: PayrollRecord) {
        setSending(record.id)
        try {
            const res = await fetch(`/api/hr/payroll/${record.id}/send`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: record.employeeEmail })
            })

            if (res.ok) {
                toast.success("Payslip sent to employee!")
            } else {
                toast.error("Failed to send")
            }
        } finally {
            setSending(null)
        }
    }

    async function markPaid(id: number) {
        const res = await fetch(`/api/hr/payroll/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Paid" })
        })

        if (res.ok) {
            toast.success("Marked as paid")
            fetchRecords()
        }
    }

    // Filter by month
    const filteredRecords = records.filter(r =>
        r.month === filterMonth
    ).sort((a, b) => b.createdAt - a.createdAt)

    // Stats
    const monthRecords = filteredRecords
    const stats = {
        total: monthRecords.length,
        pending: monthRecords.filter(r => r.status === "Pending").length,
        paid: monthRecords.filter(r => r.status === "Paid").length,
        totalPayout: monthRecords.reduce((acc, r) => acc + r.netSalary, 0)
    }

    const netSalary = (parseInt(formData.basicSalary) || 0) +
        (parseInt(formData.allowances) || 0) -
        (parseInt(formData.deductions) || 0)

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
                            Payroll
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-xl
              ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                            <Calendar className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                            <input
                                type="month"
                                value={filterMonth}
                                onChange={(e) => setFilterMonth(e.target.value)}
                                className={`bg-transparent outline-none text-sm
                  ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
                            />
                        </div>

                        <button
                            onClick={() => setShowModal(true)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isDarkMode
                                    ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                    : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                        >
                            <Plus className="h-4 w-4" />
                            Generate Payroll
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Records", value: stats.total, icon: Users },
                        { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
                        { label: "Paid", value: stats.paid, icon: CheckCircle2, color: "text-emerald-500" },
                        { label: "Total Payout", value: `₹${(stats.totalPayout / 100000).toFixed(1)}L`, icon: Wallet, color: isDarkMode ? "text-[#D4AF37]" : "text-[#003366]" },
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

                {/* Records Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`h-48 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                        ))
                    ) : filteredRecords.length === 0 ? (
                        <div className={`col-span-full text-center py-16 rounded-xl border-2 border-dashed
              ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                            <Receipt className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No payroll records</p>
                            <p className="text-sm mt-1">Generate payroll for this month</p>
                        </div>
                    ) : (
                        filteredRecords.map((record) => (
                            <PayrollCard
                                key={record.id}
                                record={record}
                                isDarkMode={isDarkMode}
                                onViewDetail={() => { setSelectedRecord(record); setShowDetailModal(true) }}
                                onMarkPaid={() => markPaid(record.id)}
                                onSendSlip={() => sendPayslip(record)}
                                sending={sending === record.id}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Generate Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Generate Payroll
                            </h2>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <form onSubmit={generatePayroll} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Employee *
                                    </label>
                                    <select
                                        required
                                        value={formData.employeeId}
                                        onChange={(e) => handleEmployeeSelect(e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    >
                                        <option value="">Select employee...</option>
                                        {employees.map(e => (
                                            <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.department})</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Month *
                                    </label>
                                    <input
                                        type="month"
                                        required
                                        value={formData.month}
                                        onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Basic Salary
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.basicSalary}
                                        onChange={(e) => setFormData({ ...formData, basicSalary: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                        placeholder="Auto from CTC"
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Allowances
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.allowances}
                                        onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Deductions
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.deductions}
                                        onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                            </div>

                            {/* Net Preview */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                <div className="flex justify-between items-center">
                                    <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Net Salary</span>
                                    <span className={`text-xl font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
                                        ₹{netSalary.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 rounded-xl font-medium transition-colors
                  ${isDarkMode
                                        ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                        : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                            >
                                Generate Payroll
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Detail Modal */}
            {showDetailModal && selectedRecord && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-sm rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Payslip Details
                            </h2>
                            <button onClick={() => setShowDetailModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <div className={`text-center pb-4 mb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                            <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{selectedRecord.employeeName}</p>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{selectedRecord.month}</p>
                        </div>

                        <div className="space-y-3">
                            {[
                                { label: "Basic Salary", value: selectedRecord.basicSalary, positive: true },
                                { label: "Allowances", value: selectedRecord.allowances, positive: true },
                                { label: "Deductions", value: selectedRecord.deductions, positive: false },
                            ].map((item, i) => (
                                <div key={i} className="flex justify-between text-sm">
                                    <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{item.label}</span>
                                    <span className={`font-medium ${item.positive ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-600') : 'text-red-500'}`}>
                                        {item.positive ? '+' : '-'}₹{item.value.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                            <div className={`pt-3 border-t flex justify-between ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                                <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Net Salary</span>
                                <span className={`text-lg font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
                                    ₹{selectedRecord.netSalary.toLocaleString()}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDetailModal(false)}
                            className={`w-full mt-6 py-2.5 rounded-xl font-medium ${isDarkMode
                                ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Payroll Card Component
function PayrollCard({
    record,
    isDarkMode,
    onViewDetail,
    onMarkPaid,
    onSendSlip,
    sending
}: {
    record: PayrollRecord
    isDarkMode: boolean
    onViewDetail: () => void
    onMarkPaid: () => void
    onSendSlip: () => void
    sending: boolean
}) {
    return (
        <div className={`group relative rounded-xl p-4 transition-all hover:scale-[1.01]
      ${isDarkMode
                ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                : 'bg-white border border-gray-200 hover:shadow-lg'}`}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
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
                            {record.month}
                        </p>
                    </div>
                </div>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
          ${record.status === "Paid"
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                    }`}>
                    {record.status}
                </span>
            </div>

            {/* Salary Breakdown */}
            <div className={`p-3 rounded-lg mb-3 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                <div className="flex justify-between mb-2">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Net Salary</span>
                    <span className={`font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
                        ₹{record.netSalary.toLocaleString()}
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                    <div>
                        <p className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>Basic</p>
                        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>₹{(record.basicSalary / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                        <p className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>Allowances</p>
                        <p className="text-emerald-500">+₹{(record.allowances / 1000).toFixed(0)}K</p>
                    </div>
                    <div>
                        <p className={isDarkMode ? 'text-gray-600' : 'text-gray-400'}>Deductions</p>
                        <p className="text-red-500">-₹{(record.deductions / 1000).toFixed(0)}K</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={onViewDetail}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
            ${isDarkMode
                            ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                    <Receipt className="h-3.5 w-3.5" />
                    Details
                </button>
                {record.status === "Pending" && (
                    <button
                        onClick={onMarkPaid}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
              ${isDarkMode
                                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                                : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                    >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Mark Paid
                    </button>
                )}
                <button
                    onClick={onSendSlip}
                    disabled={sending}
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium
            ${isDarkMode
                            ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 disabled:opacity-50'
                            : 'bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50'}`}
                >
                    <Send className="h-3.5 w-3.5" />
                </button>
            </div>
        </div>
    )
}
