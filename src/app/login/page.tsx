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
        // Entrance Animation
        const tl = gsap.timeline()

        if (containerRef.current && formRef.current) {
            tl.fromTo(containerRef.current,
                { opacity: 0 },
                { opacity: 1, duration: 1.5, ease: "power2.out" }
            )
                .fromTo(formRef.current,
                    { y: 50, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, ease: "power3.out" },
                    "-=1"
                )
        }
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
            className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
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
                        <div className="group relative">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors peer"
                                placeholder="Email Address"
                                id="email"
                            />
                            <label
                                htmlFor="email"
                                className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
                            >
                                Email Address
                            </label>
                        </div>

                        <div className="group relative">
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-transparent border-b border-white/20 py-3 text-white placeholder-transparent focus:outline-none focus:border-white transition-colors peer"
                                placeholder="Password"
                                id="password"
                            />
                            <label
                                htmlFor="password"
                                className="absolute left-0 top-3 text-gray-500 text-sm transition-all peer-focus:-top-5 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-5 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
                            >
                                Password
                            </label>
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
                        className="w-full bg-white text-black py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
