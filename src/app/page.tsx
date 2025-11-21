import { Playfair_Display, Manrope } from "next/font/google"
import LandingPageWrapper from "@/components/landing/LandingPageWrapper"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "600"],
})

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["200", "300", "400", "500", "600"],
})

export default function LandingPage() {
  return (
    <LandingPageWrapper
      fontVariables={`${playfair.variable} ${manrope.variable}`}
    />
  )
}