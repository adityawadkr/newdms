"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Calendar, Clock, User, Car, Wrench, Plus } from "lucide-react"

interface Appointment {
  id: number
  customer: string
  vehicle: string
  date: string
  serviceType: string
  status: string
}

export default function ServiceAppointmentsPage() {
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
      fetchAppointments() // Refresh to see status update
    } catch (error) {
      toast.error("Failed to create job card")
    }
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Appointments</h1>
          <p className="text-muted-foreground">Manage appointments and assign job cards.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
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
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Service">General Service</SelectItem>
                      <SelectItem value="Oil Change">Oil Change</SelectItem>
                      <SelectItem value="Repair">Repair</SelectItem>
                      <SelectItem value="Inspection">Inspection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button type="submit" className="w-full">Schedule</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Job Cards</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === "Scheduled").length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Wrench className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{appointments.filter(a => a.status === "In Progress").length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appointments List</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.customer}</TableCell>
                  <TableCell>{apt.vehicle}</TableCell>
                  <TableCell>{apt.date}</TableCell>
                  <TableCell>{apt.serviceType}</TableCell>
                  <TableCell>
                    <Badge variant={apt.status === "Scheduled" ? "outline" : apt.status === "In Progress" ? "secondary" : "default"}>
                      {apt.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {apt.status === "Scheduled" && (
                      <Dialog open={jobCardDialogOpen && selectedAppointment?.id === apt.id} onOpenChange={(open) => {
                        setJobCardDialogOpen(open)
                        if (open) setSelectedAppointment(apt)
                      }}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="default">Create Job Card</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Assign Job Card</DialogTitle>
                            <CardDescription>Assign a technician to {apt.vehicle}</CardDescription>
                          </DialogHeader>
                          <form action={createJobCard} className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="technician">Technician</Label>
                              <Select name="technician" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Technician" />
                                </SelectTrigger>
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
                  </TableCell>
                </TableRow>
              ))}
              {appointments.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No appointments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}