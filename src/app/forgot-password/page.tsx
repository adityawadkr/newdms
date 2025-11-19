"use client"

import * as React from "react"
import Link from "next/link"
import { Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [success, setSuccess] = React.useState(false)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email") as string

        await authClient.forgetPassword({
            email,
            redirectTo: "/reset-password",
        }, {
            onRequest: () => {
                setLoading(true)
            },
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
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto mb-4 flex items-center justify-center gap-2">
                        <Car className="size-8 text-primary" />
                        <span className="text-2xl font-bold">Dealership DMS</span>
                    </div>
                    <CardTitle>Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your email and we'll send you a link to reset your password
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="space-y-4">
                            <div className="text-sm text-green-600 bg-green-50 dark:bg-green-950 p-4 rounded-md">
                                Check your email for a password reset link. It may take a few minutes to arrive.
                            </div>
                            <Link href="/login">
                                <Button className="w-full">Back to Login</Button>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    autoComplete="email"
                                />
                            </div>
                            {error && (
                                <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                                    {error}
                                </div>
                            )}
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? "Sending..." : "Send Reset Link"}
                            </Button>
                            <div className="text-center">
                                <Link href="/login" className="text-sm text-primary hover:underline">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
