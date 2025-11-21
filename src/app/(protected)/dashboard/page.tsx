"use client"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { Search, Bell, Sun, Moon, MoreHorizontal, Filter, Download } from "lucide-react"
import { useTheme } from "next-themes"
import { KPICard } from "@/components/dashboard/kpi-card"
import { AlertCenter } from "@/components/dashboard/alert-center"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

const salesData = [
  { month: "Jan", leads: 120, sales: 80 },
  { month: "Feb", leads: 150, sales: 90 },
  { month: "Mar", leads: 110, sales: 70 },
  { month: "Apr", leads: 200, sales: 120 },
  { month: "May", leads: 240, sales: 160 },
  { month: "Jun", leads: 210, sales: 150 },
]

const salesByLocation = [
  { name: "Mumbai", value: 52.1, color: "var(--chart-2)" },
  { name: "Pune", value: 22.8, color: "var(--chart-1)" },
  { name: "Baramati", value: 13.9, color: "var(--chart-4)" },
  { name: "Other", value: 11.2, color: "var(--chart-5)" },
]

export default function Dashboard() {
  const { theme, setTheme } = useTheme()
  const [stats, setStats] = useState({ users: 0, inventory: 0, inStock: 0 })
  const [timeRange, setTimeRange] = useState("this_year")
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Fetch real-time stats
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setStats(data)
        }
      })
      .catch(err => console.error("Failed to fetch stats", err))
  }, [])

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/inventory/vehicles?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/10">
      {/* Zone 1: Top Action Bar */}
      <header className="flex h-16 items-center gap-4 border-b bg-background px-6 sticky top-0 z-10">
        <SidebarTrigger />
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Dashboard</span>
          <span>/</span>
          <span>Overview</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search..."
              className="h-9 w-64 rounded-md border bg-muted/50 pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <QuickActions />

          <div className="flex items-center gap-1 border-l pl-4">
            <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="h-9 w-9">
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-background" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        {/* Zone 2: KPI Strip */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <KPICard
            title="Total Revenue"
            value="₹45.2L"
            trend="up"
            trendValue="+20.1%"
            data={[{ value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 55 }, { value: 70 }]}
          />
          <KPICard
            title="Active Leads"
            value="124"
            trend="up"
            trendValue="+12.5%"
            data={[{ value: 20 }, { value: 25 }, { value: 35 }, { value: 30 }, { value: 45 }, { value: 40 }, { value: 55 }]}
          />
          <KPICard
            title="Vehicles Sold"
            value="38"
            trend="down"
            trendValue="-4.5%"
            data={[{ value: 45 }, { value: 40 }, { value: 35 }, { value: 30 }, { value: 25 }, { value: 20 }, { value: 15 }]}
          />
          <KPICard
            title="Service Bookings"
            value="89"
            trend="up"
            trendValue="+8.2%"
            data={[{ value: 30 }, { value: 40 }, { value: 35 }, { value: 50 }, { value: 45 }, { value: 60 }, { value: 65 }]}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Main Chart Section */}
          <div className="lg:col-span-4 xl:col-span-5 space-y-6">
            {/* Sales Performance Chart */}
            <Card className="shadow-sm border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 relative z-10">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">Sales Performance</CardTitle>
                  <CardDescription>Revenue vs Leads over time</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="h-8 w-[120px] bg-background/50 backdrop-blur-sm border-muted-foreground/20">
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="this_year">This Year</SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="icon" className="h-8 w-8 bg-background/50 backdrop-blur-sm border-muted-foreground/20">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="h-[300px] w-full">
                  <ChartContainer config={{
                    leads: { label: "Leads", color: "hsl(var(--chart-4))" },
                    sales: { label: "Sales", color: "hsl(var(--chart-1))" },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={salesData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-4)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-4)" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
                        <XAxis
                          dataKey="month"
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          dy={10}
                        />
                        <YAxis
                          axisLine={false}
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                          tickFormatter={(value) => `${value}`}
                        />
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              className="bg-background/80 backdrop-blur-md border-white/10 shadow-xl rounded-xl"
                              indicator="dot"
                            />
                          }
                          cursor={{ stroke: 'hsl(var(--muted-foreground))', strokeWidth: 1, strokeDasharray: '4 4' }}
                        />
                        <Area
                          type="monotone"
                          dataKey="leads"
                          stroke="var(--chart-4)"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorLeads)"
                          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--chart-4)", className: "animate-pulse" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="sales"
                          stroke="var(--chart-1)"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorSales)"
                          activeDot={{ r: 6, strokeWidth: 0, fill: "var(--chart-1)", className: "animate-pulse" }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>

            {/* Recent Inventory Table */}
            <Card className="shadow-sm border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">Recent Inventory</CardTitle>
                  <CardDescription>Latest vehicles added to stock</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">View All</Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-muted-foreground">Vehicle</TableHead>
                      <TableHead className="text-muted-foreground">Status</TableHead>
                      <TableHead className="text-right text-muted-foreground">Price</TableHead>
                      <TableHead className="text-right text-muted-foreground">Stock</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium">Mahindra XUV700 AX7</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">In Stock</Badge></TableCell>
                      <TableCell className="text-right">₹24.5L</TableCell>
                      <TableCell className="text-right">4</TableCell>
                    </TableRow>
                    <TableRow className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium">Tata Nexon EV Max</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-amber-500/10 text-amber-400 border border-amber-500/20">Low Stock</Badge></TableCell>
                      <TableCell className="text-right">₹18.2L</TableCell>
                      <TableCell className="text-right">1</TableCell>
                    </TableRow>
                    <TableRow className="border-white/5 hover:bg-white/5 transition-colors">
                      <TableCell className="font-medium">Hyundai Creta SX(O)</TableCell>
                      <TableCell><Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border border-blue-500/20">Reserved</Badge></TableCell>
                      <TableCell className="text-right">₹19.8L</TableCell>
                      <TableCell className="text-right">0</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recent Deliveries Table */}
            <Card className="shadow-sm border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Recent Deliveries</CardTitle>
                <CardDescription>Latest vehicle handovers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-muted-foreground">Customer</TableHead>
                      <TableHead className="text-muted-foreground">Vehicle</TableHead>
                      <TableHead className="text-muted-foreground">Date</TableHead>
                      <TableHead className="text-right text-muted-foreground">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { customer: "Amit Patel", vehicle: "XUV700 AX7", date: "Today", status: "Delivered" },
                      { customer: "Sneha Gupta", vehicle: "Thar 4x4", date: "Yesterday", status: "Pending" },
                      { customer: "Vikram Singh", vehicle: "Scorpio-N", date: "2 days ago", status: "Delivered" },
                    ].map((delivery, i) => (
                      <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                        <TableCell className="font-medium">{delivery.customer}</TableCell>
                        <TableCell>{delivery.vehicle}</TableCell>
                        <TableCell className="text-muted-foreground">{delivery.date}</TableCell>
                        <TableCell className="text-right">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${delivery.status === "Delivered"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            }`}>
                            {delivery.status}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Side Panel */}
          <div className="lg:col-span-3 xl:col-span-2 space-y-6">

            {/* Inventory Status Pie Chart */}
            <Card className="shadow-sm border-white/5 bg-white/5 backdrop-blur-sm overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-50 -z-10" />
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold tracking-tight">Inventory Status</CardTitle>
                <CardDescription>Vehicle stock distribution</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[220px] w-full relative">
                  <ChartContainer config={{
                    inStock: { label: "In Stock", color: "hsl(var(--chart-1))" },
                    booked: { label: "Booked", color: "hsl(var(--chart-2))" },
                    inTransit: { label: "In Transit", color: "hsl(var(--chart-3))" },
                    service: { label: "Service", color: "hsl(var(--chart-4))" },
                  }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: "In Stock", value: 45, color: "hsl(var(--chart-1))" },
                            { name: "Booked", value: 25, color: "hsl(var(--chart-2))" },
                            { name: "In Transit", value: 15, color: "hsl(var(--chart-3))" },
                            { name: "Service", value: 15, color: "hsl(var(--chart-4))" },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          stroke="none"
                        >
                          {[
                            { name: "In Stock", value: 45, color: "hsl(var(--chart-1))" },
                            { name: "Booked", value: 25, color: "hsl(var(--chart-2))" },
                            { name: "In Transit", value: 15, color: "hsl(var(--chart-3))" },
                            { name: "Service", value: 15, color: "hsl(var(--chart-4))" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} className="stroke-background hover:opacity-80 transition-opacity" strokeWidth={2} />
                          ))}
                        </Pie>
                        <ChartTooltip
                          content={
                            <ChartTooltipContent
                              className="bg-background/80 backdrop-blur-md border-white/10 shadow-xl rounded-xl"
                              indicator="dot"
                            />
                          }
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                  {/* Center Text Overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-3xl font-bold tracking-tighter">100</span>
                    <span className="text-xs text-muted-foreground uppercase tracking-widest">Total</span>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
                    <span className="text-muted-foreground">In Stock (45%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                    <span className="text-muted-foreground">Booked (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-3))]" />
                    <span className="text-muted-foreground">Transit (15%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-[hsl(var(--chart-4))]" />
                    <span className="text-muted-foreground">Service (15%)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}