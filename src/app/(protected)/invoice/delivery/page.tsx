"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Printer, ArrowLeft, Car, CheckCircle2 } from "lucide-react"

interface DeliveryData {
    id: number
    bookingId: number
    customer: string
    vehicle: string
    pdiStatus: string
    checklist: string
    status: string
    deliveryDate: string
    booking?: {
        bookingAmount: number
        paymentStatus: string
        paymentMode: string
        quotationNo: string
    }
}

export default function DeliveryInvoicePage() {
    const searchParams = useSearchParams()
    const { resolvedTheme } = useTheme()
    const [delivery, setDelivery] = React.useState<DeliveryData | null>(null)
    const [loading, setLoading] = React.useState(true)

    const deliveryId = searchParams.get('deliveryId')

    React.useEffect(() => {
        if (!deliveryId) return
        fetchDelivery()
    }, [deliveryId])

    async function fetchDelivery() {
        try {
            const res = await fetch(`/api/sales/deliveries`)
            const data = await res.json()
            const del = data.data?.find((d: any) => d.id === Number(deliveryId))
            if (del) {
                // Fetch booking details
                const bookingRes = await fetch(`/api/sales/bookings`)
                const bookingData = await bookingRes.json()
                const booking = bookingData.data?.find((b: any) => b.id === del.bookingId)
                setDelivery({ ...del, booking })
            }
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch delivery", error)
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!delivery) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Delivery not found
            </div>
        )
    }

    // Parse checklist
    let checklist: Record<string, boolean> = {}
    try {
        checklist = JSON.parse(delivery.checklist || '{}')
    } catch { checklist = {} }

    const invoiceNo = `INV-DEL-${delivery.id.toString().padStart(4, '0')}`
    const invoiceDate = delivery.deliveryDate
        ? new Date(delivery.deliveryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
        : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

    const bookingAmount = delivery.booking?.bookingAmount || 0
    const gst = Math.round(bookingAmount * 0.18)
    const grandTotal = bookingAmount + gst

    return (
        <>
            <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          @page { size: A4; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

            <div className="min-h-screen bg-white text-gray-900 p-8 print:p-0">
                <div className="max-w-[210mm] mx-auto bg-white print:shadow-none">

                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-700 to-emerald-900 text-white p-8 print:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">AUTOFLOW</h1>
                                <p className="text-emerald-200 text-sm mt-1">Vehicle Delivery Certificate</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-emerald-200 uppercase tracking-wider">Delivery Invoice</div>
                                <div className="text-xl font-bold font-mono">{invoiceNo}</div>
                            </div>
                        </div>
                    </div>

                    {/* Congratulations Banner */}
                    <div className="bg-gradient-to-r from-amber-50 to-amber-100 p-6 border-b border-amber-200">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                                <Car className="text-amber-600" size={24} />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-amber-800">Congratulations on Your New Vehicle!</h2>
                                <p className="text-sm text-amber-600">Thank you for choosing AutoFlow. We wish you many happy miles ahead!</p>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Meta */}
                    <div className="grid grid-cols-3 border-b border-gray-200">
                        <div className="p-4 border-r border-gray-200">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Delivery Date</div>
                            <div className="font-medium">{invoiceDate}</div>
                        </div>
                        <div className="p-4 border-r border-gray-200">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Quotation No.</div>
                            <div className="font-medium font-mono">{delivery.booking?.quotationNo || 'N/A'}</div>
                        </div>
                        <div className="p-4">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">PDI Status</div>
                            <div className="font-medium text-emerald-600 flex items-center gap-1">
                                <CheckCircle2 size={14} /> {delivery.pdiStatus}
                            </div>
                        </div>
                    </div>

                    {/* Customer & Vehicle Info */}
                    <div className="grid grid-cols-2 gap-8 p-8 border-b border-gray-200">
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Delivered To</div>
                            <div className="text-lg font-bold">{delivery.customer}</div>
                            <div className="text-sm text-gray-500 mt-1">Valued Customer</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Vehicle Delivered</div>
                            <div className="text-lg font-bold">{delivery.vehicle}</div>
                            <div className="text-sm text-gray-500 mt-1">Brand New</div>
                        </div>
                    </div>

                    {/* PDI Checklist */}
                    <div className="p-8 border-b border-gray-200">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Pre-Delivery Inspection (PDI) Checklist</div>
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'keys', label: 'Both Keys Handed Over' },
                                { key: 'manual', label: "Owner's Manual & Service Book" },
                                { key: 'accessories', label: 'Accessories Fitted' },
                                { key: 'cleanliness', label: 'Vehicle Cleaned & Polished' },
                                { key: 'documents', label: 'Insurance & RTO Papers' },
                            ].map((item) => (
                                <div key={item.key} className={`flex items-center gap-2 p-3 rounded-lg ${checklist[item.key] ? 'bg-emerald-50' : 'bg-gray-50'}`}>
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${checklist[item.key] ? 'bg-emerald-500 text-white' : 'bg-gray-200'}`}>
                                        {checklist[item.key] && <CheckCircle2 size={14} />}
                                    </div>
                                    <span className={`text-sm ${checklist[item.key] ? 'text-emerald-700 font-medium' : 'text-gray-500'}`}>
                                        {item.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Payment Details */}
                    <div className="p-8">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Payment Summary</div>

                        <div className="space-y-3">
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="font-medium">Vehicle Amount</div>
                                <div className="font-mono font-medium">₹{bookingAmount.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="text-gray-500">GST (18%)</div>
                                <div className="font-mono">₹{gst.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t-2 border-gray-900">
                                <div className="text-lg font-bold">Grand Total</div>
                                <div className="text-2xl font-bold font-mono">₹{grandTotal.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="text-gray-500">Payment Status</div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium ${delivery.booking?.paymentStatus === 'Paid'
                                        ? 'bg-emerald-100 text-emerald-700'
                                        : 'bg-amber-100 text-amber-700'
                                    }`}>
                                    {delivery.booking?.paymentStatus || 'Pending'}
                                </div>
                            </div>
                            {delivery.booking?.paymentMode && (
                                <div className="flex items-center justify-between py-2">
                                    <div className="text-gray-500">Payment Mode</div>
                                    <div className="font-medium">{delivery.booking.paymentMode}</div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Terms */}
                    <div className="px-8 pb-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Important Information</div>
                            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                                <li>Vehicle warranty as per manufacturer terms.</li>
                                <li>First free service due at 1,000 km or 1 month.</li>
                                <li>Please retain this document for future reference.</li>
                                <li>For roadside assistance, call our 24x7 helpline.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-emerald-800 text-white p-6">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <div className="font-bold">AutoFlow Premium Motors</div>
                                <div className="text-emerald-200 text-xs mt-1">123 Auto Street, Business Bay, Mumbai 400001</div>
                            </div>
                            <div className="text-right">
                                <div className="text-emerald-200 text-xs">24x7 Helpline</div>
                                <div className="font-medium">+91 98765 43210</div>
                            </div>
                        </div>
                    </div>

                    {/* Signature Area */}
                    <div className="grid grid-cols-2 gap-16 p-8 border-t border-gray-200">
                        <div>
                            <div className="border-t border-gray-300 pt-2 mt-16">
                                <div className="text-xs text-gray-400">Customer Signature</div>
                            </div>
                        </div>
                        <div>
                            <div className="border-t border-gray-300 pt-2 mt-16">
                                <div className="text-xs text-gray-400">Authorized Signature</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Print/Back Buttons */}
                <div className="no-print fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-emerald-700 text-white rounded-xl font-medium shadow-lg hover:bg-emerald-800 transition-all flex items-center gap-2"
                    >
                        <Printer size={18} /> Print Invoice
                    </button>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium shadow-lg hover:bg-gray-50 transition-all flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Go Back
                    </button>
                </div>
            </div>
        </>
    )
}
