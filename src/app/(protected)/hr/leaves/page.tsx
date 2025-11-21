"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Check, X, Plus, Calendar } from "lucide-react"
import { toast } from "sonner"

interface LeaveRequest {
    id: number
    employeeId: number
    employeeName: string
    type: string
    startDate: string
    endDate: string
    reason: string
    status: string
}

interface Employee {
    id: number
    firstName: string
    lastName: string
    sickLeaveBalance: number
    casualLeaveBalance: number
    earnedLeaveBalance: number
}

export default function LeavesPage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        employeeId: "",
        type: "",
        startDate: "",
        endDate: "",
        reason: ""
    })

    const selectedEmployee = employees.find(e => e.id.toString() === formData.employeeId)

    useEffect(() => {
        fetchLeaves()
        fetchEmployees()
    }, [])

    async function fetchLeaves() {
        try {
            const res = await fetch("/api/hr/leaves")
            const data = await res.json()
            if (data.data) setLeaves(data.data)
        } catch (error) {
            console.error("Failed to fetch leaves", error)
        }
    }

    async function fetchEmployees() {
        try {
            const res = await fetch("/api/hr/employees")
            const data = await res.json()
            if (data.data) setEmployees(data.data)
        } catch (error) {
            console.error("Failed to fetch employees", error)
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch("/api/hr/leaves", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    employeeId: parseInt(formData.employeeId)
                })
            })

            if (res.ok) {
                toast.success("Leave request submitted")
                setOpen(false)
                fetchLeaves()
                // Refresh employees to get updated balances if needed (though balance updates on approval)
                setFormData({ employeeId: "", type: "", startDate: "", endDate: "", reason: "" })
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to submit leave request")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    async function handleStatusUpdate(id: number, status: "Approved" | "Rejected") {
        try {
            const res = await fetch(`/api/hr/leaves/${id}`, {
                method: "PUT",
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                toast.success(`Leave request ${status}`)
                fetchLeaves()
                fetchEmployees() // Refresh balances
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Leave Management</h1>
                    <p className="text-zinc-500 mt-1">Review and manage employee leave requests.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
                            <Plus className="mr-2 h-4 w-4" /> Apply Leave
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                            <DialogTitle>Apply for Leave</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="space-y-2">
                                <Label>Employee</Label>
                                <Select value={formData.employeeId} onValueChange={v => setFormData({ ...formData, employeeId: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map(e => (
                                            <SelectItem key={e.id} value={e.id.toString()}>{e.firstName} {e.lastName}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedEmployee && (
                                    <div className="text-xs text-zinc-500 flex gap-3 mt-1">
                                        <span className="font-medium text-emerald-600">Sick: {selectedEmployee.sickLeaveBalance}</span>
                                        <span className="font-medium text-blue-600">Casual: {selectedEmployee.casualLeaveBalance}</span>
                                        <span className="font-medium text-amber-600">Earned: {selectedEmployee.earnedLeaveBalance}</span>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label>Leave Type</Label>
                                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Sick">Sick Leave</SelectItem>
                                        <SelectItem value="Casual">Casual Leave</SelectItem>
                                        <SelectItem value="Earned">Earned Leave</SelectItem>
                                        <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Date</Label>
                                    <Input required type="date" value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Date</Label>
                                    <Input required type="date" value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Reason</Label>
                                <Textarea required value={formData.reason} onChange={e => setFormData({ ...formData, reason: e.target.value })} />
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Request"}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50">
                            <TableHead>Employee</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Reason</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {leaves.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                                    No leave requests found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            leaves.map((leave) => (
                                <TableRow key={leave.id}>
                                    <TableCell className="font-medium">{leave.employeeName}</TableCell>
                                    <TableCell>{leave.type}</TableCell>
                                    <TableCell className="text-xs text-zinc-600">
                                        {leave.startDate} <span className="text-zinc-400">to</span> {leave.endDate}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate text-zinc-500" title={leave.reason}>
                                        {leave.reason}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            leave.status === "Approved" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                leave.status === "Rejected" ? "bg-red-50 text-red-700 border-red-200" :
                                                    "bg-amber-50 text-amber-700 border-amber-200"
                                        }>
                                            {leave.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {leave.status === "Pending" && (
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                                    onClick={() => handleStatusUpdate(leave.id, "Approved")}
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="outline"
                                                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                                                    onClick={() => handleStatusUpdate(leave.id, "Rejected")}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
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
