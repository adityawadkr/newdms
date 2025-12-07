"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Suspense } from "react"

function ResetPasswordContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [password, setPassword] = React.useState("")
    const [confirmPassword, setConfirmPassword] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const formRef = React.useRef<HTMLDivElement>(null)

    const token = searchParams.get("token")

    React.useEffect(() => {
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

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        if (!token) {
            setError("Invalid or expired reset link")
            setLoading(false)
            return
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        await authClient.resetPassword({
            newPassword: password,
            token,
        }, {
            onRequest: () => setLoading(true),
            onSuccess: () => {
                toast.success("Password reset successfully")
                router.push("/login")
            },
            onError: (ctx) => {
                setError(ctx.error.message)
                setLoading(false)
            },
        })
    }

    if (!token) {
        return (
            <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-6 border border-red-500/50 rounded-full flex items-center justify-center">
                        <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="font-serif text-3xl italic mb-4">Invalid Link</h1>
                    <p className="text-gray-500 mb-8 max-w-sm">This password reset link is invalid or has expired.</p>
                    <Link href="/forgot-password">
                        <button className="bg-white text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors">
                            Request New Link
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden"
        >
            {/* Background Lines */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            </div>

            {/* Logo */}
            <div className="absolute top-10 left-10 flex items-center gap-3 opacity-70">
                <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                    <div className="w-[1px] h-3 bg-white"></div>
                </div>
                <span className="font-sans font-bold tracking-widest text-xs">NEXUS</span>
            </div>

            {/* Form */}
            <div ref={formRef} className="w-full max-w-md relative z-10">
                <div className="mb-12 text-center">
                    <h1 className="font-serif text-4xl md:text-5xl italic mb-4 tracking-wide">
                        New Password
                    </h1>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                        Create a secure password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Password field with state-based floating label */}
                    <div className="relative">
                        <label
                            htmlFor="password"
                            className={`absolute left-0 transition-all duration-200 ${password
                                    ? '-top-5 text-xs text-white'
                                    : 'top-3 text-sm text-gray-500'
                                }`}
                        >
                            New Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
                    </div>

                    {/* Confirm Password field with state-based floating label */}
                    <div className="relative">
                        <label
                            htmlFor="confirmPassword"
                            className={`absolute left-0 transition-all duration-200 ${confirmPassword
                                    ? '-top-5 text-xs text-white'
                                    : 'top-3 text-sm text-gray-500'
                                }`}
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            minLength={8}
                            className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors"
                        />
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
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                    <div className="flex justify-center text-xs text-gray-500 mt-6 tracking-wider">
                        <Link href="/login" className="hover:text-white transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        }>
            <ResetPasswordContent />
        </Suspense>
    )
}
