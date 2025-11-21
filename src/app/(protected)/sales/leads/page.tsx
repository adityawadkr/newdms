"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, MoreHorizontal, Trash2, Banknote, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { LeadCard } from "@/components/sales/lead-card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"

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
  { id: "New", title: "New Leads", color: "bg-blue-500", statuses: ["New"] },
  { id: "Contacted", title: "Contacted", color: "bg-yellow-500", statuses: ["Contacted"] },
  { id: "Active", title: "Test Drive & Neg.", color: "bg-purple-500", statuses: ["Test Drive", "Negotiation"] },
  { id: "Won", title: "Won", color: "bg-emerald-500", statuses: ["Won"] },
]

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [showLost, setShowLost] = useState(false)

  // Lost Reason State
  const [lostDialogOpen, setLostDialogOpen] = useState(false)
  const [leadToMarkLost, setLeadToMarkLost] = useState<Lead | null>(null)
  const [lostReason, setLostReason] = useState("")

  useEffect(() => {
    fetchLeads()
  }, [])

  async function fetchLeads() {
    const res = await fetch("/api/sales/leads")
    const data = await res.json()
    if (data.data) setLeads(data.data)
  }

  async function createLead(formData: FormData) {
    const res = await fetch("/api/sales/leads", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (res.ok) {
      setDialogOpen(false)
      fetchLeads()
      toast.success("Lead created successfully")
    } else {
      const error = await res.json()
      if (error.duplicate) {
        toast.error("Lead already exists!", {
          description: "A lead with this phone or email is already in the system."
        })
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
        setLostDialogOpen(true)
      }
      return
    }

    const res = await fetch(`/api/sales/leads/${id}`, {
      method: "PUT",
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
      body: JSON.stringify({
        status: "Lost",
        lostReason: lostReason
      }),
    })

    if (res.ok) {
      setLostDialogOpen(false)
      setLeadToMarkLost(null)
      setLostReason("")
      fetchLeads()
      toast.success("Lead marked as Lost")
    }
  }

  async function deleteLead(id: number) {
    if (!confirm("Are you sure you want to delete this lead? This cannot be undone.")) return

    const res = await fetch(`/api/sales/leads/${id}`, {
      method: "DELETE"
    })

    if (res.ok) {
      fetchLeads()
      toast.success("Lead deleted")
    }
  }

  async function toggleFinance(lead: Lead) {
    const newStatus = lead.financeStatus === "Pre-Approved" ? null : "Pre-Approved"
    const res = await fetch(`/api/sales/leads/${lead.id}`, {
      method: "PUT",
      body: JSON.stringify({ financeStatus: newStatus })
    })

    if (res.ok) {
      fetchLeads()
      toast.success(newStatus ? "Marked as Pre-Approved" : "Finance status cleared")
    }
  }

  // All available statuses for dropdown
  const ALL_STATUSES = ["New", "Contacted", "Test Drive", "Negotiation", "Won", "Lost"]

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] p-2 space-y-2 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 px-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Lead Pipeline</h1>
          <p className="text-[10px] text-muted-foreground">Manage high-velocity sales leads.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setShowLost(!showLost)}>
            {showLost ? "Hide Lost" : "Show Lost"}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs">
                <Plus className="mr-1.5 h-3 w-3" /> Add Lead
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Lead</DialogTitle>
              </DialogHeader>
              <form action={createLead} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" required placeholder="Jane Doe" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" name="phone" required placeholder="+91 98765 43210" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="jane@example.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleInterest">Vehicle Interest</Label>
                  <Input id="vehicleInterest" name="vehicleInterest" placeholder="e.g. Hyundai Creta SX(O)" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <Select name="source" defaultValue="Walk-in">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Walk-in">Walk-in</SelectItem>
                      <SelectItem value="Website">Website</SelectItem>
                      <SelectItem value="Referral">Referral</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full">Add Lead</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 min-h-0">
        <div className="flex gap-2 h-full w-full overflow-x-auto">
          {COLUMNS.map((col) => (
            <div key={col.id} className="flex-1 min-w-[200px] flex flex-col h-full bg-zinc-50/50 rounded-lg border border-zinc-100 overflow-hidden">
              <div className="flex items-center justify-between p-2 border-b border-zinc-100 bg-white/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${col.color.replace('bg-', 'bg-').replace('/5', '')}`} />
                  <h3 className="font-semibold text-[10px] text-zinc-700 uppercase tracking-wide truncate">{col.title}</h3>
                </div>
                <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[9px] bg-white border border-zinc-200 text-zinc-500 font-medium shadow-sm shrink-0">
                  {leads.filter(l => col.statuses.includes(l.status)).length}
                </Badge>
              </div>

              <div className="flex-1 p-1.5 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-200 scrollbar-track-transparent">
                {leads.filter(l => col.statuses.includes(l.status)).map((lead) => (
                  <div key={lead.id} className="relative group">
                    <LeadCard lead={lead} />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 bg-white/90 backdrop-blur shadow-sm border border-zinc-100 hover:bg-white">
                            <MoreHorizontal className="h-3 w-3 text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {ALL_STATUSES.map(status => (
                            status !== lead.status && (
                              <DropdownMenuItem key={status} onClick={() => updateLeadStatus(lead.id, status)} className="text-xs">
                                Move to {status}
                              </DropdownMenuItem>
                            )
                          ))}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => toggleFinance(lead)} className="text-xs">
                            <Banknote className="mr-2 h-3 w-3" />
                            {lead.financeStatus ? "Clear Finance" : "Pre-Approve"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="text-xs text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete Lead
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {showLost && (
            <div className="flex-1 min-w-[200px] flex flex-col h-full bg-red-50/50 rounded-lg border border-red-100 overflow-hidden">
              <div className="flex items-center justify-between p-2 border-b border-red-100 bg-white/80 backdrop-blur-sm shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-red-500" />
                  <h3 className="font-semibold text-[10px] text-red-700 uppercase tracking-wide truncate">Lost</h3>
                </div>
                <Badge variant="secondary" className="rounded-md px-1.5 py-0 text-[9px] bg-white border border-red-200 text-red-500 font-medium shadow-sm shrink-0">
                  {leads.filter(l => l.status === "Lost").length}
                </Badge>
              </div>
              <div className="flex-1 p-1.5 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-red-200 scrollbar-track-transparent">
                {leads.filter(l => l.status === "Lost").map((lead) => (
                  <div key={lead.id} className="relative group opacity-75 hover:opacity-100 transition-opacity">
                    <LeadCard lead={lead} />
                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-5 w-5 bg-white/90 backdrop-blur shadow-sm border border-zinc-100 hover:bg-white">
                            <MoreHorizontal className="h-3 w-3 text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          <DropdownMenuItem onClick={() => updateLeadStatus(lead.id, "New")} className="text-xs">
                            Restore to New
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => deleteLead(lead.id)} className="text-xs text-red-600 focus:text-red-600">
                            <Trash2 className="mr-2 h-3 w-3" />
                            Delete Permanently
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <Dialog open={lostDialogOpen} onOpenChange={setLostDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Lead as Lost</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason for Loss</Label>
              <Textarea
                placeholder="e.g. Price too high, Bought competitor vehicle..."
                value={lostReason}
                onChange={(e) => setLostReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLostDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmLostLead}>Confirm Loss</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}