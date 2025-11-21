import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, MessageCircle, FileText, Clock, Flame, Snowflake, ThermometerSun } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LeadCardProps {
    lead: any
}

export function LeadCard({ lead }: LeadCardProps) {
    const getTemperatureIcon = (temp: string) => {
        switch (temp) {
            case "Hot": return <Flame className="h-3 w-3 text-orange-500" />
            case "Warm": return <ThermometerSun className="h-3 w-3 text-amber-500" />
            default: return <Snowflake className="h-3 w-3 text-blue-400" />
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-orange-700 bg-orange-50 border-orange-100"
        if (score >= 50) return "text-amber-700 bg-amber-50 border-amber-100"
        return "text-blue-700 bg-blue-50 border-blue-100"
    }

    let vehicleInterest = null
    try {
        vehicleInterest = lead.vehicleInterest ? JSON.parse(lead.vehicleInterest) : null
    } catch (e) {
        vehicleInterest = lead.vehicleInterest
    }

    const handleWhatsApp = () => {
        const phone = lead.phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}`, '_blank');
    }

    const handleCall = () => {
        window.location.href = `tel:${lead.phone}`;
    }

    return (
        <div className="mb-2 group/card">
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-l-[3px]" style={{ borderLeftColor: lead.temperature === 'Hot' ? '#f97316' : lead.temperature === 'Warm' ? '#f59e0b' : '#94a3b8' }}>
                <CardHeader className="p-3 pb-2 space-y-0">
                    <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm truncate text-zinc-900 leading-tight">{lead.name}</h4>
                            <p className="text-[10px] text-muted-foreground truncate mt-0.5">{lead.source}</p>
                        </div>
                        <Badge variant="outline" className={`text-[10px] px-1.5 py-0 h-5 gap-1 font-normal border ${getScoreColor(lead.score || 0)}`}>
                            {getTemperatureIcon(lead.temperature || "Cold")}
                            {lead.score || 0}
                        </Badge>
                    </div>

                    {vehicleInterest && (
                        <div className="pt-2 flex justify-between items-center">
                            <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-5 bg-zinc-100 text-zinc-600 border-zinc-200 font-normal hover:bg-zinc-200">
                                {vehicleInterest.model || vehicleInterest}
                            </Badge>
                            {lead.financeStatus && (
                                <Badge variant="outline" className="text-[9px] px-1 py-0 h-4 border-green-200 text-green-700 bg-green-50">
                                    {lead.financeStatus}
                                </Badge>
                            )}
                        </div>
                    )}
                </CardHeader>

                <CardContent className="p-3 pt-0 pb-2 space-y-2">
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                        <Phone className="h-3 w-3 opacity-70" />
                        <span className="truncate">{lead.phone}</span>
                    </div>

                    {lead.nextAction && (
                        <div className="flex items-center gap-2 text-[10px] bg-blue-50/50 px-2 py-1.5 rounded border border-blue-100/50 text-blue-700">
                            <Clock className="h-3 w-3 shrink-0 text-blue-500" />
                            <div className="flex-1 truncate">
                                <span className="font-medium">{lead.nextAction}</span>
                                {lead.nextActionDate && (
                                    <span className="text-blue-500/70 ml-1">
                                        • {formatDistanceToNow(new Date(lead.nextActionDate), { addSuffix: true })}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="p-1.5 border-t bg-zinc-50/50 flex justify-between items-center gap-1">
                    <div className="flex gap-0.5">
                        <Button variant="ghost" size="icon" onClick={handleWhatsApp} className="h-6 w-6 rounded hover:bg-green-100 hover:text-green-700 text-zinc-400">
                            <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleCall} className="h-6 w-6 rounded hover:bg-blue-100 hover:text-blue-700 text-zinc-400">
                            <Phone className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        {lead.assignedUser && (
                            <div className="h-5 w-5 rounded-full bg-zinc-200 border border-white shadow-sm overflow-hidden" title={lead.assignedUser.name}>
                                {lead.assignedUser.image ? (
                                    <img src={lead.assignedUser.image} alt={lead.assignedUser.name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-[8px] font-bold text-zinc-500">
                                        {lead.assignedUser.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                        )}
                        <span className="text-[9px] text-zinc-300 font-medium px-1">
                            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
