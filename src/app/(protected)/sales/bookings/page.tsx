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
import { Plus, Calendar, CreditCard, CheckCircle2, Clock, Receipt, Car } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { format, parseISO, addDays } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Booking {
  id: number
  customer: string
  vehicle: string
  quotationNo: string
  bookingAmount: number
  paymentStatus: string
  paymentMode: string
  deliveryDate: string
  status: string
  createdAt: number
}

interface Quotation {
  id: number
  number: string
  customer: string
  vehicle: string
  total: number
  status: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  // Receipt State
  const [receiptOpen, setReceiptOpen] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  // Filter State
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("newest")

  // Wizard State
  const [step, setStep] = useState(1)
  const [selectedQuotation, setSelectedQuotation] = useState<string>("")
  const [bookingData, setBookingData] = useState({
    customer: "",
    vehicle: "",
    quotationNo: "",
    bookingAmount: 5000,
    paymentMode: "UPI",
    deliveryDate: format(addDays(new Date(), 7), "yyyy-MM-dd")
  })

  useEffect(() => {
    fetchBookings()
    fetchQuotations()
  }, [])

  async function fetchBookings() {
    const res = await fetch("/api/sales/bookings")
    const data = await res.json()
    if (data.data) setBookings(data.data)
  }

  async function fetchQuotations() {
    const res = await fetch("/api/sales/quotations")
    const data = await res.json()
    if (data.data) setQuotations(data.data.filter((q: Quotation) => q.status !== "Accepted"))
  }

  async function createBooking() {
    const res = await fetch("/api/sales/bookings", {
      method: "POST",
      body: JSON.stringify({
        quotationId: selectedQuotation || null,
        ...bookingData
      })
    })

    if (res.ok) {
      setDialogOpen(false)
      fetchBookings()
      toast.success("Booking confirmed successfully")
      setStep(1)
      setSelectedQuotation("")
      setBookingData({
        customer: "",
        vehicle: "",
        quotationNo: "",
        bookingAmount: 5000,
        paymentMode: "UPI",
        deliveryDate: format(addDays(new Date(), 7), "yyyy-MM-dd")
      })
    } else {
      toast.error("Failed to create booking")
    }
  }

  const handleQuotationSelect = (qId: string) => {
    setSelectedQuotation(qId)
    const quote = quotations.find(q => String(q.id) === qId)
    if (quote) {
      setBookingData({
        ...bookingData,
        customer: quote.customer,
        vehicle: quote.vehicle,
        quotationNo: quote.number
      })
    }
  }

