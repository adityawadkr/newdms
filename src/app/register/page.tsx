"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import gsap from "gsap"
import { authClient } from "@/lib/auth-client"
import { ROLES } from "@/lib/roles"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState("user")
  const [gender, setGender] = useState("male")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)

  const ROLE_LABELS: Record<string, string> = {
    admin: "Administrator",
    sales: "Sales Representative",
    service: "Service Advisor",
    technician: "Technician",
    user: "Standard User",
    guest_admin: "Guest Admin",
  }

  // CSS animation handles entrance
  useEffect(() => {
    // Optional: Add any complex GSAP interactions here if needed
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)
    setError("")

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
        role,
        gender,
      } as any, {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          toast.success("Account created! Please verify your email.")
          router.push(`/verify-email?email=${encodeURIComponent(email)}`)
        },
        onError: (ctx) => {
          setError(ctx.error.message)
          setLoading(false)
        },
      })
    } catch (err: any) {
      console.error("Registration error:", err)
      if (err.message && err.message.includes("fetch")) {
        setError("Unable to connect to the server. Please check your internet connection.")
      } else {
        setError(err.message || "Something went wrong. Please try again.")
      }
      setLoading(false)
    }
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
        <div className="mb-10 text-center">
          <h1 className="font-serif text-4xl md:text-5xl italic mb-4 tracking-wide">
            Request Access
          </h1>
          <p className="text-gray-500 text-sm tracking-widest uppercase">
            Create your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <FloatingInput
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            label="Full Name"
          />

          {/* Email */}
          <FloatingInput
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email Address"
          />

          {/* Role & Gender Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="absolute left-0 -top-5 text-xs text-white">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
              >
                {Object.values(ROLES).map((roleValue) => (
                  <option key={roleValue} value={roleValue} className="bg-black text-white">
                    {ROLE_LABELS[roleValue] || roleValue}
                  </option>
                ))}
              </select>
              <span className="absolute right-0 top-3 text-gray-500 pointer-events-none">▼</span>
            </div>

            <div className="relative">
              <label className="absolute left-0 -top-5 text-xs text-white">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors appearance-none cursor-pointer"
              >
                <option value="male" className="bg-black text-white">Male</option>
                <option value="female" className="bg-black text-white">Female</option>
                <option value="other" className="bg-black text-white">Other</option>
              </select>
              <span className="absolute right-0 top-3 text-gray-500 pointer-events-none">▼</span>
            </div>
          </div>

          {/* Password */}
          <FloatingInput
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
          />

          {/* Confirm Password */}
          <FloatingInput
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            label="Confirm Password"
          />

          {error && (
            <div className="text-red-500 text-sm text-center tracking-wide">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#ffffff] text-black py-4 text-sm uppercase tracking-widest font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-8"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="flex justify-center text-xs text-gray-500 mt-6 tracking-wider">
            <Link href="/login" className="hover:text-white transition-colors">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

// Floating label component defined outside to prevent re-renders losing focus
const FloatingInput = ({
  id,
  type,
  value,
  onChange,
  label
}: {
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string
}) => (
  <div className="relative">
    <label
      htmlFor={id}
      className={`absolute left-0 transition-all duration-200 ${value
        ? '-top-5 text-xs text-white'
        : 'top-3 text-sm text-gray-500'
        }`}
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      value={value}
      onChange={onChange}
      required
      className="w-full bg-transparent border-b border-white/20 py-3 text-white focus:outline-none focus:border-white transition-colors"
    />
  </div>
)