"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Calendar, Clock, User, Car, Wrench, Plus, ArrowRight, CalendarDays, CheckCircle2 } from "lucide-react"
import { useTheme } from "next-themes"

interface Appointment {
  id: number
  customer: string
  vehicle: string
  date: string
  serviceType: string
  status: string
}

export default function ServiceAppointmentsPage() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [jobCardDialogOpen, setJobCardDialogOpen] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  useEffect(() => {
    fetchAppointments()
  }, [])

  async function fetchAppointments() {
    try {
      const res = await fetch("/api/service/appointments")
      const json = await res.json()
      if (json.data) setAppointments(json.data)
    } catch (error) {
      console.error("Failed to fetch appointments", error)
    } finally {
      setLoading(false)
    }
  }

  async function createAppointment(formData: FormData) {
    const body = {
      customer: formData.get("customer"),
      vehicle: formData.get("vehicle"),
      date: formData.get("date"),
      serviceType: formData.get("serviceType"),
    }

    try {
      const res = await fetch("/api/service/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to create appointment")

      toast.success("Appointment scheduled")
      setDialogOpen(false)
      fetchAppointments()
    } catch (error) {
      toast.error("Failed to schedule appointment")
    }
  }

  async function createJobCard(formData: FormData) {
    if (!selectedAppointment) return

    const body = {
      appointmentId: selectedAppointment.id,
      technician: formData.get("technician"),
      notes: formData.get("notes"),
    }

    try {
      const res = await fetch("/api/service/job-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Failed to create job card")

      toast.success("Job Card created")
      setJobCardDialogOpen(false)
      fetchAppointments()
    } catch (error) {
      toast.error("Failed to create job card")
    }
  }

  const scheduled = appointments.filter(a => a.status === "Scheduled")
  const inProgress = appointments.filter(a => a.status === "In Progress")
  const completed = appointments.filter(a => a.status === "Completed")

  const stats = [
    { label: "Today's", value: appointments.length, icon: Calendar, color: "text-blue-500" },
    { label: "Pending", value: scheduled.length, icon: Clock, color: "text-amber-500" },
    { label: "In Progress", value: inProgress.length, icon: Wrench, color: "text-purple-500" },
    { label: "Completed", value: completed.length, icon: CheckCircle2, color: "text-emerald-500" },
  ]

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Scheduled": return isDark ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : "bg-amber-50 text-amber-600 border-amber-200"
      case "In Progress": return isDark ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-purple-50 text-purple-600 border-purple-200"
      case "Completed": return isDark ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : "bg-emerald-50 text-emerald-600 border-emerald-200"
      default: return isDark ? "bg-zinc-800 text-zinc-400" : "bg-zinc-100 text-zinc-600"
    }
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            Service Appointments
          </h1>
          <p className={`text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Schedule and manage service appointments
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className={isDark ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]" : ""}>
              <Plus className="mr-2 h-4 w-4" /> New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Service</DialogTitle>
            </DialogHeader>
            <form action={createAppointment} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer Name</Label>
                <Input id="customer" name="customer" required placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicle">Vehicle</Label>
                <Input id="vehicle" name="vehicle" required placeholder="MH12 AB 1234 - Swift" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Service Type</Label>
                  <Select name="serviceType" defaultValue="General Service">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Service">General Service</SelectItem>
                      <SelectItem value="Oil Change">Oil Change</SelectItem>
                      <SelectItem value="Brake Service">Brake Service</SelectItem>
                      <SelectItem value="AC Service">AC Service</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Schedule Appointment</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`p-4 rounded-xl border ${isDark ? "bg-white/[0.02] border-white/10" : "bg-white border-gray-200"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                {stat.label}
              </span>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
            <div className={`text-2xl font-bold ${isDark ? "text-white" : "text-gray-900"}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Appointments Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className={`p-5 rounded-xl border transition-all hover:shadow-lg ${isDark
                ? "bg-white/[0.02] border-white/10 hover:border-white/20"
                : "bg-white border-gray-200 hover:border-gray-300"
              }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Badge className={`${getStatusStyle(apt.status)} border`}>
                {apt.status}
              </Badge>
              <div className={`text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>
                #{apt.id}
              </div>
            </div>

            {/* Customer */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <User className={`h-4 w-4 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
              </div>
              <div>
                <div className={`font-semibold ${isDark ? "text-white" : "text-gray-900"}`}>{apt.customer}</div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Customer</div>
              </div>
            </div>

            {/* Vehicle */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`p-2 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-100"}`}>
                <Car className={`h-4 w-4 ${isDark ? "text-[#D4AF37]" : "text-blue-600"}`} />
              </div>
              <div>
                <div className={`text-sm ${isDark ? "text-gray-300" : "text-gray-700"}`}>{apt.vehicle}</div>
                <div className={`text-xs ${isDark ? "text-gray-500" : "text-gray-500"}`}>Vehicle</div>
              </div>
            </div>

            {/* Details Row */}
            <div className={`flex items-center justify-between py-3 border-t ${isDark ? "border-white/10" : "border-gray-100"}`}>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <CalendarDays className={`h-3.5 w-3.5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{apt.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wrench className={`h-3.5 w-3.5 ${isDark ? "text-gray-500" : "text-gray-400"}`} />
                  <span className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}>{apt.serviceType}</span>
                </div>
              </div>
            </div>

            {/* Action */}
            {apt.status === "Scheduled" && (
              <Dialog open={jobCardDialogOpen && selectedAppointment?.id === apt.id} onOpenChange={(open) => {
                setJobCardDialogOpen(open)
                if (open) setSelectedAppointment(apt)
              }}>
                <DialogTrigger asChild>
                  <Button
                    className={`w-full mt-3 ${isDark ? "bg-[#D4AF37] text-black hover:bg-[#E5C158]" : ""}`}
                    size="sm"
                  >
                    Create Job Card <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Job Card</DialogTitle>
                  </DialogHeader>
                  <form action={createJobCard} className="space-y-4">
                    <div className={`p-3 rounded-lg ${isDark ? "bg-white/5" : "bg-gray-50"}`}>
                      <div className={`text-sm font-medium ${isDark ? "text-white" : "text-gray-900"}`}>{apt.vehicle}</div>
                      <div className={`text-xs ${isDark ? "text-gray-400" : "text-gray-500"}`}>{apt.customer} • {apt.serviceType}</div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="technician">Technician</Label>
                      <Select name="technician" required>
                        <SelectTrigger><SelectValue placeholder="Select Technician" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Rajesh Kumar">Rajesh Kumar</SelectItem>
                          <SelectItem value="Suresh Patil">Suresh Patil</SelectItem>
                          <SelectItem value="Amit Singh">Amit Singh</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Initial Notes</Label>
                      <Input id="notes" name="notes" placeholder="Customer complaints..." />
                    </div>
                    <Button type="submit" className="w-full">Create & Assign</Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </div>
        ))}

        {appointments.length === 0 && !loading && (
          <div className={`col-span-full flex flex-col items-center justify-center py-16 ${isDark ? "text-gray-500" : "text-gray-400"}`}>
            <Calendar className="h-12 w-12 mb-4 opacity-30" />
            <p className="text-sm">No appointments scheduled</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Schedule First Appointment
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}