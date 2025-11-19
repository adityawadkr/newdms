"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { authClient } from "@/lib/auth-client"
import { Role, ROLES } from "@/lib/roles"
import { Trash2, Mail, Shield, Users } from "lucide-react"

type User = {
    id: string
    name: string
    email: string
    role: Role
    createdAt: string
}

type Invitation = {
    id: string
    email: string
    role: Role
    status: "pending" | "accepted"
    token: string
    createdAt: string
}

export default function HRPage() {
    const [users, setUsers] = useState<User[]>([])
    const [invitations, setInvitations] = useState<Invitation[]>([])
    const [loading, setLoading] = useState(true)
    const [inviteOpen, setInviteOpen] = useState(false)
    const [inviteEmail, setInviteEmail] = useState("")
    const [inviteRole, setInviteRole] = useState<Role>("user")
    const [sending, setSending] = useState(false)

    const { data: session } = authClient.useSession()

    useEffect(() => {
        loadData()
    }, [])

    async function loadData() {
        try {
            setLoading(true)
            const [usersRes, invitesRes] = await Promise.all([
                fetch("/api/hr/users"),
                fetch("/api/hr/invitations")
            ])

            if (usersRes.ok) {
                const data = await usersRes.json()
                setUsers(data.users)
            }

            if (invitesRes.ok) {
                const data = await invitesRes.json()
                setInvitations(data.invitations)
            }
        } catch (e) {
            console.error("Failed to load HR data", e)
        } finally {
            setLoading(false)
        }
    }

    async function sendInvite() {
        try {
            setSending(true)
            const res = await fetch("/api/hr/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: inviteEmail, role: inviteRole })
            })

            if (!res.ok) throw new Error("Failed to send invite")

            setInviteOpen(false)
            setInviteEmail("")
            loadData()
        } catch (e) {
            alert("Failed to send invitation")
        } finally {
            setSending(false)
        }
    }

    async function deleteUser(id: string) {
        if (!confirm("Are you sure you want to delete this user?")) return

        try {
            const res = await fetch(`/api/hr/users/${id}`, { method: "DELETE" })
            if (res.ok) loadData()
        } catch (e) {
            console.error(e)
        }
    }

    if ((session?.user as any)?.role !== "admin" && (session?.user as any)?.role !== "guest_admin") {
        return <div className="p-8 text-center text-muted-foreground">Access Denied. Admin only.</div>
    }

    return (
        <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">HR & Team Management</h1>
                    <p className="text-muted-foreground">Manage users, roles, and invitations.</p>
                </div>
                <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Mail className="mr-2 size-4" /> Invite User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite New Team Member</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Email Address</Label>
                                <Input
                                    placeholder="colleague@example.com"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as Role)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.values(ROLES).map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role.charAt(0).toUpperCase() + role.slice(1)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button className="w-full" onClick={sendInvite} disabled={sending}>
                                {sending ? "Sending..." : "Send Invitation"}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="size-5" /> Team Members
                        </CardTitle>
                        <CardDescription>Active users in the system</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="font-medium">{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{user.role}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => deleteUser(user.id)}
                                                disabled={(session?.user as any)?.role === "guest_admin"}
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Mail className="size-5" /> Pending Invitations
                        </CardTitle>
                        <CardDescription>Invites sent but not yet accepted</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {invitations.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground py-8">
                                            No pending invitations
                                        </TableCell>
                                    </TableRow>
                                )}
                                {invitations.map((invite) => (
                                    <TableRow key={invite.id}>
                                        <TableCell>{invite.email}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{invite.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200">
                                                {invite.status}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
