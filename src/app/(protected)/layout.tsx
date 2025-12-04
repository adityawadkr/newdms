import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

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

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset>
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}
