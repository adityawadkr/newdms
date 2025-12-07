"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  CheckCircle2, Calendar, Camera, ClipboardCheck, PartyPopper, Car, X,
  Truck, Clock, AlertCircle, Gift, FileCheck, Key, Book, Sparkles, FileText, Plus
} from "lucide-react"
import { toast } from "sonner"
import { format, parseISO, differenceInDays, isToday } from "date-fns"
import confetti from "canvas-confetti"

interface Delivery {
  id: number
  bookingId: number
  customer: string
  vehicle: string
  pdiStatus: string
  checklist: string
  status: string
  deliveryDate: string
}

interface Booking {
  id: number
  customer: string
  vehicle: string
  status: string
}

const CHECKLIST_ITEMS = [
  { key: "keys", label: "Spare Keys Handed Over", icon: Key },
  { key: "manual", label: "Owner's Manual & Guide", icon: Book },
  { key: "accessories", label: "Accessories Installed", icon: Gift },
  { key: "cleanliness", label: "Vehicle Cleaned & Polished", icon: Sparkles },
  { key: "documents", label: "All Documents Ready", icon: FileText },
]

export default function PremiumDeliveryPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPdiModal, setShowPdiModal] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)

  const [newDeliveryData, setNewDeliveryData] = useState({
    bookingId: "",
    deliveryDate: format(new Date(), "yyyy-MM-dd")
  })

  const [checklistData, setChecklistData] = useState<Record<string, boolean>>({
    keys: false, manual: false, accessories: false, cleanliness: false, documents: false
  })

  useEffect(() => {
    fetchDeliveries()
    fetchBookings()
  }, [])

  async function fetchDeliveries() {
    setLoading(true)
    try {
      const res = await fetch("/api/sales/deliveries")
      const data = await res.json()
      if (data.data) setDeliveries(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function fetchBookings() {
    const res = await fetch("/api/sales/bookings")
    const data = await res.json()
    if (data.data) setBookings(data.data.filter((b: Booking) => b.status === "Confirmed"))
  }

  async function scheduleDelivery() {
    const res = await fetch("/api/sales/deliveries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newDeliveryData)
    })

    if (res.ok) {
      setShowAddModal(false)
      fetchDeliveries()
      toast.success("Delivery scheduled!")
      setNewDeliveryData({ bookingId: "", deliveryDate: format(new Date(), "yyyy-MM-dd") })
    } else {
      toast.error("Failed to schedule delivery")
    }
  }

  const openPdiDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    if (delivery.checklist) {
      try {
        setChecklistData(JSON.parse(delivery.checklist))
      } catch {
        setChecklistData({ keys: false, manual: false, accessories: false, cleanliness: false, documents: false })
      }
    } else {
      setChecklistData({ keys: false, manual: false, accessories: false, cleanliness: false, documents: false })
    }
    setShowPdiModal(true)
  }

  const savePdi = async (complete: boolean) => {
    if (!selectedDelivery) return

    const res = await fetch(`/api/sales/deliveries/${selectedDelivery.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        checklist: JSON.stringify(checklistData),
        pdiStatus: complete ? "Passed" : "Pending",
        status: complete ? "Completed" : "Ready"
      })
    })

    if (res.ok) {
      setShowPdiModal(false)
      fetchDeliveries()
      if (complete) {
        triggerCelebration()
        toast.success("🎉 Delivery Completed!")
      } else {
        toast.success("Checklist saved")
      }
    }
  }

  const triggerCelebration = () => {
    const duration = 3000
    const end = Date.now() + duration
      ; (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#D4AF37', '#ffffff'] })
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#003366', '#ffffff'] })
        if (Date.now() < end) requestAnimationFrame(frame)
      })()
  }

  // Group deliveries
  const grouped = {
    today: deliveries.filter(d => isToday(parseISO(d.deliveryDate)) && d.status !== "Completed"),
    pending: deliveries.filter(d => d.status === "Scheduled" && !isToday(parseISO(d.deliveryDate))),
    ready: deliveries.filter(d => d.status === "Ready"),
    completed: deliveries.filter(d => d.status === "Completed")
  }

  // Stats
  const stats = {
    total: deliveries.length,
    scheduled: deliveries.filter(d => d.status === "Scheduled").length,
    ready: deliveries.filter(d => d.status === "Ready").length,
    completed: deliveries.filter(d => d.status === "Completed").length,
    todayCount: grouped.today.length
  }

  const completedPercent = Object.values(checklistData).filter(Boolean).length / CHECKLIST_ITEMS.length * 100

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              SALES
            </span>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Delivery Management
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
            Schedule Delivery
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total", value: stats.total, icon: Truck },
            { label: "Scheduled", value: stats.scheduled, icon: Calendar, color: "text-blue-500" },
            { label: "Ready for Handover", value: stats.ready, icon: ClipboardCheck, color: "text-amber-500" },
            { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Today", value: stats.todayCount, icon: Clock, color: "text-purple-500" },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border transition-all hover:scale-[1.02]
              ${isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-white border-gray-200'}`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {stat.label}
                </span>
                <stat.icon className={`h-4 w-4 ${stat.color || (isDarkMode ? 'text-gray-500' : 'text-gray-400')}`} />
              </div>
              <p className={`text-xl font-bold ${stat.color || (isDarkMode ? 'text-white' : 'text-gray-900')}`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Today's Deliveries */}
          {grouped.today.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-500 animate-pulse" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                  Today's Deliveries
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                  {grouped.today.length}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.today.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} isDarkMode={isDarkMode} onPdi={() => openPdiDialog(delivery)} />
                ))}
              </div>
            </section>
          )}

          {/* Ready for Handover */}
          {grouped.ready.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                  Ready for Handover
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                  {grouped.ready.length}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.ready.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} isDarkMode={isDarkMode} onPdi={() => openPdiDialog(delivery)} />
                ))}
              </div>
            </section>
          )}

          {/* Scheduled */}
          {grouped.pending.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Scheduled
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                  {grouped.pending.length}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {grouped.pending.map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} isDarkMode={isDarkMode} onPdi={() => openPdiDialog(delivery)} />
                ))}
              </div>
            </section>
          )}

          {/* Completed */}
          {grouped.completed.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <h2 className={`text-sm font-semibold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                  Completed
                </h2>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                  {grouped.completed.length}
                </span>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                {grouped.completed.slice(0, 6).map(delivery => (
                  <DeliveryCard key={delivery.id} delivery={delivery} isDarkMode={isDarkMode} onPdi={() => openPdiDialog(delivery)} />
                ))}
              </div>
            </section>
          )}

          {deliveries.length === 0 && !loading && (
            <div className={`text-center py-16 rounded-xl border-2 border-dashed
              ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              <Truck className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No deliveries scheduled</p>
              <p className="text-sm mt-1">Schedule your first delivery to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Delivery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Schedule Delivery
              </h2>
              <button onClick={() => setShowAddModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Select Booking *
                </label>
                <select
                  value={newDeliveryData.bookingId}
                  onChange={(e) => setNewDeliveryData({ ...newDeliveryData, bookingId: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                >
                  <option value="">Select a confirmed booking...</option>
                  {bookings.map(b => (
                    <option key={b.id} value={b.id}>{b.customer} - {b.vehicle}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Delivery Date *
                </label>
                <input
                  type="date"
                  value={newDeliveryData.deliveryDate}
                  onChange={(e) => setNewDeliveryData({ ...newDeliveryData, deliveryDate: e.target.value })}
                  className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                    ? 'bg-white/5 border border-white/10 text-white'
                    : 'bg-gray-50 border border-gray-200 text-gray-900'
                    } focus:outline-none`}
                />
              </div>

              <button
                onClick={scheduleDelivery}
                disabled={!newDeliveryData.bookingId}
                className={`w-full py-3 rounded-xl font-medium transition-colors
                  ${isDarkMode
                    ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158] disabled:opacity-50'
                    : 'bg-[#003366] text-white hover:bg-[#004488] disabled:opacity-50'}`}
              >
                Schedule Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PDI Checklist Modal */}
      {showPdiModal && selectedDelivery && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Pre-Delivery Inspection
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  {selectedDelivery.customer} • {selectedDelivery.vehicle}
                </p>
              </div>
              <button onClick={() => setShowPdiModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Progress */}
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-1">
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Completion</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{Math.round(completedPercent)}%</span>
              </div>
              <div className={`h-2 rounded-full ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`}>
                <div
                  className={`h-full rounded-full transition-all ${completedPercent === 100 ? 'bg-emerald-500' : isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]'}`}
                  style={{ width: `${completedPercent}%` }}
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3 mb-6">
              {CHECKLIST_ITEMS.map((item) => (
                <label
                  key={item.key}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all
                    ${checklistData[item.key]
                      ? isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
                      : isDarkMode ? 'bg-white/5 border border-white/10 hover:bg-white/10' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={checklistData[item.key] || false}
                    onChange={(e) => setChecklistData({ ...checklistData, [item.key]: e.target.checked })}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors
                    ${checklistData[item.key]
                      ? 'bg-emerald-500 text-white'
                      : isDarkMode ? 'bg-white/10' : 'bg-gray-200'
                    }`}>
                    {checklistData[item.key] && <CheckCircle2 className="h-3.5 w-3.5" />}
                  </div>
                  <item.icon className={`h-4 w-4 ${checklistData[item.key] ? 'text-emerald-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                  <span className={`text-sm ${checklistData[item.key] ? (isDarkMode ? 'text-emerald-400' : 'text-emerald-700') : (isDarkMode ? 'text-gray-300' : 'text-gray-700')}`}>
                    {item.label}
                  </span>
                </label>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => savePdi(false)}
                className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Save Progress
              </button>
              <button
                onClick={() => savePdi(true)}
                disabled={completedPercent < 100}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2
                  ${completedPercent === 100
                    ? isDarkMode ? 'bg-emerald-500 text-white hover:bg-emerald-600' : 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : isDarkMode ? 'bg-white/5 text-gray-500' : 'bg-gray-100 text-gray-400'
                  }`}
              >
                <PartyPopper className="h-4 w-4" />
                Complete Delivery
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Delivery Card Component
function DeliveryCard({
  delivery,
  isDarkMode,
  onPdi
}: {
  delivery: Delivery
  isDarkMode: boolean
  onPdi: () => void
}) {
  const statusConfig: Record<string, { bg: string, text: string, border: string }> = {
    "Scheduled": { bg: isDarkMode ? "bg-blue-500/10" : "bg-blue-50", text: "text-blue-500", border: "border-blue-500/20" },
    "Ready": { bg: isDarkMode ? "bg-amber-500/10" : "bg-amber-50", text: "text-amber-500", border: "border-amber-500/20" },
    "Completed": { bg: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50", text: "text-emerald-500", border: "border-emerald-500/20" }
  }

  const config = statusConfig[delivery.status] || statusConfig["Scheduled"]
  const daysUntil = differenceInDays(parseISO(delivery.deliveryDate), new Date())

  return (
    <div className={`group relative rounded-xl p-4 transition-all hover:scale-[1.01]
      ${isDarkMode
        ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
        : 'bg-white border border-gray-200 hover:shadow-lg'}`}
    >
      {/* Completed ribbon */}
      {delivery.status === "Completed" && (
        <div className="absolute top-3 right-3">
          <PartyPopper className="h-5 w-5 text-emerald-500" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {delivery.customer}
          </h4>
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <Car className="h-3.5 w-3.5" />
            <span className="truncate">{delivery.vehicle}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {delivery.status}
        </span>
      </div>

      {/* Date & PDI Status */}
      <div className={`flex items-center gap-4 text-xs p-2.5 rounded-lg mb-3
        ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div className="flex items-center gap-1.5">
          <Calendar className={`h-3.5 w-3.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
            {format(parseISO(delivery.deliveryDate), "MMM d")}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <FileCheck className={`h-3.5 w-3.5 ${delivery.pdiStatus === 'Passed' ? 'text-emerald-500' : isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
          <span className={delivery.pdiStatus === 'Passed' ? 'text-emerald-500' : (isDarkMode ? 'text-gray-300' : 'text-gray-600')}>
            PDI: {delivery.pdiStatus || "Pending"}
          </span>
        </div>
      </div>

      {/* Days countdown */}
      {delivery.status !== "Completed" && daysUntil >= 0 && (
        <div className={`text-xs px-3 py-1.5 rounded-lg mb-3 flex items-center gap-2
          ${daysUntil === 0
            ? isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-600'
            : isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
          <Clock className="h-3.5 w-3.5" />
          {daysUntil === 0 ? "Delivery today!" : `${daysUntil} days remaining`}
        </div>
      )}

      {/* Action */}
      {delivery.status !== "Completed" && (
        <button
          onClick={onPdi}
          className={`w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-colors
            ${isDarkMode
              ? 'bg-white/5 text-gray-300 hover:bg-white/10'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <ClipboardCheck className="h-3.5 w-3.5" />
          PDI Checklist
        </button>
      )}
    </div>
  )
}