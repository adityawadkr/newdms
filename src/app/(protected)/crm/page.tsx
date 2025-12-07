"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import Link from "next/link"
import {
  HeartHandshake,
  Users,
  Gift,
  Crown,
  Mail,
  PhoneCall,
  Star,
  TrendingUp,
  TrendingDown,
  UserPlus,
  Calendar,
  Target,
  Award,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle
} from "lucide-react"

// ============================================================================
// LEAD FUNNEL
// ============================================================================
const LeadFunnel = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const stages = [
    { name: "Total Leads", count: 320, color: isDarkMode ? "#D4AF37" : "#003366" },
    { name: "Qualified", count: 185, color: isDarkMode ? "#B8962E" : "#0055AA" },
    { name: "Proposal Sent", count: 90, color: isDarkMode ? "#9A7A24" : "#0066CC" },
    { name: "Negotiation", count: 55, color: isDarkMode ? "#7C5E1A" : "#4488DD" },
    { name: "Closed Won", count: 32, color: isDarkMode ? "#5E4210" : "#6699EE" },
  ]

  const maxCount = stages[0].count

  return (
    <div className="space-y-3">
      {stages.map((stage, i) => {
        const widthPercent = (stage.count / maxCount) * 100
        return (
          <div key={i} className="group relative">
            <div
              className="h-12 rounded-lg flex items-center justify-between px-4 transition-all duration-500"
              style={{
                width: `${widthPercent}%`,
                background: stage.color,
                boxShadow: isDarkMode ? `0 0 20px ${stage.color}40` : undefined,
                minWidth: '60%'
              }}
            >
              <span className="text-xs font-medium text-white">{stage.name}</span>
              <span className="text-sm font-bold text-white font-mono">{stage.count}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ============================================================================
// CUSTOMER SEGMENT DONUT
// ============================================================================
const SegmentDonut = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const segments = [
    { name: "VIP", value: 12, color: isDarkMode ? "#D4AF37" : "#003366" },
    { name: "Premium", value: 28, color: isDarkMode ? "#9A7A24" : "#0066CC" },
    { name: "Regular", value: 45, color: isDarkMode ? "#5E4210" : "#4488DD" },
    { name: "New", value: 15, color: isDarkMode ? "#3D2A08" : "#99BBEE" },
  ]

  const total = segments.reduce((a, b) => a + b.value, 0)
  let cumulativePercent = 0
  const radius = 40
  const circumference = 2 * Math.PI * radius

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const percent = seg.value / total
            const strokeDasharray = `${percent * circumference} ${circumference}`
            const strokeDashoffset = -cumulativePercent * circumference
            cumulativePercent += percent

            return (
              <circle
                key={i}
                cx="50" cy="50" r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="8"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            )
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>1,284</span>
          <span className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>MEMBERS</span>
        </div>
      </div>

      <div className="space-y-2.5">
        {segments.map((seg, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: seg.color }} />
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{seg.name}</span>
            <span className={`text-xs font-bold font-mono ml-auto ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// VIP CUSTOMER CARD
// ============================================================================
const VIPCard = ({ customer, isDarkMode }: any) => (
  <div className={`luxury-card p-4 flex items-center gap-4 group cursor-pointer`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-serif font-bold
      ${isDarkMode
        ? 'bg-gradient-to-br from-[#D4AF37] to-[#8B7320] text-black'
        : 'bg-gradient-to-br from-[#003366] to-[#0066CC] text-white'}
    `}>
      {customer.initials}
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {customer.name}
        </span>
        <Crown size={12} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
      </div>
      <div className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {customer.purchases} purchases · ₹{customer.lifetime}L lifetime
      </div>
    </div>

    <div className="text-right">
      <div className={`text-xs font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
        {customer.points} pts
      </div>
      <div className={`text-[9px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        {customer.tier} Tier
      </div>
    </div>

    <ChevronRight size={16} className="opacity-0 group-hover:opacity-50 transition-opacity" />
  </div>
)

// ============================================================================
// CAMPAIGN CARD
// ============================================================================
const CampaignCard = ({ campaign, isDarkMode }: any) => (
  <div className={`p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01]
    ${isDarkMode ? 'border-white/5 hover:border-[#D4AF37]/20 hover:bg-[#D4AF37]/5' : 'border-black/5 hover:border-[#003366]/10 hover:bg-[#003366]/5'}
  `}>
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <Mail size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
        <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{campaign.name}</span>
      </div>
      <span className={`px-2 py-0.5 rounded text-[9px] font-bold
        ${campaign.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' :
          campaign.status === 'Scheduled' ? isDarkMode ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]' :
            'bg-gray-500/10 text-gray-500'}
      `}>
        {campaign.status}
      </span>
    </div>

    <div className="grid grid-cols-3 gap-2 text-center">
      <div>
        <div className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>{campaign.sent}</div>
        <div className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sent</div>
      </div>
      <div>
        <div className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>{campaign.opened}%</div>
        <div className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Opened</div>
      </div>
      <div>
        <div className={`text-lg font-bold font-mono ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>{campaign.clicked}%</div>
        <div className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Clicked</div>
      </div>
    </div>
  </div>
)

// ============================================================================
// MAIN CRM PAGE
// ============================================================================
export default function CrmPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => { setMounted(true) }, [])

  const vipCustomers = [
    { name: "Rajesh Kumar", initials: "RK", purchases: 3, lifetime: "52.8", points: 12500, tier: "Platinum" },
    { name: "Karan Malhotra", initials: "KM", purchases: 2, lifetime: "41.2", points: 9800, tier: "Gold" },
    { name: "Priya Sharma", initials: "PS", purchases: 2, lifetime: "35.6", points: 8200, tier: "Gold" },
    { name: "Amit Patel", initials: "AP", purchases: 1, lifetime: "23.9", points: 5600, tier: "Silver" },
  ]

  const campaigns = [
    { name: "Year-End Offers", status: "Active", sent: "2.4K", opened: 42, clicked: 18 },
    { name: "Service Reminder", status: "Active", sent: "1.8K", opened: 65, clicked: 28 },
    { name: "New Model Launch", status: "Scheduled", sent: "-", opened: 0, clicked: 0 },
  ]

  const followUps = [
    { customer: "Vikram Singh", task: "Follow up on Range Rover quote", time: "Today 2:00 PM", priority: "high" },
    { customer: "Sneha Reddy", task: "Send Cayenne brochure", time: "Today 4:30 PM", priority: "medium" },
    { customer: "Arjun Nair", task: "Schedule test drive - Seltos", time: "Tomorrow 11:00 AM", priority: "low" },
  ]

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <HeartHandshake size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">Customer Relations</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              CRM & Loyalty
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/sales/leads"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}
              `}
            >
              <Users size={14} /> View Leads
            </Link>
            <Link
              href="/sales/leads?action=new"
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-medium transition-all
                ${isDarkMode
                  ? 'border-[#D4AF37]/20 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 text-[#D4AF37]'
                  : 'border-[#003366]/20 bg-[#003366]/10 hover:bg-[#003366]/20 text-[#003366]'}
              `}
            >
              <UserPlus size={14} /> Add Lead
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
          {[
            { label: "Total Leads", value: "320", change: 12, icon: Users },
            { label: "Conversion Rate", value: "15%", change: 2.5, icon: Target },
            { label: "Loyalty Members", value: "1,284", change: 8, icon: Award },
            { label: "Avg. Response Time", value: "2.4h", change: -15, icon: Clock },
          ].map((stat, i) => (
            <div key={i} className={`luxury-card p-4`}>
              <div className="flex items-center justify-between mb-2">
                <stat.icon size={16} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                <div className={`flex items-center gap-1 text-[10px] font-bold
                  ${stat.change >= 0 ? 'text-emerald-500' : 'text-red-500'}
                `}>
                  {stat.change >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </div>
              </div>
              <div className={`text-2xl font-serif font-bold mb-0.5 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                {stat.value}
              </div>
              <div className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Lead Funnel */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Lead Funnel
              </h2>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>This Quarter</span>
            </div>
            <LeadFunnel isDarkMode={isDarkMode} />
          </div>

          {/* Customer Segments */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                Customer Segments
              </h2>
              <span className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Loyalty Program</span>
            </div>
            <SegmentDonut isDarkMode={isDarkMode} />
          </div>
        </div>

        {/* VIP Customers */}
        <div className="luxury-card p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Crown size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                VIP Customers
              </h2>
            </div>
            <Link
              href="/sales/leads"
              className={`flex items-center gap-1 text-xs font-medium ${isDarkMode ? 'text-[#D4AF37] hover:text-[#E5C158]' : 'text-[#003366] hover:text-[#0055AA]'}`}
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vipCustomers.map((customer, i) => (
              <VIPCard key={i} customer={customer} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Campaigns */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Mail size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                  Campaigns
                </h2>
              </div>
              <button
                onClick={() => alert('Campaign creation coming soon! This feature is under development.')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isDarkMode ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20' : 'bg-[#003366]/10 text-[#003366] hover:bg-[#003366]/20'}
                `}
              >
                <Sparkles size={12} /> New Campaign
              </button>
            </div>
            <div className="space-y-3">
              {campaigns.map((campaign, i) => (
                <CampaignCard key={i} campaign={campaign} isDarkMode={isDarkMode} />
              ))}
            </div>
          </div>

          {/* Follow-ups */}
          <div className="luxury-card p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <PhoneCall size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
                <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                  Follow-ups Today
                </h2>
              </div>
              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${isDarkMode ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'}`}>
                {followUps.length} pending
              </span>
            </div>
            <div className="space-y-3">
              {followUps.map((task, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl transition-colors
                  ${isDarkMode ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.02]'}
                `}>
                  <div className={`mt-0.5 w-2 h-2 rounded-full
                    ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'}
                  `} />
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium mb-0.5 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {task.customer}
                    </div>
                    <div className={`text-xs truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
                      {task.task}
                    </div>
                  </div>
                  <div className={`text-[10px] font-mono whitespace-nowrap ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    {task.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rewards */}
        <div className="luxury-card p-5 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
            <h2 className={`text-lg font-serif font-semibold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Loyalty Rewards
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { reward: "Free Service", points: "5,000", icon: "🔧" },
              { reward: "Accessory Voucher", points: "3,000", icon: "🎁" },
              { reward: "Priority Booking", points: "2,000", icon: "⭐" },
              { reward: "Extended Warranty", points: "10,000", icon: "🛡️" },
            ].map((item, i) => (
              <div key={i} className={`p-4 rounded-xl border text-center transition-all hover:scale-[1.02] cursor-pointer
                ${isDarkMode ? 'border-white/5 hover:border-[#D4AF37]/20' : 'border-black/5 hover:border-[#003366]/10'}
              `}>
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{item.reward}</div>
                <div className={`text-[10px] font-mono ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>{item.points} pts</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}