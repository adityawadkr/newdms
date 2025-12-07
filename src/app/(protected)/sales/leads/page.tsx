"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Plus, MoreHorizontal, Trash2, Phone, MessageCircle, Mail, X,
  Flame, Snowflake, ThermometerSun, Clock, Car, Banknote, Users,
  TrendingUp, Filter, Search, ChevronRight, CheckCircle2, XCircle
} from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"

interface Lead {
  id: number
  name: string
  phone: string
  email: string
  source: string
  status: string
  vehicleInterest: any
  temperature: string
  score: number
  nextAction: string
  nextActionDate: string
  lastContacted: string
  financeStatus?: string
  lostReason?: string
  assignedUser?: {
    name: string
    image: string
  }
  createdAt: number
}

const COLUMNS = [
  { id: "New", title: "New Leads", statuses: ["New"], gradient: "from-blue-500 to-indigo-600" },
  { id: "Contacted", title: "Contacted", statuses: ["Contacted"], gradient: "from-amber-500 to-orange-500" },
  { id: "Active", title: "Test Drive & Negotiation", statuses: ["Test Drive", "Negotiation"], gradient: "from-purple-500 to-pink-500" },
  { id: "Won", title: "Won", statuses: ["Won"], gradient: "from-emerald-500 to-green-600" },
]

const ALL_STATUSES = ["New", "Contacted", "Test Drive", "Negotiation", "Won", "Lost"]

