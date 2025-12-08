import { Playfair_Display, Manrope } from "next/font/google"
import Link from "next/link"
import ClientWrapper from "@/components/landing/ClientWrapper"

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

// SERVER COMPONENT - All content renders as HTML immediately
export default function LandingPage() {
  return (
    <main className={`${playfair.variable} ${manrope.variable} font-sans bg-[#020202] min-h-screen text-white overflow-x-hidden`}>
      {/* Server-side CSS for preloader animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @-webkit-keyframes spin { from { -webkit-transform: rotate(0deg); } to { -webkit-transform: rotate(360deg); } }
        @keyframes fadeOut { 0%, 70% { opacity: 1; } 100% { opacity: 0; pointer-events: none; } }
        @-webkit-keyframes fadeOut { 0%, 70% { opacity: 1; } 100% { opacity: 0; pointer-events: none; } }
        .preloader-spin { animation: spin 10s linear infinite; -webkit-animation: spin 10s linear infinite; }
        .preloader-fadeout { animation: fadeOut 2.5s ease-out forwards; -webkit-animation: fadeOut 2.5s ease-out forwards; }
      `}} />

      {/* PRELOADER - Server rendered, CSS animation */}
      <div className="preloader-fadeout fixed inset-0 bg-black z-[100] flex flex-col justify-center items-center">
        <div className="preloader-spin w-[50px] h-[50px] border border-[#333] rounded-full flex items-center justify-center mb-5 relative">
          <div className="w-[1px] h-[30px] bg-white absolute"></div>
          <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(60deg)' }}></div>
          <div className="w-[1px] h-[30px] bg-white absolute" style={{ transform: 'rotate(-60deg)' }}></div>
        </div>
        <div className="font-serif italic text-gray-500 tracking-widest text-sm">Vision Iconic</div>
      </div>

      {/* Client wrapper for 3D scene and cursor - loads after page */}
      <ClientWrapper />

      {/* ALL CONTENT IS SERVER-RENDERED HTML */}
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
            <h1 className="font-serif text-[clamp(2.5rem,8vw,9rem)] leading-none tracking-[-0.01em] font-normal mb-8 text-white">
              SYSTEM<br />
              <span className="italic text-gray-400">INTEGRATED.</span>
            </h1>
            <p className="font-sans text-gray-400 max-w-md text-sm leading-relaxed mb-10">
              The operating system for the automotive avant-garde. Redefining
              dealer management through sensual purity and absolute data precision.
            </p>
            <Link href="/login">
              <button className="bg-[#ffffff] text-black px-8 md:px-12 py-4 rounded-full font-sans font-semibold text-sm">
                Login to Platform
              </button>
            </Link>
          </div>
          <div className="absolute bottom-12 right-6 md:right-12 flex flex-col items-end gap-4 opacity-50 mix-blend-difference text-white">
            <span className="font-sans text-xs tracking-widest uppercase">Scroll</span>
            <div className="h-16 w-[1px] bg-white"></div>
          </div>
        </section>

        <div className="h-[30vh]"></div>

        {/* MODULES */}
        <section id="modules" className="px-6 md:px-24 py-32 bg-[#020202] relative z-20 border-t border-white/5 text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-16">
            <div className="col-span-1 md:col-span-4">
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#D90429] mb-4 block">The Modules</span>
              <h2 className="font-serif text-5xl mb-8">Engineered<br /><span className="italic text-gray-500">Beyond.</span></h2>
              <p className="text-gray-400 text-sm leading-relaxed">NEXUS is not merely software; it is the nervous system of your enterprise.</p>
            </div>
            <div className="col-span-1 md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { num: "01.", title: "Inventory", desc: "Real-time asset tracking with 3D visualization.", href: "/inventory" },
                { num: "02.", title: "Sales", desc: "Clienteling tools that anticipate customer desires.", href: "/sales" },
                { num: "03.", title: "Service", desc: "Automated bay scheduling and AI-driven parts management.", href: "/service" },
                { num: "04.", title: "Finance", desc: "Financial clarity with zero latency.", href: "/finance" },
                { num: "05.", title: "HR", desc: "Workforce management and performance tracking.", href: "/hr" },
                { num: "06.", title: "CRM", desc: "Customer relationship with lead tracking.", href: "/crm" }
              ].map((card) => (
                <Link key={card.num} href={card.href}>
                  <div className="group cursor-pointer bg-white/5 border border-white/10 p-8 md:p-12 transition-all duration-500 hover:bg-white/10 hover:border-white/30 h-full relative overflow-hidden">
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

        {/* DASHBOARD MOCKUP */}
        <section id="performance" className="px-6 md:px-24 py-32 relative z-20 bg-[#020202]">
          <div className="w-full min-h-[60vh] md:h-[80vh] bg-[#050505] rounded-lg overflow-hidden shadow-[0_20px_100px_rgba(0,0,0,0.8)] border border-[#222] relative flex flex-col font-sans text-gray-400">
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
              <div className="hidden md:flex w-64 border-r border-white/10 flex-col py-8 bg-[#080808]">
                <div className="px-8 mb-8">
                  <div className="text-[10px] uppercase tracking-widest text-gray-600 mb-4">Modules</div>
                  <div className="flex flex-col gap-4 text-xs font-medium">
                    <div className="text-white flex justify-between">Dashboard <span className="w-1.5 h-1.5 bg-[#D90429] rounded-full"></span></div>
                    <div className="text-gray-400">Inventory</div>
                    <div className="text-gray-400">Sales</div>
                    <div className="text-gray-400">Service</div>
                    <div className="text-gray-400">Finance</div>
                  </div>
                </div>
              </div>
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="col-span-2 bg-white/5 border border-white/5 rounded-sm">
                    <div className="p-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                      <span className="text-xs text-white tracking-wide font-medium">LIVE INVENTORY FEED</span>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D90429] animate-pulse"></span>
                        <span className="text-[10px] text-[#D90429]">LIVE</span>
                      </div>
                    </div>
                    <div className="p-2">
                      <div className="grid grid-cols-4 text-[10px] uppercase text-gray-600 px-4 py-3 font-medium tracking-wider">
                        <div className="col-span-2">Vehicle</div>
                        <div>Status</div>
                        <div className="text-right">Price</div>
                      </div>
                      <div className="space-y-1">
                        {[
                          { name: "2025 S-Class Maybach", status: "Ready", color: "bg-green-500", price: "$194,000" },
                          { name: "2025 EQS 580 SUV", status: "PDI", color: "bg-yellow-500", price: "$126,500" },
                          { name: "2024 SL 63 AMG", status: "Ready", color: "bg-green-500", price: "$181,000" },
                          { name: "2025 G 63 AMG", status: "Reserved", color: "bg-[#D90429]", price: "$188,000" },
                          { name: "2025 GT 63 S E-Performance", status: "Transit", color: "bg-blue-500", price: "$204,000" }
                        ].map((car, i) => (
                          <div key={i} className="grid grid-cols-4 text-xs items-center px-4 py-4 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/[0.02]">
                            <div className="col-span-2 text-white font-medium">{car.name}</div>
                            <div><span className={`inline-block w-1.5 h-1.5 rounded-full ${car.color} mr-2`}></span>{car.status}</div>
                            <div className="text-right font-serif tracking-wide">{car.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 bg-white/5 border border-white/5 rounded-sm p-6">
                    <div className="text-xs text-white tracking-wide mb-6 font-medium">SERVICE BAY STATUS</div>
                    <div className="space-y-6">
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[10px] text-white rounded-full">01</div>
                        <div>
                          <div className="text-xs text-white font-medium">Service A - S580</div>
                          <div className="text-[10px] text-gray-500 mt-1">Bay 4 • Tech: M.K.</div>
                          <div className="w-24 h-0.5 bg-white/10 mt-2 rounded-full overflow-hidden"><div className="w-2/3 h-full bg-green-500"></div></div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <div className="w-8 h-8 bg-white/10 flex items-center justify-center text-[10px] text-white rounded-full">02</div>
                        <div>
                          <div className="text-xs text-white font-medium">Brake Install - G63</div>
                          <div className="text-[10px] text-gray-500 mt-1">Bay 2 • Tech: J.R.</div>
                          <div className="w-24 h-0.5 bg-white/10 mt-2 rounded-full overflow-hidden"><div className="w-1/3 h-full bg-yellow-500"></div></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-24 w-full flex flex-col items-center justify-center text-center">
            <h3 className="font-serif text-3xl md:text-4xl text-white mb-8">Elevate Your Enterprise.</h3>
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-center">
              <Link href="/register"><button className="bg-[#ffffff] text-black px-8 md:px-10 py-4 rounded-full font-sans font-semibold text-sm tracking-widest uppercase">Request Full Demo</button></Link>
              <button className="px-8 md:px-10 py-4 rounded-full border border-white/30 text-white font-sans text-xs font-bold tracking-widest uppercase">View Pricing Tiers</button>
            </div>
          </div>
        </section>

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
            <p className="font-sans text-xs text-gray-600">© 2025 NEXUS Automotive Systems.<br />Designed in Stuttgart.</p>
          </div>
        </footer>
      </div>
    </main>
  )
}