"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, FileText, Trash2, Calculator, Wrench, User, Clock, IndianRupee } from "lucide-react"
import { useTheme } from "next-themes"

interface JobCard {
  id: number
  jobNo: string
  technician: string
  status: string
  notes: string
  partsData: string
  laborCharges: number
  totalAmount: number
  invoiceStatus: string
  createdAt: number
}

interface Part {
  id: number
  name: string
  sku: string
  sellingPrice: number
  stock: number
}

interface SelectedPart {
  partId: number
  name: string
  price: number
  quantity: number
}

export default function JobCardsPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [jobCards, setJobCards] = useState<JobCard[]>([])
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedJob, setSelectedJob] = useState<JobCard | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Form State
  const [selectedParts, setSelectedParts] = useState<SelectedPart[]>([])
  const [laborCharges, setLaborCharges] = useState(0)
  const [status, setStatus] = useState("In Progress")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    fetchJobCards()
    fetchParts()
  }, [])

  async function fetchJobCards() {
    try {
      const res = await fetch("/api/service/job-cards")
      const json = await res.json()
      if (json.data) setJobCards(json.data)
    } catch (error) {
      console.error("Failed to fetch job cards", error)
    } finally {
      setLoading(false)
    }
  }

  async function fetchParts() {
    try {
      const res = await fetch("/api/inventory/spare-parts?lowStock=false")
      const json = await res.json()
      if (json.data) setParts(json.data)
    } catch (error) {
      console.error("Failed to fetch parts", error)
    }
  }

  useEffect(() => {
    if (selectedJob) {
      setStatus(selectedJob.status)
      setNotes(selectedJob.notes || "")
      setLaborCharges(selectedJob.laborCharges || 0)
      try {
        setSelectedParts(selectedJob.partsData ? JSON.parse(selectedJob.partsData) : [])
      } catch {
        setSelectedParts([])
      }
    }
  }, [selectedJob])

  const addPart = (partId: string) => {
    const part = parts.find(p => p.id === Number(partId))
    if (!part) return

    const existing = selectedParts.find(p => p.partId === part.id)
    if (existing) {
      setSelectedParts(selectedParts.map(p => p.partId === part.id ? { ...p, quantity: p.quantity + 1 } : p))
    } else {
      setSelectedParts([...selectedParts, { partId: part.id, name: part.name, price: part.sellingPrice, quantity: 1 }])
    }
  }

  const removePart = (partId: number) => {
    setSelectedParts(selectedParts.filter(p => p.partId !== partId))
  }

  const totalPartsCost = selectedParts.reduce((acc, p) => acc + (p.price * p.quantity), 0)
  const grandTotal = totalPartsCost + laborCharges

  async function updateJobCard() {
    if (!selectedJob) return

    const body = {
      status,
      notes,
      partsData: selectedParts,
      laborCharges,
      totalAmount: grandTotal,
      invoiceStatus: status === "Completed" ? "Generated" : selectedJob.invoiceStatus
    }

    try {
      const res = await fetch(`/api/service/job-cards/${selectedJob.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to update job card")

      toast.success(status === "Completed" ? "Job Completed & Invoice Generated" : "Job Card Updated")
      setDialogOpen(false)
      fetchJobCards()
    } catch (error) {
      toast.error("Failed to update job card")
    }
  }

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed": return isDark ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-600 border-emerald-200"
      case "In Progress": return isDark ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-blue-50 text-blue-600 border-blue-200"
      case "Waiting for Parts": return isDark ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-600 border-amber-200"
      default: return isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"
    }
  }

  const inProgress = jobCards.filter(j => j.status === "In Progress").length
  const completed = jobCards.filter(j => j.status === "Completed").length
  const totalRevenue = jobCards.reduce((acc, j) => acc + (j.totalAmount || 0), 0)

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
          Job Cards
        </h1>
        <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          Manage service jobs and generate invoices
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Total Jobs</div>
          <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>{jobCards.length}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>In Progress</div>
          <div className="text-2xl font-bold text-blue-500">{inProgress}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Completed</div>
          <div className="text-2xl font-bold text-emerald-500">{completed}</div>
        </div>
        <div className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}>
          <div className={`text-xs uppercase tracking-wider mb-1 ${isDark ? "text-gray-500" : "text-gray-400"}`}>Revenue</div>
          <div className={`text-2xl font-bold ${isDark ? "text-[#D4AF37]" : "text-green-600"}`}>₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {jobCards.map((job) => (
          <div
            key={job.id}
            className={`p-5 rounded-xl border transition-all hover:shadow-lg ${isDark
              ? "bg-white/[0.02] border-white/10 hover:border-white/20"
              : "bg-white border-gray-200 hover:border-gray-300"
              }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className={`font-mono text-xs ${isDark ? "border-white/20" : ""}`}>
                {job.jobNo}
              </Badge>
              <Badge className={`${getStatusStyle(job.status)} border`}>
                {job.status}
              </Badge>
            </div>

            {/* Technician */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <User className={`h-4 w-4 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
              </div>
              <div>
                <div className={`font-medium text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{job.technician}</div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Assigned Technician</div>
              </div>
            </div>

            {/* Notes */}
            <div className={`p-3 rounded-lg mb-4 ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
              <div className={`text-xs font-medium mb-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>Notes</div>
              <p className={`text-sm line-clamp-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {job.notes || "No notes provided."}
              </p>
            </div>

            {/* Amount */}
            <div className={`flex items-center justify-between py-3 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
              <div className="flex items-center gap-2">
                <IndianRupee className={`h-4 w-4 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                <span className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>Total Amount</span>
              </div>
              <span className={`text-lg font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
                ₹{(job.totalAmount || 0).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 mt-3">
              {job.status === "Completed" && (
                <Button
                  variant="outline"
                  size="sm"
                  className={`flex-1 ${isDark ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10" : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"}`}
                  onClick={() => window.open(`/invoice/service?jobId=${job.id}`, '_blank')}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  View Invoice
                </Button>
              )}
              <Dialog open={dialogOpen && selectedJob?.id === job.id} onOpenChange={(open) => {
                setDialogOpen(open)
                if (open) setSelectedJob(job)
              }}>
                <DialogTrigger asChild>
                  <Button
                    className={`flex-1 ${job.status !== "Completed" && isDark ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]" : ""}`}
                    variant={job.status === "Completed" ? "outline" : "default"}
                    size="sm"
                  >
                    {job.status === "Completed" ? "Details" : "Update Job"}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Job Card: {job.jobNo}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    {/* Status & Notes */}
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Status</Label>
                        <Select value={status} onValueChange={setStatus} disabled={job.status === "Completed"}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="In Progress">In Progress</SelectItem>
                            <SelectItem value="Waiting for Parts">Waiting for Parts</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Technician Notes</Label>
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Work done details..."
                          disabled={job.status === "Completed"}
                        />
                      </div>
                    </div>

                    {/* Parts Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className={`text-sm font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>Spare Parts</h3>
                        {job.status !== "Completed" && (
                          <Select onValueChange={addPart}>
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Add Part..." />
                            </SelectTrigger>
                            <SelectContent>
                              {parts.map(p => (
                                <SelectItem key={p.id} value={String(p.id)} disabled={p.stock <= 0}>
                                  {p.name} (₹{p.sellingPrice})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      </div>

                      <div className={`border rounded-lg p-4 space-y-3 ${isDark ? "bg-white/[0.02] border-white/10" : "bg-gray-50 border-gray-200"}`}>
                        {selectedParts.length === 0 ? (
                          <p className={`text-sm text-center py-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>No parts added.</p>
                        ) : (
                          selectedParts.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex-1">
                                <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{p.name}</div>
                                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>₹{p.price} × {p.quantity}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>₹{p.price * p.quantity}</div>
                                {job.status !== "Completed" && (
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500" onClick={() => removePart(p.partId)}>
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Billing */}
                    <div className="space-y-4">
                      <h3 className={`text-sm font-semibold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}>
                        <Calculator className="h-4 w-4" /> Billing
                      </h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Labor Charges (₹)</Label>
                          <Input
                            type="number"
                            value={laborCharges}
                            onChange={(e) => setLaborCharges(Number(e.target.value))}
                            disabled={job.status === "Completed"}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Parts Cost</Label>
                          <div className={`h-10 flex items-center px-3 border rounded-md ${isDark ? "bg-white/5 border-white/10 text-gray-300" : "bg-gray-100 text-gray-700"}`}>
                            ₹{totalPartsCost.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                      <div className={`flex justify-between items-center p-4 rounded-xl ${isDark ? "bg-emerald-500/10" : "bg-emerald-50"}`}>
                        <span className={`font-bold text-lg ${isDark ? "text-white" : "text-gray-900"}`}>Grand Total</span>
                        <span className="font-bold text-2xl text-emerald-500">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {job.status !== "Completed" && (
                      <Button onClick={updateJobCard} className={`w-full ${isDark ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]" : ""}`} size="lg">
                        {status === "Completed" ? "Complete Job & Generate Invoice" : "Update Job Card"}
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        ))}

        {jobCards.length === 0 && !loading && (
          <div className={`col-span-full flex flex-col items-center justify-center py-16 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <Wrench className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">No job cards assigned</p>
            <p className={`text-xs mt-1 ${isDark ? "text-gray-600" : "text-gray-400"}`}>Create jobs from Appointments page</p>
          </div>
        )}
      </div>
    </div>
  )
}