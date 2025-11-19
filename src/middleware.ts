import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { db } from "@/db";
import { session, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hasAccess, Role } from "@/lib/roles";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Define public paths that don't require authentication
    const publicPaths = [
        "/login",
        "/register",
        "/verify-email",
        "/reset-password",
        "/api/auth", // Allow auth API
        "/api/debug", // Allow debug API
        "/_next", // Next.js internals
        "/favicon.ico",
        "/public",
        "/images" // If you have an images folder
    ];

    // Check if path is public
    if (publicPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // 2. Get session token from cookie
    // better-auth uses "better-auth.session_token" by default
    // We also check for the secure version just in case
    const token = request.cookies.get("better-auth.session_token")?.value ||
        request.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!token) {
        // Redirect to login if no token
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        // Add return url?
        url.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(url);
    }

    // 3. Verify session in DB
    try {
        // We need to query the session and user to get the role
        // Note: In Edge Runtime, make sure your DB client is compatible (LibSQL via HTTP is)
        const result = await db.select({
            user: user,
            session: session
        })
            .from(session)
            .innerJoin(user, eq(session.userId, user.id))
            .where(eq(session.token, token))
            .get();

        if (!result || result.session.expiresAt < new Date()) {
            // Invalid or expired session
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }

        // 4. Check Role Access
        const userRole = result.user.role as Role;

        // Allow access to root and dashboard for everyone logged in
        if (pathname === "/" || pathname === "/dashboard") {
            return NextResponse.next();
        }

        // Skip role check for API routes in middleware (let API handlers handle it)
        // to avoid breaking fetch requests with redirects
        if (pathname.startsWith("/api/")) {
            return NextResponse.next();
        }

        if (!hasAccess(userRole, pathname)) {
            // Unauthorized
            // Redirect to dashboard
            const url = request.nextUrl.clone();
            url.pathname = "/dashboard";
            return NextResponse.redirect(url);
        }

        return NextResponse.next();

    } catch (e) {
        console.error("Middleware error:", e);
        // If DB fails, we might want to allow or block. 
        // Blocking is safer.
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
