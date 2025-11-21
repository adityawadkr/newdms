"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const activities = [
    {
        user: "Siddhi",
        action: "created a new lead",
        target: "Rajesh Kumar",
        time: "2 mins ago",
        initials: "SI",
    },
    {
        user: "Aditya",
        action: "scheduled a test drive",
        target: "Mahindra XUV700",
        time: "1 hour ago",
        initials: "AD",
    },
    {
        user: "System",
        action: "alert: low stock",
        target: "Tata Nexon EV",
        time: "3 hours ago",
        initials: "SY",
    },
    {
        user: "Rahul",
        action: "completed job card",
        target: "#JC-2024-001",
        time: "5 hours ago",
        initials: "RA",
    },
]

export function RecentActivity() {
    return (
        <Card className="shadow-sm border-white/5 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4 border-b border-white/5">
                <CardTitle className="text-base font-semibold tracking-tight">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="space-y-0 relative">
                    {/* Timeline Line */}
                    <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-white/20 via-white/10 to-transparent" />

                    {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4 relative pb-6 last:pb-0 group">
                            <div className="relative z-10 mt-1">
                                <Avatar className="h-8 w-8 border border-white/10 bg-background/50 backdrop-blur-sm ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                    <AvatarFallback className="text-[10px] bg-gradient-to-br from-primary/20 to-primary/5 text-primary">{activity.initials}</AvatarFallback>
                                </Avatar>
                            </div>
                            <div className="grid gap-1 pt-0.5">
                                <p className="text-sm font-medium leading-none text-foreground/90 group-hover:text-foreground transition-colors">
                                    {activity.user} <span className="text-muted-foreground font-normal">{activity.action}</span>
                                </p>
                                <p className="text-xs text-muted-foreground/60 group-hover:text-muted-foreground transition-colors">
                                    {activity.target} • <span className="font-mono text-[10px]">{activity.time}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
