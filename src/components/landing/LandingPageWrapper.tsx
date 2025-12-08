"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"

// Dynamically import Scene3D with error handling
const Scene3D = dynamic(() => import("@/components/landing/Scene3D").catch(() => {
    // If Scene3D fails to load, return an empty component
    return { default: () => null }
}), {
    ssr: false,
    loading: () => null
})

export default function LandingPageWrapper({
    fontVariables,
}: {
    fontVariables: string
}) {
    const [mounted, setMounted] = useState(false)
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // Mark as mounted after hydration
        setMounted(true)
    }, [])

    useEffect(() => {
        // Cursor effect - desktop only
        const cursor = cursorRef.current
        if (!cursor || !mounted) return
        if (!window.matchMedia('(pointer: fine)').matches) return

        const onMouseMove = (e: MouseEvent) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
        }
        window.addEventListener("mousemove", onMouseMove)
        return () => window.removeEventListener("mousemove", onMouseMove)
    }, [mounted])

    return (
        <main className={`${fontVariables} font-sans bg-[#020202] min-h-screen text-white overflow-x-hidden`}>
            {/* Inline styles - guaranteed to work */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes preloaderHide {
                    0%, 60% { opacity: 1; visibility: visible; }
                    100% { opacity: 0; visibility: hidden; }
                }
                .animate-fade-in-up-1 { animation: fadeInUp 0.8s ease-out 0.3s both; }
                .animate-fade-in-up-2 { animation: fadeInUp 0.8s ease-out 0.5s both; }
                .animate-fade-in-up-3 { animation: fadeInUp 0.8s ease-out 0.7s both; }
                .preloader-auto-hide { animation: preloaderHide 2s ease-out forwards; }
                .logo-spin { animation: spin 10s linear infinite; }
            `}} />

            {/* 3D Scene - loads in background, won't block content */}
            {mounted && (
                <Suspense fallback={null}>
                    <Scene3D />
                </Suspense>
            )}

            {/* PRELOADER - auto-hides with CSS animation */}
            <div className="preloader-auto-hide fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center">
                <div className="logo-spin w-[50px] h-[50px] border border-[#333] rounded-full flex items-center justify-center mb-5 relative">
                    <div className="w-[1px] h-[30px] bg-white absolute"></div>
                    <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(60deg)' }}></div>
                    <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(-60deg)' }}></div>
                </div>
                <div className="font-serif italic text-gray-500 tracking-widest text-sm">
                    Vision Iconic
                </div>
            </div>

            {/* Custom cursor - desktop only */}
            <div
                ref={cursorRef}
                className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-exclusion"
                style={{ display: mounted ? undefined : 'none' }}
            />

            {/* MAIN CONTENT - Always visible, animations enhance */}
            <div className="relative z-10 w-full">
                {/* Header */}
                <nav className="w-full p-6 md:p-10 flex justify-between items-center fixed top-0 z-50 mix-blend-difference text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                            <div className="w-[1px] h-3 bg-white"></div>
                        </div>
                        <span className="font-sans font-bold tracking-widest text-xs">NEXUS</span>
                    </div>
                    <div className="hidden md:flex gap-12">
                        <a href="#system" className="opacity-70 hover:opacity-100 transition-opacity text-sm tracking-wider">System</a>
                        <a href="#modules" className="opacity-70 hover:opacity-100 transition-opacity text-sm tracking-wider">Modules</a>
                        <a href="#performance" className="opacity-70 hover:opacity-100 transition-opacity text-sm tracking-wider">Performance</a>
                    </div>
                    <Link href="/login" className="opacity-70 hover:opacity-100 transition-opacity text-sm tracking-wider">Login</Link>
                </nav>

                {/* HERO SECTION */}
                <section id="system" className="min-h-screen w-full flex items-center px-6 md:px-24 pt-20">
                    <div className="z-10">
                        <h1 className="animate-fade-in-up-1 font-serif text-[clamp(2.5rem,8vw,9rem)] leading-none tracking-[-0.01em] font-normal mb-8 text-white">
                            SYSTEM<br />
                            <span className="italic text-gray-400">INTEGRATED.</span>
                        </h1>
                        <p className="animate-fade-in-up-2 font-sans text-gray-400 max-w-md text-sm leading-relaxed mb-10">
                            The operating system for the automotive avant-garde. Redefining
                            dealer management through sensual purity and absolute data precision.
                        </p>
                        <Link href="/login" className="animate-fade-in-up-3 inline-block">
                            <button className="bg-white text-black px-8 md:px-12 py-4 rounded-full font-sans font-semibold text-sm hover:scale-105 transition-transform">
                                Login to Platform
                            </button>
                        </Link>
                    </div>

                    {/* Scroll guidance */}
                    <div className="absolute bottom-12 right-6 md:right-12 flex flex-col items-end gap-4 opacity-50 mix-blend-difference text-white">
                        <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
                        <div className="h-16 w-[1px] bg-white"></div>
                    </div>
                </section>

                {/* SPACER */}
                <div className="h-[30vh]"></div>

                {/* FEATURES GRID */}
                <section id="modules" className="px-6 md:px-24 py-32 bg-[#020202] relative z-20 border-t border-white/5 text-white">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                        <div className="col-span-1 md:col-span-4">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D90429] mb-4 block">The Modules</span>
                            <h2 className="font-serif text-5xl mb-8">
                                Engineered<br />
                                <span className="italic text-gray-500">Beyond.</span>
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                NEXUS is not merely software; it is the nervous system of your enterprise.
                                Seamlessly connecting sales velocity with service precision.
                            </p>
                        </div>
                        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { num: "01.", title: "Inventory", desc: "Real-time asset tracking with 3D visualization and predictive aging analysis.", href: "/inventory" },
                                { num: "02.", title: "Sales", desc: "Clienteling tools that anticipate customer desires before they are spoken.", href: "/sales" },
                                { num: "03.", title: "Service", desc: "Automated bay scheduling and AI-driven parts inventory management.", href: "/service" },
                                { num: "04.", title: "Finance", desc: "Financial clarity with zero latency. Global reporting at a glance.", href: "/finance" },
                                { num: "05.", title: "HR", desc: "Workforce management, payroll integration, and performance tracking.", href: "/hr" },
                                { num: "06.", title: "CRM", desc: "Customer relationship management with integrated lead tracking.", href: "/crm" }
                            ].map((card) => (
                                <Link key={card.num} href={card.href} className="block">
                                    <div className="group cursor-pointer bg-white/5 border border-white/10 p-8 md:p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 h-full">
                                        <div className="absolute top-0 left-0 w-[2px] h-0 bg-[#D90429] transition-all duration-500 group-hover:h-full"></div>
                                        <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">{card.num}</div>
                                        <h3 className="text-xl font-medium mb-2">{card.title}</h3>
                                        <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* INTERFACE SHOWCASE */}
                <section id="performance" className="px-6 md:px-24 py-32 relative z-20 bg-[#020202]">
                    <div className="w-full min-h-[60vh] md:h-[80vh] bg-[#050505] rounded-lg overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] border border-[#222] relative flex flex-col font-sans text-gray-400">
                        {/* Header */}
                        <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 md:px-6 bg-[#0a0a0a]">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                                </div>
                                <span className="text-xs tracking-widest text-gray-500">NEXUS OS 2.0</span>
                            </div>
                            <div className="hidden md:flex gap-8 text-[10px] tracking-wider items-center">
                                <span>SEARCH</span>
                                <span>NOTIFICATIONS <span className="text-[#D90429]">(3)</span></span>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                    <span className="text-white">ADMIN</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar */}
                            <div className="hidden md:flex w-64 border-r border-white/10 flex-col py-8 bg-[#080808]">
                                <div className="px-8 mb-8">
                                    <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-4">Modules</div>
                                    <div className="flex flex-col gap-4 text-xs font-medium">
                                        <div className="text-white flex justify-between">Dashboard <span className="w-1.5 h-1.5 bg-[#D90429] rounded-full shadow-[0_0_10px_#D90429]"></span></div>
                                        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Inventory</div>
                                        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Sales</div>
                                        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Service</div>
                                        <div className="text-gray-400 hover:text-white transition-colors cursor-pointer">Finance</div>
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gradient-to-br from-[#0a0a0a] to-black">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Total Revenue (Mtd)</div>
                                        <div className="text-2xl md:text-3xl text-white font-serif">$4.2M <span className="text-sm text-green-500 font-sans">▲ 12%</span></div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Active Inventory</div>
                                        <div className="text-2xl md:text-3xl text-white font-serif">248 <span className="text-sm text-gray-500 font-sans">Units</span></div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">Pending Leads</div>
                                        <div className="text-2xl md:text-3xl text-white font-serif">86 <span className="text-sm text-[#D90429] font-sans">Urgent</span></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA BLOCK */}
                    <div className="mt-24 w-full flex flex-col items-center justify-center text-center">
                        <h3 className="font-serif text-3xl md:text-4xl text-white mb-8">Elevate Your Enterprise.</h3>
                        <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
                            <Link href="/register">
                                <button className="bg-white text-black px-8 md:px-10 py-4 rounded-full font-sans font-semibold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 transition-transform">
                                    Request Full Demo
                                </button>
                            </Link>
                            <button className="px-8 md:px-10 py-4 rounded-full border border-white/30 text-white font-sans text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300">
                                View Pricing Tiers
                            </button>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-black py-20 px-6 md:px-24 border-t border-white/10 relative z-20 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                        <div>
                            <h2 className="font-serif text-4xl mb-6">NEXUS</h2>
                            <div className="flex gap-6 font-sans text-xs text-gray-500 uppercase tracking-wider">
                                <a href="#" className="hover:text-white transition-colors">Contact</a>
                                <a href="#" className="hover:text-white transition-colors">Legal</a>
                                <a href="#" className="hover:text-white transition-colors">Privacy</a>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <p className="font-sans text-xs text-gray-600">
                                © 2025 NEXUS Automotive Systems.<br />
                                Designed in Stuttgart.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </main>
    )
}