// Premium Lead Card Component
function PremiumLeadCard({
  lead,
  isDarkMode,
  onStatusChange,
  onDelete,
  onToggleFinance
}: {
  lead: Lead
  isDarkMode: boolean
  onStatusChange: (id: number, status: string) => void
  onDelete: (id: number) => void
  onToggleFinance: (lead: Lead) => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  const getTempConfig = (temp: string) => {
    switch (temp) {
      case "Hot": return { icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" }
      case "Warm": return { icon: ThermometerSun, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" }
      default: return { icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" }
    }
  }

  const tempConfig = getTempConfig(lead.temperature || "Cold")
  const TempIcon = tempConfig.icon

  let vehicleInterest = null
  try {
    vehicleInterest = lead.vehicleInterest ? JSON.parse(lead.vehicleInterest) : null
  } catch (e) {
    vehicleInterest = lead.vehicleInterest
  }

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation()
    const phone = lead.phone.replace(/\D/g, '')
    window.open(`https://wa.me/${phone}`, '_blank')
  }

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.location.href = `tel:${lead.phone}`
  }

  return (
    <div className={`group relative rounded-xl p-3 transition-all duration-300 cursor-pointer
      hover:scale-[1.02] hover:-translate-y-0.5
      ${isDarkMode
        ? 'bg-white/[0.03] border border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
        : 'bg-white border border-gray-200 hover:border-gray-300 hover:shadow-lg'
      }`}
    >
      {/* Temperature Indicator Bar */}
      <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-full ${tempConfig.bg}`}
        style={{
          background: lead.temperature === 'Hot' ? 'linear-gradient(to bottom, #f97316, #ea580c)' :
            lead.temperature === 'Warm' ? 'linear-gradient(to bottom, #f59e0b, #d97706)' :
              'linear-gradient(to bottom, #60a5fa, #3b82f6)'
        }} />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-2 pl-2">
        <div className="min-w-0 flex-1">
          <h4 className={`font-semibold text-sm truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {lead.name}
          </h4>
          <p className={`text-[10px] truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {lead.source}
          </p>
        </div>

        {/* Score Badge */}
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${tempConfig.bg} ${tempConfig.border} ${tempConfig.color}`}>
          <TempIcon className="h-3 w-3" />
          <span>{lead.score || 0}</span>
        </div>
      </div>

      {/* Vehicle Interest */}
      {vehicleInterest && (
        <div className="flex items-center gap-2 mb-2 pl-2">
          <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-medium
            ${isDarkMode ? 'bg-white/5 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
            <Car className="h-3 w-3" />
            <span className="truncate">{vehicleInterest.model || vehicleInterest}</span>
          </div>
          {lead.financeStatus && (
            <div className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              ✓ {lead.financeStatus}
            </div>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div className={`flex items-center gap-2 text-[11px] pl-2 mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        <Phone className="h-3 w-3" />
        <span className="truncate">{lead.phone}</span>
      </div>

      {/* Next Action */}
      {lead.nextAction && (
        <div className={`flex items-center gap-2 text-[10px] px-2 py-1.5 rounded-lg ml-2 mb-2
          ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20 text-blue-400' : 'bg-blue-50 border border-blue-100 text-blue-700'}`}>
          <Clock className="h-3 w-3 shrink-0" />
          <span className="truncate font-medium">{lead.nextAction}</span>
          {lead.nextActionDate && (
            <span className="opacity-60">• {formatDistanceToNow(new Date(lead.nextActionDate), { addSuffix: true })}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 pl-2 border-t border-dashed
        ${isDarkMode ? 'border-white/10' : 'border-gray-200'}">
        {/* Quick Actions */}
        <div className="flex gap-1">
          <button
            onClick={handleWhatsApp}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode
              ? 'hover:bg-green-500/20 text-gray-500 hover:text-green-400'
              : 'hover:bg-green-100 text-gray-400 hover:text-green-600'}`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={handleCall}
            className={`p-1.5 rounded-lg transition-colors ${isDarkMode
              ? 'hover:bg-blue-500/20 text-gray-500 hover:text-blue-400'
              : 'hover:bg-blue-100 text-gray-400 hover:text-blue-600'}`}
          >
            <Phone className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2">
          {lead.assignedUser && (
            <div className={`h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-bold
              ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-200 text-gray-500'}`}
              title={lead.assignedUser.name}>
              {lead.assignedUser.image ? (
                <img src={lead.assignedUser.image} alt="" className="h-full w-full object-cover rounded-full" />
              ) : (
                lead.assignedUser.name?.charAt(0)
              )}
            </div>
          )}
          <span className={`text-[9px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Hover Menu */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu) }}
          className={`p-1.5 rounded-lg ${isDarkMode
            ? 'bg-white/10 hover:bg-white/20 text-gray-400'
            : 'bg-gray-100 hover:bg-gray-200 text-gray-500'}`}
        >
          <MoreHorizontal className="h-3.5 w-3.5" />
        </button>

        {showMenu && (
          <div className={`absolute top-full right-0 mt-1 w-36 rounded-lg shadow-xl z-50 py-1 
            ${isDarkMode ? 'bg-[#111] border border-white/10' : 'bg-white border border-gray-200'}`}
            onClick={(e) => e.stopPropagation()}>
            {ALL_STATUSES.filter(s => s !== lead.status).map(status => (
              <button
                key={status}
                onClick={() => { onStatusChange(lead.id, status); setShowMenu(false) }}
                className={`w-full text-left px-3 py-1.5 text-xs transition-colors
                  ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
              >
                Move to {status}
              </button>
            ))}
            <div className={`my-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
            <button
              onClick={() => { onToggleFinance(lead); setShowMenu(false) }}
              className={`w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 transition-colors
                ${isDarkMode ? 'hover:bg-white/5 text-gray-300' : 'hover:bg-gray-50 text-gray-700'}`}
            >
              <Banknote className="h-3 w-3" />
              {lead.financeStatus ? "Clear Finance" : "Pre-Approve"}
            </button>
            <div className={`my-1 h-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
            <button
              onClick={() => { onDelete(lead.id); setShowMenu(false) }}
              className="w-full text-left px-3 py-1.5 text-xs flex items-center gap-2 text-red-500 hover:bg-red-500/10"
            >
              <Trash2 className="h-3 w-3" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PremiumLeadsPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showLost, setShowLost] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showLostModal, setShowLostModal] = useState(false)
  const [leadToMarkLost, setLeadToMarkLost] = useState<Lead | null>(null)
  const [lostReason, setLostReason] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  // Form state
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", vehicleInterest: "", source: "Walk-in"
  })

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    setLoading(true)
    try {
      const res = await fetch("/api/sales/leads")
      const data = await res.json()
      if (data.data) setLeads(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function createLead(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch("/api/sales/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    if (res.ok) {
      setShowAddModal(false)
      setFormData({ name: "", phone: "", email: "", vehicleInterest: "", source: "Walk-in" })
      fetchLeads()
      toast.success("Lead created successfully")
    } else {
      const error = await res.json()
      if (error.duplicate) {
        toast.error("Lead already exists!", { description: "A lead with this phone or email is already in the system." })
      } else {
        toast.error("Failed to create lead")
      }
    }
  }

  async function updateLeadStatus(id: number, newStatus: string) {
    if (newStatus === "Lost") {
      const lead = leads.find(l => l.id === id)
      if (lead) {
        setLeadToMarkLost(lead)
        setShowLostModal(true)
      }
      return
    }

    const res = await fetch(`/api/sales/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    })

    if (res.ok) {
      fetchLeads()
      toast.success(`Lead moved to ${newStatus}`)
    }
  }

  async function confirmLostLead() {
    if (!leadToMarkLost) return

    const res = await fetch(`/api/sales/leads/${leadToMarkLost.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Lost", lostReason }),
    })

    if (res.ok) {
      setShowLostModal(false)
      setLeadToMarkLost(null)
      setLostReason("")
      fetchLeads()
      toast.success("Lead marked as Lost")
    }
  }

  async function deleteLead(id: number) {
    if (!confirm("Delete this lead permanently?")) return

    const res = await fetch(`/api/sales/leads/${id}`, { method: "DELETE" })

    if (res.ok) {
      fetchLeads()
      toast.success("Lead deleted")
    }
  }

  async function toggleFinance(lead: Lead) {
    const newStatus = lead.financeStatus === "Pre-Approved" ? null : "Pre-Approved"
    const res = await fetch(`/api/sales/leads/${lead.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ financeStatus: newStatus })
    })

    if (res.ok) {
      fetchLeads()
      toast.success(newStatus ? "Marked as Pre-Approved" : "Finance status cleared")
    }
  }

  // Filter leads by search
  const filteredLeads = searchQuery
    ? leads.filter(l =>
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.phone.includes(searchQuery) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : leads

  // Calculate pipeline stats
  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === "New").length,
    contacted: leads.filter(l => l.status === "Contacted").length,
    active: leads.filter(l => ["Test Drive", "Negotiation"].includes(l.status)).length,
    won: leads.filter(l => l.status === "Won").length,
    lost: leads.filter(l => l.status === "Lost").length,
    hot: leads.filter(l => l.temperature === "Hot").length,
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                SALES PIPELINE
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Lead Management
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border
              ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200'}`}>
              <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`bg-transparent outline-none text-sm w-40
                  ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
              />
            </div>

            <button
              onClick={() => setShowLost(!showLost)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                ${showLost
                  ? isDarkMode ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-red-100 text-red-700 border border-red-200'
                  : isDarkMode ? 'bg-white/5 text-gray-400 border border-white/10 hover:bg-white/10' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
            >
              {showLost ? "Hide Lost" : "Show Lost"}
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isDarkMode
                  ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                  : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
            >
              <Plus className="h-4 w-4" />
              Add Lead
            </button>
          </div>
        </div>

        {/* Pipeline Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 mb-6">
          {[
            { label: "Total Leads", value: stats.total, icon: Users },
            { label: "New", value: stats.new, color: "text-blue-500" },
            { label: "Contacted", value: stats.contacted, color: "text-amber-500" },
            { label: "Active", value: stats.active, color: "text-purple-500" },
            { label: "Won", value: stats.won, color: "text-emerald-500", icon: CheckCircle2 },
            { label: "Hot Leads", value: stats.hot, icon: Flame, color: "text-orange-500" },
          ].map((stat, i) => (
            <div key={i} className={`p-3 rounded-xl border transition-all
              ${isDarkMode ? 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]' : 'bg-white border-gray-200 hover:shadow-md'}`}>
              <div className="flex items-center justify-between mb-1">
                <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {stat.label}
                </span>
                {stat.icon && <stat.icon className={`h-4 w-4 ${stat.color || (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />}
              </div>
              <p className={`text-xl font-bold ${stat.color || (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 'calc(100vh - 280px)' }}>
          {COLUMNS.map((col) => {
            const columnLeads = filteredLeads.filter(l => col.statuses.includes(l.status))
            return (
              <div key={col.id} className={`flex-1 min-w-[280px] flex flex-col rounded-xl overflow-hidden
                ${isDarkMode ? 'bg-white/[0.02] border border-white/10' : 'bg-gray-100/50 border border-gray-200'}`}>

                {/* Column Header */}
                <div className={`p-3 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${col.gradient}`} />
                      <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {col.title}
                      </h3>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                      ${isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-white text-gray-500 border border-gray-200'}`}>
                      {columnLeads.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                  {loading ? (
                    <div className="space-y-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className={`h-32 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
                      ))}
                    </div>
                  ) : columnLeads.length === 0 ? (
                    <div className={`text-center py-8 text-xs ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      No leads
                    </div>
                  ) : (
                    columnLeads.map(lead => (
                      <PremiumLeadCard
                        key={lead.id}
                        lead={lead}
                        isDarkMode={isDarkMode}
                        onStatusChange={updateLeadStatus}
                        onDelete={deleteLead}
                        onToggleFinance={toggleFinance}
                      />
                    ))
                  )}
                </div>
              </div>
            )
          })}

          {/* Lost Column */}
          {showLost && (
            <div className={`flex-1 min-w-[280px] flex flex-col rounded-xl overflow-hidden
              ${isDarkMode ? 'bg-red-500/5 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
              <div className={`p-3 border-b ${isDarkMode ? 'border-red-500/20' : 'border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <h3 className={`text-xs font-semibold uppercase tracking-wider ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                      Lost
                    </h3>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                    ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}>
                    {filteredLeads.filter(l => l.status === "Lost").length}
                  </span>
                </div>
              </div>
              <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                {filteredLeads.filter(l => l.status === "Lost").map(lead => (
                  <div key={lead.id} className="opacity-60 hover:opacity-100 transition-opacity">
                    <PremiumLeadCard
                      lead={lead}
                      isDarkMode={isDarkMode}
                      onStatusChange={updateLeadStatus}
                      onDelete={deleteLead}
                      onToggleFinance={toggleFinance}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Add New Lead
              </h2>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <form onSubmit={createLead} className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white focus:border-[#D4AF37]'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#003366]'
                    } focus:outline-none`}
                  placeholder="John Doe"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                    placeholder="+91 98765 43210"
                  />
                </div>
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
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Vehicle Interest
                </label>
                <input
                  type="text"
                  value={formData.vehicleInterest}
                  onChange={(e) => setFormData({ ...formData, vehicleInterest: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                  placeholder="e.g. Hyundai Creta SX(O)"
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Source
                </label>
                <select
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                </select>
              </div>

              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-medium transition-colors ${isDarkMode
                  ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                  : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
              >
                Add Lead
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Lost Reason Modal */}
      {showLostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Mark Lead as Lost
              </h2>
              <button onClick={() => setShowLostModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Reason for Loss
                </label>
                <textarea
                  value={lostReason}
                  onChange={(e) => setLostReason(e.target.value)}
                  rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm resize-none ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                  placeholder="e.g. Price too high, bought competitor vehicle..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowLostModal(false)}
                  className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                    ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLostLead}
                  className="flex-1 py-2.5 rounded-xl font-medium bg-red-500 text-white hover:bg-red-600"
                >
                  Confirm Loss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}