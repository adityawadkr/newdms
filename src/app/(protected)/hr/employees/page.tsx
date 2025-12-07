"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
    Plus, Search, MoreHorizontal, Mail, Phone, Briefcase, Pencil, Trash2,
    Users, UserCheck, UserX, Building2, X, Calendar, DollarSign
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface Employee {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    designation: string
    department: string
    status: string
    salary: number
    joiningDate: string
}

const DEPARTMENTS = ["Sales", "Service", "HR", "Finance", "Admin", "Operations"]

export default function PremiumEmployeesPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [employees, setEmployees] = useState<Employee[]>([])
    const [search, setSearch] = useState("")
    const [filterDept, setFilterDept] = useState("all")
    const [showModal, setShowModal] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

    const [formData, setFormData] = useState({
        firstName: "", lastName: "", email: "", phone: "",
        designation: "", department: "", salary: "",
        joiningDate: new Date().toISOString().split('T')[0], status: "Active"
    })

    useEffect(() => {
        fetchEmployees()
    }, [])

    async function fetchEmployees() {
        setLoading(true)
        try {
            const res = await fetch("/api/hr/employees")
            const data = await res.json()
            if (data.data) setEmployees(data.data)
        } finally {
            setLoading(false)
        }
    }

    function handleAddNew() {
        setEditingId(null)
        setFormData({
            firstName: "", lastName: "", email: "", phone: "",
            designation: "", department: "", salary: "",
            joiningDate: new Date().toISOString().split('T')[0], status: "Active"
        })
        setShowModal(true)
    }

    function handleEdit(employee: Employee) {
        setEditingId(employee.id)
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            designation: employee.designation,
            department: employee.department,
            salary: employee.salary.toString(),
            joiningDate: employee.joiningDate,
            status: employee.status
        })
        setShowModal(true)
    }

    async function handleDelete(id: number) {
        try {
            const res = await fetch(`/api/hr/employees/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Employee deleted")
                fetchEmployees()
            } else {
                toast.error("Failed to delete")
            }
        } finally {
            setShowDeleteConfirm(null)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)
        try {
            const url = editingId ? `/api/hr/employees/${editingId}` : "/api/hr/employees"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...formData, salary: parseInt(formData.salary) || 0 })
            })

            if (res.ok) {
                toast.success(`Employee ${editingId ? "updated" : "added"}!`)
                setShowModal(false)
                fetchEmployees()
            } else {
                toast.error("Failed to save")
            }
        } finally {
            setSaving(false)
        }
    }

    const filteredEmployees = employees.filter(e => {
        if (filterDept !== "all" && e.department !== filterDept) return false
        if (search) {
            const q = search.toLowerCase()
            return e.firstName.toLowerCase().includes(q) ||
                e.lastName.toLowerCase().includes(q) ||
                e.email.toLowerCase().includes(q) ||
                e.designation.toLowerCase().includes(q)
        }
        return true
    })

    // Stats
    const stats = {
        total: employees.length,
        active: employees.filter(e => e.status === "Active").length,
        inactive: employees.filter(e => e.status !== "Active").length,
        departments: [...new Set(employees.map(e => e.department))].length
    }

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
                            Employees
                        </h1>
                    </div>

                    <button
                        onClick={handleAddNew}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isDarkMode
                                ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                    >
                        <Plus className="h-4 w-4" />
                        Add Employee
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {[
                        { label: "Total Employees", value: stats.total, icon: Users },
                        { label: "Active", value: stats.active, icon: UserCheck, color: "text-emerald-500" },
                        { label: "Inactive", value: stats.inactive, icon: UserX, color: "text-red-500" },
                        { label: "Departments", value: stats.departments, icon: Building2, color: "text-blue-500" },
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

                {/* Search & Filter */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-sm
            ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
                        <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className={`bg-transparent outline-none text-sm w-full
                ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
                        />
                    </div>

                    <div className="flex gap-2 flex-wrap">
                        {["all", ...DEPARTMENTS].map((dept) => (
                            <button
                                key={dept}
                                onClick={() => setFilterDept(dept)}
                                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${filterDept === dept
                                        ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                                        : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                    }`}
                            >
                                {dept === "all" ? "All" : dept}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Employee Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className={`h-48 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                        ))
                    ) : filteredEmployees.length === 0 ? (
                        <div className={`col-span-full text-center py-16 rounded-xl border-2 border-dashed
              ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="text-lg font-medium">No employees found</p>
                            <p className="text-sm mt-1">Add your first employee to get started</p>
                        </div>
                    ) : (
                        filteredEmployees.map(employee => (
                            <EmployeeCard
                                key={employee.id}
                                employee={employee}
                                isDarkMode={isDarkMode}
                                onEdit={() => handleEdit(employee)}
                                onDelete={() => setShowDeleteConfirm(employee.id)}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-lg rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6 max-h-[90vh] overflow-y-auto`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {editingId ? "Edit Employee" : "Add Employee"}
                            </h2>
                            <button onClick={() => setShowModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        First Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Last Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        required
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Designation *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designation}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                        placeholder="Sales Manager"
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Department *
                                    </label>
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    >
                                        <option value="">Select...</option>
                                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Salary (Annual CTC)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.salary}
                                        onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Joining Date
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.joiningDate}
                                        onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={saving}
                                className={`w-full py-3 rounded-xl font-medium transition-colors
                  ${isDarkMode
                                        ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                                        : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
                            >
                                {saving ? "Saving..." : (editingId ? "Update Employee" : "Add Employee")}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-sm rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
                        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                            Delete Employee?
                        </h3>
                        <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(null)}
                                className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(showDeleteConfirm)}
                                className="flex-1 py-2.5 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Employee Card Component
function EmployeeCard({
    employee,
    isDarkMode,
    onEdit,
    onDelete
}: {
    employee: Employee
    isDarkMode: boolean
    onEdit: () => void
    onDelete: () => void
}) {
    const [showMenu, setShowMenu] = useState(false)

    return (
        <div className={`group relative rounded-xl p-4 transition-all hover:scale-[1.01]
      ${isDarkMode
                ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
                : 'bg-white border border-gray-200 hover:shadow-lg'}`}
        >
            {/* Menu */}
            <div className="absolute top-3 right-3">
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity
            ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                >
                    <MoreHorizontal className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                </button>
                {showMenu && (
                    <div className={`absolute right-0 top-8 w-32 rounded-lg shadow-lg py-1 z-10
            ${isDarkMode ? 'bg-[#1a1a1a] border border-white/10' : 'bg-white border border-gray-200'}`}>
                        <button
                            onClick={() => { onEdit(); setShowMenu(false) }}
                            className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2
                ${isDarkMode ? 'text-gray-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-50'}`}
                        >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                            onClick={() => { onDelete(); setShowMenu(false) }}
                            className="w-full px-3 py-2 text-left text-sm flex items-center gap-2 text-red-500 hover:bg-red-500/10"
                        >
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Avatar & Name */}
            <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
          ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                    {employee.firstName[0]}{employee.lastName[0]}
                </div>
                <div>
                    <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {employee.firstName} {employee.lastName}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        {employee.designation}
                    </p>
                </div>
            </div>

            {/* Details */}
            <div className={`space-y-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5" />
                    <span>{employee.department}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate">{employee.email}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{employee.phone}</span>
                </div>
            </div>

            {/* Status */}
            <div className="mt-3 pt-3 border-t flex items-center justify-between"
                style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
          ${employee.status === "Active"
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                    {employee.status}
                </span>
                <span className={`text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Joined {format(new Date(employee.joiningDate), "MMM yyyy")}
                </span>
            </div>
        </div>
    )
}
