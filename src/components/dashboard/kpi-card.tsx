"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDown, ArrowUp, MoreHorizontal } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface KPICardProps {
    title: string
    value: string | number
    trend: "up" | "down" | "neutral"
    trendValue: string
    data?: { value: number }[]
    actionLabel?: string
    onAction?: () => void
}

export function KPICard({ title, value, trend, trendValue, data, actionLabel, onAction }: KPICardProps) {
    return (
        <Card className="overflow-hidden border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(255,255,255,0.1)] group relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {title}
                </CardTitle>
                {actionLabel && onAction && (
                    <Button variant="ghost" size="icon" className="h-4 w-4 text-muted-foreground hover:text-foreground" onClick={onAction}>
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                    </Button>
                )}
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center text-xs font-medium">
                        {trend === "up" && <ArrowUp className="mr-1 h-3 w-3 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                        {trend === "down" && <ArrowDown className="mr-1 h-3 w-3 text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.5)]" />}
                        <span className={trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-muted-foreground"}>
                            {trendValue}
                        </span>
                        <span className="text-muted-foreground/70 ml-1">vs last month</span>
                    </div>

                    {data && data.length > 0 && (
                        <div className="h-[35px] w-[80px] opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <defs>
                                        <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stopColor={trend === "up" ? "#34d399" : "#fb7185"} stopOpacity={0.2} />
                                            <stop offset="100%" stopColor={trend === "up" ? "#10b981" : "#f43f5e"} stopOpacity={1} />
                                        </linearGradient>
                                    </defs>
                                    <Line
                                        type="monotone"
                                        dataKey="value"
                                        stroke={`url(#gradient-${title})`}
                                        strokeWidth={2}
                                        dot={false}
                                        strokeLinecap="round"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
