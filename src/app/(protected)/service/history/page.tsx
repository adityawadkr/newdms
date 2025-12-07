"use client"

import * as React from "react"
import { History, Search, Download, Calendar, Car, User, IndianRupee, FileText, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useTheme } from "next-themes"
import { toast } from "sonner"

type ServiceRecord = {
  id: string
  customer: string
  vehicle: string
  jobNo: string
  date: string
  amount: number
}

export default function ServiceHistoryPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [rows, setRows] = React.useState<ServiceRecord[]>([])
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")

  React.useEffect(() => {
    let ignore = false
    const load = async () => {
      try {
        setError(null)
        const res = await fetch("/api/service-history?limit=100")
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || "Failed to load service history")
        if (!ignore) {
          const mapped: ServiceRecord[] = (data?.data || []).map((r: any) => ({
            id: String(r.id),
            customer: r.customer,
            vehicle: r.vehicle,
            jobNo: r.jobNo,
            date: r.date,
            amount: Number(r.amount),
          }))
          setRows(mapped)
        }
      } catch (e: any) {
        if (!ignore) setError(e.message || "Error loading service history")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [])

  const filteredRows = searchQuery
    ? rows.filter(r =>
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jobNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : rows

  const totalRevenue = rows.reduce((acc, r) => acc + r.amount, 0)
  const thisMonthCount = rows.filter(r => {
    const d = new Date(r.date)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const exportToCSV = () => {
    const headers = ["Customer", "Vehicle", "Job No", "Date", "Amount"]
    const csvContent = [
      headers.join(","),
      ...rows.map(r => [r.customer, r.vehicle, r.jobNo, r.date, r.amount].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "service-history.csv"
    a.click()
    toast.success("Service history exported")
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
            <History className={`h-6 w-6 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
            Service History
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            View completed service records and invoices
          </p>
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Total Records</div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{rows.length}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>This Month</div>
          <div className="text-2xl font-bold text-blue-500">{thisMonthCount}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Total Revenue</div>
          <div className={`text-2xl font-bold ${isDark ? "text-[#D4AF37]" : "text-green-600"}`}>₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Avg. Amount</div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
            ₹{rows.length ? Math.round(totalRevenue / rows.length).toLocaleString('en-IN') : 0}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className={`relative max-w-md ${isDark ? "" : ""}`}>
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
        <Input
          placeholder="Search by customer, vehicle, or job no..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`pl-10 ${isDark ? "bg-white/[0.02] border-white/10" : ""}`}
        />
      </div>

      {/* Loading/Error */}
      {loading && (
        <div className={`text-center py-8 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Loading service history...
        </div>
      )}
      {error && (
        <div className="text-center py-8 text-red-500">{error}</div>
      )}

      {/* Records Grid */}
      {!loading && !error && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRows.map((r) => (
            <div
              key={r.id}
              className={`p-5 rounded-xl border transition-all hover:shadow-lg ${isDark
                  ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                  : "bg-white border-gray-200 hover:border-gray-300"
                }`}
            >
              {/* Job No Badge */}
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className={`font-mono text-xs ${isDark ? "border-white/20" : ""}`}>
                  {r.jobNo}
                </Badge>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                  {r.date}
                </div>
              </div>

              {/* Customer */}
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <User className={`h-4 w-4 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
                </div>
                <div>
                  <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{r.customer}</div>
                  <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Customer</div>
                </div>
              </div>

              {/* Vehicle */}
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                  <Car className={`h-4 w-4 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
                </div>
                <div>
                  <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{r.vehicle}</div>
                  <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Vehicle</div>
                </div>
              </div>

              {/* Amount */}
              <div className={`flex items-center justify-between pt-3 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Invoice Amount</span>
                <span className={`text-lg font-bold ${isDark ? "text-emerald-400" : "text-emerald-600"}`}>
                  ₹{r.amount.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}

          {filteredRows.length === 0 && !loading && (
            <div className={`col-span-full flex flex-col items-center justify-center py-16 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
              <FileText className="h-12 w-12 mb-4 opacity-30" />
              <p className="text-sm">{searchQuery ? "No matching records found" : "No service history yet"}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}