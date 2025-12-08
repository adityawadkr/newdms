"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { Suspense } from "react"

function VerifyEmailContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [otp, setOtp] = React.useState(["", "", "", "", "", ""])

    const containerRef = React.useRef<HTMLDivElement>(null)
    const formRef = React.useRef<HTMLDivElement>(null)
    const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

    React.useEffect(() => {
        // CSS animation handles entrance
    }, [])

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[0]
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)

        // Auto-focus next
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    if (!email) {
        return (
            <div className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="font-serif text-3xl mb-4">Error</h1>
                    <p className="text-gray-500 mb-8">Email address is missing.</p>
                    <button
                        onClick={() => router.push("/register")}
                        className="bg-[#ffffff] text-black px-8 py-3 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors"
                    >
                        Back to Sign Up
                    </button>
                </div>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const otpString = otp.join("")
        if (otpString.length !== 6) return

        setLoading(true)
        setError(null)

        await authClient.emailOtp.verifyEmail({
            email: email as string,
            otp: otpString,
        }, {
            onRequest: () => setLoading(true),
            onSuccess: () => {
                toast.success("Email verified successfully")
                router.push("/dashboard")
            },
            onError: (ctx: { error: { message: string } }) => {
                setError(ctx.error.message)
                setLoading(false)
            },
        })
    }

    return (
        <div
            ref={containerRef}
            className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden animate-fade-up"
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
                    <h1 className="font-serif text-4xl md:text-5xl mb-4 tracking-wide">
                        Verify Email
                    </h1>
                    <p className="text-gray-500 text-sm tracking-widest uppercase mb-2">
                        Enter the 6-digit code sent to
                    </p>
                    <p className="text-white text-sm font-medium">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* OTP Inputs */}
                    <div className="flex justify-center gap-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={el => { inputRefs.current[index] = el }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 bg-transparent border border-white/30 rounded-lg text-center text-2xl font-mono text-white focus:outline-none focus:border-white transition-colors"
                            />
                        ))}
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center tracking-wide">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || otp.join("").length !== 6}
                        className="w-full bg-[#ffffff] text-black py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "Verifying..." : "Verify Email"}
                    </button>

                    <div className="flex justify-center text-xs text-gray-500 mt-6 tracking-wider">
                        <button
                            type="button"
                            onClick={() => router.push("/register")}
                            className="hover:text-white transition-colors"
                        >
                            ← Back to Sign Up
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    )
}
