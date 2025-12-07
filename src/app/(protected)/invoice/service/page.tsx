"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { useTheme } from "next-themes"
import { Printer, Download, ArrowLeft } from "lucide-react"

interface JobCardData {
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
    appointment?: {
        customer: string
        vehicle: string
        serviceType: string
    }
}

interface PartItem {
    partId: number
    name: string
    price: number
    quantity: number
}

export default function ServiceInvoicePage() {
    const searchParams = useSearchParams()
    const { resolvedTheme } = useTheme()
    const [jobCard, setJobCard] = React.useState<JobCardData | null>(null)
    const [loading, setLoading] = React.useState(true)

    const jobId = searchParams.get('jobId')

    React.useEffect(() => {
        if (!jobId) return
        fetchJobCard()
    }, [jobId])

    async function fetchJobCard() {
        try {
            const res = await fetch(`/api/service/job-cards`)
            const data = await res.json()
            const job = data.data?.find((j: any) => j.id === Number(jobId))
            if (job) {
                // Fetch appointment details
                const apptRes = await fetch(`/api/service/appointments`)
                const apptData = await apptRes.json()
                const appointment = apptData.data?.find((a: any) => a.id === job.appointmentId)
                setJobCard({ ...job, appointment })
            }
            setLoading(false)
        } catch (error) {
            console.error("Failed to fetch job card", error)
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

    if (!jobCard) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Job Card not found
            </div>
        )
    }

    // Parse parts data
    let parts: PartItem[] = []
    try {
        parts = JSON.parse(jobCard.partsData || '[]')
    } catch { parts = [] }

    const partsTotal = parts.reduce((sum, p) => sum + (p.price * p.quantity), 0)
    const laborCharges = jobCard.laborCharges || 0
    const subtotal = partsTotal + laborCharges
    const gst = Math.round(subtotal * 0.18)
    const grandTotal = subtotal + gst

    const invoiceNo = `INV-SVC-${jobCard.jobNo.replace('JOB-', '')}`
    const invoiceDate = new Date().toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric'
    })

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
                    <div className="bg-gradient-to-r from-[#003366] to-[#0055aa] text-white p-8 print:p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">AUTOFLOW</h1>
                                <p className="text-blue-200 text-sm mt-1">Authorized Service Center</p>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-blue-200 uppercase tracking-wider">Service Invoice</div>
                                <div className="text-xl font-bold font-mono">{invoiceNo}</div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Meta */}
                    <div className="grid grid-cols-3 border-b border-gray-200">
                        <div className="p-4 border-r border-gray-200">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Invoice Date</div>
                            <div className="font-medium">{invoiceDate}</div>
                        </div>
                        <div className="p-4 border-r border-gray-200">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Job Card No.</div>
                            <div className="font-medium font-mono">{jobCard.jobNo}</div>
                        </div>
                        <div className="p-4">
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Status</div>
                            <div className="font-medium text-emerald-600">{jobCard.status}</div>
                        </div>
                    </div>

                    {/* Customer & Vehicle Info */}
                    <div className="grid grid-cols-2 gap-8 p-8 border-b border-gray-200">
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Bill To</div>
                            <div className="text-lg font-bold">{jobCard.appointment?.customer || 'Walk-in Customer'}</div>
                            <div className="text-sm text-gray-500 mt-1">Valued Customer</div>
                        </div>
                        <div>
                            <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Vehicle Details</div>
                            <div className="text-lg font-bold">{jobCard.appointment?.vehicle || 'N/A'}</div>
                            <div className="text-sm text-gray-500 mt-1">{jobCard.appointment?.serviceType || 'General Service'}</div>
                        </div>
                    </div>

                    {/* Service Details */}
                    <div className="p-8">
                        <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-4">Service Details</div>

                        {/* Parts Table */}
                        {parts.length > 0 && (
                            <div className="mb-6">
                                <div className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Parts Used</div>
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b-2 border-gray-200">
                                            <th className="py-2 text-left text-xs font-bold uppercase text-gray-500">#</th>
                                            <th className="py-2 text-left text-xs font-bold uppercase text-gray-500">Part Name</th>
                                            <th className="py-2 text-right text-xs font-bold uppercase text-gray-500">Qty</th>
                                            <th className="py-2 text-right text-xs font-bold uppercase text-gray-500">Unit Price</th>
                                            <th className="py-2 text-right text-xs font-bold uppercase text-gray-500">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {parts.map((part, i) => (
                                            <tr key={i} className="border-b border-gray-100">
                                                <td className="py-3 text-gray-400 text-sm">{i + 1}</td>
                                                <td className="py-3 font-medium">{part.name}</td>
                                                <td className="py-3 text-right font-mono">{part.quantity}</td>
                                                <td className="py-3 text-right font-mono">₹{part.price.toLocaleString('en-IN')}</td>
                                                <td className="py-3 text-right font-mono font-medium">₹{(part.price * part.quantity).toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Labor Charges */}
                        <div className="flex items-center justify-between py-3 border-b border-gray-100">
                            <div className="font-medium">Labor Charges</div>
                            <div className="font-mono font-medium">₹{laborCharges.toLocaleString('en-IN')}</div>
                        </div>

                        {/* Totals */}
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center justify-between py-2">
                                <div className="text-gray-500">Subtotal</div>
                                <div className="font-mono">₹{subtotal.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <div className="text-gray-500">GST (18%)</div>
                                <div className="font-mono">₹{gst.toLocaleString('en-IN')}</div>
                            </div>
                            <div className="flex items-center justify-between py-3 border-t-2 border-gray-900">
                                <div className="text-lg font-bold">Grand Total</div>
                                <div className="text-2xl font-bold font-mono">₹{grandTotal.toLocaleString('en-IN')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Technician Notes */}
                    {jobCard.notes && (
                        <div className="px-8 pb-8">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Technician Notes</div>
                                <p className="text-sm text-gray-600">{jobCard.notes}</p>
                            </div>
                        </div>
                    )}

                    {/* Terms */}
                    <div className="px-8 pb-8">
                        <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Terms & Conditions</div>
                            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside">
                                <li>Parts warranty as per manufacturer terms.</li>
                                <li>Labor warranty valid for 30 days from service date.</li>
                                <li>Payment due upon completion of service.</li>
                                <li>For any queries, contact our service desk.</li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-[#003366] text-white p-6">
                        <div className="flex items-center justify-between text-sm">
                            <div>
                                <div className="font-bold">AutoFlow Service Center</div>
                                <div className="text-blue-200 text-xs mt-1">123 Auto Street, Business Bay, Mumbai 400001</div>
                            </div>
                            <div className="text-right">
                                <div className="text-blue-200 text-xs">Helpline</div>
                                <div className="font-medium">+91 98765 43210</div>
                            </div>
                        </div>
                    </div>

                    {/* Signature Area */}
                    <div className="grid grid-cols-2 gap-16 p-8 border-t border-gray-200">
                        <div>
                            <div className="text-xs text-gray-500 mb-1">Technician: {jobCard.technician}</div>
                            <div className="border-t border-gray-300 pt-2 mt-12">
                                <div className="text-xs text-gray-400">Customer Signature</div>
                            </div>
                        </div>
                        <div>
                            <div className="border-t border-gray-300 pt-2 mt-12">
                                <div className="text-xs text-gray-400">Authorized Signature</div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Print/Back Buttons */}
                <div className="no-print fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                    <button
                        onClick={() => window.print()}
                        className="px-6 py-3 bg-[#003366] text-white rounded-xl font-medium shadow-lg hover:bg-[#004488] transition-all flex items-center gap-2"
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
