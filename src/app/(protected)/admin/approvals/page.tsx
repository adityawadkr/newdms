"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import {
    UserCheck, UserX, Users, Clock, Shield, Mail, Calendar, X,
    CheckCircle2, XCircle, AlertTriangle, Snowflake, Trash2, Eye,
    MessageSquare, HeartHandshake
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"

interface PendingUser {
    id: string
    name: string
    email: string
    emailVerified: boolean
    role: string
    approved: boolean
    createdAt: Date
}

interface PoshComplaint {
    id: number
    type: string
    description: string
    status: string
    createdAt: number
    employeeId?: number
    employeeName?: string
}

const ROLES = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "sales", label: "Sales" },
    { value: "hr", label: "HR" },
    { value: "service", label: "Service" },
]

export default function AdminApprovalsPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
    const [approvedUsers, setApprovedUsers] = useState<PendingUser[]>([])
    const [poshComplaints, setPoshComplaints] = useState<PoshComplaint[]>([])
    const [loading, setLoading] = useState(true)
    const [processing, setProcessing] = useState<string | null>(null)
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null)
    const [selectedRole, setSelectedRole] = useState("user")
    const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 })
    const [activeTab, setActiveTab] = useState<"users" | "posh">("users")

    useEffect(() => {
        fetchUsers()
        fetchPoshComplaints()
    }, [])

    async function fetchUsers() {
        setLoading(true)
        try {
            const res = await fetch("/api/admin/approvals")
            const data = await res.json()
            if (data.pending) setPendingUsers(data.pending)
            if (data.approved) setApprovedUsers(data.approved)
            if (data.stats) setStats(data.stats)
        } catch (error) {
            console.error("Error:", error)
        } finally {
            setLoading(false)
        }
    }

    async function fetchPoshComplaints() {
        try {
            const res = await fetch("/api/posh/complaints")
            const data = await res.json()
            if (data.data) setPoshComplaints(data.data)
        } catch (error) {
            console.error("Error fetching POSH complaints:", error)
        }
    }

    function openApproveModal(user: PendingUser) {
        setSelectedUser(user)
        setSelectedRole(user.role || "user")
        setShowApproveModal(true)
    }

    async function handleApprove() {
        if (!selectedUser) return
        setProcessing(selectedUser.id)
        try {
            const res = await fetch("/api/admin/approvals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.id,
                    action: "approve",
                    role: selectedRole
                })
            })

            if (res.ok) {
                toast.success(`${selectedUser.name} approved as ${selectedRole}!`)
                setShowApproveModal(false)
                fetchUsers()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to approve")
            }
        } finally {
            setProcessing(null)
        }
    }

    async function handleAction(user: PendingUser, action: "reject" | "freeze" | "delete") {
        const messages: Record<string, string> = {
            reject: `Reject ${user.name}? This will delete their account.`,
            freeze: `Freeze ${user.name}? They will lose access until unfrozen.`,
            delete: `Delete ${user.name}? This action cannot be undone.`
        }

        if (!confirm(messages[action])) return

        setProcessing(user.id)
        try {
            const res = await fetch("/api/admin/approvals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: user.id, action })
            })

            if (res.ok) {
                const successMessages: Record<string, string> = {
                    reject: "User rejected",
                    freeze: "User frozen",
                    delete: "User deleted"
                }
                toast.success(successMessages[action])
                fetchUsers()
            } else {
                const data = await res.json()
                toast.error(data.error || "Action failed")
            }
        } finally {
            setProcessing(null)
        }
    }

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        ADMIN
                    </span>
                    <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Admin Panel
                    </h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${activeTab === "users"
                                ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                                : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        User Approvals
                        {stats.pending > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                                ${activeTab === "users" ? 'bg-white/20' : 'bg-amber-500 text-white'}`}>
                                {stats.pending}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab("posh")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                            ${activeTab === "posh"
                                ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                                : isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-white text-gray-600 border border-gray-200'
                            }`}
                    >
                        <HeartHandshake className="h-4 w-4" />
                        POSH Complaints
                        {poshComplaints.filter(c => c.status === "Pending").length > 0 && (
                            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold
                                ${activeTab === "posh" ? 'bg-white/20' : 'bg-red-500 text-white'}`}>
                                {poshComplaints.filter(c => c.status === "Pending").length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === "users" ? (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[
                                { label: "Total Users", value: stats.total, icon: Users },
                                { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-500" },
                                { label: "Approved", value: stats.approved, icon: UserCheck, color: "text-emerald-500" },
                            ].map((stat, i) => (
                                <div key={i} className={`p-4 rounded-xl border transition-all
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

                        {/* Warning Banner */}
                        {stats.pending > 0 && (
                            <div className={`flex items-center gap-3 p-4 rounded-xl mb-6 
                                ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                <p className={`text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    <strong>{stats.pending} user{stats.pending > 1 ? 's' : ''}</strong> waiting for approval.
                                </p>
                            </div>
                        )}

                        {/* Pending Users */}
                        <div className="mb-8">
                            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2
                                ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                <Clock className="h-4 w-4" />
                                Pending Approval ({pendingUsers.length})
                            </h2>

                            {loading ? (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className={`h-40 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                                    ))}
                                </div>
                            ) : pendingUsers.length === 0 ? (
                                <div className={`text-center py-12 rounded-xl border-2 border-dashed
                                    ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                                    <UserCheck className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                    <p>No pending approvals</p>
                                </div>
                            ) : (
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {pendingUsers.map(user => (
                                        <PendingUserCard
                                            key={user.id}
                                            user={user}
                                            isDarkMode={isDarkMode}
                                            onApprove={() => openApproveModal(user)}
                                            onReject={() => handleAction(user, "reject")}
                                            processing={processing === user.id}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Approved Users */}
                        <div>
                            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-4 flex items-center gap-2
                                ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                <CheckCircle2 className="h-4 w-4" />
                                Approved Users ({approvedUsers.length})
                            </h2>

                            <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
                                <div className="divide-y" style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                                    {approvedUsers.map(user => (
                                        <div key={user.id} className={`p-3 flex items-center justify-between
                                            ${isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'}`}>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                                                    ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                                </div>
                                                <div>
                                                    <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                        {user.name}
                                                    </p>
                                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium capitalize
                                                    ${isDarkMode ? 'bg-white/10 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                                    {user.role}
                                                </span>
                                                <button
                                                    onClick={() => handleAction(user, "freeze")}
                                                    disabled={processing === user.id}
                                                    title="Freeze User"
                                                    className={`p-1.5 rounded-lg transition-colors
                                                        ${isDarkMode ? 'hover:bg-blue-500/20 text-blue-400' : 'hover:bg-blue-100 text-blue-600'}`}
                                                >
                                                    <Snowflake className="h-3.5 w-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAction(user, "delete")}
                                                    disabled={processing === user.id}
                                                    title="Delete User"
                                                    className={`p-1.5 rounded-lg transition-colors
                                                        ${isDarkMode ? 'hover:bg-red-500/20 text-red-400' : 'hover:bg-red-100 text-red-600'}`}
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* POSH Complaints Tab */
                    <div>
                        <div className="mb-6">
                            <h2 className={`text-sm font-semibold uppercase tracking-wider mb-2 flex items-center gap-2
                                ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                <MessageSquare className="h-4 w-4" />
                                POSH Complaints ({poshComplaints.length})
                            </h2>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                Review and manage workplace harassment complaints
                            </p>
                        </div>

                        {poshComplaints.length === 0 ? (
                            <div className={`text-center py-16 rounded-xl border-2 border-dashed
                                ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                                <HeartHandshake className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium">No complaints filed</p>
                                <p className="text-sm mt-1">All is well in the workplace</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {poshComplaints.map((complaint) => (
                                    <div key={complaint.id} className={`rounded-xl p-4 border
                                        ${complaint.status === "Pending"
                                            ? isDarkMode ? 'bg-red-500/5 border-red-500/20' : 'bg-red-50 border-red-200'
                                            : complaint.status === "Resolved"
                                                ? isDarkMode ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
                                                : isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'
                                        }`}>
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {complaint.type}
                                                </p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    Filed on {format(new Date(complaint.createdAt), "MMM d, yyyy")}
                                                    {complaint.employeeName && ` by ${complaint.employeeName}`}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                                                ${complaint.status === "Pending"
                                                    ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                                    : complaint.status === "Resolved"
                                                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                                        : 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                                }`}>
                                                {complaint.status}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            {complaint.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Approve Modal */}
            {showApproveModal && selectedUser && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Approve User
                            </h2>
                            <button onClick={() => setShowApproveModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                                    ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                                    {selectedUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div>
                                    <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        {selectedUser.name}
                                    </p>
                                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {selectedUser.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                Assign Role
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {ROLES.map(role => (
                                    <button
                                        key={role.value}
                                        onClick={() => setSelectedRole(role.value)}
                                        className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors
                                            ${selectedRole === role.value
                                                ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                                                : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            }`}
                                    >
                                        {role.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowApproveModal(false)}
                                className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing === selectedUser.id}
                                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2
                                    ${isDarkMode
                                        ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                        : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                            >
                                <UserCheck className="h-4 w-4" />
                                Approve
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Pending User Card
function PendingUserCard({
    user,
    isDarkMode,
    onApprove,
    onReject,
    processing
}: {
    user: PendingUser
    isDarkMode: boolean
    onApprove: () => void
    onReject: () => void
    processing: boolean
}) {
    return (
        <div className={`rounded-xl p-4 border-2 border-dashed transition-all
            ${isDarkMode
                ? 'bg-amber-500/5 border-amber-500/30'
                : 'bg-amber-50 border-amber-200'}`}
        >
            <div className="flex items-start gap-3 mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold
                    ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                    <p className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {user.name}
                    </p>
                    <div className={`flex items-center gap-1.5 text-xs mt-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        <Mail className="h-3 w-3" />
                        {user.email}
                    </div>
                </div>
            </div>

            <div className={`flex items-center gap-2 text-xs mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                <Calendar className="h-3 w-3" />
                <span>Registered {format(new Date(user.createdAt), "MMM d, yyyy")}</span>
                {user.emailVerified && (
                    <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                )}
            </div>

            <div className="flex gap-2">
                <button
                    onClick={onApprove}
                    disabled={processing}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                        ${isDarkMode
                            ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                    <UserCheck className="h-3.5 w-3.5" />
                    Approve
                </button>
                <button
                    onClick={onReject}
                    disabled={processing}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                        ${isDarkMode
                            ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                            : 'bg-red-600 text-white hover:bg-red-700'}`}
                >
                    <UserX className="h-3.5 w-3.5" />
                    Reject
                </button>
            </div>
        </div>
    )
}
