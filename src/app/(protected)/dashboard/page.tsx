"use client"

import React, { useState, useEffect, useRef } from 'react';
import {
  LucideSun,
  LucideMoon,
  LucidePlus,
  LucideChevronDown,
  LucideMessageSquare,
  LucideAlertCircle,
  LucideCheckCircle,
  LucideUsers,
  LucideCar,
  LucideCalendar,
  LucideFileText,
  LucideArrowRight,
  LucideRefreshCw,
  LucideTrendingUp,
  LucideTrendingDown,
  LucideSearch,
  LucideWrench,
  LucidePackage,
  LucideBarChart3
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from "next-themes";

// ============================================================================
// SEARCH MODULE DATA
// ============================================================================
const SEARCH_MODULES = [
  { name: "Dashboard", path: "/dashboard", icon: LucideBarChart3, keywords: ["home", "overview", "stats"] },
  { name: "Leads", path: "/sales/leads", icon: LucideUsers, keywords: ["customers", "prospects", "sales"] },
  { name: "Quotations", path: "/sales/quotations", icon: LucideFileText, keywords: ["quote", "proposal", "price"] },
  { name: "Bookings", path: "/sales/bookings", icon: LucideCalendar, keywords: ["orders", "confirmed"] },
  { name: "Test Drives", path: "/sales/test-drives", icon: LucideCar, keywords: ["demo", "trial"] },
  { name: "Vehicles", path: "/inventory/vehicles", icon: LucideCar, keywords: ["stock", "cars", "inventory"] },
  { name: "Spare Parts", path: "/inventory/spare-parts", icon: LucidePackage, keywords: ["parts", "accessories"] },
  { name: "Service", path: "/service", icon: LucideWrench, keywords: ["repair", "maintenance"] },
  { name: "Job Cards", path: "/service/job-cards", icon: LucideFileText, keywords: ["work", "service", "repair"] },
  { name: "Reports", path: "/reports", icon: LucideBarChart3, keywords: ["analytics", "data", "export"] },
  { name: "Employees", path: "/hr/employees", icon: LucideUsers, keywords: ["staff", "team", "hr"] },
  { name: "Finance", path: "/finance", icon: LucideFileText, keywords: ["accounts", "money", "payments"] },
];

// Notification route mapping
const NOTIFICATION_ROUTES: Record<string, string> = {
  "low_stock": "/inventory/spare-parts",
  "new_lead": "/sales/leads",
  "booking_confirmed": "/sales/bookings",
  "service_due": "/service/appointments",
  "payment_received": "/finance",
  "job_completed": "/service/job-cards",
};

// ============================================================================
// ANIMATED NUMBER COUNTER
// ============================================================================
const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: string, prefix?: string, suffix?: string }) => {
  const [displayed, setDisplayed] = useState(value);

  useEffect(() => {
    setDisplayed(value);
  }, [value]);

  return (
    <span className="inline-block animate-count tabular-nums">
      {prefix}{displayed}{suffix}
    </span>
  );
};

