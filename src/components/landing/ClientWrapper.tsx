"use client"

import { useEffect, useRef, Suspense } from "react"
import dynamic from "next/dynamic"

// Load 3D scene only on client, with error handling
const Scene3D = dynamic(
    () => import("@/components/landing/Scene3D").catch(() => ({ default: () => null })),
    { ssr: false, loading: () => null }
)

export default function ClientWrapper() {
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        // Desktop only
        if (!window.matchMedia('(pointer: fine)').matches) {
            cursor.style.display = 'none'
            return
        }

        const onMouseMove = (e: MouseEvent) => {
            cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`
        }

        window.addEventListener("mousemove", onMouseMove)

        const interactiveElements = document.querySelectorAll("a, button")
        interactiveElements.forEach((el) => {
            el.addEventListener("mouseenter", () => cursor.classList.add("active"))
            el.addEventListener("mouseleave", () => cursor.classList.remove("active"))
        })

        return () => window.removeEventListener("mousemove", onMouseMove)
    }, [])

    return (
        <>
            {/* 3D Scene - background enhancement */}
            <Suspense fallback={null}>
                <Scene3D />
            </Suspense>

            {/* Custom cursor - desktop only */}
            <div
                ref={cursorRef}
                className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-exclusion [&.active]:scale-[6] [&.active]:bg-[#D90429] [&.active]:mix-blend-normal [&.active]:opacity-20 transition-transform duration-100"
            />
        </>
    )
}
