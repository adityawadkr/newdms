"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Plus, Search, MoreHorizontal, Mail, Phone, Briefcase, Pencil, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Employee {
    id: number
    firstName: string
    lastName: string
    email: string
    phone: string
    designation: string
    department: string
    status: string
    salary: number
    joiningDate: string
}

export default function EmployeesPage() {
    const [employees, setEmployees] = useState<Employee[]>([])
    const [search, setSearch] = useState("")
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [editingId, setEditingId] = useState<number | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        designation: "",
        department: "",
        salary: "",
        joiningDate: new Date().toISOString().split('T')[0],
        status: "Active"
    })

    useEffect(() => {
        fetchEmployees()
    }, [])

    async function fetchEmployees() {
        try {
            const res = await fetch("/api/hr/employees")
            const data = await res.json()
            if (data.data) setEmployees(data.data)
        } catch (error) {
            console.error("Failed to fetch employees", error)
        }
    }

    function handleAddNew() {
        setEditingId(null)
        setFormData({
            firstName: "", lastName: "", email: "", phone: "", designation: "", department: "", salary: "", joiningDate: new Date().toISOString().split('T')[0], status: "Active"
        })
        setOpen(true)
    }

    function handleEdit(employee: Employee) {
        setEditingId(employee.id)
        setFormData({
            firstName: employee.firstName,
            lastName: employee.lastName,
            email: employee.email,
            phone: employee.phone,
            designation: employee.designation,
            department: employee.department,
            salary: employee.salary.toString(),
            joiningDate: employee.joiningDate,
            status: employee.status
        })
        setOpen(true)
    }

    async function handleDelete(id: number) {
        if (!confirm("Are you sure you want to delete this employee?")) return

        try {
            const res = await fetch(`/api/hr/employees/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Employee deleted")
                fetchEmployees()
            } else {
                toast.error("Failed to delete employee")
            }
        } catch (error) {
            toast.error("Something went wrong")
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        try {
            const url = editingId ? `/api/hr/employees/${editingId}` : "/api/hr/employees"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                body: JSON.stringify({
                    ...formData,
                    salary: parseInt(formData.salary) || 0
                })
            })

            if (res.ok) {
                toast.success(`Employee ${editingId ? "updated" : "added"} successfully`)
                setOpen(false)
                fetchEmployees()
            } else {
                toast.error(`Failed to ${editingId ? "update" : "add"} employee`)
            }
        } catch (error) {
            toast.error("Something went wrong")
        } finally {
            setLoading(false)
        }
    }

    const filteredEmployees = employees.filter(e =>
        e.firstName.toLowerCase().includes(search.toLowerCase()) ||
        e.lastName.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        e.designation.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Employees</h1>
                    <p className="text-zinc-500 mt-1">Manage your organization's workforce.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button onClick={handleAddNew} className="bg-zinc-900 text-white hover:bg-zinc-800">
                            <Plus className="mr-2 h-4 w-4" /> Add Employee
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{editingId ? "Edit Employee" : "Add New Employee"}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input required type="email" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Designation</Label>
                                    <Input required value={formData.designation} onChange={e => setFormData({ ...formData, designation: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Department</Label>
                                    <Input required value={formData.department} onChange={e => setFormData({ ...formData, department: e.target.value })} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Salary (CTC)</Label>
                                    <Input required type="number" value={formData.salary} onChange={e => setFormData({ ...formData, salary: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Joining Date</Label>
                                    <Input required type="date" value={formData.joiningDate} onChange={e => setFormData({ ...formData, joiningDate: e.target.value })} />
                                </div>
                            </div>
                            <Button type="submit" className="w-full mt-4" disabled={loading}>
                                {loading ? "Saving..." : (editingId ? "Update Employee" : "Add Employee")}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex items-center space-x-2 bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                <Search className="h-5 w-5 text-zinc-400" />
                <Input
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border-none shadow-none focus-visible:ring-0 text-base"
                />
            </div>

            <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-zinc-50/50">
                            <TableHead className="w-[300px]">Employee</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-zinc-500">
                                    No employees found. Add one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <TableRow key={employee.id} className="group">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border border-zinc-200">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${employee.firstName} ${employee.lastName}`} />
                                                <AvatarFallback>{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-zinc-900">{employee.firstName} {employee.lastName}</div>
                                                <div className="text-xs text-zinc-500">{employee.department}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-zinc-600">
                                                <Mail className="mr-2 h-3 w-3" /> {employee.email}
                                            </div>
                                            <div className="flex items-center text-xs text-zinc-600">
                                                <Phone className="mr-2 h-3 w-3" /> {employee.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm text-zinc-700">
                                            <Briefcase className="mr-2 h-4 w-4 text-zinc-400" />
                                            {employee.designation}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            employee.status === "Active" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-zinc-100 text-zinc-600"
                                        }>
                                            {employee.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreHorizontal className="h-4 w-4 text-zinc-500" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => handleEdit(employee)}>
                                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(employee.id)} className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
