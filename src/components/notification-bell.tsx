"use client"

import * as React from "react"
import { Bell, X, Check, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"

type Notification = {
    id: number
    type: string
    title: string
    message: string
    link?: string
    read: boolean
    createdAt: string
}

const TYPE_COLORS: Record<string, string> = {
    lead: "bg-blue-500",
    quotation: "bg-purple-500",
    booking: "bg-green-500",
    delivery: "bg-teal-500",
    service: "bg-orange-500",
    hr: "bg-pink-500",
    posh: "bg-red-500",
    inventory: "bg-yellow-500",
    system: "bg-gray-500",
}

export function NotificationBell() {
    const router = useRouter()
    const { resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"

    const [isOpen, setIsOpen] = React.useState(false)
    const [notifications, setNotifications] = React.useState<Notification[]>([])
    const [unreadCount, setUnreadCount] = React.useState(0)
    const [loading, setLoading] = React.useState(false)

    const fetchNotifications = React.useCallback(async () => {
        try {
            const res = await fetch("/api/notifications?limit=10")
            const data = await res.json()
            setNotifications(data.data || [])
            setUnreadCount(data.unreadCount || 0)
        } catch (err) {
            console.error("Failed to fetch notifications:", err)
        }
    }, [])

    React.useEffect(() => {
        fetchNotifications()
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000)
        return () => clearInterval(interval)
    }, [fetchNotifications])

    const markAsRead = async (ids?: number[]) => {
        try {
            await fetch("/api/notifications", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ids ? { ids } : { markAll: true })
            })
            fetchNotifications()
        } catch (err) {
            console.error("Failed to mark as read:", err)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.read) {
            markAsRead([notification.id])
        }
        setIsOpen(false)

        if (notification.link) {
            // Use window.location for reliable redirect
            window.location.href = notification.link
        }
    }

    const formatTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return "Just now"
        if (minutes < 60) return `${minutes}m ago`
        if (hours < 24) return `${hours}h ago`
        if (days < 7) return `${days}d ago`
        return date.toLocaleDateString()
    }

    return (
        <div className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 rounded-lg transition-colors ${isDarkMode
                    ? 'hover:bg-white/10 text-gray-300'
                    : 'hover:bg-black/5 text-gray-600'
                    }`}
            >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Panel */}
                    <div className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-xl shadow-2xl z-[100] overflow-hidden ${isDarkMode
                        ? 'bg-[#111] border border-white/10'
                        : 'bg-white border border-gray-200'
                        }`}>
                        {/* Header */}
                        <div className={`px-4 py-3 flex items-center justify-between ${isDarkMode ? 'border-b border-white/10' : 'border-b border-gray-100'
                            }`}>
                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Notifications
                            </h3>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAsRead()}
                                        className={`text-xs font-medium ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
                                            }`}
                                    >
                                        Mark all read
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className={`p-1 rounded ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        {/* Notifications List */}
                        <div className="max-h-96 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className={`py-12 text-center ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`px-4 py-3 cursor-pointer transition-colors ${notification.read
                                            ? isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50'
                                            : isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-blue-50 hover:bg-blue-100'
                                            }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Type indicator */}
                                            <div className={`w-2 h-2 rounded-full mt-2 ${TYPE_COLORS[notification.type] || TYPE_COLORS.system}`} />

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-sm font-medium truncate ${isDarkMode ? 'text-white' : 'text-gray-900'
                                                        } ${!notification.read ? 'font-semibold' : ''}`}>
                                                        {notification.title}
                                                    </p>
                                                    <span className={`text-xs whitespace-nowrap ${isDarkMode ? 'text-gray-500' : 'text-gray-400'
                                                        }`}>
                                                        {formatTime(notification.createdAt)}
                                                    </span>
                                                </div>
                                                <p className={`text-xs mt-0.5 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                                    }`}>
                                                    {notification.message}
                                                </p>
                                                {notification.link && (
                                                    <span className={`inline-flex items-center gap-1 mt-1 text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'
                                                        }`}>
                                                        View <ExternalLink className="h-3 w-3" />
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
