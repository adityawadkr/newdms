"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
    Shield, FileText, Send, Clock, CheckCircle2, AlertTriangle,
    Phone, Mail, Lock, Plus, X, Calendar, MapPin, User, Eye, EyeOff,
    ChevronRight, AlertCircle
} from "lucide-react"
import { toast } from "sonner"

type Complaint = {
    id: number
    complaintNo: string
    respondentName: string
    incidentDate: string
    incidentLocation: string
    description: string
    status: string
    createdAt: string
}

const STATUS_CONFIG: Record<string, { bg: string, text: string, border: string }> = {
    "Submitted": { bg: "bg-blue-500/10", text: "text-blue-500", border: "border-blue-500/20" },
    "Under Review": { bg: "bg-amber-500/10", text: "text-amber-500", border: "border-amber-500/20" },
    "Investigation": { bg: "bg-orange-500/10", text: "text-orange-500", border: "border-orange-500/20" },
    "Resolved": { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
    "Closed": { bg: "bg-gray-500/10", text: "text-gray-500", border: "border-gray-500/20" }
}

export default function PremiumPOSHPage() {
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"
    const [complaints, setComplaints] = React.useState<Complaint[]>([])
    const [loading, setLoading] = React.useState(true)
    const [showForm, setShowForm] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    // Form state
    const [respondentName, setRespondentName] = React.useState("")
    const [incidentDate, setIncidentDate] = React.useState("")
    const [incidentLocation, setIncidentLocation] = React.useState("")
    const [description, setDescription] = React.useState("")
    const [witnesses, setWitnesses] = React.useState("")

    React.useEffect(() => {
        fetchComplaints()
    }, [])

    async function fetchComplaints() {
        try {
            const res = await fetch("/api/posh")
            const data = await res.json()
            setComplaints(data.data || [])
        } catch (err) {
            console.error("Failed to fetch complaints:", err)
        } finally {
            setLoading(false)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)

        try {
            const res = await fetch("/api/posh", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    respondentName,
                    incidentDate,
                    incidentLocation,
                    description,
                    witnesses: witnesses || null
                })
            })

            const data = await res.json()
            if (res.ok) {
                toast.success(data.message || "Complaint submitted successfully")
                setShowForm(false)
                resetForm()
                fetchComplaints()
            } else {
                toast.error(data.error || "Failed to submit complaint")
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    function resetForm() {
        setRespondentName("")
        setIncidentDate("")
        setIncidentLocation("")
        setDescription("")
        setWitnesses("")
    }

    const infoCards = [
        { icon: Lock, title: "Confidential", desc: "All complaints are strictly confidential", color: "emerald" },
        { icon: Clock, title: "Quick Response", desc: "Acknowledged within 24 hours", color: "blue" },
        { icon: Shield, title: "Protection", desc: "Zero tolerance for retaliation", color: "purple" },
    ]

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
            <div className="max-w-5xl mx-auto p-6">

                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100'}`}>
                                <Shield className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                            <div>
                                <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    POSH Committee
                                </h1>
                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                    Prevention of Sexual Harassment • Confidential Portal
                                </p>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowForm(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all
                            ${isDarkMode
                                ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/30'
                                : 'bg-purple-600 text-white hover:bg-purple-700'
                            }`}
                    >
                        <Plus className="h-4 w-4" />
                        File a Complaint
                    </button>
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {infoCards.map((card, i) => (
                        <div key={i} className={`p-4 rounded-xl transition-all hover:scale-[1.02] 
                            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${card.color === 'emerald' ? (isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100') :
                                        card.color === 'blue' ? (isDarkMode ? 'bg-blue-500/10' : 'bg-blue-100') :
                                            (isDarkMode ? 'bg-purple-500/10' : 'bg-purple-100')
                                    }`}>
                                    <card.icon className={`h-4 w-4 ${card.color === 'emerald' ? 'text-emerald-500' :
                                            card.color === 'blue' ? 'text-blue-500' : 'text-purple-500'
                                        }`} />
                                </div>
                                <span className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {card.title}
                                </span>
                            </div>
                            <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
                                {card.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Contact Card */}
                <div className={`p-5 rounded-xl mb-8 ${isDarkMode ? 'bg-purple-500/5 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-purple-300' : 'text-purple-900'}`}>
                        <Phone className="h-4 w-4" />
                        POSH Committee Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <Mail className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                posh@company.com
                            </span>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-white'}`}>
                            <Phone className={`h-4 w-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                +91 98765 00000 (Confidential)
                            </span>
                        </div>
                    </div>
                </div>

                {/* My Complaints */}
                <div className="mb-8">
                    <h2 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        My Complaints
                    </h2>

                    {loading ? (
                        <div className="grid gap-4">
                            {[1, 2].map(i => (
                                <div key={i} className={`h-24 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                            ))}
                        </div>
                    ) : complaints.length === 0 ? (
                        <div className={`text-center py-12 rounded-xl ${isDarkMode ? 'bg-white/[0.02] border border-white/10' : 'bg-white border border-gray-200'}`}>
                            <FileText className={`h-12 w-12 mx-auto mb-4 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                            <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>No complaints filed yet</p>
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>Your reports will appear here</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {complaints.map((complaint) => {
                                const config = STATUS_CONFIG[complaint.status] || STATUS_CONFIG["Submitted"]
                                return (
                                    <div
                                        key={complaint.id}
                                        className={`p-5 rounded-xl transition-all hover:scale-[1.01]
                                            ${isDarkMode ? 'bg-white/[0.03] border border-white/10 hover:border-white/20' : 'bg-white border border-gray-200 hover:shadow-md'}`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`font-mono text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        {complaint.complaintNo}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}>
                                                        {complaint.status}
                                                    </span>
                                                </div>
                                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                    Against: <strong className={isDarkMode ? 'text-white' : 'text-gray-900'}>{complaint.respondentName}</strong>
                                                </p>
                                            </div>
                                            <span className={`text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        <div className={`flex items-center gap-4 text-xs p-2.5 rounded-lg
                                            ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
                                            <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <Calendar className="h-3.5 w-3.5" />
                                                {complaint.incidentDate}
                                            </span>
                                            <span className={`flex items-center gap-1.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                                <MapPin className="h-3.5 w-3.5" />
                                                {complaint.incidentLocation}
                                            </span>
                                        </div>

                                        {/* Progress Timeline */}
                                        <div className="mt-4 flex items-center gap-1">
                                            {["Submitted", "Under Review", "Investigation", "Resolved", "Closed"].map((step, idx) => {
                                                const stepOrder = ["Submitted", "Under Review", "Investigation", "Resolved", "Closed"]
                                                const currentIdx = stepOrder.indexOf(complaint.status)
                                                const isComplete = idx <= currentIdx
                                                const isCurrent = idx === currentIdx

                                                return (
                                                    <React.Fragment key={step}>
                                                        <div className={`h-1.5 flex-1 rounded-full transition-all
                                                            ${isComplete
                                                                ? 'bg-purple-500'
                                                                : isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}
                                                        />
                                                    </React.Fragment>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Submit Form Modal */}
            {showForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className={`w-full max-w-lg rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6 max-h-[90vh] overflow-y-auto`}>
                        <div className="flex items-center justify-between mb-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                File a Complaint
                            </h2>
                            <button onClick={() => setShowForm(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                            </button>
                        </div>

                        <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className={`h-4 w-4 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                <p className={`text-xs ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                    All information is strictly confidential and will only be accessed by the POSH Committee.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Name of Person(s) Complained Against *
                                </label>
                                <input
                                    type="text"
                                    value={respondentName}
                                    onChange={(e) => setRespondentName(e.target.value)}
                                    required
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                        ? 'bg-white/5 border border-white/10 text-white focus:border-purple-500'
                                        : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-purple-500'
                                        } focus:outline-none`}
                                    placeholder="Enter name(s)"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Date of Incident *
                                    </label>
                                    <input
                                        type="date"
                                        value={incidentDate}
                                        onChange={(e) => setIncidentDate(e.target.value)}
                                        required
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                    />
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Location *
                                    </label>
                                    <input
                                        type="text"
                                        value={incidentLocation}
                                        onChange={(e) => setIncidentLocation(e.target.value)}
                                        required
                                        className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                            ? 'bg-white/5 border border-white/10 text-white'
                                            : 'bg-gray-50 border border-gray-200 text-gray-900'
                                            } focus:outline-none`}
                                        placeholder="Where did it occur?"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Description of Incident *
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows={4}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${isDarkMode
                                        ? 'bg-white/5 border border-white/10 text-white'
                                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                                        } focus:outline-none`}
                                    placeholder="Please provide details..."
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Witnesses (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={witnesses}
                                    onChange={(e) => setWitnesses(e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                                        ? 'bg-white/5 border border-white/10 text-white'
                                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                                        } focus:outline-none`}
                                    placeholder="Names of any witnesses"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                                        ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2
                                        ${isDarkMode
                                            ? 'bg-purple-500 text-white hover:bg-purple-600'
                                            : 'bg-purple-600 text-white hover:bg-purple-700'
                                        } disabled:opacity-50`}
                                >
                                    {submitting ? "Submitting..." : (
                                        <>
                                            <Send className="h-4 w-4" />
                                            Submit Complaint
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
