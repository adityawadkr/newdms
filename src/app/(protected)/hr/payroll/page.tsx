"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign, Download, Printer, FileText, Mail } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface PayrollRecord {
    id: number
    employeeName: string
    month: string
    basicSalary: number
    allowances: number
    deductions: number
    netSalary: number
    status: string
    paymentDate: string
    designation?: string // Optional, if we fetch it
    department?: string // Optional
}

export default function PayrollPage() {
    const [payrollData, setPayrollData] = useState<PayrollRecord[]>([])
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
    const [loading, setLoading] = useState(false)
    const [selectedSlip, setSelectedSlip] = useState<PayrollRecord | null>(null)

    useEffect(() => {
        fetchPayroll()
    }, [selectedMonth])

    async function fetchPayroll() {
        try {
            const res = await fetch(`/api/hr/payroll?month=${selectedMonth}`)
            const data = await res.json()
            if (data.data) setPayrollData(data.data)
        } catch (error) {
            console.error("Failed to fetch payroll", error)
        }
    }

    async function handleGeneratePayroll() {
        setLoading(true)
        try {
            const res = await fetch("/api/hr/payroll", {
                method: "POST",
                body: JSON.stringify({ month: selectedMonth })
            })

            if (res.ok) {
                toast.success("Payroll generated successfully")
                fetchPayroll()
            } else {
                toast.error("Failed to generate payroll")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    async function handleEmailSlip(record: PayrollRecord) {
        toast.promise(
            fetch(`/api/hr/payroll/${record.id}/send`, { method: "POST", body: JSON.stringify({}) }),
            {
                loading: "Sending email...",
                success: "Payslip sent to employee!",
                error: "Failed to send email"
            }
        )
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Payroll</h1>
                    <p className="text-zinc-500 mt-1">Manage salaries and generate payslips.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Month" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="2023-10">October 2023</SelectItem>
                            <SelectItem value="2023-11">November 2023</SelectItem>
                            <SelectItem value="2023-12">December 2023</SelectItem>
                            <SelectItem value="2024-01">January 2024</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button onClick={handleGeneratePayroll} disabled={loading} className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <DollarSign className="mr-2 h-4 w-4" />
                        {loading ? "Generating..." : "Generate Payroll"}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Payout</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">
                            ₹{payrollData.reduce((acc, curr) => acc + curr.netSalary, 0).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Pending Payments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">
                            {payrollData.filter(p => p.status === "Pending").length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-zinc-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Processed</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">
                            {payrollData.filter(p => p.status === "Paid").length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #payslip, #payslip * {
            visibility: visible;
          }
          #payslip {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          /* Hide print button and other actions inside the slip */
          #payslip button {
            display: none !important;
          }
        }
      `}</style>
            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50">
                            <TableHead>Employee</TableHead>
                            <TableHead>Basic Salary</TableHead>
                            <TableHead>Allowances</TableHead>
                            <TableHead>Deductions</TableHead>
                            <TableHead>Net Salary</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payrollData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                                    No payroll records found for this month.
                                </TableCell>
                            </TableRow>
                        ) : (
                            payrollData.map((record) => (
                                <TableRow key={record.id}>
                                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                                    <TableCell>₹{record.basicSalary.toLocaleString()}</TableCell>
                                    <TableCell className="text-emerald-600">+₹{record.allowances.toLocaleString()}</TableCell>
                                    <TableCell className="text-rose-600">-₹{record.deductions.toLocaleString()}</TableCell>
                                    <TableCell className="font-bold">₹{record.netSalary.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            record.status === "Paid" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
                                        }>
                                            {record.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button variant="ghost" size="sm" onClick={() => setSelectedSlip(record)}>
                                                    <FileText className="mr-2 h-4 w-4" /> View Slip
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-3xl">
                                                <DialogHeader>
                                                    <DialogTitle>Payslip - {selectedSlip?.month}</DialogTitle>
                                                </DialogHeader>
                                                {selectedSlip && (
                                                    <div className="p-6 border rounded-lg space-y-6" id="payslip">
                                                        <div className="flex justify-between items-start border-b pb-6">
                                                            <div>
                                                                <h2 className="text-2xl font-bold text-zinc-900">Acme Corp</h2>
                                                                <p className="text-zinc-500">123 Business Park, Tech City</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <h3 className="text-lg font-semibold">Payslip</h3>
                                                                <p className="text-zinc-500">{selectedSlip.month}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-8">
                                                            <div>
                                                                <p className="text-sm text-zinc-500">Employee Name</p>
                                                                <p className="font-medium">{selectedSlip.employeeName}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm text-zinc-500">Payment Date</p>
                                                                <p className="font-medium">{selectedSlip.paymentDate || "Pending"}</p>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-8 border-t pt-6">
                                                            <div>
                                                                <h4 className="font-semibold mb-4 text-emerald-700">Earnings</h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-zinc-600">Basic Salary</span>
                                                                        <span>₹{selectedSlip.basicSalary.toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-zinc-600">House Rent Allowance</span>
                                                                        <span>₹{(selectedSlip.allowances * 0.4).toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-zinc-600">Special Allowance</span>
                                                                        <span>₹{(selectedSlip.allowances * 0.6).toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold mb-4 text-rose-700">Deductions</h4>
                                                                <div className="space-y-2">
                                                                    <div className="flex justify-between">
                                                                        <span className="text-zinc-600">Provident Fund</span>
                                                                        <span>₹{(selectedSlip.deductions * 0.5).toLocaleString()}</span>
                                                                    </div>
                                                                    <div className="flex justify-between">
                                                                        <span className="text-zinc-600">Professional Tax</span>
                                                                        <span>₹{(selectedSlip.deductions * 0.5).toLocaleString()}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="border-t pt-6 flex justify-between items-center">
                                                            <div className="text-sm text-zinc-500">
                                                                *This is a computer generated slip.
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-sm text-zinc-500">Net Payable</p>
                                                                <p className="text-2xl font-bold text-zinc-900">₹{selectedSlip.netSalary.toLocaleString()}</p>
                                                            </div>
                                                        </div>

                                                        <div className="flex justify-end gap-2 pt-4 print:hidden">
                                                            <Button variant="outline" onClick={() => handleEmailSlip(selectedSlip)}>
                                                                <Mail className="mr-2 h-4 w-4" /> Email
                                                            </Button>
                                                            <Button variant="outline" onClick={() => window.print()}>
                                                                <Printer className="mr-2 h-4 w-4" /> Print
                                                            </Button>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
