"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, FileText, Plus, Trash2, Calculator } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface JobCard {
  id: number
  jobNo: string
  technician: string
  status: string
  notes: string
  partsData: string // JSON string
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

  // Initialize form when job selected
  useEffect(() => {
    if (selectedJob) {
      setStatus(selectedJob.status)
      setNotes(selectedJob.notes || "")
      setLaborCharges(selectedJob.laborCharges || 0)
      try {
        setSelectedParts(selectedJob.partsData ? JSON.parse(selectedJob.partsData) : [])
      } catch (e) {
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

  const updateQuantity = (partId: number, qty: number) => {
    if (qty < 1) return
    setSelectedParts(selectedParts.map(p => p.partId === partId ? { ...p, quantity: qty } : p))
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-emerald-500"
      case "In Progress": return "bg-blue-500"
      default: return "bg-slate-500"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Job Cards</h1>
        <p className="text-muted-foreground">View and manage your assigned service jobs.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {jobCards.map((job) => (
          <Card key={job.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="font-mono">{job.jobNo}</Badge>
                <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
              </div>
              <CardTitle className="mt-2">Service Request</CardTitle>
              <CardDescription>Assigned to: {job.technician}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
              <div className="text-sm">
                <span className="font-semibold block mb-1">Notes:</span>
                <p className="text-muted-foreground line-clamp-2">{job.notes || "No notes provided."}</p>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t">
                <span className="text-muted-foreground">Total Amount:</span>
                <span className="font-bold">₹{job.totalAmount?.toLocaleString('en-IN') || 0}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={dialogOpen && selectedJob?.id === job.id} onOpenChange={(open) => {
                setDialogOpen(open)
                if (open) setSelectedJob(job)
              }}>
                <DialogTrigger asChild>
                  <Button className="w-full" variant={job.status === "Completed" ? "outline" : "default"}>
                    <FileText className="mr-2 h-4 w-4" /> {job.status === "Completed" ? "View Details" : "Update Job"}
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
                        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Work done details..." disabled={job.status === "Completed"} />
                      </div>
                    </div>

                    <Separator />

                    {/* Parts Selection */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold">Spare Parts</h3>
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

                      <div className="border rounded-md p-4 space-y-3 bg-zinc-50/50">
                        {selectedParts.length === 0 ? (
                          <p className="text-sm text-muted-foreground text-center py-2">No parts added.</p>
                        ) : (
                          selectedParts.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between text-sm">
                              <div className="flex-1">
                                <div className="font-medium">{p.name}</div>
                                <div className="text-xs text-muted-foreground">₹{p.price} x {p.quantity}</div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="font-medium">₹{p.price * p.quantity}</div>
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

                    <Separator />

                    {/* Billing */}
                    <div className="space-y-4">
                      <h3 className="text-sm font-semibold flex items-center gap-2"><Calculator className="h-4 w-4" /> Billing</h3>
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
                          <div className="h-10 flex items-center px-3 border rounded-md bg-muted text-muted-foreground">
                            ₹{totalPartsCost}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-zinc-100 rounded-lg">
                        <span className="font-bold text-lg">Grand Total</span>
                        <span className="font-bold text-2xl text-emerald-600">₹{grandTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    {job.status !== "Completed" && (
                      <Button onClick={updateJobCard} className="w-full mt-4" size="lg">
                        {status === "Completed" ? "Complete Job & Generate Invoice" : "Update Job Card"}
                      </Button>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
        {jobCards.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <CheckCircle2 className="h-12 w-12 mb-4 opacity-20" />
            <p>No job cards assigned.</p>
          </div>
        )}
      </div>
    </div>
  )
}