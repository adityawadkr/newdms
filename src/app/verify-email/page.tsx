"use client"

import * as React from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const email = searchParams.get("email")
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [otp, setOtp] = React.useState("")

    if (!email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle>Error</CardTitle>
                        <CardDescription>Email address is missing.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button onClick={() => router.push("/register")} className="w-full">
                            Back to Sign Up
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        await authClient.emailOtp.verifyEmail({
            email,
            otp,
        }, {
            onRequest: () => {
                setLoading(true)
            },
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center gap-2">
                        <Car className="size-8 text-primary" />
                        <span className="text-2xl font-bold">Dealership DMS</span>
                    </div>
                    <CardTitle>Verify Your Email</CardTitle>
                    <CardDescription>
                        Enter the verification code sent to <strong>{email}</strong>
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2 flex flex-col items-center">
                            <Label htmlFor="otp" className="sr-only">One-Time Password</Label>
                            <InputOTP
                                maxLength={6}
                                value={otp}
                                onChange={(value) => setOtp(value)}
                            >
                                <InputOTPGroup>
                                    <InputOTPSlot index={0} />
                                    <InputOTPSlot index={1} />
                                    <InputOTPSlot index={2} />
                                    <InputOTPSlot index={3} />
                                    <InputOTPSlot index={4} />
                                    <InputOTPSlot index={5} />
                                </InputOTPGroup>
                            </InputOTP>
                        </div>
                        {error && (
                            <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md text-center">
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
                            {loading ? "Verifying..." : "Verify Email"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
