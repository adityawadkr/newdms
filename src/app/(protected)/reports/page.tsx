"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  TrendingUp,
  TrendingDown,
  Users,
  Wallet,
  CircleDollarSign,
  FileDown,
  FileSpreadsheet,
  BarChart3,
  Calendar,
  Download,
  Filter
} from "lucide-react"

// ============================================================================
// PREMIUM KPI CARD
// ============================================================================
const KPICard = ({ title, value, change, icon: Icon, isDarkMode, delay = 0 }: any) => {
  const isPositive = change >= 0

  return (
    <div
      className={`luxury-card relative p-5 overflow-hidden group`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`absolute top-0 left-0 right-0 h-[2px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500
        ${isDarkMode ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6B2]' : 'bg-gradient-to-r from-[#003366] to-[#0066CC]'}
      `} />

      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${isDarkMode ? 'bg-[#D4AF37]/10' : 'bg-[#003366]/10'}`}>
          <Icon size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
        </div>
        <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold
          ${isPositive ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}
        `}>
          {isPositive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isPositive ? '+' : ''}{change}%
        </div>
      </div>

      <div className={`text-[10px] font-mono uppercase tracking-[0.1em] mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {title}
      </div>
      <div className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
        {value}
      </div>
    </div>
  )
}

// ============================================================================
// PREMIUM AREA CHART
// ============================================================================
const PremiumAreaChart = ({ isDarkMode, data, dataKey1, dataKey2, color1, color2 }: any) => {
  const maxVal = Math.max(...data.map((d: any) => Math.max(d[dataKey1], d[dataKey2] || 0)))

  const generatePath = (key: string, color: string, opacity: number) => {
    const points = data.map((d: any, i: number) => ({
      x: (i / (data.length - 1)) * 100,
      y: 100 - ((d[key] / maxVal) * 80)
    }))

    let linePath = `M ${points[0].x} ${points[0].y}`
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1]
      const curr = points[i]
      const cpx = (prev.x + curr.x) / 2
      linePath += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`
    }

    const areaPath = `${linePath} L 100 100 L 0 100 Z`

    return { linePath, areaPath }
  }

  const path1 = generatePath(dataKey1, color1, 0.3)
  const path2 = dataKey2 ? generatePath(dataKey2, color2, 0.2) : null

  return (
    <div className="relative w-full h-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        <defs>
          <linearGradient id="areaGrad1" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color1} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color1} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="areaGrad2" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color2} stopOpacity="0" />
          </linearGradient>
          <filter id="glow1">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Grid */}
        {[20, 40, 60, 80].map(y => (
          <line key={y} x1="0" y1={y} x2="100" y2={y}
            stroke={isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"} strokeWidth="0.2" />
        ))}

        {/* Area 2 (behind) */}
        {path2 && (
          <>
            <path d={path2.areaPath} fill="url(#areaGrad2)" />
            <path d={path2.linePath} fill="none" stroke={color2} strokeWidth="0.4" strokeOpacity="0.7" />
          </>
        )}

        {/* Area 1 (front) */}
        <path d={path1.areaPath} fill="url(#areaGrad1)" />
        <path d={path1.linePath} fill="none" stroke={color1} strokeWidth="0.6" filter="url(#glow1)" />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-1 text-[8px] font-mono opacity-30">
        {data.map((d: any, i: number) => (
          <span key={i} className={i % 2 === 0 ? '' : 'hidden sm:inline'}>{d.month}</span>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// PREMIUM BAR CHART (FUNNEL)
// ============================================================================
const FunnelChart = ({ isDarkMode, data }: any) => {
  const maxVal = Math.max(...data.map((d: any) => d.count))

  return (
    <div className="space-y-3">
      {data.map((item: any, i: number) => {
        const width = (item.count / maxVal) * 100
        return (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {item.stage}
              </span>
              <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                {item.count}
              </span>
            </div>
            <div className={`h-8 rounded-lg overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
              <div
                className={`h-full rounded-lg transition-all duration-700 ease-out group-hover:brightness-110
                  ${isDarkMode
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#8B7320]'
                    : 'bg-gradient-to-r from-[#003366] to-[#0066CC]'}
                `}
                style={{ width: `${width}%`, filter: isDarkMode ? 'drop-shadow(0 0 8px rgba(212,175,55,0.3))' : undefined }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// MAIN REPORTS PAGE
// ============================================================================
export default function ReportsPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)
  const [resource, setResource] = React.useState("leads")
  const [downloading, setDownloading] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const revenueData = [
    { month: "Jan", revenue: 4200000, expenses: 2800000 },
    { month: "Feb", revenue: 4800000, expenses: 3000000 },
    { month: "Mar", revenue: 5100000, expenses: 3200000 },
    { month: "Apr", revenue: 6000000, expenses: 3600000 },
    { month: "May", revenue: 6400000, expenses: 3800000 },
    { month: "Jun", revenue: 7000000, expenses: 4100000 },
  ]

  const salesFunnel = [
    { stage: "Leads Generated", count: 320 },
    { stage: "Test Drives Scheduled", count: 140 },
    { stage: "Quotations Sent", count: 90 },
    { stage: "Bookings Confirmed", count: 55 },
    { stage: "Deliveries Completed", count: 48 },
  ]

  const kpis = [
    { title: "Monthly Revenue", value: "₹70L", change: 12.5, icon: Wallet },
    { title: "Gross Profit", value: "₹29L", change: 8.2, icon: CircleDollarSign },
    { title: "Active Leads", value: "320", change: 15.8, icon: Users },
    { title: "Conversion Rate", value: "15%", change: -2.1, icon: TrendingUp },
  ]

  const handleExport = async (type: "xlsx" | "pdf") => {
    try {
      setDownloading(true)
      const res = await fetch("/api/reports/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, resource }),
      })
      if (!res.ok) throw new Error("Export failed")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${resource}-report.${type}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error(e)
    } finally {
      setDownloading(false)
    }
  }

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">Analytics</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Reports & Analytics
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'}`}>
              <Calendar size={14} className="opacity-50" />
              <span className="text-xs font-medium">Last 6 Months</span>
            </div>

            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className={`h-10 px-3 rounded-xl border text-sm font-medium outline-none
                ${isDarkMode
                  ? 'bg-white/5 border-white/10 text-white'
                  : 'bg-black/5 border-black/10 text-gray-900'}
              `}
            >
              <option value="leads">Leads</option>
              <option value="vehicles">Vehicles</option>
              <option value="quotations">Quotations</option>
              <option value="bookings">Bookings</option>
            </select>

            <button
              onClick={() => handleExport("xlsx")}
              disabled={downloading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode
                  ? 'border-[#D4AF37]/20 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'border-[#003366]/20 bg-[#003366]/10 hover:bg-[#003366]/20 text-[#003366]'}
              `}
            >
              <FileSpreadsheet size={14} /> Export XLSX
            </button>
            <button
              onClick={() => handleExport("pdf")}
              disabled={downloading}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}
              `}
            >
              <FileDown size={14} /> Export PDF
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {kpis.map((kpi, i) => (
            <KPICard key={kpi.title} {...kpi} isDarkMode={isDarkMode} delay={i * 100} />
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Revenue vs Expenses */}
          <div className="lg:col-span-2 luxury-card p-5 sm:p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                  Revenue vs Expenses
                </h2>
                <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  Last 6 months comparison
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]'}`} />
                  <span className="opacity-60">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${isDarkMode ? 'bg-red-400' : 'bg-red-500'}`} />
                  <span className="opacity-60">Expenses</span>
                </div>
              </div>
            </div>
            <div className="h-[260px]">
              <PremiumAreaChart
                isDarkMode={isDarkMode}
                data={revenueData}
                dataKey1="revenue"
                dataKey2="expenses"
                color1={isDarkMode ? "#D4AF37" : "#003366"}
                color2={isDarkMode ? "#EF4444" : "#DC2626"}
              />
            </div>
          </div>

          {/* Sales Funnel */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="mb-6">
              <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Sales Funnel
              </h2>
              <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                Lead to delivery conversion
              </p>
            </div>
            <FunnelChart isDarkMode={isDarkMode} data={salesFunnel} />
          </div>
        </div>

        {/* Additional Insights Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="luxury-card p-5 sm:p-6">
            <h2 className={`text-lg font-serif font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Top Performing Models
            </h2>
            <div className="space-y-3">
              {[
                { model: "Mercedes-Benz S-Class", sales: 12, revenue: "₹19.8Cr" },
                { model: "BMW 7 Series", sales: 8, revenue: "₹13.8Cr" },
                { model: "Audi A8 L", sales: 6, revenue: "₹8.7Cr" },
                { model: "Porsche Cayenne", sales: 5, revenue: "₹9.9Cr" },
              ].map((item, i) => (
                <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${isDarkMode ? 'bg-white/[0.02]' : 'bg-black/[0.02]'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
                      ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}
                    `}>
                      {i + 1}
                    </div>
                    <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.model}</span>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>{item.revenue}</div>
                    <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.sales} units</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="luxury-card p-5 sm:p-6">
            <h2 className={`text-lg font-serif font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Lead Sources
            </h2>
            <div className="space-y-3">
              {[
                { source: "Walk-in", count: 95, percentage: 30 },
                { source: "Website", count: 80, percentage: 25 },
                { source: "Referral", count: 64, percentage: 20 },
                { source: "Social Media", count: 48, percentage: 15 },
                { source: "Exhibition", count: 33, percentage: 10 },
              ].map((item, i) => (
                <div key={i} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.source}</span>
                    <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.count} ({item.percentage}%)</span>
                  </div>
                  <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]'}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}