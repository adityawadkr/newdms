"use client"

import { Button } from "@/components/ui/button"
import { Plus, Car, Users, Calendar, FileText } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { useRouter } from "next/navigation"

export function QuickActions() {
    const router = useRouter()

    return (
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-[0_0_20px_-5px_rgba(var(--primary),0.3)] hover:shadow-[0_0_25px_-5px_rgba(var(--primary),0.5)] transition-all duration-300 border-0">
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline font-medium tracking-wide">Quick Add</span>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background/80 backdrop-blur-xl border-white/10 shadow-2xl">
                    <DropdownMenuLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Create New</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer" onClick={() => router.push('/sales/leads')}>
                        <Users className="mr-2 h-4 w-4" />
                        <span>New Lead</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer" onClick={() => router.push('/sales/test-drives')}>
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Book Test Drive</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer" onClick={() => router.push('/inventory/vehicles')}>
                        <Car className="mr-2 h-4 w-4" />
                        <span>Add Vehicle</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="focus:bg-white/10 focus:text-primary cursor-pointer" onClick={() => router.push('/sales/quotations')}>
                        <FileText className="mr-2 h-4 w-4" />
                        <span>Create Quote</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
