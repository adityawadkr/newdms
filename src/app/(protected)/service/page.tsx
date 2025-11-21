"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Wrench, DollarSign, Activity, Car } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Badge } from "@/components/ui/badge"

export default function ServiceDashboard() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/service/dashboard")
            .then(res => res.json())
            .then(json => {
                if (json.data) setData(json.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    if (loading) return <div className="p-8">Loading dashboard...</div>

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Service Overview</h1>
                <p className="text-zinc-500 mt-1">Real-time insights into service operations.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{data?.appointmentsToday || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Vehicles in Service</CardTitle>
                        <Wrench className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{data?.inService || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Revenue (This Month)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">₹{(data?.revenue || 0).toLocaleString('en-IN')}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Service Type Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data?.serviceTypes || []}>
                                    <XAxis dataKey="type" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="count" fill="#18181b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Job Cards</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data?.recentJobs?.map((job: any) => (
                                <div key={job.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <Car className="h-5 w-5 text-zinc-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900">{job.jobNo}</p>
                                            <p className="text-xs text-zinc-500">{job.technician}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={job.status === "Completed" ? "default" : "secondary"}>{job.status}</Badge>
                                        <p className="text-xs text-zinc-500 mt-1">{new Date(job.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                            {(!data?.recentJobs || data.recentJobs.length === 0) && (
                                <div className="text-center text-zinc-500 py-4">No recent activity</div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
