"use client"

import dynamic from "next/dynamic"
import LandingUI from "@/components/landing/LandingUI"

const Scene3D = dynamic(() => import("@/components/landing/Scene3D"), {
    ssr: false,
})

export default function LandingPageWrapper({
    fontVariables,
}: {
    fontVariables: string
}) {
    return (
        <main
            className={`${fontVariables} font-sans bg-[#020202] min-h-screen text-white overflow-x-hidden`}
        >
            <Scene3D />
            <LandingUI />
        </main>
    )
}
