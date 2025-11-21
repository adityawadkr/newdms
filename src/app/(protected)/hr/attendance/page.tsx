"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"

interface AttendanceRecord {
    id: number
    employeeId: number
    employeeName: string
    date: string
    checkIn: string
    checkOut: string | null
    status: string
}

interface Employee {
    id: number
    firstName: string
    lastName: string
}

export default function AttendancePage() {
    const [records, setRecords] = useState<AttendanceRecord[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [selectedEmployee, setSelectedEmployee] = useState<string>("")
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchRecords()
        fetchEmployees()
    }, [])

    async function fetchRecords() {
        try {
            const res = await fetch("/api/hr/attendance")
            const data = await res.json()
            if (data.data) setRecords(data.data)
        } catch (error) {
            console.error("Failed to fetch attendance", error)
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

    async function handleAttendance(action: "check-in" | "check-out") {
        if (!selectedEmployee) {
            toast.error("Please select an employee first")
            return
        }

        setLoading(true)
        try {
            const now = new Date()
            const time = now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })
            const date = now.toISOString().split('T')[0]

            const res = await fetch("/api/hr/attendance", {
                method: "POST",
                body: JSON.stringify({
                    employeeId: parseInt(selectedEmployee),
                    action,
                    time,
                    date
                })
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(`Successfully ${action === "check-in" ? "Checked In" : "Checked Out"}`)
                fetchRecords()
            } else {
                toast.error(data.error || "Failed to update attendance")
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Attendance</h1>
                    <p className="text-zinc-500 mt-1">Track employee work hours and status.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-1 border-zinc-200 shadow-sm h-fit">
                    <CardHeader>
                        <CardTitle>Quick Action</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-zinc-700">Select Employee</label>
                            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose employee..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {employees.map(e => (
                                        <SelectItem key={e.id} value={e.id.toString()}>{e.firstName} {e.lastName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                onClick={() => handleAttendance("check-in")}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                disabled={loading}
                            >
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Check In
                            </Button>
                            <Button
                                onClick={() => handleAttendance("check-out")}
                                variant="outline"
                                className="border-zinc-200 hover:bg-zinc-50"
                                disabled={loading}
                            >
                                <XCircle className="mr-2 h-4 w-4" /> Check Out
                            </Button>
                        </div>
                        <p className="text-xs text-zinc-500 text-center pt-2">
                            Current Time: {new Date().toLocaleTimeString()}
                        </p>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-zinc-200 shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Logs</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-zinc-50/50">
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Check In</TableHead>
                                    <TableHead>Check Out</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {records.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                            No attendance records found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    records.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">{record.employeeName}</TableCell>
                                            <TableCell>{record.date}</TableCell>
                                            <TableCell className="font-mono text-xs">{record.checkIn}</TableCell>
                                            <TableCell className="font-mono text-xs">{record.checkOut || "-"}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className={
                                                    record.status === "Present" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                                        record.status === "Late" ? "bg-amber-50 text-amber-700 border-amber-200" :
                                                            "bg-zinc-100 text-zinc-600"
                                                }>
                                                    {record.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
