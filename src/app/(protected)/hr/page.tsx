"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Clock, Calendar, DollarSign, UserPlus, FileText, CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface LeaveRequest {
  id: number
  employeeName: string
  type: string
  status: string
  createdAt: string
  startDate: string
  endDate: string
}

export default function HRDashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0
  })
  const [recentActivity, setRecentActivity] = useState<LeaveRequest[]>([])

  useEffect(() => {
    // Fetch stats from APIs
    async function fetchData() {
      try {
        const today = new Date().toISOString().split('T')[0]

        const [empRes, attRes, leaveRes, pendingLeaveRes] = await Promise.all([
          fetch("/api/hr/employees"),
          fetch(`/api/hr/attendance?date=${today}`),
          fetch("/api/hr/leaves?status=Approved"),
          fetch("/api/hr/leaves?status=Pending")
        ])

        const empData = await empRes.json()
        const attData = await attRes.json()
        const approvedLeavesData = await leaveRes.json()
        const pendingLeavesData = await pendingLeaveRes.json()

        // Calculate "On Leave" for today
        const onLeaveCount = (approvedLeavesData.data || []).filter((l: LeaveRequest) =>
          l.startDate <= today && l.endDate >= today
        ).length

        setStats({
          totalEmployees: empData.data?.length || 0,
          presentToday: attData.data?.length || 0,
          onLeave: onLeaveCount,
          pendingLeaves: pendingLeavesData.data?.length || 0
        })

        // Combine recent leaves for activity feed
        const allLeaves = [...(pendingLeavesData.data || []), ...(approvedLeavesData.data || [])]
        // Sort by ID desc (proxy for recency) or createdAt if available
        const sortedLeaves = allLeaves.sort((a: LeaveRequest, b: LeaveRequest) => b.id - a.id).slice(0, 5)
        setRecentActivity(sortedLeaves)

      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">HR Dashboard</h1>
          <p className="text-zinc-500 mt-1">Overview of your workforce and daily operations.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/hr/employees">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800">
              <UserPlus className="mr-2 h-4 w-4" /> Add Employee
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{stats.totalEmployees}</div>
            <p className="text-xs text-zinc-500 mt-1">Active workforce</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Present Today</CardTitle>
            <Clock className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{stats.presentToday}</div>
            <p className="text-xs text-zinc-500 mt-1">Checked in so far</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">On Leave</CardTitle>
            <Calendar className="h-4 w-4 text-rose-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{stats.onLeave}</div>
            <p className="text-xs text-zinc-500 mt-1">Approved for today</p>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-900">{stats.pendingLeaves}</div>
            <p className="text-xs text-zinc-500 mt-1">Requires approval</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link href="/hr/attendance" className="block">
              <div className="flex items-center p-4 border rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-zinc-900">Attendance</h3>
                  <p className="text-sm text-zinc-500">View daily logs</p>
                </div>
              </div>
            </Link>
            <Link href="/hr/leaves" className="block">
              <div className="flex items-center p-4 border rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                  <Calendar className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-zinc-900">Leaves</h3>
                  <p className="text-sm text-zinc-500">Approve requests</p>
                </div>
              </div>
            </Link>
            <Link href="/hr/payroll" className="block">
              <div className="flex items-center p-4 border rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <DollarSign className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-zinc-900">Payroll</h3>
                  <p className="text-sm text-zinc-500">Generate slips</p>
                </div>
              </div>
            </Link>
            <Link href="/hr/employees" className="block">
              <div className="flex items-center p-4 border rounded-xl hover:bg-zinc-50 transition-colors cursor-pointer group">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                  <Users className="h-5 w-5" />
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-zinc-900">Directory</h3>
                  <p className="text-sm text-zinc-500">Manage staff</p>
                </div>
              </div>
            </Link>
          </CardContent>
        </Card>

        <Card className="col-span-3 border-zinc-200 shadow-sm">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-zinc-500">No recent activity.</p>
              ) : (
                recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="h-8 w-8 rounded-full bg-zinc-100 flex items-center justify-center mt-0.5">
                      <FileText className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-900">
                        {activity.status === "Pending" ? "New Leave Request" : `Leave ${activity.status}`}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {activity.employeeName} - {activity.type}
                      </p>
                      <div className="mt-1">
                        <Badge variant="outline" className="text-[10px] px-1 py-0 h-5">
                          {activity.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
