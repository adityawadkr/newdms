"use client"

import { useEffect, useRef } from "react"

export default function ClientEnhancements() {
    const cursorRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        if (!cursor) return

        // Only show cursor on desktop with pointer
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

        return () => {
            window.removeEventListener("mousemove", onMouseMove)
        }
    }, [])

    return (
        <div
            ref={cursorRef}
            className="hidden md:block fixed top-0 left-0 w-3 h-3 bg-white rounded-full pointer-events-none z-[9999] mix-blend-exclusion [&.active]:scale-[6] [&.active]:bg-[#D90429] [&.active]:mix-blend-normal [&.active]:opacity-20 transition-transform duration-100"
        />
    )
}
