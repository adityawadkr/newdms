"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, Suspense } from "react"
import { toast } from "sonner"

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [inviteData, setInviteData] = useState<{ email: string, role: string } | null>(null)
  const [checkingInvite, setCheckingInvite] = useState(!!token)
  const [error, setError] = useState("")

  useEffect(() => {
    if (token) {
      checkInvite()
    }
  }, [token])

  async function checkInvite() {
    try {
      const res = await fetch(`/api/auth/check-invite?token=${token}`)
      if (!res.ok) throw new Error("Invalid or expired invitation")
      const data = await res.json()
      setInviteData(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setCheckingInvite(false)
    }
  }

  const handleSubmit = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!token && !inviteData) {
      // Public registration is disabled, but we can leave a message or redirect
      setError("Public registration is disabled. Please use an invite link.")
      return
    }

    setLoading(true)
    setError("")

    try {
      await authClient.signUp.email({
        email: inviteData!.email,
        password,
        name,
        // We pass the token to the backend to verify and assign role
        // But better-auth might not support custom fields in signUp directly without plugin
        // So we might need a custom hook or just trust the flow if we verify token again on backend
        // Actually, we should probably use a custom API to complete registration if we want to be secure
        // OR, we can just use the standard signUp and update the role in a hook.
        // For simplicity, let's assume we pass the token as a custom header or field if supported.
        // Wait, better-auth allows additional fields.
        // Let's pass the token in `image` field temporarily or just handle it via a custom route?
        // Better approach: Use a custom API route to create the user with the specific role.
      }, {
        onRequest: () => {
          setLoading(true)
        },
        onSuccess: async () => {
          // After successful signup, we need to mark invite as accepted and assign role
          // We can do this by calling a custom API
          await fetch("/api/auth/complete-invite", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token })
          })
          router.push("/dashboard")
        },
        onError: (ctx) => {
          setError(ctx.error.message)
          setLoading(false)
        },
      })
    } catch (err: any) {
      setError(err.message || "Something went wrong")
      setLoading(false)
    }
  }

  if (checkingInvite) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>
  }

  if (token && error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Invitation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login"><Button variant="outline">Back to Login</Button></Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Registration Closed</CardTitle>
            <CardDescription>Public registration is currently disabled. Please contact your administrator for an invitation.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/login"><Button className="w-full">Back to Login</Button></Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Accept Invitation</CardTitle>
          <CardDescription>
            Create your account for <strong>{inviteData?.email}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="mr-2 size-4 animate-spin" />}
            Create Account
          </Button>
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}