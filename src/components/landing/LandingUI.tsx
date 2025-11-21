"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import gsap from "gsap"

export default function LandingUI() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const preloaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        // --- CURSOR ---
        const cursor = cursorRef.current
        if (cursor) {
            const onMouseMove = (e: MouseEvent) => {
                gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 })
            }
            window.addEventListener("mousemove", onMouseMove)

            const interactiveElements = document.querySelectorAll(
                "a, button, .module-card, .dms-mockup, .cursor-pointer"
            )
            interactiveElements.forEach((el) => {
                el.addEventListener("mouseenter", () => cursor.classList.add("active"))
                el.addEventListener("mouseleave", () => cursor.classList.remove("active"))
            })

            return () => {
                window.removeEventListener("mousemove", onMouseMove)
                interactiveElements.forEach((el) => {
                    el.removeEventListener("mouseenter", () =>
                        cursor.classList.add("active")
                    )
                    el.removeEventListener("mouseleave", () =>
                        cursor.classList.remove("active")
                    )
                })
            }
        }
    }, [])

    useEffect(() => {
        // --- ANIMATION ---
        // Intro
        const tl = gsap.timeline()
        if (preloaderRef.current) {
            tl.to(preloaderRef.current, {
                opacity: 0,
                duration: 1.5,
                delay: 1,
                pointerEvents: "none",
            }).to(
                ".reveal-text",
                { y: 0, opacity: 1, duration: 1.5, stagger: 0.2 },
                "-=1.5"
            )
        }
    }, [])

    return (
        <>
            <div
                id="cursor"
                ref={cursorRef}
                className="fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-transform duration-100 ease-out mix-blend-exclusion [&.active]:scale-[6] [&.active]:bg-[#D90429] [&.active]:mix-blend-normal [&.active]:opacity-20"
            ></div>

            {/* PRELOADER */}
            <div
                id="preloader"
                ref={preloaderRef}
                className="fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center transition-opacity duration-[1200ms] ease-out"
            >
                <div className="w-[50px] h-[50px] border border-[#333] rounded-full flex items-center justify-center mb-5 animate-[spin_10s_linear_infinite]">
                    <div className="w-[1px] h-[30px] bg-white absolute"></div>
                    <div className="w-[1px] h-[30px] bg-white absolute rotate-60"></div>
                    <div className="w-[1px] h-[30px] bg-white absolute -rotate-60"></div>
                </div>
                <div className="font-serif italic text-gray-500 tracking-widest text-sm">
                    Vision Iconic
                </div>
            </div>

            {/* CONTENT */}
            <div className="relative z-10 w-full pointer-events-none">
                {/* Header */}
                <nav className="w-full p-10 flex justify-between items-center fixed top-0 z-50 pointer-events-auto mix-blend-difference text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 border border-white rounded-full flex items-center justify-center">
                            <div className="w-[1px] h-3 bg-white"></div>
                        </div>
                        <span className="font-sans font-bold tracking-widest text-xs">
                            NEXUS
                        </span>
                    </div>
                    <div className="hidden md:flex gap-12">
                        <a
                            href="#system"
                            className="nav-link opacity-70 hover:opacity-100 transition-opacity relative text-sm tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 hover:after:w-full pb-1"
                        >
                            System
                        </a>
                        <a
                            href="#modules"
                            className="nav-link opacity-70 hover:opacity-100 transition-opacity relative text-sm tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 hover:after:w-full pb-1"
                        >
                            Modules
                        </a>
                        <a
                            href="#performance"
                            className="nav-link opacity-70 hover:opacity-100 transition-opacity relative text-sm tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 hover:after:w-full pb-1"
                        >
                            Performance
                        </a>
                    </div>
                    <Link
                        href="/login"
                        className="nav-link opacity-70 hover:opacity-100 transition-opacity relative text-sm tracking-wider after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-[width] after:duration-300 hover:after:w-full pb-1"
                    >
                        Login
                    </Link>
                </nav>

                {/* HERO SECTION */}
                <section
                    id="system"
                    className="h-screen w-full flex items-center px-10 md:px-24 relative"
                >
                    <div className="z-10 pointer-events-auto">
                        <h1 className="font-serif text-[clamp(3rem,8vw,9rem)] leading-none tracking-[-0.01em] font-normal mb-8 reveal-text translate-y-10 opacity-0 text-white">
                            SYSTEM
                            <br />
                            <span className="italic text-gray-400">INTEGRATED.</span>
                        </h1>
                        <p className="font-sans text-gray-400 max-w-md text-sm leading-relaxed mb-10 reveal-text translate-y-10 opacity-0">
                            The operating system for the automotive avant-garde. Redefining
                            dealer management through sensual purity and absolute data
                            precision.
                        </p>
                        <Link href="/login">
                            <button className="bg-white text-black px-12 py-4 rounded-full font-sans font-semibold text-sm transition-transform duration-300 hover:scale-105 reveal-text translate-y-10 opacity-0">
                                Explore Platform
                            </button>
                        </Link>
                    </div>

                    {/* Scroll guidance */}
                    <div className="absolute bottom-12 right-12 flex flex-col items-end gap-4 opacity-50 mix-blend-difference text-white">
                        <span className="font-sans text-xs tracking-widest uppercase">
                            Scroll
                        </span>
                        <div className="h-16 w-[1px] bg-white"></div>
                    </div>
                </section>

                {/* SPACER for Cinematics */}
                <div style={{ height: "30vh" }}></div>

                {/* FEATURES GRID */}
                <section
                    id="modules"
                    className="px-10 md:px-24 py-32 bg-[#020202] relative z-20 border-t border-white/5 text-white"
                >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
                        <div className="col-span-1 md:col-span-4">
                            <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D90429] mb-4 display-block">
                                The Modules
                            </span>
                            <h2 className="font-serif text-5xl mb-8">
                                Engineered
                                <br />
                                <span className="italic text-gray-500">Beyond.</span>
                            </h2>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                NEXUS is not merely software; it is the nervous system of your
                                enterprise. Seamlessly connecting sales velocity with service
                                precision.
                            </p>
                        </div>
                        <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Card 1 */}
                            <Link href="/inventory" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        01.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Inventory</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Real-time asset tracking with 3D visualization and predictive
                                        aging analysis.
                                    </p>
                                </div>
                            </Link>
                            {/* Card 2 */}
                            <Link href="/sales" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        02.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Sales</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Clienteling tools that anticipate customer desires before they
                                        are spoken.
                                    </p>
                                </div>
                            </Link>
                            {/* Card 3 */}
                            <Link href="/service" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        03.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Service</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Automated bay scheduling and AI-driven parts inventory
                                        management.
                                    </p>
                                </div>
                            </Link>
                            {/* Card 4 */}
                            <Link href="/finance" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        04.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">Finance</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Financial clarity with zero latency. Global reporting at a
                                        glance.
                                    </p>
                                </div>
                            </Link>
                            {/* Card 5 */}
                            <Link href="/hr" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        05.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">HR</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Workforce management, payroll integration, and performance tracking.
                                    </p>
                                </div>
                            </Link>
                            {/* Card 6 */}
                            <Link href="/crm" className="block">
                                <div className="module-card group pointer-events-auto cursor-pointer bg-white/5 border border-white/10 p-12 transition-all duration-500 relative overflow-hidden hover:bg-white/10 hover:border-white/30 before:content-[''] before:absolute before:top-0 before:left-0 before:w-[2px] before:h-0 before:bg-[#D90429] before:transition-[height] before:duration-500 hover:before:h-full h-full">
                                    <div className="text-3xl mb-4 font-serif italic text-gray-600 group-hover:text-white transition-colors">
                                        06.
                                    </div>
                                    <h3 className="text-xl font-medium mb-2">CRM</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed">
                                        Customer relationship management with integrated lead tracking.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* INTERFACE SHOWCASE */}
                <section id="performance" className="px-10 md:px-24 py-32 relative z-20 bg-[#020202]">
                    <div className="dms-mockup w-full h-[80vh] pointer-events-auto bg-[#050505] rounded-lg overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] border border-[#222] relative flex flex-col font-sans text-gray-400">
                        {/* Header */}
                        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-[#0a0a0a]">
                            <div className="flex items-center gap-4">
                                <div className="flex gap-2">
                                    <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                                    <div className="w-3 h-3 rounded-full bg-[#333]"></div>
                                </div>
                                <span className="text-xs tracking-widest text-gray-500">
                                    NEXUS OS 2.0
                                </span>
                            </div>
                            <div className="flex gap-8 text-[10px] tracking-wider items-center">
                                <span className="cursor-pointer hover:text-white transition-colors">
                                    SEARCH
                                </span>
                                <span className="cursor-pointer hover:text-white transition-colors">
                                    NOTIFICATIONS{" "}
                                    <span className="text-[var(--accent-red)]">(3)</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-white/10"></div>
                                    <span className="text-white">ADMIN</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 flex overflow-hidden">
                            {/* Sidebar */}
                            <div className="w-16 md:w-64 border-r border-white/10 flex flex-col py-8 bg-[#080808]">
                                <div className="px-8 mb-8 hidden md:block">
                                    <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-4">
                                        Modules
                                    </div>
                                    <div className="flex flex-col gap-4 text-xs font-medium">
                                        <div className="text-white flex justify-between cursor-pointer group">
                                            Dashboard{" "}
                                            <span className="w-1.5 h-1.5 bg-[#D90429] rounded-full self-center shadow-[0_0_10px_#D90429]"></span>
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            Inventory
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            Sales
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            Service
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            Finance
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            HR
                                        </div>
                                        <div className="hover:text-white transition-colors cursor-pointer">
                                            CRM
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-auto px-8 hidden md:block">
                                    <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-4">
                                        System
                                    </div>
                                    <div className="text-xs hover:text-white transition-colors cursor-pointer mb-2">
                                        Settings
                                    </div>
                                    <div className="text-xs hover:text-white transition-colors cursor-pointer">
                                        Audit Log
                                    </div>
                                </div>
                            </div>

                            {/* Main Content */}
                            <div className="flex-1 p-8 overflow-y-auto custom-scrollbar bg-gradient-to-br from-[#0a0a0a] to-black">
                                {/* KPI Row */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm hover:bg-white/10 transition-colors">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                            Total Revenue (Mtd)
                                        </div>
                                        <div className="text-3xl text-white font-serif">
                                            $4.2M{" "}
                                            <span className="text-sm text-green-500 font-sans ml-2 font-medium">
                                                ▲ 12%
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm hover:bg-white/10 transition-colors">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                            Active Inventory
                                        </div>
                                        <div className="text-3xl text-white font-serif">
                                            248{" "}
                                            <span className="text-sm text-gray-500 font-sans ml-2">
                                                Units
                                            </span>
                                        </div>
                                    </div>
                                    <div className="bg-white/5 border border-white/5 p-5 rounded-sm hover:bg-white/10 transition-colors">
                                        <div className="text-[10px] uppercase tracking-widest text-gray-500 mb-2">
                                            Pending Leads
                                        </div>
                                        <div className="text-3xl text-white font-serif">
                                            86{" "}
                                            <span className="text-sm text-[#D90429] font-sans ml-2 font-medium">
                                                Urgent
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Split View */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                                    {/* Inventory Table */}
                                    <div className="col-span-2 bg-white/5 border border-white/5 rounded-sm flex flex-col">
                                        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                            <span className="text-xs text-white tracking-wide font-medium">
                                                LIVE INVENTORY FEED
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-[#D90429] animate-pulse"></span>
                                                <span className="text-[10px] text-[#D90429]">LIVE</span>
                                            </div>
                                        </div>
                                        <div className="p-2">
                                            {/* Table Header */}
                                            <div className="grid grid-cols-4 text-[10px] uppercase text-gray-600 px-4 py-3 font-medium tracking-wider">
                                                <div className="col-span-2">Vehicle</div>
                                                <div>Status</div>
                                                <div className="text-right">Price</div>
                                            </div>
                                            {/* Rows */}
                                            <div className="space-y-1">
                                                {/* Row 1 */}
                                                <div className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border-b border-white/[0.02] last:border-0">
                                                    <div className="col-span-2 text-white font-medium">
                                                        2025 S-Class Maybach
                                                    </div>
                                                    <div>
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                        Ready
                                                    </div>
                                                    <div className="text-right font-serif tracking-wide">
                                                        $194,000
                                                    </div>
                                                </div>
                                                {/* Row 2 */}
                                                <div className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border-b border-white/[0.02] last:border-0">
                                                    <div className="col-span-2 text-white font-medium">
                                                        2025 EQS 580 SUV
                                                    </div>
                                                    <div>
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-yellow-500 mr-2"></span>
                                                        PDI
                                                    </div>
                                                    <div className="text-right font-serif tracking-wide">
                                                        $126,500
                                                    </div>
                                                </div>
                                                {/* Row 3 */}
                                                <div className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border-b border-white/[0.02] last:border-0">
                                                    <div className="col-span-2 text-white font-medium">
                                                        2024 SL 63 AMG
                                                    </div>
                                                    <div>
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mr-2"></span>
                                                        Ready
                                                    </div>
                                                    <div className="text-right font-serif tracking-wide">
                                                        $181,000
                                                    </div>
                                                </div>
                                                {/* Row 4 */}
                                                <div className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border-b border-white/[0.02] last:border-0">
                                                    <div className="col-span-2 text-white font-medium">
                                                        2025 G 63 AMG
                                                    </div>
                                                    <div>
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D90429] mr-2"></span>
                                                        Reserved
                                                    </div>
                                                    <div className="text-right font-serif tracking-wide">
                                                        $188,000
                                                    </div>
                                                </div>
                                                {/* Row 5 */}
                                                <div className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 rounded-sm cursor-pointer transition-colors border-b border-white/[0.02] last:border-0">
                                                    <div className="col-span-2 text-white font-medium">
                                                        2025 GT 63 S E-Performance
                                                    </div>
                                                    <div>
                                                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500 mr-2"></span>
                                                        Transit
                                                    </div>
                                                    <div className="text-right font-serif tracking-wide">
                                                        $204,000
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Activity Feed */}
                                    <div className="col-span-1 bg-white/5 border border-white/5 rounded-sm p-6">
                                        <div className="text-xs text-white tracking-wide mb-6 font-medium">
                                            SERVICE BAY STATUS
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex gap-4 items-start group cursor-pointer">
                                                <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[10px] text-white rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                                                    01
                                                </div>
                                                <div>
                                                    <div className="text-xs text-white font-medium">
                                                        Service A - S580
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 mt-1">
                                                        Bay 4 • Tech: M.K.
                                                    </div>
                                                    <div className="w-24 h-0.5 bg-white/10 mt-2 rounded-full overflow-hidden">
                                                        <div className="w-2/3 h-full bg-green-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-4 items-start group cursor-pointer">
                                                <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[10px] text-white rounded-full group-hover:bg-white group-hover:text-black transition-colors">
                                                    02
                                                </div>
                                                <div>
                                                    <div className="text-xs text-white font-medium">
                                                        Brake Install - G63
                                                    </div>
                                                    <div className="text-[10px] text-gray-500 mt-1">
                                                        Bay 2 • Tech: J.R.
                                                    </div>
                                                    <div className="w-24 h-0.5 bg-white/10 mt-2 rounded-full overflow-hidden">
                                                        <div className="w-1/3 h-full bg-yellow-500"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA BLOCK */}
                    <div className="mt-24 w-full flex flex-col items-center justify-center text-center pointer-events-auto">
                        <h3 className="font-serif text-4xl text-white mb-8">
                            Elevate Your Enterprise.
                        </h3>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                            <Link href="/register">
                                <button className="bg-white text-black px-10 py-4 rounded-full font-sans font-semibold text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] hover:scale-105 transition-transform">
                                    Request Full Demo
                                </button>
                            </Link>
                            <button className="px-10 py-4 rounded-full border border-white/30 text-white font-sans text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                                View Pricing Tiers
                            </button>
                        </div>
                        <div className="mt-8 flex items-center gap-6 text-[10px] font-sans tracking-widest text-gray-500 uppercase opacity-60">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_5px_#22c55e]"></span>{" "}
                                Instant Deployment
                            </span>
                            <span className="w-1 h-1 bg-gray-700 rounded-full"></span>
                            <span>Full Data Migration</span>
                        </div>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-black py-20 px-10 md:px-24 border-t border-white/10 relative z-20 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-end">
                        <div>
                            <h2 className="font-serif text-4xl mb-6">NEXUS</h2>
                            <div className="flex gap-6 font-sans text-xs text-gray-500 uppercase tracking-wider">
                                <a href="#" className="hover:text-white transition-colors">
                                    Contact
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Legal
                                </a>
                                <a href="#" className="hover:text-white transition-colors">
                                    Privacy
                                </a>
                            </div>
                        </div>
                        <div className="text-right mt-10 md:mt-0">
                            <p className="font-sans text-xs text-gray-600">
                                © 2025 NEXUS Automotive Systems.
                                <br />
                                Designed in Stuttgart.
                            </p>
                        </div>
                    </div>
                </footer>
            </div >
        </>
    )
}
