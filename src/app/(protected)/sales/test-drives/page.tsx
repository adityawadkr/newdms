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
import { Plus, Calendar, Clock, Car, User, CheckCircle2, AlertCircle, Star, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Textarea } from "@/components/ui/textarea"
import { format, isToday, isFuture, isPast, parseISO } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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

export default function TestDrivesPage() {
  const [drives, setDrives] = useState<TestDrive[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  // Feedback State
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [selectedDrive, setSelectedDrive] = useState<TestDrive | null>(null)
  const [feedback, setFeedback] = useState("")
  const [rating, setRating] = useState(5)

  useEffect(() => {
    fetchDrives()
    fetchLeads()
  }, [])

  async function fetchDrives() {
    const res = await fetch("/api/sales/test-drives")
    const data = await res.json()
    if (data.data) setDrives(data.data)
  }

  async function fetchLeads() {
    const res = await fetch("/api/sales/leads")
    const data = await res.json()
    if (data.data) setLeads(data.data)
  }

  async function scheduleDrive(formData: FormData) {
    const res = await fetch("/api/sales/test-drives", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData)),
    })

    if (res.ok) {
      setDialogOpen(false)
      fetchDrives()
      toast.success("Test Drive scheduled successfully")
    } else {
      const error = await res.json()
      if (res.status === 409) {
        toast.error("Vehicle Conflict", {
          description: error.message
        })
      } else {
        toast.error("Failed to schedule drive")
      }
    }
  }

  async function updateStatus(id: number, status: string) {
    if (status === "Completed") {
      const drive = drives.find(d => d.id === id)
      if (drive) {
        setSelectedDrive(drive)
        setFeedbackOpen(true)
      }
      return
    }

    const res = await fetch(`/api/sales/test-drives/${id}`, {
      method: "PUT",
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
      body: JSON.stringify({
        status: "Completed",
        feedback,
        rating
      })
    })

    if (res.ok) {
      setFeedbackOpen(false)
      setSelectedDrive(null)
      setFeedback("")
      setRating(5)
      fetchDrives()
      toast.success("Drive completed & feedback saved")
    }
  }

  const groupedDrives = {
    today: drives.filter(d => isToday(parseISO(d.date))),
    upcoming: drives.filter(d => isFuture(parseISO(d.date)) && !isToday(parseISO(d.date))),
    past: drives.filter(d => isPast(parseISO(d.date)) && !isToday(parseISO(d.date)))
  }

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] p-2 space-y-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 px-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Test Drives</h1>
          <p className="text-[10px] text-muted-foreground">Schedule and manage vehicle test drives.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 text-xs">
              <Plus className="mr-1.5 h-3 w-3" /> Schedule Drive
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Test Drive</DialogTitle>
            </DialogHeader>
            <form action={scheduleDrive} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="leadId">Select Lead (Optional)</Label>
                <Select name="leadId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select a lead..." />
                  </SelectTrigger>
                  <SelectContent>
                    {leads.map(lead => (
                      <SelectItem key={lead.id} value={String(lead.id)}>
                        {lead.name} - {lead.vehicleInterest}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name (If not a lead)</Label>
                <Input name="customerName" placeholder="Walk-in Customer Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Select name="vehicle" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Hyundai Creta SX(O)">Hyundai Creta SX(O)</SelectItem>
                    <SelectItem value="Kia Seltos GTX+">Kia Seltos GTX+</SelectItem>
                    <SelectItem value="Mahindra XUV700 AX7">Mahindra XUV700 AX7</SelectItem>
                    <SelectItem value="Tata Harrier Fearless">Tata Harrier Fearless</SelectItem>
                    <SelectItem value="Volkswagen Virtus GT">Volkswagen Virtus GT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input id="time" name="time" type="time" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea name="notes" placeholder="Special requests, license check..." />
              </div>
              <Button type="submit" className="w-full">Schedule Drive</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto space-y-6 px-2 pb-4">
        {/* Today's Drives */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar className="h-3 w-3" /> Today
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupedDrives.today.length === 0 && <p className="text-xs text-zinc-400 italic col-span-full">No drives scheduled for today.</p>}
            {groupedDrives.today.map(drive => (
              <DriveCard key={drive.id} drive={drive} onUpdateStatus={updateStatus} />
            ))}
          </div>
        </section>

        {/* Upcoming Drives */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock className="h-3 w-3" /> Upcoming
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupedDrives.upcoming.length === 0 && <p className="text-xs text-zinc-400 italic col-span-full">No upcoming drives.</p>}
            {groupedDrives.upcoming.map(drive => (
              <DriveCard key={drive.id} drive={drive} onUpdateStatus={updateStatus} />
            ))}
          </div>
        </section>

        {/* Past Drives */}
        <section>
          <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-3 w-3" /> Past & Completed
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {groupedDrives.past.map(drive => (
              <DriveCard key={drive.id} drive={drive} onUpdateStatus={updateStatus} />
            ))}
          </div>
        </section>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Test Drive</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Customer Rating</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 hover:scale-110 transition-transform ${rating >= star ? "text-yellow-400" : "text-zinc-200"}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Feedback & Notes</Label>
              <Textarea
                placeholder="Customer feedback, vehicle condition..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={submitFeedback}>Save & Complete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DriveCard({ drive, onUpdateStatus }: { drive: TestDrive, onUpdateStatus: (id: number, status: string) => void }) {
  const statusColors: any = {
    "Scheduled": "bg-blue-50 text-blue-700 border-blue-200",
    "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
    "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200",
    "Cancelled": "bg-red-50 text-red-700 border-red-200"
  }

  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-sm text-zinc-900">{drive.customerName}</h4>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
            <Car className="h-3.5 w-3.5" />
            {drive.vehicle}
          </div>
        </div>
        <Badge variant="secondary" className={`text-[10px] px-2 py-0.5 border font-medium ${statusColors[drive.status] || "bg-zinc-100"}`}>
          {drive.status}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-4 bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5 text-zinc-400" />
          {format(parseISO(drive.date), "MMM d")}
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5 text-zinc-400" />
          {drive.time} <span className="text-zinc-300">|</span> {drive.duration}m
        </div>
      </div>

      {drive.assignedToName && (
        <div className="flex items-center gap-2 mb-4">
          <Avatar className="h-6 w-6 border border-zinc-100">
            <AvatarImage src={drive.assignedToImage} />
            <AvatarFallback className="text-[9px] bg-zinc-100 text-zinc-600">{drive.assignedToName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[11px] text-zinc-600">Assigned to <span className="font-medium text-zinc-900">{drive.assignedToName}</span></span>
        </div>
      )}

      {drive.status === "Completed" && drive.rating && (
        <div className="flex items-center gap-2 mb-4 bg-yellow-50/80 p-2 rounded-lg border border-yellow-100/50">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-3 w-3 ${i < drive.rating! ? "text-yellow-400 fill-current" : "text-zinc-200"}`} />
            ))}
          </div>
          {drive.feedback && <span className="text-[10px] text-zinc-600 truncate flex-1 border-l border-yellow-200 pl-2">{drive.feedback}</span>}
        </div>
      )}

      <div className="flex gap-2 mt-auto">
        {drive.status === "Scheduled" && (
          <Button size="sm" variant="outline" className="w-full h-8 text-xs font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900" onClick={() => onUpdateStatus(drive.id, "In Progress")}>
            Start Drive
          </Button>
        )}
        {drive.status === "In Progress" && (
          <Button size="sm" className="w-full h-8 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-white shadow-none" onClick={() => onUpdateStatus(drive.id, "Completed")}>
            Complete Drive
          </Button>
        )}
        {drive.status === "Completed" && (
          <Button size="sm" variant="ghost" className="w-full h-8 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700" disabled>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Completed
          </Button>
        )}
      </div>
    </div>
  )
}