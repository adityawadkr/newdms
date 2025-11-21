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
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CheckCircle2, Calendar, Camera, ClipboardCheck, PartyPopper, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import confetti from "canvas-confetti"

interface Delivery {
  id: number
  bookingId: number
  customer: string
  vehicle: string
  pdiStatus: string
  checklist: string
  status: string
  deliveryDate: string
}

interface Booking {
  id: number
  customer: string
  vehicle: string
  status: string
}

export default function DeliveryPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pdiDialogOpen, setPdiDialogOpen] = useState(false)
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(null)

  const [newDeliveryData, setNewDeliveryData] = useState({
    bookingId: "",
    deliveryDate: format(new Date(), "yyyy-MM-dd")
  })

  const [checklistData, setChecklistData] = useState({
    keys: false,
    manual: false,
    accessories: false,
    cleanliness: false,
    documents: false
  })

  useEffect(() => {
    fetchDeliveries()
    fetchBookings()
  }, [])

  async function fetchDeliveries() {
    const res = await fetch("/api/sales/deliveries")
    const data = await res.json()
    if (data.data) setDeliveries(data.data)
  }

  async function fetchBookings() {
    const res = await fetch("/api/sales/bookings")
    const data = await res.json()
    if (data.data) setBookings(data.data.filter((b: Booking) => b.status === "Confirmed"))
  }

  async function scheduleDelivery() {
    const res = await fetch("/api/sales/deliveries", {
      method: "POST",
      body: JSON.stringify(newDeliveryData)
    })

    if (res.ok) {
      setDialogOpen(false)
      fetchDeliveries()
      toast.success("Delivery scheduled successfully")
      setNewDeliveryData({ bookingId: "", deliveryDate: format(new Date(), "yyyy-MM-dd") })
    } else {
      toast.error("Failed to schedule delivery")
    }
  }

  const openPdiDialog = (delivery: Delivery) => {
    setSelectedDelivery(delivery)
    if (delivery.checklist) {
      try {
        setChecklistData(JSON.parse(delivery.checklist))
      } catch (e) {
        // Reset if parse fails
        setChecklistData({ keys: false, manual: false, accessories: false, cleanliness: false, documents: false })
      }
    } else {
      setChecklistData({ keys: false, manual: false, accessories: false, cleanliness: false, documents: false })
    }
    setPdiDialogOpen(true)
  }

  const savePdi = async (status: string) => {
    if (!selectedDelivery) return

    const res = await fetch(`/api/sales/deliveries/${selectedDelivery.id}`, {
      method: "PUT",
      body: JSON.stringify({
        checklist: JSON.stringify(checklistData),
        pdiStatus: status === "Completed" ? "Passed" : "Pending",
        status: status
      })
    })

    if (res.ok) {
      setPdiDialogOpen(false)
      fetchDeliveries()
      if (status === "Completed") {
        triggerCelebration()
        toast.success("Delivery Completed! 🎉")
      } else {
        toast.success("PDI Checklist Saved")
      }
    }
  }

  const triggerCelebration = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#bb0000', '#ffffff']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#bb0000', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] p-2 space-y-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 px-2">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Delivery Dashboard</h1>
          <p className="text-[10px] text-muted-foreground">Manage vehicle handovers and PDI.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="h-7 text-xs">
              <Calendar className="mr-1.5 h-3 w-3" /> Schedule Delivery
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule Delivery</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Select Booking</Label>
                <Select onValueChange={val => setNewDeliveryData({ ...newDeliveryData, bookingId: val })} value={newDeliveryData.bookingId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select confirmed booking..." />
                  </SelectTrigger>
                  <SelectContent>
                    {bookings.map(b => (
                      <SelectItem key={b.id} value={String(b.id)}>
                        {b.customer} - {b.vehicle}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Delivery Date</Label>
                <Input
                  type="date"
                  value={newDeliveryData.deliveryDate}
                  onChange={e => setNewDeliveryData({ ...newDeliveryData, deliveryDate: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={scheduleDelivery}>Schedule</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map(delivery => (
            <DeliveryCard key={delivery.id} delivery={delivery} onOpenPdi={() => openPdiDialog(delivery)} />
          ))}
        </div>
      </div>

      <Dialog open={pdiDialogOpen} onOpenChange={setPdiDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Pre-Delivery Inspection (PDI)</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="keys" checked={checklistData.keys} onCheckedChange={(c) => setChecklistData({ ...checklistData, keys: c as boolean })} />
                <Label htmlFor="keys">Both Keys Handed Over</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="manual" checked={checklistData.manual} onCheckedChange={(c) => setChecklistData({ ...checklistData, manual: c as boolean })} />
                <Label htmlFor="manual">Owner's Manual & Service Book</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="accessories" checked={checklistData.accessories} onCheckedChange={(c) => setChecklistData({ ...checklistData, accessories: c as boolean })} />
                <Label htmlFor="accessories">Accessories Fitted</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cleanliness" checked={checklistData.cleanliness} onCheckedChange={(c) => setChecklistData({ ...checklistData, cleanliness: c as boolean })} />
                <Label htmlFor="cleanliness">Vehicle Cleaned & Polished</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="documents" checked={checklistData.documents} onCheckedChange={(c) => setChecklistData({ ...checklistData, documents: c as boolean })} />
                <Label htmlFor="documents">Insurance & RTO Papers</Label>
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button variant="outline" className="w-full" onClick={() => savePdi("Scheduled")}>Save Progress</Button>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => savePdi("Completed")}>
                <PartyPopper className="mr-2 h-4 w-4" /> Complete Delivery
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DeliveryCard({ delivery, onOpenPdi }: { delivery: Delivery, onOpenPdi: () => void }) {
  return (
    <div className={`bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 transition-all group shadow-sm border-l-4 ${delivery.status === "Completed" ? "border-l-emerald-500" : "border-l-blue-500"}`}>
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-sm text-zinc-900">{delivery.customer}</h4>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
            <Car className="h-3.5 w-3.5" />
            {delivery.vehicle}
          </div>
        </div>
        <Badge variant={delivery.status === "Completed" ? "default" : "outline"} className={`text-[10px] px-2 py-0.5 border font-medium ${delivery.status === "Completed" ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "text-blue-700 border-blue-200 bg-blue-50"}`}>
          {delivery.status}
        </Badge>
      </div>

      <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4 bg-zinc-50/50 p-2 rounded-lg border border-zinc-100">
        <Calendar className="h-3.5 w-3.5 text-zinc-400" />
        <span className="font-medium text-zinc-700">{delivery.deliveryDate ? format(new Date(delivery.deliveryDate), "PPP") : "Date Not Set"}</span>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-zinc-50 mt-auto">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider font-medium">PDI Status</span>
          <Badge variant="secondary" className={`text-[10px] px-1.5 py-0 border ${delivery.pdiStatus === "Passed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>
            {delivery.pdiStatus}
          </Badge>
        </div>

        {delivery.status !== "Completed" ? (
          <Button size="sm" className="h-7 text-xs bg-blue-600 hover:bg-blue-700 text-white shadow-none" onClick={onOpenPdi}>
            <ClipboardCheck className="mr-1.5 h-3.5 w-3.5" /> PDI Checklist
          </Button>
        ) : (
          <Button size="sm" variant="ghost" className="h-7 text-xs text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700" disabled>
            <PartyPopper className="mr-1.5 h-3.5 w-3.5" /> Delivered
          </Button>
        )}
      </div>
    </div>
  )
}