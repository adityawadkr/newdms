"use client"

import { useEffect, useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  Users, Clock, Calendar, DollarSign, UserPlus, FileText,
  CheckCircle2, AlertCircle, Briefcase, TrendingUp, ChevronRight,
  BarChart3, ArrowUpRight, Timer, UserCheck, UserX
} from "lucide-react"

interface LeaveRequest {
  id: number
  employeeName: string
  type: string
  status: string
  createdAt: string
  startDate: string
  endDate: string
}

interface Employee {
  id: number
  name: string
  department: string
  role: string
  status: string
}

// Animated stat component
const AnimatedStat = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const [displayed, setDisplayed] = useState(0)

  useEffect(() => {
    const duration = 800
    const steps = 30
    const increment = value / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setDisplayed(value)
        clearInterval(timer)
      } else {
        setDisplayed(Math.floor(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [value])

  return <span>{displayed}{suffix}</span>
}

export default function PremiumHRDashboard() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"

  const [stats, setStats] = useState({
    totalEmployees: 0,
    presentToday: 0,
    onLeave: 0,
    pendingLeaves: 0
  })
  const [recentActivity, setRecentActivity] = useState<LeaveRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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

        const onLeaveCount = (approvedLeavesData.data || []).filter((l: LeaveRequest) =>
          l.startDate <= today && l.endDate >= today
        ).length

        setStats({
          totalEmployees: empData.data?.length || 0,
          presentToday: attData.data?.length || 0,
          onLeave: onLeaveCount,
          pendingLeaves: pendingLeavesData.data?.length || 0
        })

        const allLeaves = [...(pendingLeavesData.data || []), ...(approvedLeavesData.data || [])]
        const sortedLeaves = allLeaves.sort((a: LeaveRequest, b: LeaveRequest) => b.id - a.id).slice(0, 5)
        setRecentActivity(sortedLeaves)

      } catch (error) {
        console.error("Failed to fetch dashboard data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const quickActions = [
    {
      title: "Attendance",
      description: "View daily logs",
      icon: Clock,
      href: "/hr/attendance",
      gradient: "from-emerald-500 to-green-600",
      bgColor: isDarkMode ? "bg-emerald-500/10" : "bg-emerald-50"
    },
    {
      title: "Leaves",
      description: "Approve requests",
      icon: Calendar,
      href: "/hr/leaves",
      gradient: "from-amber-500 to-orange-500",
      bgColor: isDarkMode ? "bg-amber-500/10" : "bg-amber-50"
    },
    {
      title: "Payroll",
      description: "Generate slips",
      icon: DollarSign,
      href: "/hr/payroll",
      gradient: "from-blue-500 to-indigo-600",
      bgColor: isDarkMode ? "bg-blue-500/10" : "bg-blue-50"
    },
    {
      title: "Directory",
      description: "Manage staff",
      icon: Users,
      href: "/hr/employees",
      gradient: "from-purple-500 to-pink-500",
      bgColor: isDarkMode ? "bg-purple-500/10" : "bg-purple-50"
    },
  ]

  const attendanceRate = stats.totalEmployees > 0
    ? Math.round((stats.presentToday / stats.totalEmployees) * 100)
    : 0

  return (
    <div className={`min-h-screen p-6 ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-mono uppercase tracking-[0.15em] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                HUMAN RESOURCES
              </span>
            </div>
            <h1 className={`text-2xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              HR Dashboard
            </h1>
            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-600'}`}>
              Workforce overview and daily operations
            </p>
          </div>

          <Link
            href="/hr/employees"
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${isDarkMode
                ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                : 'bg-[#003366] text-white hover:bg-[#004488]'}`}
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Employees */}
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Total Employees
              </span>
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
                <Users className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {loading ? "—" : <AnimatedStat value={stats.totalEmployees} />}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              Active workforce
            </p>
          </div>

          {/* Present Today */}
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Present Today
              </span>
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'}`}>
                <UserCheck className={`h-4 w-4 text-emerald-500`} />
              </div>
            </div>
            <p className={`text-3xl font-bold text-emerald-500`}>
              {loading ? "—" : <AnimatedStat value={stats.presentToday} />}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              Checked in today
            </p>
          </div>

          {/* On Leave */}
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                On Leave
              </span>
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-rose-500/10' : 'bg-rose-100'}`}>
                <UserX className={`h-4 w-4 text-rose-500`} />
              </div>
            </div>
            <p className={`text-3xl font-bold text-rose-500`}>
              {loading ? "—" : <AnimatedStat value={stats.onLeave} />}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              Approved for today
            </p>
          </div>

          {/* Pending Requests */}
          <div className={`relative overflow-hidden rounded-2xl p-5 transition-all hover:scale-[1.02]
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Pending Requests
              </span>
              <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100'}`}>
                <AlertCircle className={`h-4 w-4 text-amber-500`} />
              </div>
            </div>
            <p className={`text-3xl font-bold text-amber-500`}>
              {loading ? "—" : <AnimatedStat value={stats.pendingLeaves} />}
            </p>
            <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-600' : 'text-gray-500'}`}>
              Requires approval
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Attendance Rate Card */}
          <div className={`lg:col-span-1 rounded-2xl p-6 transition-all
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Today's Attendance
            </h3>

            {/* Circular Progress */}
            <div className="relative w-36 h-36 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="72" cy="72" r="60"
                  className={`fill-none stroke-[8] ${isDarkMode ? 'stroke-white/10' : 'stroke-gray-200'}`}
                />
                <circle
                  cx="72" cy="72" r="60"
                  className="fill-none stroke-[8] stroke-emerald-500 transition-all duration-1000"
                  strokeDasharray={`${attendanceRate * 3.77} 377`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {loading ? "—" : `${attendanceRate}%`}
                </span>
                <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                  Attendance
                </span>
              </div>
            </div>

            <div className="flex justify-center gap-6 text-center">
              <div>
                <p className={`text-lg font-semibold text-emerald-500`}>{stats.presentToday}</p>
                <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Present</p>
              </div>
              <div className={`w-px ${isDarkMode ? 'bg-white/10' : 'bg-gray-200'}`} />
              <div>
                <p className={`text-lg font-semibold text-rose-500`}>{stats.onLeave}</p>
                <p className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>Absent</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className={`lg:col-span-2 rounded-2xl p-6 transition-all
            ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
            <h3 className={`text-sm font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Quick Actions
            </h3>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={`group flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02]
                    ${isDarkMode
                      ? 'bg-white/[0.02] border border-white/10 hover:border-white/20'
                      : 'bg-gray-50 border border-gray-100 hover:border-gray-200 hover:shadow-md'}`}
                >
                  <div className={`p-3 rounded-xl ${action.bgColor} transition-transform group-hover:scale-110`}>
                    <action.icon className={`h-5 w-5 bg-gradient-to-r ${action.gradient} bg-clip-text`}
                      style={{
                        color: action.gradient.includes('emerald') ? '#10b981' :
                          action.gradient.includes('amber') ? '#f59e0b' :
                            action.gradient.includes('blue') ? '#3b82f6' : '#a855f7'
                      }} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {action.title}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {action.description}
                    </p>
                  </div>
                  <ChevronRight className={`h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity
                    ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`rounded-2xl p-6 transition-all
          ${isDarkMode ? 'bg-white/[0.03] border border-white/10' : 'bg-white border border-gray-200 shadow-sm'}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Recent Activity
            </h3>
            <Link
              href="/hr/leaves"
              className={`flex items-center gap-1 text-xs font-medium transition-colors
                ${isDarkMode ? 'text-[#D4AF37] hover:text-[#E5C158]' : 'text-[#003366] hover:text-[#004488]'}`}
            >
              View All <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-16 rounded-xl animate-pulse ${isDarkMode ? 'bg-white/5' : 'bg-gray-100'}`} />
              ))}
            </div>
          ) : recentActivity.length === 0 ? (
            <div className={`text-center py-8 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-colors
                    ${isDarkMode ? 'hover:bg-white/[0.03]' : 'hover:bg-gray-50'}`}
                >
                  <div className={`p-2 rounded-lg ${activity.status === 'Pending'
                      ? isDarkMode ? 'bg-amber-500/10' : 'bg-amber-100'
                      : activity.status === 'Approved'
                        ? isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-100'
                        : isDarkMode ? 'bg-gray-500/10' : 'bg-gray-100'
                    }`}>
                    {activity.status === 'Pending' ? (
                      <Timer className="h-4 w-4 text-amber-500" />
                    ) : activity.status === 'Approved' ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <FileText className={`h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {activity.status === 'Pending' ? 'New Leave Request' : `Leave ${activity.status}`}
                    </p>
                    <p className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {activity.employeeName} • {activity.type}
                    </p>
                  </div>

                  <div className={`px-2 py-1 rounded-full text-[10px] font-medium
                    ${activity.status === 'Pending'
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                      : activity.status === 'Approved'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                        : isDarkMode ? 'bg-white/10 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                    {activity.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
