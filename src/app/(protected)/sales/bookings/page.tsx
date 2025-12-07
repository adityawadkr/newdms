"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import {
  Plus, Calendar, CreditCard, CheckCircle2, Clock, Receipt, Car, X,
  Search, Filter, TrendingUp, Truck, AlertCircle, ArrowRight
} from "lucide-react"
import { toast } from "sonner"
import { format, parseISO, addDays, differenceInDays } from "date-fns"

interface Booking {
  id: number
  customer: string
  vehicle: string
  quotationNo: string
  bookingAmount: number
  paymentStatus: string
  paymentMode: string
  deliveryDate: string
  status: string
  createdAt: number
}

interface Quotation {
  id: number
  number: string
  customer: string
  vehicle: string
  total: number
  status: string
}

export default function PremiumBookingsPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [bookings, setBookings] = useState<Booking[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [showReceiptModal, setShowReceiptModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Wizard state
  const [step, setStep] = useState(1)
  const [selectedQuotation, setSelectedQuotation] = useState("")
  const [formData, setFormData] = useState({
    customer: "",
    vehicle: "",
    quotationNo: "",
    bookingAmount: 5000,
    paymentMode: "UPI",
    deliveryDate: format(addDays(new Date(), 7), "yyyy-MM-dd")
  })

  useEffect(() => {
    fetchBookings()
    fetchQuotations()
  }, [])

  async function fetchBookings() {
    setLoading(true)
    try {
      const res = await fetch("/api/sales/bookings")
      const data = await res.json()
      if (data.data) setBookings(data.data)
    } finally {
      setLoading(false)
    }
  }

  async function fetchQuotations() {
    const res = await fetch("/api/sales/quotations")
    const data = await res.json()
    if (data.data) setQuotations(data.data.filter((q: Quotation) => q.status !== "Accepted"))
  }

  const handleQuotationSelect = (qId: string) => {
    setSelectedQuotation(qId)
    const quote = quotations.find(q => String(q.id) === qId)
    if (quote) {
      setFormData({
        ...formData,
        customer: quote.customer,
        vehicle: quote.vehicle,
        quotationNo: quote.number
      })
    }
  }

  async function createBooking() {
    const res = await fetch("/api/sales/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        quotationId: selectedQuotation || null,
        ...formData
      })
    })

    if (res.ok) {
      setShowAddModal(false)
      resetForm()
      fetchBookings()
      toast.success("Booking confirmed!")
    } else {
      toast.error("Failed to create booking")
    }
  }

  function resetForm() {
    setStep(1)
    setSelectedQuotation("")
    setFormData({
      customer: "",
      vehicle: "",
      quotationNo: "",
      bookingAmount: 5000,
      paymentMode: "UPI",
      deliveryDate: format(addDays(new Date(), 7), "yyyy-MM-dd")
    })
  }

  async function updatePaymentStatus(id: number, status: string) {
    const res = await fetch(`/api/sales/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paymentStatus: status })
    })
    if (res.ok) {
      fetchBookings()
      toast.success(`Payment marked as ${status}`)
    }
  }

  // Filter and search
  const filteredBookings = bookings
    .filter(b => {
      if (filterStatus !== "all" && b.paymentStatus !== filterStatus) return false
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return b.customer.toLowerCase().includes(q) ||
          b.vehicle.toLowerCase().includes(q) ||
          b.quotationNo.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => b.createdAt - a.createdAt)

  // Stats
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.paymentStatus === "Pending").length,
    paid: bookings.filter(b => b.paymentStatus === "Paid").length,
    totalValue: bookings.reduce((acc, b) => acc + b.bookingAmount, 0),
    upcomingDeliveries: bookings.filter(b => {
      if (!b.deliveryDate) return false
      const days = differenceInDays(parseISO(b.deliveryDate), new Date())
      return days >= 0 && days <= 7
    }).length
  }

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
              Bookings
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
            New Booking
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
          {[
            { label: "Total Bookings", value: stats.total, icon: Receipt },
            { label: "Pending Payment", value: stats.pending, icon: Clock, color: "text-amber-500" },
            { label: "Paid", value: stats.paid, icon: CheckCircle2, color: "text-emerald-500" },
            { label: "Total Value", value: `₹${(stats.totalValue / 1000).toFixed(0)}K`, icon: TrendingUp },
            { label: "Upcoming Deliveries", value: stats.upcomingDeliveries, icon: Truck, color: "text-blue-500" },
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

        {/* Search & Filter */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg flex-1 max-w-xs
            ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'}`}>
            <Search className={`h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`bg-transparent outline-none text-sm w-full
                ${isDarkMode ? 'text-white placeholder:text-gray-500' : 'text-gray-900 placeholder:text-gray-400'}`}
            />
          </div>

          <div className="flex gap-2">
            {["all", "Pending", "Paid"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors
                  ${filterStatus === status
                    ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                    : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
              >
                {status === "all" ? "All" : status}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className={`h-48 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-200'}`} />
            ))
          ) : filteredBookings.length === 0 ? (
            <div className={`col-span-full text-center py-12 rounded-xl border-2 border-dashed
              ${isDarkMode ? 'border-white/10 text-gray-500' : 'border-gray-200 text-gray-400'}`}>
              <Receipt className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No bookings found</p>
            </div>
          ) : (
            filteredBookings.map(booking => (
              <BookingCard
                key={booking.id}
                booking={booking}
                isDarkMode={isDarkMode}
                onMarkPaid={() => updatePaymentStatus(booking.id, "Paid")}
                onViewReceipt={() => { setSelectedBooking(booking); setShowReceiptModal(true) }}
              />
            ))
          )}
        </div>
      </div>

      {/* Add Booking Modal - 2 Step Wizard */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  New Booking
                </h2>
                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Step {step} of 2
                </p>
              </div>
              <button onClick={() => { setShowAddModal(false); resetForm() }} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            {/* Progress */}
            <div className="flex gap-2 mb-6">
              <div className={`h-1 flex-1 rounded-full ${step >= 1 ? (isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]') : (isDarkMode ? 'bg-white/10' : 'bg-gray-200')}`} />
              <div className={`h-1 flex-1 rounded-full ${step >= 2 ? (isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]') : (isDarkMode ? 'bg-white/10' : 'bg-gray-200')}`} />
            </div>

            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Select Quotation (Optional)
                  </label>
                  <select
                    value={selectedQuotation}
                    onChange={(e) => handleQuotationSelect(e.target.value)}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                  >
                    <option value="">Direct Booking (No Quote)</option>
                    {quotations.map(q => (
                      <option key={q.id} value={q.id}>{q.number} - {q.customer}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.customer}
                    onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Vehicle *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.vehicle}
                    onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                    placeholder="Hyundai Creta SX(O)"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  disabled={!formData.customer || !formData.vehicle}
                  className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                    ${isDarkMode
                      ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158] disabled:opacity-50'
                      : 'bg-[#003366] text-white hover:bg-[#004488] disabled:opacity-50'}`}
                >
                  Next: Payment Details <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Booking Amount (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.bookingAmount}
                      onChange={(e) => setFormData({ ...formData, bookingAmount: Number(e.target.value) })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                        ? 'bg-white/5 border border-white/10 text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                        } focus:outline-none`}
                    />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Payment Mode
                    </label>
                    <select
                      value={formData.paymentMode}
                      onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value })}
                      className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                        ? 'bg-white/5 border border-white/10 text-white'
                        : 'bg-gray-50 border border-gray-200 text-gray-900'
                        } focus:outline-none`}
                    >
                      <option value="UPI">UPI</option>
                      <option value="Card">Card</option>
                      <option value="Cash">Cash</option>
                      <option value="Transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Tentative Delivery Date
                  </label>
                  <input
                    type="date"
                    value={formData.deliveryDate}
                    onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                    className={`w-full px-4 py-2.5 rounded-xl text-sm ${isDarkMode
                      ? 'bg-white/5 border border-white/10 text-white'
                      : 'bg-gray-50 border border-gray-200 text-gray-900'
                      } focus:outline-none`}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setStep(1)}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                      ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Back
                  </button>
                  <button
                    onClick={createBooking}
                    className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                      ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Booking Receipt
              </h2>
              <button onClick={() => setShowReceiptModal(false)} className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}>
                <X className={`h-5 w-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
              </button>
            </div>

            <div className={`text-center pb-4 mb-4 border-b ${isDarkMode ? 'border-white/10' : 'border-gray-200'}`}>
              <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>AutoFlow</h3>
              <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Official Booking Receipt</p>
            </div>

            <div className="space-y-3 mb-4">
              {[
                { label: "Receipt No.", value: `RCPT-${selectedBooking.id.toString().padStart(6, '0')}` },
                { label: "Date", value: format(new Date(), "PPP") },
                { label: "Customer", value: selectedBooking.customer },
                { label: "Vehicle", value: selectedBooking.vehicle },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{item.label}</span>
                  <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.value}</span>
                </div>
              ))}
            </div>

            <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Amount Paid</span>
                <span className={`text-xl font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
                  ₹{selectedBooking.bookingAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className={isDarkMode ? 'text-gray-500' : 'text-gray-500'}>Payment Mode</span>
                <span className={isDarkMode ? 'text-gray-300' : 'text-gray-700'}>{selectedBooking.paymentMode}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReceiptModal(false)}
                className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className={`flex-1 py-2.5 rounded-xl font-medium ${isDarkMode
                  ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                  : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
              >
                Print
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Booking Card Component
function BookingCard({
  booking,
  isDarkMode,
  onMarkPaid,
  onViewReceipt
}: {
  booking: Booking
  isDarkMode: boolean
  onMarkPaid: () => void
  onViewReceipt: () => void
}) {
  const daysUntilDelivery = booking.deliveryDate
    ? differenceInDays(parseISO(booking.deliveryDate), new Date())
    : null

  return (
    <div className={`group relative rounded-xl p-4 transition-all hover:scale-[1.01]
      ${isDarkMode
        ? 'bg-white/[0.03] border border-white/10 hover:border-white/20'
        : 'bg-white border border-gray-200 hover:shadow-lg'}`}
    >
      {/* Status indicator */}
      <div className={`absolute left-0 top-4 bottom-4 w-1 rounded-full
        ${booking.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} />

      {/* Header */}
      <div className="flex items-start justify-between mb-3 pl-3">
        <div>
          <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {booking.customer}
          </h4>
          <div className={`flex items-center gap-1.5 text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            <Car className="h-3.5 w-3.5" />
            <span className="truncate">{booking.vehicle}</span>
          </div>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
          ${booking.paymentStatus === 'Paid'
            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
            : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
          }`}>
          {booking.paymentStatus}
        </span>
      </div>

      {/* Details */}
      <div className={`grid grid-cols-2 gap-3 p-3 rounded-lg mb-3 ml-3
        ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
        <div>
          <p className={`text-[10px] uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Amount
          </p>
          <p className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            ₹{booking.bookingAmount.toLocaleString()}
          </p>
        </div>
        <div>
          <p className={`text-[10px] uppercase tracking-wider mb-0.5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Delivery
          </p>
          <p className={`text-sm font-semibold flex items-center gap-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            <Calendar className="h-3.5 w-3.5 opacity-50" />
            {booking.deliveryDate ? format(parseISO(booking.deliveryDate), "MMM d") : "TBD"}
          </p>
        </div>
      </div>

      {/* Delivery countdown */}
      {daysUntilDelivery !== null && daysUntilDelivery >= 0 && (
        <div className={`text-xs px-3 py-1.5 rounded-lg mb-3 ml-3 flex items-center gap-2
          ${daysUntilDelivery <= 3
            ? isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-600'
            : isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-600'
          }`}>
          <Truck className="h-3.5 w-3.5" />
          {daysUntilDelivery === 0 ? "Delivery today!" : `${daysUntilDelivery} days to delivery`}
        </div>
      )}

      {/* Meta */}
      <div className={`flex items-center justify-between text-[10px] mb-3 ml-3 ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        <span className="flex items-center gap-1">
          <Receipt className="h-3 w-3" />
          {booking.quotationNo || "Direct"}
        </span>
        <span className="flex items-center gap-1">
          <CreditCard className="h-3 w-3" />
          {booking.paymentMode}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 ml-3">
        {booking.paymentStatus === "Pending" && (
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
          onClick={onViewReceipt}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
            ${isDarkMode
              ? 'bg-white/5 text-gray-300 hover:bg-white/10'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          <Receipt className="h-3.5 w-3.5" />
          Receipt
        </button>
      </div>
    </div>
  )
}