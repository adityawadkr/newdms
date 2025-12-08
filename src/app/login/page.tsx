"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const containerRef = useRef<HTMLDivElement>(null)
    const formRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // CSS animation handles entrance
    }, [])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        console.log("🔵 Attempting login with:", email);

        try {
            console.log("🟡 Calling authClient.signIn.email...");
            await authClient.signIn.email({
                email,
                password,
                fetchOptions: {
                    onSuccess: () => {
                        console.log("✅ Login SUCCESS! Redirecting...");
                        router.push("/dashboard")
                    },
                    onError: (ctx) => {
                        console.error("❌ Login FAILED (onError):", ctx);
                        setError(ctx.error.message || "Invalid credentials")
                        setLoading(false)
                    }
                }
            })
            console.log("🟡 authClient.signIn.email call completed (await returned).");
        } catch (err: any) {
            console.error("❌ Login EXCEPTION:", err)
            if (err.message && err.message.includes("fetch")) {
                setError("Unable to connect to the server. Please check your internet connection or try again later.")
            } else {
                setError(err.message || "An unexpected error occurred. Please try again.")
            }
            setLoading(false)
        }
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-up"
        >
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Header / Logo Area */}
            <div className="absolute top-10 left-10 flex items-center gap-3 opacity-70">
                <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                    <div className="w-[1px] h-3 bg-white"></div>
                </div>
                <span className="font-sans font-bold tracking-widest text-xs">NEXUS</span>
            </div>

            {/* Login Form Container */}
            <div
                ref={formRef}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl italic mb-4 tracking-wide">
                        System Access
                    </h1>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                        Enter your credentials
                    </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-8">
                    <div className="space-y-6">
                        {/* Email Field */}
                        <div className="relative">
                            <label
                                htmlFor="email"
                                className={`absolute left-0 transition-all duration-200 ${email
                                    ? '-top-5 text-xs text-white'
                                    : 'top-3 text-sm text-gray-500'
                                    }`}
                            >
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className={`absolute left-0 transition-all duration-200 ${password
                                    ? '-top-5 text-xs text-white'
                                    : 'top-3 text-sm text-gray-500'
                                    }`}
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center tracking-wide">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#ffffff] text-black py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Authenticating..." : "Initialize Session"}
                    </button>

                    <div className="flex justify-between items-center text-xs text-gray-500 mt-8 tracking-wider">
                        <Link href="/register" className="hover:text-white transition-colors">
                            Request Access
                        </Link>
                        <Link href="/forgot-password" className="hover:text-white transition-colors">
                            Recover Password
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
