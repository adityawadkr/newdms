"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Plus, Calendar, Clock, Car, User, CheckCircle2, X, Star,
  ChevronRight, Play, AlertCircle, MapPin
} from "lucide-react"
import { toast } from "sonner"
import { format, isToday, isFuture, isPast, parseISO, addDays } from "date-fns"

interface TestDrive {
  id: number
  customerName: string
  vehicle: string
  date: string
  time: string
  duration: number
  status: string
  notes?: string
  feedback?: string
  rating?: number
  leadId?: number
  leadName?: string
  assignedToName?: string
  assignedToImage?: string
}

interface Lead {
  id: number
  name: string
  vehicleInterest: any
}

const VEHICLES = [
  "Hyundai Creta SX(O)",
  "Kia Seltos GTX+",
  "Mahindra XUV700 AX7",
  "Tata Harrier Fearless",
  "Volkswagen Virtus GT"
]

export default function PremiumTestDrivesPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [drives, setDrives] = useState<TestDrive[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<TestDrive | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(5)

  // Form state
  const [formData, setFormData] = useState({
    leadId: "", customerName: "", vehicle: "", date: "", time: "", notes: ""
  })

  useEffect(() => {
    fetchDrives()
    fetchLeads()
  }, [])

  async function fetchDrives() {
    setLoading(true)
    try {
      const res = await fetch("/api/sales/test-drives")
      const data = await res.json()
      if (data.data) setDrives(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function fetchLeads() {
    const res = await fetch("/api/sales/leads")
    const data = await res.json()
    if (data.data) setLeads(data.data)
  }

  async function scheduleDrive(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/sales/test-drives", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowAddModal(false)
      setFormData({ leadId: "", customerName: "", vehicle: "", date: "", time: "", notes: "" })
      fetchDrives()
      toast.success("Test Drive scheduled!")
    } else {
      const error = await res.json()
      toast.error(error.message || "Failed to schedule")
    }
  }

  async function updateStatus(id: number, status: string) {
    if (status === "Completed") {
      const drive = drives.find(d => d.id === id)
      if (drive) {
        setSelectedDrive(drive)
        setShowFeedbackModal(true)
      }
      return
    }

    const res = await fetch(`/api/sales/test-drives/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })

    if (res.ok) {
      fetchDrives()
      toast.success(`Drive marked as ${status}`)
    }
  }

  async function submitFeedback() {
    if (!selectedDrive) return

    const res = await fetch(`/api/sales/test-drives/${selectedDrive.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Completed", feedback, rating })
    })

    if (res.ok) {
      setShowFeedbackModal(false)
      setSelectedDrive(null)
      setFeedback("")
      setRating(5)
      fetchDrives()
      toast.success("Drive completed!")
    }
  }

  const groupedDrives = {
    today: drives.filter(d => isToday(parseISO(d.date))),
    upcoming: drives.filter(d => isFuture(parseISO(d.date)) && !isToday(parseISO(d.date))),
    past: drives.filter(d => isPast(parseISO(d.date)) && !isToday(parseISO(d.date)))
  }

  const stats = {
    total: drives.length,
    scheduled: drives.filter(d => d.status === "Scheduled").length,
    inProgress: drives.filter(d => d.status === "In Progress").length,
    completed: drives.filter(d => d.status === "Completed").length,
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                SALES
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Test Drives
            </h1>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isDarkMode
                ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
          >
            <Plus className="h-4 w-4" />
            Schedule Drive
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, icon: Car },
            { label: "Scheduled", value: stats.scheduled, color: "text-blue-500", icon: Calendar },
            { label: "In Progress", value: stats.inProgress, color: "text-amber-500", icon: Play },
            { label: "Completed", value: stats.completed, color: "text-emerald-500", icon: CheckCircle2 },
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

        {/* Timeline Sections */}
        <div className="space-y-8">
          {/* Today */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-emerald-500' : 'bg-emerald-500'} animate-pulse`} />
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                Today
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                {groupedDrives.today.length}
              </span>
            </div>

            {groupedDrives.today.length === 0 ? (
              <div className={`text-center py-8 rounded-xl border-2 border-dashed
                ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No drives scheduled for today</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedDrives.today.map(drive => (
                  <DriveCard key={drive.id} drive={drive} isDarkMode={isDarkMode} onUpdateStatus={updateStatus} />
                ))}
              </div>
            )}
          </section>

          {/* Upcoming */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-blue-500' : 'bg-blue-500'}`} />
              <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                Upcoming
              </h2>
              <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                {groupedDrives.upcoming.length}
              </span>
            </div>

            {groupedDrives.upcoming.length === 0 ? (
              <div className={`text-center py-8 rounded-xl border-2 border-dashed
                ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
                <p className="text-sm">No upcoming drives</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {groupedDrives.upcoming.map(drive => (
                  <DriveCard key={drive.id} drive={drive} isDarkMode={isDarkMode} onUpdateStatus={updateStatus} />
                ))}
              </div>
            )}
          </section>

          {/* Past */}
          {groupedDrives.past.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-3 h-3 rounded-full ${isDarkMode ? 'bg-gray-500' : 'bg-gray-400'}`} />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Past
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  {groupedDrives.past.length}
                </span>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                {groupedDrives.past.slice(0, 6).map(drive => (
                  <DriveCard key={drive.id} drive={drive} isDarkMode={isDarkMode} onUpdateStatus={updateStatus} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Schedule Test Drive
              </h2>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <form onSubmit={scheduleDrive} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Lead (Optional)
                </label>
                <select
                  value={formData.leadId}
                  onChange={(e) => setFormData({ ...formData, leadId: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                >
                  <option value="">Walk-in Customer</option>
                  {leads.map(lead => (
                    <option key={lead.id} value={lead.id}>{lead.name}</option>
                  ))}
                </select>
              </div>

              {!formData.leadId && (
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Customer Name
                  </label>
                  <input
                    type="text"
                    required={!formData.leadId}
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vehicle *
                </label>
                <select
                  required
                  value={formData.vehicle}
                  onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                >
                  <option value="">Select vehicle...</option>
                  {VEHICLES.map(v => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={2}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                  placeholder="Special requests..."
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-medium transition-colors ${isDarkMode
                  ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                  : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
              >
                Schedule Drive
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Complete Test Drive
              </h2>
              <button onClick={() => setShowFeedbackModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Customer Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star className={`h-8 w-8 ${rating >= star ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Feedback
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                  placeholder="Customer feedback..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Premium Drive Card
function DriveCard({
  drive,
  isDarkMode,
  onUpdateStatus
}: {
  drive: TestDrive
  isDarkMode: boolean
  onUpdateStatus: (id: number, status: string) => void
}) {
  const statusConfig: Record<string, { bg: string, text: string, border: string }> = {
    "Scheduled": { bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", text: "text-blue-500", border: "border-blue-500/20" },
    "In Progress": { bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", text: "text-amber-500", border: "border-amber-500/20" },
    "Completed": { bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-500/20" },
    "Cancelled": { bg: isDarkMode ? "bg-red-500/10" : "bg-red-50", text: "text-red-500", border: "border-red-500/20" }
  }

  const config = statusConfig[drive.status] || statusConfig["Scheduled"]

  return (
    <div className={`group relative rounded-xl p-4 transition-all hover:scale-[1.01]
      ${isDarkMode
        ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
        : 'bg-white border border-gray-200 hover:shadow-lg'}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {drive.customerName}
          </h4>
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <Car className="h-3.5 w-3.5" />
            <span className="truncate">{drive.vehicle}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {drive.status}
        </span>
      </div>

      {/* Time Info */}
      <div className={`flex items-center gap-4 text-xs p-2.5 rounded-lg mb-3
        ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-1.5">
          <Calendar className={`h-3.5 w-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {format(parseISO(drive.date), "MMM d")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className={`h-3.5 w-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {drive.time}
          </span>
        </div>
        <span className={`px-1.5 py-0.5 rounded text-[9px] ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'}`}>
          {drive.duration}m
        </span>
      </div>

      {/* Rating (if completed) */}
      {drive.status === "Completed" && drive.rating && (
        <div className={`flex items-center gap-2 text-xs p-2 rounded-lg mb-3
          ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-100'}`}>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < drive.rating! ? "text-amber-400 fill-amber-400" : isDarkMode ? "text-gray-600" : "text-gray-300"}`} />
            ))}
          </div>
          {drive.feedback && (
            <span className={`truncate flex-1 ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
              {drive.feedback}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {drive.status === "Scheduled" && (
          <button
            onClick={() => onUpdateStatus(drive.id, "In Progress")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors
              ${isDarkMode
                ? 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          >
            <Play className="h-3.5 w-3.5" />
            Start Drive
          </button>
        )}
        {drive.status === "In Progress" && (
          <button
            onClick={() => onUpdateStatus(drive.id, "Completed")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors
              ${isDarkMode
                ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30'
                : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Complete
          </button>
        )}
        {drive.status === "Completed" && (
          <div className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
            ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            Completed
          </div>
        )}
      </div>
    </div>
  )
}