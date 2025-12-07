"use client"

import { useState } from "react"
import { useTheme } from "next-themes"
import { authClient } from "@/lib/auth-client"
import {
    User,
    Bell,
    Moon,
    Sun,
    Shield,
    Save,
    Check
} from "lucide-react"

export default function SettingsPage() {
    const { data: session } = authClient.useSession()
    const { setTheme, resolvedTheme } = useTheme()
    const isDarkMode = resolvedTheme === "dark"
    const [activeTab, setActiveTab] = useState("profile")
    const [saved, setSaved] = useState(false)

    const user = session?.user

    const handleSave = () => {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    const borderClass = isDarkMode ? "border-white/10" : "border-black/10"
    const cardClass = isDarkMode ? "bg-[#0a0a0a]/80" : "bg-white/90 shadow-lg shadow-black/5"
    const inputClass = isDarkMode
        ? "bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-[#D4AF37]"
        : "bg-black/5 border-black/10 text-gray-900 placeholder:text-gray-400 focus:border-[#003366]"

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "appearance", label: "Appearance", icon: isDarkMode ? Moon : Sun },
        { id: "security", label: "Security", icon: Shield },
    ]

    return (
        <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#F5F5F7] text-gray-900'}`}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className={`text-2xl sm:text-3xl font-serif font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                        Settings
                    </h1>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                        Manage your account settings and preferences
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className={`lg:w-56 p-2 rounded-xl border ${borderClass} ${cardClass}`}>
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                                        ${activeTab === tab.id
                                            ? isDarkMode
                                                ? 'bg-[#D4AF37]/20 text-[#D4AF37]'
                                                : 'bg-[#003366]/10 text-[#003366]'
                                            : isDarkMode
                                                ? 'text-gray-400 hover:text-white hover:bg-white/5'
                                                : 'text-gray-600 hover:text-gray-900 hover:bg-black/5'
                                        }`}
                                >
                                    <tab.icon size={18} />
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Content */}
                    <div className={`flex-1 p-6 rounded-xl border ${borderClass} ${cardClass}`}>
                        {activeTab === "profile" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Profile Information
                                    </h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Update your personal details
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold
                                        ${isDarkMode ? 'bg-[#D4AF37]/20 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                                        {user?.name?.slice(0, 2).toUpperCase() || "U"}
                                    </div>
                                    <div>
                                        <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                            {user?.name || "User"}
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {user?.email || "user@example.com"}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            defaultValue={user?.name || ""}
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none transition-colors ${inputClass}`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            defaultValue={user?.email || ""}
                                            disabled
                                            className={`w-full px-4 py-2.5 rounded-lg border outline-none opacity-60 cursor-not-allowed ${inputClass}`}
                                        />
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                            Email cannot be changed
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSave}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-colors
                                        ${isDarkMode
                                            ? 'bg-[#D4AF37] text-black hover:bg-[#D4AF37]/90'
                                            : 'bg-[#003366] text-white hover:bg-[#003366]/90'
                                        }`}
                                >
                                    {saved ? <Check size={18} /> : <Save size={18} />}
                                    {saved ? "Saved!" : "Save Changes"}
                                </button>
                            </div>
                        )}

                        {activeTab === "notifications" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Notification Preferences
                                    </h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Choose how you want to be notified
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { label: "New lead assignments", desc: "Get notified when a lead is assigned to you" },
                                        { label: "Service updates", desc: "Notifications about job card status changes" },
                                        { label: "Low inventory alerts", desc: "Alerts when parts are below reorder level" },
                                        { label: "Daily summary", desc: "Receive a daily summary of activities" },
                                    ].map((item, i) => (
                                        <div key={i} className={`flex items-center justify-between p-4 rounded-lg border ${borderClass}`}>
                                            <div>
                                                <p className={`font-medium text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                                    {item.label}
                                                </p>
                                                <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" defaultChecked={i < 2} className="sr-only peer" />
                                                <div className={`w-11 h-6 rounded-full peer peer-focus:ring-2 
                                                    ${isDarkMode
                                                        ? 'bg-white/10 peer-checked:bg-[#D4AF37] peer-focus:ring-[#D4AF37]/30'
                                                        : 'bg-black/10 peer-checked:bg-[#003366] peer-focus:ring-[#003366]/30'
                                                    } 
                                                    after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full`}>
                                                </div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === "appearance" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Appearance
                                    </h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Customize how the app looks
                                    </p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                        Theme
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`p-4 rounded-xl border-2 transition-all ${!isDarkMode
                                                ? 'border-[#003366] bg-[#003366]/5'
                                                : 'border-white/10 hover:border-white/20'
                                                }`}
                                        >
                                            <Sun size={24} className={`mx-auto mb-2 ${!isDarkMode ? 'text-[#003366]' : 'text-gray-400'}`} />
                                            <p className={`text-sm font-medium ${!isDarkMode ? 'text-[#003366]' : 'text-gray-400'}`}>Light</p>
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`p-4 rounded-xl border-2 transition-all ${isDarkMode
                                                ? 'border-[#D4AF37] bg-[#D4AF37]/10'
                                                : 'border-black/10 hover:border-black/20'
                                                }`}
                                        >
                                            <Moon size={24} className={`mx-auto mb-2 ${isDarkMode ? 'text-[#D4AF37]' : 'text-gray-500'}`} />
                                            <p className={`text-sm font-medium ${isDarkMode ? 'text-[#D4AF37]' : 'text-gray-500'}`}>Dark</p>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === "security" && (
                            <div className="space-y-6">
                                <div>
                                    <h2 className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Security Settings
                                    </h2>
                                    <p className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Manage your account security
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border ${borderClass}`}>
                                    <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Change Password
                                    </h3>
                                    <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        Update your password to keep your account secure
                                    </p>
                                    <button
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                            ${isDarkMode
                                                ? 'bg-white/10 hover:bg-white/20 text-white'
                                                : 'bg-black/5 hover:bg-black/10 text-gray-900'
                                            }`}
                                    >
                                        Update Password
                                    </button>
                                </div>

                                <div className={`p-4 rounded-lg border ${borderClass}`}>
                                    <h3 className={`font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                        Active Sessions
                                    </h3>
                                    <p className={`text-sm mb-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                                        You're currently logged in on this device
                                    </p>
                                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                        Last login: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
