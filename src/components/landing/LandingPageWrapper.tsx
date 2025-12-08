"use client"

import { useEffect, useRef, useState, Suspense } from "react"
import dynamic from "next/dynamic"
import LandingUI from "@/components/landing/LandingUI"

// Dynamically import Scene3D with error handling - won't crash if it fails
const Scene3D = dynamic(
    () => import("@/components/landing/Scene3D").catch(() => ({ default: () => null })),
    { ssr: false, loading: () => null }
)

export default function LandingPageWrapper({
    fontVariables,
}: {
    fontVariables: string
}) {
    const [mounted, setMounted] = useState(false)
    const preloaderRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setMounted(true)

        // Hide preloader after animation
        const timer = setTimeout(() => {
            if (preloaderRef.current) {
                preloaderRef.current.style.opacity = '0'
                preloaderRef.current.style.pointerEvents = 'none'
                setTimeout(() => {
                    if (preloaderRef.current) {
                        preloaderRef.current.style.display = 'none'
                    }
                }, 500)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [])

    return (
        <main className={`${fontVariables} font-sans bg-[#020202] min-h-screen text-white overflow-x-hidden`}>
            {/* Inline critical CSS for animations */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes preloaderSpin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .preloader-spin {
                    animation: preloaderSpin 10s linear infinite;
                }
            `}} />

            {/* 3D Scene - background, loads after mount */}
            {mounted && (
                <Suspense fallback={null}>
                    <Scene3D />
                </Suspense>
            )}

            {/* PRELOADER with Vision Iconic */}
            <div
                ref={preloaderRef}
                className="fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center transition-opacity duration-500"
            >
                <div className="preloader-spin w-[50px] h-[50px] border border-[#333] rounded-full flex items-center justify-center mb-5 relative">
                    <div className="w-[1px] h-[30px] bg-white absolute"></div>
                    <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(60deg)' }}></div>
                    <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(-60deg)' }}></div>
                </div>
                <div className="font-serif italic text-gray-500 tracking-widest text-sm">
                    Vision Iconic
                </div>
            </div>

            {/* Original LandingUI with all content */}
            <LandingUI />
        </main>
    )
}
