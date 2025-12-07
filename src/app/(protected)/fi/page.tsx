"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  HandCoins,
  ShieldCheck,
  FileCheck,
  Percent,
  Calculator,
  Building2,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Car,
  IndianRupee,
  Calendar,
  FileText
} from "lucide-react"

// ============================================================================
// LOAN CALCULATOR
// ============================================================================
const LoanCalculator = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [amount, setAmount] = React.useState(1500000)
  const [tenure, setTenure] = React.useState(60)
  const [rate, setRate] = React.useState(8.5)

  const monthlyRate = rate / 12 / 100
  const emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1)
  const totalPayment = emi * tenure
  const totalInterest = totalPayment - amount

  return (
    <div className="space-y-6">
      {/* Sliders */}
      <div className="space-y-5">
        <div>
          <div className="flex justify-between mb-2">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loan Amount</span>
            <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
              ₹{(amount / 100000).toFixed(1)}L
            </span>
          </div>
          <input
            type="range"
            min={500000}
            max={5000000}
            step={50000}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className={`w-full h-2 rounded-full appearance-none cursor-pointer
              ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}
            `}
            style={{
              background: isDarkMode
                ? `linear-gradient(to right, #D4AF37 ${(amount - 500000) / 45000}%, rgba(255,255,255,0.1) ${(amount - 500000) / 45000}%)`
                : `linear-gradient(to right, #003366 ${(amount - 500000) / 45000}%, rgba(0,0,0,0.1) ${(amount - 500000) / 45000}%)`
            }}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Tenure</span>
            <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
              {tenure} months
            </span>
          </div>
          <input
            type="range"
            min={12}
            max={84}
            step={6}
            value={tenure}
            onChange={(e) => setTenure(Number(e.target.value))}
            className={`w-full h-2 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Interest Rate</span>
            <span className={`text-sm font-bold font-mono ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
              {rate}% p.a.
            </span>
          </div>
          <input
            type="range"
            min={7}
            max={15}
            step={0.25}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={`w-full h-2 rounded-full appearance-none cursor-pointer ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`}
          />
        </div>
      </div>

      {/* Results */}
      <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-[#D4AF37]/5 border border-[#D4AF37]/20' : 'bg-[#003366]/5 border border-[#003366]/10'}`}>
        <div className="text-center mb-4">
          <div className={`text-[10px] font-mono uppercase tracking-widest mb-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Monthly EMI
          </div>
          <div className={`text-3xl font-serif font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
            ₹{Math.round(emi).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Interest</div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>
              ₹{(totalInterest / 100000).toFixed(1)}L
            </div>
          </div>
          <div className="text-center">
            <div className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Payment</div>
            <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              ₹{(totalPayment / 100000).toFixed(1)}L
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// INSURANCE PLAN CARD
// ============================================================================
const InsurancePlanCard = ({ plan, isDarkMode, featured = false }: any) => (
  <div className={`relative luxury-card p-5 overflow-hidden ${featured ? 'ring-2 ring-offset-2' : ''}
    ${featured && isDarkMode ? 'ring-[#D4AF37] ring-offset-[#030303]' : ''}
    ${featured && !isDarkMode ? 'ring-[#003366] ring-offset-white' : ''}
  `}>
    {featured && (
      <div className={`absolute top-0 left-0 right-0 py-1 text-center text-[9px] font-bold uppercase tracking-wider
        ${isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'}
      `}>
        Recommended
      </div>
    )}

    <div className={featured ? 'mt-4' : ''}>
      <div className="flex items-center gap-2 mb-3">
        <ShieldCheck size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
        <span className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{plan.name}</span>
      </div>

      <div className={`text-2xl font-serif font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
        ₹{(plan.premium / 1000).toFixed(0)}K
        <span className={`text-xs font-normal ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>/year</span>
      </div>

      <div className={`text-[10px] mb-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        IDV: ₹{(plan.idv / 100000).toFixed(1)}L
      </div>

      <ul className="space-y-2 mb-4">
        {plan.features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500" />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{f}</span>
          </li>
        ))}
      </ul>

      <button className={`w-full py-2.5 rounded-xl text-xs font-medium transition-all
        ${featured
          ? isDarkMode
            ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
            : 'bg-[#003366] text-white hover:bg-[#004488]'
          : isDarkMode
            ? 'border border-white/10 hover:bg-white/5'
            : 'border border-black/10 hover:bg-black/5'}
      `}>
        Select Plan
      </button>
    </div>
  </div>
)

// ============================================================================
// PIPELINE STAGE
// ============================================================================
const PipelineStage = ({ stage, count, status, isDarkMode }: any) => {
  const statusConfig: any = {
    completed: { color: 'text-emerald-500', bg: 'bg-emerald-500', icon: CheckCircle2 },
    active: { color: isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]', bg: isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]', icon: Clock },
    pending: { color: 'text-gray-400', bg: 'bg-gray-400', icon: AlertCircle },
  }
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <div className="flex items-center gap-3 group">
      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center ${config.bg}/10`}>
        <Icon size={18} className={config.color} />
        {status === 'active' && (
          <div className={`absolute inset-0 rounded-full animate-ping ${config.bg}/20`} />
        )}
      </div>
      <div className="flex-1">
        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{stage}</div>
        <div className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{count} applications</div>
      </div>
      <ChevronRight size={16} className={`opacity-30 group-hover:opacity-60 transition-opacity`} />
    </div>
  )
}

// ============================================================================
// MAIN F&I PAGE
// ============================================================================
export default function FinanceInsurancePage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const insurancePlans = [
    {
      name: "Basic",
      premium: 28000,
      idv: 1500000,
      features: ["Third Party Cover", "Personal Accident", "24/7 Roadside Assist"]
    },
    {
      name: "Comprehensive",
      premium: 45000,
      idv: 1500000,
      features: ["Own Damage Cover", "Zero Depreciation", "Engine Protection", "NCB Protection"]
    },
    {
      name: "Premium",
      premium: 62000,
      idv: 1500000,
      features: ["All Comprehensive", "Consumables Cover", "Return to Invoice", "Key Replacement"]
    },
  ]

  const applications = [
    { name: "Rajesh Kumar", vehicle: "S-Class S500", amount: "₹15L", status: "Under Review", time: "2h ago" },
    { name: "Priya Sharma", vehicle: "A8 L", amount: "₹12L", status: "Documents Pending", time: "5h ago" },
    { name: "Amit Patel", vehicle: "Cayenne", amount: "₹18L", status: "Approved", time: "1d ago" },
  ]

  const lenders = [
    { name: "HDFC Bank", rate: "8.25%", logo: "🏦" },
    { name: "ICICI Bank", rate: "8.50%", logo: "🏛️" },
    { name: "SBI", rate: "8.65%", logo: "🏦" },
    { name: "Axis Bank", rate: "8.75%", logo: "🏛️" },
  ]

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HandCoins size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">F&I Desk</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Finance & Insurance
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sales/quotations"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode
                  ? 'border-[#D4AF37]/20 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'border-[#003366]/20 bg-[#003366]/10 hover:bg-[#003366]/20 text-[#003366]'}
              `}
            >
              <FileCheck size={14} /> New Application
            </Link>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* EMI Calculator */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calculator size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                EMI Calculator
              </h2>
            </div>
            <LoanCalculator isDarkMode={isDarkMode} />
          </div>

          {/* Insurance Plans */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Insurance Plans
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {insurancePlans.map((plan, i) => (
                <InsurancePlanCard key={plan.name} plan={plan} isDarkMode={isDarkMode} featured={i === 1} />
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline & Applications */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pipeline */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                F&I Pipeline
              </h2>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>12 active</span>
            </div>

            <div className="space-y-4">
              <PipelineStage stage="Application Submitted" count={4} status="completed" isDarkMode={isDarkMode} />
              <div className={`h-6 border-l-2 ml-5 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`} />
              <PipelineStage stage="Document Verification" count={3} status="active" isDarkMode={isDarkMode} />
              <div className={`h-6 border-l-2 ml-5 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`} />
              <PipelineStage stage="Underwriting" count={2} status="pending" isDarkMode={isDarkMode} />
              <div className={`h-6 border-l-2 ml-5 ${isDarkMode ? 'border-white/10' : 'border-black/10'}`} />
              <PipelineStage stage="Approval & Disbursement" count={3} status="pending" isDarkMode={isDarkMode} />
            </div>
          </div>
          {/* Recent Applications */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Recent Applications
              </h2>
              <Link
                href="/sales/quotations"
                className={`flex items-center gap-1 text-xs font-medium transition-colors ${isDarkMode ? 'text-[#D4AF37] hover:text-[#E5C158]' : 'text-[#003366] hover:text-[#0055AA]'}`}
              >
                View All →
              </Link>
            </div>

            <div className="space-y-3">
              {applications.map((app, i) => (
                <div key={i} className={`p-3 rounded-xl transition-colors cursor-pointer
                  ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'}
                `}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                      <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{app.name}</span>
                    </div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{app.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{app.vehicle}</span>
                      <span className={`text-xs font-mono font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>{app.amount}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-medium
                      ${app.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                        app.status === 'Under Review' ? isDarkMode ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]' :
                          'bg-amber-500/10 text-amber-500'}
                    `}>
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Lenders */}
        <div className="luxury-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
            <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Partner Lenders
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {lenders.map((lender, i) => (
              <div key={i} className={`p-4 rounded-xl border text-center transition-all cursor-pointer hover:scale-[1.02]
                ${isDarkMode ? 'border-white/10 hover:border-[#D4AF37]/30 hover:bg-[#D4AF37]/5' : 'border-black/10 hover:border-[#003366]/20 hover:bg-[#003366]/5'}
              `}>
                <div className="text-2xl mb-2">{lender.logo}</div>
                <div className={`text-sm font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{lender.name}</div>
                <div className={`text-xs font-mono ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>from {lender.rate}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}