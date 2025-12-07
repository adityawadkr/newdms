"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  DollarSign,
  Receipt,
  Banknote,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Plus,
  Download,
  Eye
} from "lucide-react"

// ============================================================================
// PREMIUM SUMMARY CARD
// ============================================================================
const SummaryCard = ({ title, value, subtitle, icon: Icon, trend, isDarkMode }: any) => {
  const isPositive = trend >= 0

  return (
    <div className="luxury-card relative p-5 overflow-hidden group">
      <div className={`absolute top-0 left-0 right-0 h-[2px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500
        ${isDarkMode ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6B2]' : 'bg-gradient-to-r from-[#003366] to-[#0066CC]'}
      `} />

      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#D4AF37]/10' : 'bg-[#003366]/10'}`}>
          <Icon size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold
            ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
          `}>
            {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
            {isPositive ? '+' : ''}{trend}%
          </div>
        )}
      </div>

      <div className={`text-[10px] font-mono uppercase tracking-[0.1em] mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {title}
      </div>
      <div className={`text-2xl sm:text-3xl font-serif font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
        {value}
      </div>
      {subtitle && (
        <div className={`text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{subtitle}</div>
      )}
    </div>
  )
}

// ============================================================================
// CASH FLOW CHART
// ============================================================================
const CashFlowChart = ({ isDarkMode, data }: any) => {
  const maxVal = Math.max(...data.map((d: any) => Math.max(d.inflow, d.outflow)))

  return (
    <div className="relative h-full w-full">
      <div className="flex items-end justify-between h-[200px] gap-2 sm:gap-4 px-2">
        {data.map((item: any, i: number) => {
          const inflowHeight = (item.inflow / maxVal) * 100
          const outflowHeight = (item.outflow / maxVal) * 100

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
              <div className="flex items-end gap-1 h-[160px]">
                {/* Inflow bar */}
                <div
                  className={`w-3 sm:w-4 rounded-t-md transition-all duration-500 group-hover:brightness-110
                    ${isDarkMode
                      ? 'bg-gradient-to-t from-[#D4AF37] to-[#F5E6B2]'
                      : 'bg-gradient-to-t from-[#003366] to-[#0066CC]'}
                  `}
                  style={{ height: `${inflowHeight}%`, boxShadow: isDarkMode ? '0 0 12px rgba(212,175,55,0.3)' : undefined }}
                  title={`Inflow: ₹${(item.inflow / 100000).toFixed(1)}L`}
                />
                {/* Outflow bar */}
                <div
                  className={`w-3 sm:w-4 rounded-t-md transition-all duration-500 group-hover:brightness-110
                    ${isDarkMode
                      ? 'bg-gradient-to-t from-red-500/80 to-red-400'
                      : 'bg-gradient-to-t from-red-600 to-red-400'}
                  `}
                  style={{ height: `${outflowHeight}%` }}
                  title={`Outflow: ₹${(item.outflow / 100000).toFixed(1)}L`}
                />
              </div>
              <span className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                {item.month}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// STATUS BADGE
// ============================================================================
const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    Paid: { bg: 'bg-emerald-500/10', text: 'text-emerald-500', icon: CheckCircle },
    Pending: { bg: 'bg-amber-500/10', text: 'text-amber-500', icon: Clock },
    Overdue: { bg: 'bg-red-500/10', text: 'text-red-500', icon: AlertCircle },
  }
  const c = config[status] || config.Pending
  const Icon = c.icon

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${c.bg} ${c.text}`}>
      <Icon size={10} />
      {status}
    </span>
  )
}

// ============================================================================
// MAIN FINANCE PAGE
// ============================================================================
export default function FinancePage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)
  const [showPaymentModal, setShowPaymentModal] = React.useState(false)
  const [paymentData, setPaymentData] = React.useState({ invoice: "", amount: "", method: "bank" })
  const router = useRouter()

  React.useEffect(() => { setMounted(true) }, [])

  const cashflowData = [
    { month: "Jan", inflow: 520000, outflow: 360000 },
    { month: "Feb", inflow: 560000, outflow: 380000 },
    { month: "Mar", inflow: 590000, outflow: 400000 },
    { month: "Apr", inflow: 640000, outflow: 420000 },
    { month: "May", inflow: 690000, outflow: 460000 },
    { month: "Jun", inflow: 720000, outflow: 480000 },
  ]

  const invoices = [
    { number: "INV-2024-001", customer: "Rajesh Kumar", amount: 2650000, date: "Dec 2", status: "Paid", vehicle: "S-Class S500" },
    { number: "INV-2024-002", customer: "Priya Sharma", amount: 1890000, date: "Dec 4", status: "Pending", vehicle: "A8 L" },
    { number: "INV-2024-003", customer: "Amit Patel", amount: 3250000, date: "Nov 28", status: "Overdue", vehicle: "Cayenne Turbo" },
    { number: "INV-2024-004", customer: "Karan Malhotra", amount: 2390000, date: "Dec 5", status: "Paid", vehicle: "7 Series" },
    { number: "INV-2024-005", customer: "Sneha Reddy", amount: 1650000, date: "Dec 6", status: "Pending", vehicle: "GLS 450" },
  ]

  const summaries = [
    { title: "Accounts Receivable", value: "₹45.8L", subtitle: "12 open invoices", icon: ArrowUpRight, trend: 8.5 },
    { title: "Accounts Payable", value: "₹18.5L", subtitle: "8 pending payments", icon: ArrowDownRight, trend: -3.2 },
    { title: "Cash on Hand", value: "₹1.45Cr", subtitle: "Available balance", icon: Banknote, trend: 12.4 },
  ]

  const handleRecordPayment = () => {
    if (!paymentData.invoice || !paymentData.amount) {
      toast.error("Please fill all fields")
      return
    }
    toast.success(`Payment of ₹${paymentData.amount} recorded for ${paymentData.invoice}`)
    setShowPaymentModal(false)
    setPaymentData({ invoice: "", amount: "", method: "bank" })
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">Accounting</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Finance & Accounting
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/invoice/create"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode
                  ? 'border-[#D4AF37]/20 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'border-[#003366]/20 bg-[#003366]/10 hover:bg-[#003366]/20 text-[#003366]'}
              `}
            >
              <Receipt size={14} /> New Invoice
            </Link>
            <button
              onClick={() => setShowPaymentModal(true)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}
              `}
            >
              <CreditCard size={14} /> Record Payment
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
          {summaries.map((s, i) => (
            <SummaryCard key={s.title} {...s} isDarkMode={isDarkMode} />
          ))}
        </div>

        {/* Cash Flow Chart */}
        <div className="luxury-card p-5 sm:p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Cash Flow
              </h2>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Inflow vs Outflow · Last 6 Months
              </p>
            </div>
            <div className="flex items-center gap-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]'}`} />
                <span className="opacity-60">Inflow</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <span className="opacity-60">Outflow</span>
              </div>
            </div>
          </div>
          <CashFlowChart isDarkMode={isDarkMode} data={cashflowData} />
        </div>

        {/* Invoices Table */}
        <div className="luxury-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Recent Invoices
              </h2>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Vehicle sales invoicing
              </p>
            </div>
            <Link
              href="/invoice"
              className={`flex items-center gap-1 text-xs font-medium ${isDarkMode ? 'text-[#D4AF37] hover:text-[#E5C158]' : 'text-[#003366] hover:text-[#0055AA]'}`}
            >
              View All <Eye size={12} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  <th className="text-left pb-4 font-medium">Invoice</th>
                  <th className="text-left pb-4 font-medium">Customer</th>
                  <th className="text-left pb-4 font-medium hidden sm:table-cell">Vehicle</th>
                  <th className="text-right pb-4 font-medium">Amount</th>
                  <th className="text-left pb-4 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((inv, i) => (
                  <tr
                    key={inv.number}
                    className={`border-t transition-colors cursor-pointer
                      ${isDarkMode ? 'border-white/5 hover:bg-white/[0.02]' : 'border-black/5 hover:bg-black/[0.02]'}
                    `}
                  >
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <FileText size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                        <span className={`text-xs font-mono font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                          {inv.number}
                        </span>
                      </div>
                    </td>
                    <td className={`py-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {inv.customer}
                    </td>
                    <td className={`py-4 text-xs hidden sm:table-cell ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {inv.vehicle}
                    </td>
                    <td className={`py-4 text-right text-sm font-bold font-mono ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                      ₹{(inv.amount / 100000).toFixed(1)}L
                    </td>
                    <td className={`py-4 text-xs hidden md:table-cell ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {inv.date}
                    </td>
                    <td className="py-4 text-right">
                      <StatusBadge status={inv.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Invoices This Month", value: "24", icon: Receipt },
            { label: "Average Invoice Value", value: "₹22.8L", icon: DollarSign },
            { label: "Collection Rate", value: "94%", icon: TrendingUp },
            { label: "Outstanding Days", value: "12 avg", icon: Clock },
          ].map((stat, i) => (
            <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
              <div className="flex items-center gap-2 mb-2">
                <stat.icon size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {stat.label}
                </span>
              </div>
              <div className={`text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Record Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`w-full max-w-md rounded-2xl ${isDarkMode ? 'bg-[#111]' : 'bg-white'} p-6`}>
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Record Payment
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Invoice Number
                </label>
                <select
                  value={paymentData.invoice}
                  onChange={(e) => setPaymentData({ ...paymentData, invoice: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl border text-sm
                    ${isDarkMode ? 'bg-white/5 border-white/10 text-white' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                >
                  <option value="">Select Invoice</option>
                  {invoices.filter(i => i.status !== "Paid").map(inv => (
                    <option key={inv.number} value={inv.number}>{inv.number} - {inv.customer} (₹{(inv.amount / 100000).toFixed(1)}L)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Amount (₹)
                </label>
                <input
                  type="number"
                  value={paymentData.amount}
                  onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                  placeholder="Enter amount"
                  className={`w-full px-4 py-3 rounded-xl border text-sm
                    ${isDarkMode ? 'bg-white/5 border-white/10 text-white placeholder:text-gray-600' : 'bg-gray-50 border-gray-200 text-gray-900'}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["bank", "cash", "cheque"].map(method => (
                    <button
                      key={method}
                      onClick={() => setPaymentData({ ...paymentData, method })}
                      className={`py-2 px-3 rounded-lg text-xs font-medium capitalize transition-colors
                        ${paymentData.method === method
                          ? isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'
                          : isDarkMode ? 'bg-white/5 text-gray-400 hover:bg-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowPaymentModal(false)}
                className={`flex-1 py-3 rounded-xl font-medium ${isDarkMode
                  ? 'bg-white/5 text-gray-300 hover:bg-white/10'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className={`flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2
                  ${isDarkMode
                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
              >
                <CreditCard size={16} />
                Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}