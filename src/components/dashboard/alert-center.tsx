"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Alert {
    id: string
    title: string
    description: string
    severity: "critical" | "warning" | "info"
    time: string
}

const mockAlerts: Alert[] = [
    {
        id: "1",
        title: "Low Stock Alert",
        description: "Swift VXI (Red) is below reorder point (2 left).",
        severity: "critical",
        time: "10m ago",
    },
    {
        id: "2",
        title: "VIP Lead Assigned",
        description: "New lead assigned to you: Rahul Sharma.",
        severity: "info",
        time: "1h ago",
    },
    {
        id: "3",
        title: "Service Overdue",
        description: "Vehicle MH12AB1234 missed scheduled service.",
        severity: "warning",
        time: "2h ago",
    },
]

export function AlertCenter() {
    return (
        <Card className="h-full flex flex-col border-white/5 bg-white/5 backdrop-blur-sm shadow-sm">
            <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-semibold flex items-center gap-2 tracking-tight">
                        <AlertTriangle className="h-4 w-4 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        Alert Center
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="text-xs h-7 text-muted-foreground hover:text-foreground hover:bg-white/5">
                        Clear All
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-[300px] px-4 py-2">
                    <div className="space-y-3">
                        {mockAlerts.map((alert) => (
                            <div key={alert.id} className="flex gap-3 items-start p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors group">
                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 shadow-[0_0_8px_currentColor] ${alert.severity === "critical" ? "bg-red-500 text-red-500" :
                                    alert.severity === "warning" ? "bg-amber-500 text-amber-500" : "bg-blue-500 text-blue-500"
                                    }`} />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium leading-none group-hover:text-white transition-colors">{alert.title}</p>
                                    <p className="text-xs text-muted-foreground group-hover:text-muted-foreground/80">{alert.description}</p>
                                    <p className="text-[10px] text-muted-foreground/50 pt-1 font-mono">{alert.time}</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-6 w-6 -mt-1 -mr-1 text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10 opacity-0 group-hover:opacity-100 transition-all">
                                    <CheckCircle2 className="h-3 w-3" />
                                    <span className="sr-only">Acknowledge</span>
                                </Button>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
