"use client"

import Link from "next/link"
import { Check } from "lucide-react"

export default function PricingPage() {
    const tiers = [
        {
            name: "Starter",
            price: "$299",
            description: "Essential tools for boutique dealerships.",
            features: [
                "Inventory Management (up to 50 cars)",
                "Basic CRM Integration",
                "Digital Invoicing",
                "Standard Reporting",
                "Single User License"
            ],
            cta: "Get Started",
            href: "/register?plan=starter",
            highlight: false
        },
        {
            name: "Professional",
            price: "$599",
            description: "Advanced power for growing showrooms.",
            features: [
                "Unlimited Inventory",
                "Advanced CRM & Lead Scoring",
                "Automated Marketing Campaigns",
                "Financial Analytics Dashboard",
                "5 User Licenses",
                "Priority Support"
            ],
            cta: "Get Started",
            href: "/register?plan=professional",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "Bespoke solutions for automotive groups.",
            features: [
                "Multi-Location Management",
                "API Access & Custom Integrations",
                "White-Label Client Portal",
                "Dedicated Account Manager",
                "Unlimited Users",
                "24/7 Concierge Support"
            ],
            cta: "Contact Sales",
            href: "mailto:sales@nexus.auto",
            highlight: false
        }
    ]

    return (
        <div className="min-h-screen w-full bg-black text-white font-sans overflow-x-hidden">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full z-50 px-6 py-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
                <Link href="/" className="flex items-center gap-3 group cursor-pointer">
                    <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                        <div className="w-[1px] h-4 bg-white/50 group-hover:bg-white transition-colors"></div>
                    </div>
                    <span className="font-sans font-bold tracking-[0.2em] text-sm">NEXUS</span>
                </Link>
                <div className="flex items-center gap-8">
                    <Link href="/login" className="hidden md:block text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-white transition-colors">
                        Login
                    </Link>
                    <Link href="/register">
                        <button className="bg-[#ffffff] text-black px-6 py-2 rounded-full font-bold text-xs tracking-widest uppercase hover:bg-gray-200 transition-colors">
                            Get Access
                        </button>
                    </Link>
                </div>
            </nav>

            {/* Header */}
            <div className="pt-40 pb-20 px-6 md:px-24 text-center animate-fade-up">
                <h1 className="font-serif text-5xl md:text-7xl mb-6 tracking-tight">
                    Investment in <br /><span className="text-gray-500">Excellence.</span>
                </h1>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
                    Choose the tier that aligns with your dealership's ambition. Transparent pricing for uncompromising performance.
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="px-6 md:px-24 pb-32">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {tiers.map((tier, index) => (
                        <div
                            key={tier.name}
                            className={`relative p-8 rounded-3xl border ${tier.highlight ? 'border-white bg-white/5' : 'border-white/10 bg-black'
                                } flex flex-col hover:border-white/30 transition-all duration-500 group animate-fade-up`}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            {tier.highlight && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="font-serif text-2xl mb-2">{tier.name}</h3>
                                <p className="text-gray-500 text-sm h-10">{tier.description}</p>
                            </div>

                            <div className="mb-8">
                                <span className="font-serif text-5xl">{tier.price}</span>
                                {tier.price !== "Custom" && <span className="text-gray-500 text-sm ml-2">/ month</span>}
                            </div>

                            <div className="flex-grow space-y-4 mb-10">
                                {tier.features.map((feature) => (
                                    <div key={feature} className="flex items-start gap-3 text-sm text-gray-300">
                                        <Check className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <Link href={tier.href} className="w-full">
                                <button className={`w-full py-4 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${tier.highlight
                                    ? 'bg-[#ffffff] text-black hover:bg-gray-200'
                                    : 'border border-white/20 text-white hover:bg-white hover:text-black'
                                    }`}>
                                    {tier.cta}
                                </button>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="bg-black py-20 px-6 md:px-24 border-t border-white/10 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
                    <div>
                        <h2 className="font-serif text-4xl mb-6">NEXUS</h2>
                        <div className="flex gap-6 font-sans text-xs text-gray-500 uppercase tracking-wider">
                            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                            <Link href="#" className="hover:text-white transition-colors">Legal</Link>
                            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                        </div>
                    </div>
                    <p className="font-sans text-xs text-gray-600">© 2025 NEXUS Automotive Systems.<br />Made with ❤️ in Baramati</p>
                </div>
            </footer>
        </div>
    )
}