  const updatePaymentStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/sales/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ paymentStatus: status })
    })
    if (res.ok) {
      fetchBookings()
      toast.success(`Payment marked as ${status}`)
    }
  }

  const openReceipt = (booking: Booking) => {
    setSelectedBooking(booking)
    setReceiptOpen(true)
  }

  const handlePrint = () => {
    window.print()
  }

  // Filter & Sort Logic
  const filteredBookings = bookings
    .filter(b =>
      b.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.quotationNo.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "newest") return b.createdAt - a.createdAt
      if (sortBy === "oldest") return a.createdAt - b.createdAt
      if (sortBy === "amount-high") return b.bookingAmount - a.bookingAmount
      if (sortBy === "amount-low") return a.bookingAmount - b.bookingAmount
      return 0
    })

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] p-2 space-y-4 overflow-hidden">
      <div className="flex flex-col gap-4 shrink-0 px-2">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">Bookings</h1>
            <p className="text-[10px] text-muted-foreground">Manage vehicle bookings and deliveries.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="h-7 text-xs">
                <Plus className="mr-1.5 h-3 w-3" /> New Booking
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Booking Wizard</DialogTitle>
              </DialogHeader>

              {step === 1 && (
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Select Quotation (Optional)</Label>
                    <Select onValueChange={handleQuotationSelect} value={selectedQuotation}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a quotation..." />
                      </SelectTrigger>
                      <SelectContent>
                        {quotations.map(q => (
                          <SelectItem key={q.id} value={String(q.id)}>
                            {q.number} - {q.customer} ({q.vehicle})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Customer Name</Label>
                    <Input
                      value={bookingData.customer}
                      onChange={e => setBookingData({ ...bookingData, customer: e.target.value })}
                      placeholder="Customer Name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle</Label>
                    <Input
                      value={bookingData.vehicle}
                      onChange={e => setBookingData({ ...bookingData, vehicle: e.target.value })}
                      placeholder="Vehicle Model"
                    />
                  </div>
                  <Button className="w-full" onClick={() => setStep(2)}>Next: Payment</Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Booking Amount (₹)</Label>
                      <Input
                        type="number"
                        value={bookingData.bookingAmount}
                        onChange={e => setBookingData({ ...bookingData, bookingAmount: Number(e.target.value) })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Payment Mode</Label>
                      <Select
                        value={bookingData.paymentMode}
                        onValueChange={val => setBookingData({ ...bookingData, paymentMode: val })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Card">Card</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Transfer">Bank Transfer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Tentative Delivery Date</Label>
                    <Input
                      type="date"
                      value={bookingData.deliveryDate}
                      onChange={e => setBookingData({ ...bookingData, deliveryDate: e.target.value })}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" className="w-full" onClick={() => setStep(1)}>Back</Button>
                    <Button className="w-full" onClick={createBooking}>Confirm Booking</Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search bookings..."
            className="h-8 text-xs max-w-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="h-8 text-xs w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="amount-high">Amount: High-Low</SelectItem>
              <SelectItem value="amount-low">Amount: Low-High</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookings.length === 0 && (
            <div className="col-span-full text-center py-10 text-zinc-400 text-sm">
              No bookings found matching your search.
            </div>
          )}
          {filteredBookings.map(booking => (
            <BookingCard key={booking.id} booking={booking} onUpdatePayment={updatePaymentStatus} onOpenReceipt={() => openReceipt(booking)} />
          ))}
        </div>
      </div>

      {/* Receipt Dialog */}
      <Dialog open={receiptOpen} onOpenChange={setReceiptOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Receipt</DialogTitle>
          </DialogHeader>

          {selectedBooking && (
            <div className="py-4 space-y-6" id="receipt-area">
              <div className="text-center border-b border-zinc-100 pb-4">
                <h2 className="text-xl font-bold tracking-tight">AutoFlow</h2>
                <p className="text-xs text-zinc-500">Official Booking Receipt</p>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Receipt No.</span>
                  <span className="text-sm font-mono font-medium">RCPT-{selectedBooking.id.toString().padStart(6, '0')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Date</span>
                  <span className="text-sm font-medium">{format(new Date(), "PPP")}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Customer</span>
                  <span className="text-sm font-medium">{selectedBooking.customer}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-zinc-500">Vehicle</span>
                  <span className="text-sm font-medium">{selectedBooking.vehicle}</span>
                </div>
              </div>

              <div className="bg-zinc-50 p-4 rounded-lg border border-zinc-100 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">Amount Paid</span>
                  <span className="text-lg font-bold">₹{selectedBooking.bookingAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span>Payment Mode</span>
                  <span>{selectedBooking.paymentMode}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span>Status</span>
                  <Badge variant="outline" className="bg-white text-[10px] h-5">{selectedBooking.paymentStatus}</Badge>
                </div>
              </div>

              <div className="text-center text-[10px] text-zinc-400 pt-4 border-t border-zinc-100">
                <p>Thank you for your booking!</p>
                <p>Ref: {selectedBooking.quotationNo}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setReceiptOpen(false)}>Close</Button>
            <Button onClick={handlePrint}>Print Receipt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #receipt-area, #receipt-area * {
            visibility: visible;
          }
          #receipt-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 20px;
          }
          .no-print {
            display: none;
          }
        }
      `}</style>
    </div>
  )
}

function BookingCard({ booking, onUpdatePayment, onOpenReceipt }: { booking: Booking, onUpdatePayment: (id: number, status: string) => void, onOpenReceipt: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 p-4 hover:border-zinc-300 transition-all group shadow-sm border-l-4 border-l-emerald-500">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-sm text-zinc-900">{booking.customer}</h4>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 mt-1">
            <Car className="h-3.5 w-3.5" />
            {booking.vehicle}
          </div>
        </div>
        <Badge variant={booking.paymentStatus === "Paid" ? "default" : "secondary"} className={`text-[10px] px-2 py-0.5 border font-medium ${booking.paymentStatus === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-amber-50 text-amber-700 border-amber-200"}`}>
          {booking.paymentStatus}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4 bg-zinc-50/50 p-3 rounded-lg border border-zinc-100">
        <div>
          <div className="text-zinc-400 text-[10px] uppercase tracking-wider font-medium mb-1">Booking Amount</div>
          <div className="font-semibold text-sm text-zinc-900">₹{booking.bookingAmount.toLocaleString()}</div>
        </div>
        <div>
          <div className="text-zinc-400 text-[10px] uppercase tracking-wider font-medium mb-1">Delivery Date</div>
          <div className="font-semibold text-sm text-zinc-900 flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-zinc-400" />
            {format(parseISO(booking.deliveryDate), "MMM d, yyyy")}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-4 px-1">
        <span className="flex items-center gap-1"><Receipt className="h-3 w-3" /> Ref: {booking.quotationNo}</span>
        <span className="flex items-center gap-1"><CreditCard className="h-3 w-3" /> {booking.paymentMode}</span>
      </div>

      <div className="flex gap-2 mt-auto">
        {booking.paymentStatus === "Pending" && (
          <Button size="sm" className="w-full h-8 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white shadow-none" onClick={() => onUpdatePayment(booking.id, "Paid")}>
            <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> Mark Paid
          </Button>
        )}
        <Button size="sm" variant="outline" className="w-full h-8 text-xs font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900" onClick={onOpenReceipt}>
          <Receipt className="mr-1.5 h-3.5 w-3.5" /> Receipt
        </Button>
      </div>
    </div>
  )
}