// ============================================================================
// PROFESSIONAL REVENUE BAR CHART - NEXT LEVEL DESIGN
// ============================================================================
const PremiumAreaChart = ({ isDarkMode, dataPoints }: { isDarkMode: boolean, dataPoints: number[] }) => {
  const maxVal = Math.max(...dataPoints, 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Calculate revenue values from normalized data
  const getRevenue = (val: number) => {
    // Convert from normalized 20-200 range to lakhs
    const normalized = Math.max(0, val - 20) / 180;
    return (normalized * 50).toFixed(1); // Max 50L
  };

  const currentMonth = new Date().getMonth();

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-visible pt-8">
      {/* Y-axis labels */}
      <div className="absolute left-0 top-8 bottom-8 w-10 flex flex-col justify-between text-right pr-2">
        {['50L', '40L', '30L', '20L', '10L', '0'].map((label, i) => (
          <span key={i} className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {label}
          </span>
        ))}
      </div>

      {/* Chart area */}
      <div className="absolute left-12 right-0 top-8 bottom-0 flex flex-col">
        {/* Grid lines */}
        <div className="flex-1 relative overflow-visible">
          {[0, 20, 40, 60, 80, 100].map((percent) => (
            <div
              key={percent}
              className={`absolute left-0 right-0 border-t ${isDarkMode ? 'border-white/5' : 'border-gray-100'}`}
              style={{ top: `${percent}%` }}
            />
          ))}

          {/* Bars */}
          <div className="absolute inset-0 flex items-end justify-between gap-1 px-1 overflow-visible">
            {dataPoints.map((val, i) => {
              const height = Math.max(2, ((val - 20) / 180) * 100);
              const isCurrentMonth = i === currentMonth;
              const isPast = i < currentMonth;

              return (
                <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative group cursor-pointer">
                  {/* Tooltip on hover */}
                  <div className={`absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap 
                    opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-50 shadow-lg
                    ${isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'}`}>
                    ₹{getRevenue(val)}L
                    <div className={`absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent
                      ${isDarkMode ? 'border-t-[#D4AF37]' : 'border-t-[#003366]'}`} />
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ease-out ${isCurrentMonth
                      ? isDarkMode
                        ? 'bg-gradient-to-t from-[#D4AF37] to-[#F5E6B2]'
                        : 'bg-gradient-to-t from-[#003366] to-[#0066CC]'
                      : isPast
                        ? isDarkMode
                          ? 'bg-gradient-to-t from-[#8B7320] to-[#D4AF37]/60'
                          : 'bg-gradient-to-t from-[#003366]/60 to-[#0066CC]/40'
                        : isDarkMode
                          ? 'bg-white/10'
                          : 'bg-gray-200'
                      }`}
                    style={{
                      height: `${height}%`,
                      minHeight: '4px'
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* X-axis labels */}
        <div className="h-8 flex items-center justify-between px-1 border-t border-dashed mt-1"
          style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          {months.map((month, i) => (
            <div key={i} className={`flex-1 text-center text-[8px] font-medium uppercase tracking-wider
              ${i === currentMonth
                ? isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'
                : isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              {month}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PROFESSIONAL INVENTORY CHART - HORIZONTAL BARS
// ============================================================================
const LuxuryDonutChart = ({ isDarkMode, data }: { isDarkMode: boolean, data: any }) => {
  const total = data.total || 0;
  const segments = [
    {
      value: data.inStock,
      color: isDarkMode ? "#D4AF37" : "#003366",
      bgColor: isDarkMode ? "rgba(212, 175, 55, 0.15)" : "rgba(0, 51, 102, 0.1)",
      label: "In Stock"
    },
    {
      value: data.booked,
      color: isDarkMode ? "#8B7320" : "#0066CC",
      bgColor: isDarkMode ? "rgba(139, 115, 32, 0.15)" : "rgba(0, 102, 204, 0.1)",
      label: "Booked"
    },
    {
      value: data.transit,
      color: isDarkMode ? "#6B5B1F" : "#4B89DC",
      bgColor: isDarkMode ? "rgba(107, 91, 31, 0.15)" : "rgba(75, 137, 220, 0.1)",
      label: "In Transit"
    },
  ];

  return (
    <div className="space-y-4">
      {/* Total Count Display */}
      <div className="text-center py-4">
        <div className={`text-5xl font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          {total}
        </div>
        <div className={`text-xs font-medium uppercase tracking-widest mt-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Total Vehicles
        </div>
      </div>

      {/* Horizontal Bar Segments */}
      <div className="space-y-3">
        {segments.map((seg, i) => (
          <div key={i} className="group">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: seg.color }}
                />
                <span className={`text-xs font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {seg.label}
                </span>
              </div>
              <span className={`text-xs font-bold font-mono ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {seg.value}%
              </span>
            </div>
            <div
              className="h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: seg.bgColor }}
            >
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${seg.value}%`,
                  backgroundColor: seg.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className={`flex items-center justify-center gap-2 pt-2 text-[10px] font-mono
        ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        <span>Available for sale:</span>
        <span className={`font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
          {Math.round(total * data.inStock / 100)} units
        </span>
      </div>
    </div>
  );
};

// ============================================================================
// PREMIUM STAT CARD
// ============================================================================
const PremiumStatCard = ({ title, value, trend, icon: Icon, isDarkMode, delay = 0 }: any) => {
  const isPositive = trend >= 0;

  return (
    <div
      className={`luxury-card relative p-5 sm:p-6 overflow-hidden group cursor-pointer`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Accent line at top */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500
        ${isDarkMode ? 'bg-gradient-to-r from-[#D4AF37] to-[#F5E6B2]' : 'bg-gradient-to-r from-[#003366] to-[#0066CC]'}
      `} />

      {/* Background glow on hover */}
      <div className={`absolute -right-12 -bottom-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700
        ${isDarkMode ? 'bg-[#D4AF37]' : 'bg-[#003366]'}
      `} />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <span className={`text-[10px] font-mono uppercase tracking-[0.1em] ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
            {title}
          </span>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
            <Icon size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
          </div>
        </div>

        <div className={`text-3xl sm:text-4xl font-serif font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
          <AnimatedNumber value={value} />
        </div>

        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold
            ${isPositive
              ? 'bg-emerald-500/10 text-emerald-500'
              : 'bg-red-500/10 text-red-500'}
          `}>
            {isPositive ? <LucideTrendingUp size={10} /> : <LucideTrendingDown size={10} />}
            {isPositive ? '+' : ''}{trend}%
          </div>
          <span className={`text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>vs last month</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK ACTION BUTTON
// ============================================================================
const QuickActionBtn = ({ icon: Icon, label, onClick, isDarkMode }: any) => (
  <button
    onClick={onClick}
    className={`group flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all duration-300 
      hover:scale-[1.02] active:scale-[0.98]
      ${isDarkMode
        ? 'border-white/5 bg-white/[0.02] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37]/20'
        : 'border-black/5 bg-black/[0.02] hover:bg-[#003366]/5 hover:border-[#003366]/10'}
    `}
  >
    <div className={`p-2.5 rounded-lg transition-colors
      ${isDarkMode
        ? 'bg-[#D4AF37]/10 group-hover:bg-[#D4AF37]/20'
        : 'bg-[#003366]/5 group-hover:bg-[#003366]/10'}
    `}>
      <Icon size={18} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
    </div>
    <span className={`text-[10px] font-medium tracking-wide uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
      {label}
    </span>
  </button>
);

// ============================================================================
// ACTIVITY ITEM (Clickable with routing)
// ============================================================================
const ActivityItem = ({ notification, isDarkMode, onClick }: any) => (
  <div
    onClick={onClick}
    className={`flex items-start gap-3 p-3 rounded-xl transition-all cursor-pointer group
      ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-black/[0.03]'}
    `}
  >
    <div className={`mt-0.5 p-1.5 rounded-lg transition-transform group-hover:scale-110 ${notification.type === 'alert'
      ? 'bg-red-500/10 text-red-500'
      : notification.type === 'success'
        ? 'bg-emerald-500/10 text-emerald-500'
        : isDarkMode ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'bg-[#003366]/10 text-[#003366]'
      }`}>
      {notification.type === 'alert'
        ? <LucideAlertCircle size={12} />
        : notification.type === 'success'
          ? <LucideCheckCircle size={12} />
          : <LucideMessageSquare size={12} />}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={`text-xs font-semibold mb-0.5 group-hover:underline ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
        {notification.title}
      </h4>
      <p className={`text-[10px] leading-relaxed truncate ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
        {notification.message}
      </p>
    </div>
    <div className="flex items-center gap-2">
      <span className={`text-[9px] font-mono whitespace-nowrap ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
        {notification.time}
      </span>
      <LucideArrowRight size={10} className={`opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`} />
    </div>
  </div>
);

// ============================================================================
// SEARCH BAR COMPONENT
// ============================================================================
const SearchBar = ({ isDarkMode, router }: { isDarkMode: boolean, router: any }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredModules = query.trim()
    ? SEARCH_MODULES.filter(m =>
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.keywords.some(k => k.toLowerCase().includes(query.toLowerCase()))
    )
    : SEARCH_MODULES.slice(0, 6);

  const handleSelect = (path: string) => {
    router.push(path);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all
        ${isOpen
          ? isDarkMode ? 'border-[#D4AF37]/50 bg-white/[0.05]' : 'border-[#003366]/30 bg-black/[0.03]'
          : isDarkMode ? 'border-white/10 bg-white/[0.02]' : 'border-black/10 bg-black/[0.02]'}
      `}>
        <LucideSearch size={16} className={isDarkMode ? 'text-gray-500' : 'text-gray-400'} />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search modules... (e.g., leads, parts, reports)"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true); }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className={`flex-1 bg-transparent outline-none text-sm placeholder:text-gray-500
            ${isDarkMode ? 'text-white' : 'text-gray-900'}
          `}
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={`absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-2xl z-50 overflow-hidden
          ${isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-gray-200'}
        `}>
          <div className={`px-3 py-2 text-[9px] font-mono uppercase tracking-wider ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {query ? 'Results' : 'Quick Access'}
          </div>
          {filteredModules.map((mod) => (
            <button
              key={mod.path}
              onClick={() => handleSelect(mod.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors
                ${isDarkMode ? 'hover:bg-white/[0.05]' : 'hover:bg-gray-50'}
              `}
            >
              <mod.icon size={16} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{mod.name}</span>
              <span className={`ml-auto text-[10px] ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>{mod.path}</span>
            </button>
          ))}
          {query && filteredModules.length === 0 && (
            <div className={`px-4 py-6 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              No modules found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN DASHBOARD COMPONENT
// ============================================================================
export default function PremiumDashboard() {
  const { setTheme, resolvedTheme } = useTheme();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/stats');
      if (!response.ok) throw new Error('Failed to fetch');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      setData({
        stats: {
          revenue: { value: "₹0", trend: 0, label: "Total Revenue" },
          leads: { value: "0", trend: 0, label: "Active Leads" },
          sold: { value: "0", trend: 0, label: "Vehicles Sold" },
          bookings: { value: "0", trend: 0, label: "Service Bookings" }
        },
        inventory: { inStock: 0, booked: 0, transit: 0, total: 0 },
        salesCurve: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        notifications: []
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!mounted) return null;

  return (
    <div className={`relative min-h-screen overflow-hidden
      ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}
    `}>



      {/* Main content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 pb-12">
        {data ? (
          <div className="max-w-7xl mx-auto space-y-6">


            {/* Dashboard Header */}
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
                <div className="animate-fade-up">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-[0.15em] opacity-50">AUTOFLOW DMS</span>
                  </div>
                  <h1 className={`text-2xl sm:text-3xl font-bold tracking-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    Command Center
                  </h1>
                </div>
                <div className={`px-4 py-2 rounded-lg text-xs font-mono
                  ${isDarkMode ? 'bg-white/5 text-gray-400' : 'bg-gray-100 text-gray-600'}
                `}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
              <PremiumStatCard
                title={data.stats.revenue.label}
                value={data.stats.revenue.value}
                trend={data.stats.revenue.trend}
                icon={LucideFileText}
                isDarkMode={isDarkMode}
                delay={100}
              />
              <PremiumStatCard
                title={data.stats.leads.label}
                value={data.stats.leads.value}
                trend={data.stats.leads.trend}
                icon={LucideUsers}
                isDarkMode={isDarkMode}
                delay={200}
              />
              <PremiumStatCard
                title={data.stats.sold.label}
                value={data.stats.sold.value}
                trend={data.stats.sold.trend}
                icon={LucideCar}
                isDarkMode={isDarkMode}
                delay={300}
              />
              <PremiumStatCard
                title={data.stats.bookings.label}
                value={data.stats.bookings.value}
                trend={data.stats.bookings.trend}
                icon={LucideCalendar}
                isDarkMode={isDarkMode}
                delay={400}
              />
            </div>

            {/* Quick Actions */}
            <div className="luxury-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Quick Actions</h2>
                <LucidePlus size={14} className="opacity-30" />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <QuickActionBtn icon={LucideUsers} label="New Lead" onClick={() => router.push('/sales/leads?action=new')} isDarkMode={isDarkMode} />
                <QuickActionBtn icon={LucideCalendar} label="Test Drive" onClick={() => router.push('/sales/test-drives?action=new')} isDarkMode={isDarkMode} />
                <QuickActionBtn icon={LucideCar} label="Add Vehicle" onClick={() => router.push('/inventory/vehicles?action=new')} isDarkMode={isDarkMode} />
                <QuickActionBtn icon={LucideFileText} label="Create Quote" onClick={() => router.push('/sales/quotations?action=new')} isDarkMode={isDarkMode} />
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Sales Chart */}
              <div className="lg:col-span-2 luxury-card p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
                  <div>
                    <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                      Revenue Trend
                    </h2>
                    <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      Monthly Performance · FY 2024-25
                    </p>
                  </div>
                  <button className={`self-start flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium
                    ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-black/10 hover:bg-black/5'}
                  `}>
                    <span>This Year</span>
                    <LucideChevronDown size={12} />
                  </button>
                </div>
                <div className="h-[240px] sm:h-[280px]">
                  <PremiumAreaChart isDarkMode={isDarkMode} dataPoints={data.salesCurve} />
                </div>
              </div>

              {/* Inventory Chart */}
              <div className="luxury-card p-5 sm:p-6">
                <div className="mb-4">
                  <h2 className={`text-lg font-serif font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                    Inventory
                  </h2>
                  <p className={`text-[10px] font-mono uppercase tracking-widest ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    Current Stock Status
                  </p>
                </div>
                <LuxuryDonutChart isDarkMode={isDarkMode} data={data.inventory} />
              </div>
            </div>

            {/* Recent Activity */}
            {data.notifications && data.notifications.length > 0 && (
              <div className="luxury-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className={`text-sm font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Activity</h2>
                  <button
                    onClick={() => router.push('/activity')}
                    className={`flex items-center gap-1 text-[10px] font-medium transition-colors
                      ${isDarkMode ? 'text-[#D4AF37] hover:text-[#E5C158]' : 'text-[#003366] hover:text-[#0055AA]'}
                    `}
                  >
                    View All <LucideArrowRight size={10} />
                  </button>
                </div>
                <div className="space-y-1">
                  {data.notifications.slice(0, 5).map((notif: any) => (
                    <ActivityItem
                      key={notif.id}
                      notification={notif}
                      isDarkMode={isDarkMode}
                      onClick={() => {
                        // Route based on notification type or id pattern
                        const id = (notif.id || '').toLowerCase();
                        const type = (notif.type || '').toLowerCase();
                        const title = (notif.title || '').toLowerCase();
                        let route = '/dashboard';

                        // Check type field first
                        if (type.includes('lead') || title.includes('lead')) route = '/sales/leads';
                        else if (type.includes('quotation') || title.includes('quotation') || title.includes('quote')) route = '/sales/quotations';
                        else if (type.includes('booking') || title.includes('booking')) route = '/sales/bookings';
                        else if (type.includes('test') || type.includes('drive') || title.includes('test drive')) route = '/sales/test-drives';
                        else if (type.includes('delivery') || title.includes('delivery')) route = '/sales/delivery';
                        else if (type.includes('job') || title.includes('job card')) route = '/service/job-cards';
                        else if (type.includes('service') || title.includes('service') || title.includes('appointment')) route = '/service/appointments';
                        else if (type.includes('stock') || type.includes('inventory') || title.includes('stock') || title.includes('part')) route = '/inventory/spare-parts';
                        else if (type.includes('vehicle') || title.includes('vehicle')) route = '/inventory/vehicles';
                        else if (type.includes('employee') || title.includes('employee')) route = '/hr/employees';
                        else if (type.includes('leave') || title.includes('leave')) route = '/hr/leaves';
                        else if (type.includes('payroll') || title.includes('payroll') || title.includes('salary')) route = '/hr/payroll';
                        else if (type.includes('attendance') || title.includes('attendance')) route = '/hr/attendance';
                        else if (type.includes('posh') || title.includes('posh') || title.includes('complaint')) route = '/posh';
                        else if (type.includes('finance') || type.includes('payment') || title.includes('payment')) route = '/finance';
                        // Fallback to id-based routing
                        else if (id.includes('lead')) route = '/sales/leads';
                        else if (id.includes('job')) route = '/service/job-cards';
                        else if (id.includes('stock') || id.includes('inventory')) route = '/inventory/spare-parts';
                        else if (id.includes('booking')) route = '/sales/bookings';
                        else if (id.includes('service')) route = '/service/appointments';

                        router.push(route);
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          // Premium Loading State
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <div className={`w-16 h-16 rounded-full border-2 border-t-transparent animate-spin
                  ${isDarkMode ? 'border-[#D4AF37]' : 'border-[#003366]'}
                `} />
                <div className={`absolute inset-2 rounded-full border-2 border-b-transparent animate-spin
                  ${isDarkMode ? 'border-[#D4AF37]/30' : 'border-[#003366]/30'}
                `} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
              </div>
              <div className="text-center">
                <span className={`text-xs tracking-[0.3em] uppercase font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Loading Dashboard
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}