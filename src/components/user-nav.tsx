"use client"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import { ChevronsUpDown, LogOut, BadgeCheck, Bell, Settings, Sun, Moon, HelpCircle } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

export function UserNav({ user }: { user: { name: string; email: string; image?: string | null } }) {
    const { isMobile } = useSidebar()
    const router = useRouter()
    const { setTheme, resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const handleSignOut = async () => {
        await authClient.signOut({
            fetchOptions: {
                onSuccess: () => {
                    router.push("/login")
                },
            },
        })
    }

    // Get user initials
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className={`transition-colors ${isDarkMode
                                ? 'data-[state=open]:bg-white/10 hover:bg-white/5 text-white'
                                : 'data-[state=open]:bg-black/5 hover:bg-black/5 text-gray-900'
                                }`}
                        >
                            <Avatar className={`h-8 w-8 rounded-lg ring-2 ${isDarkMode ? 'ring-[#D4AF37]/30' : 'ring-[#003366]/20'}`}>
                                <AvatarImage src={user.image || ""} alt={user.name} />
                                <AvatarFallback className={`rounded-lg font-semibold ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                                    {getInitials(user.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className={`truncate font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                                <span className={`truncate text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>
                            </div>
                            <ChevronsUpDown className={`ml-auto size-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className={`w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl ${isDarkMode
                            ? 'bg-[#0a0a0a] border-white/10 text-white'
                            : 'bg-white border-black/10 text-gray-900'
                            }`}
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className={`flex items-center gap-2 px-2 py-2 text-left text-sm border-b ${isDarkMode ? 'border-white/10' : 'border-black/5'}`}>
                                <Avatar className={`h-10 w-10 rounded-lg ring-2 ${isDarkMode ? 'ring-[#D4AF37]/30' : 'ring-[#003366]/20'}`}>
                                    <AvatarImage src={user.image || ""} alt={user.name} />
                                    <AvatarFallback className={`rounded-lg font-semibold ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                                        {getInitials(user.name)}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className={`truncate font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{user.name}</span>
                                    <span className={`truncate text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user.email}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuItem
                                onClick={() => router.push('/settings')}
                                className={`rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-black/5 focus:bg-black/5'}`}
                            >
                                <BadgeCheck className={`mr-2 h-4 w-4 ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`} />
                                <span>Account</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => router.push('/settings?tab=notifications')}
                                className={`rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-black/5 focus:bg-black/5'}`}
                            >
                                <Bell className={`mr-2 h-4 w-4 ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`} />
                                <span>Notifications</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
                                className={`rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-black/5 focus:bg-black/5'}`}
                            >
                                {isDarkMode ? (
                                    <Sun className="mr-2 h-4 w-4 text-[#D4AF37]" />
                                ) : (
                                    <Moon className="mr-2 h-4 w-4 text-[#003366]" />
                                )}
                                <span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className={isDarkMode ? 'bg-white/10' : 'bg-black/5'} />
                        <DropdownMenuGroup className="p-1">
                            <DropdownMenuItem
                                onClick={() => window.open('https://github.com/your-repo/docs', '_blank')}
                                className={`rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-white/10 focus:bg-white/10' : 'hover:bg-black/5 focus:bg-black/5'}`}
                            >
                                <HelpCircle className={`mr-2 h-4 w-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                                <span>Help & Support</span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className={isDarkMode ? 'bg-white/10' : 'bg-black/5'} />
                        <div className="p-1">
                            <DropdownMenuItem
                                onClick={handleSignOut}
                                className={`rounded-lg cursor-pointer text-red-500 ${isDarkMode ? 'hover:bg-red-500/10 focus:bg-red-500/10' : 'hover:bg-red-50 focus:bg-red-50'}`}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}

