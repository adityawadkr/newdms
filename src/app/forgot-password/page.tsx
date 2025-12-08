"use client"

import * as React from "react"
import Link from "next/link"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [email, setEmail] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState(false)

    const containerRef = React.useRef<HTMLDivElement>(null)
    const formRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        // Optional animation - content already visible
        try {
            if (containerRef.current && formRef.current) {
                gsap.set([containerRef.current, formRef.current], { opacity: 1 })
            }
        } catch (e) {
            console.log('Animation skipped')
        }
    }, [])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        await authClient.forgetPassword({
            email,
            redirectTo: "/reset-password",
        }, {
            onRequest: () => setLoading(true),
            onSuccess: () => {
                setSuccess(true)
                toast.success("Password reset link sent to your email")
                setLoading(false)
            },
            onError: (ctx) => {
                setError(ctx.error.message)
                setLoading(false)
            },
        })
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
                        Recover Access
                    </h1>
                    <p className="text-gray-500 text-sm tracking-widest uppercase">
                        {success ? "Check your inbox" : "Enter your email address"}
                    </p>
                </div>

                {success ? (
                    <div className="space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto mb-6 border border-green-500/50 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                We've sent a password reset link to your email. Please check your inbox and follow the instructions.
                            </p>
                        </div>
                        <Link href="/login">
                            <button className="w-full bg-white text-black py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors">
                                Back to Login
                            </button>
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Email Field with state-based floating label */}
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
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>

                        <div className="flex justify-center text-xs text-gray-500 mt-6 tracking-wider">
                            <Link href="/login" className="hover:text-white transition-colors">
                                ← Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
