import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ProtectedHeader } from "@/components/protected-header"
import { db } from "@/db"
import { user } from "@/db/schema"
import { eq } from "drizzle-orm"

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const headerList = await headers();
    const cookieHeader = headerList.get("cookie");
    console.log("🔒 Protected Layout - Cookies received:", cookieHeader ? "Yes (Length: " + cookieHeader.length + ")" : "NONE");

    const session = await auth.api.getSession({
        headers: headerList,
    })

    console.log("🔒 Protected Layout - Session Check:", session ? "Valid Session" : "No Session (Redirecting)");

    if (!session) {
        redirect("/login")
    }

    // Check if user is approved (admins are always approved)
    const dbUser = await db.select().from(user).where(eq(user.id, session.user.id)).get()
    const isApproved = dbUser?.approved || dbUser?.role === "admin"

    // If not approved, show pending approval page
    if (!isApproved) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Pending Approval</h1>
                    <p className="text-gray-400 mb-6">
                        Your account is pending approval from an administrator. You'll receive access once approved.
                    </p>
                    <p className="text-sm text-gray-500">
                        Signed in as <span className="text-[#D4AF37]">{session.user.email}</span>
                    </p>
                    <form action="/api/auth/sign-out" method="POST" className="mt-6">
                        <button type="submit" className="px-6 py-2 bg-white/10 text-gray-300 rounded-lg hover:bg-white/20 transition-colors text-sm">
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        )
    }

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                <ProtectedHeader />
                <div className="flex flex-1 flex-col gap-4 p-4 pt-4 bg-[var(--background)] transition-colors duration-300">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}
