"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Plus,
  Pencil,
  Search,
  AlertTriangle,
  Store,
  Warehouse,
  ArrowRightLeft,
  Car,
  Fuel,
  Calendar,
  MapPin,
  Clock,
  X,
  Check,
  ChevronDown,
  Eye,
  Trash2,
  TrendingUp,
  IndianRupee
} from "lucide-react"
import { toast } from "sonner"
import { getVehicleImage } from "@/lib/vehicleImages"

type Vehicle = {
  id: number
  vin: string
  make: string
  model: string
  year: number
  category: string
  color: string
  price: number
  stock: number
  reorderPoint: number
  status: "in_stock" | "reserved" | "sold" | "in-stock" | "booked" | "in-transit"
  location: "Stockyard" | "Showroom" | "In Transit"
  daysInStock: number
  costPrice: number
}

// ============================================================================
// VEHICLE CARD
// ============================================================================
const VehicleCard = ({ vehicle, isDarkMode, onEdit, onMove }: any) => {
  const [imageError, setImageError] = React.useState(false)
  const statusConfig: any = {
    'in_stock': { label: 'In Stock', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'in-stock': { label: 'In Stock', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    'reserved': { label: 'Reserved', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'booked': { label: 'Booked', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    'sold': { label: 'Sold', color: 'text-gray-500', bg: 'bg-gray-500/10' },
    'in-transit': { label: 'In Transit', color: 'text-blue-500', bg: 'bg-blue-500/10' },
  }

  const status = statusConfig[vehicle.status] || statusConfig['in_stock']
  const profit = vehicle.price - vehicle.costPrice
  const profitMargin = vehicle.costPrice > 0 ? ((profit / vehicle.costPrice) * 100).toFixed(1) : 0

  // Generate placeholder gradient based on make
  const getGradient = (make: string) => {
    const gradients: any = {
      'Mercedes-Benz': 'from-slate-700 to-slate-900',
      'BMW': 'from-blue-700 to-blue-900',
      'Audi': 'from-gray-700 to-gray-900',
      'Porsche': 'from-red-700 to-red-900',
      'Range Rover': 'from-green-700 to-green-900',
      'Volkswagen': 'from-blue-600 to-blue-800',
      'Hyundai': 'from-sky-600 to-sky-800',
      'Kia': 'from-orange-600 to-orange-800',
    }
    return gradients[make] || 'from-zinc-600 to-zinc-800'
  }

  // Get vehicle image URL
  const vehicleImageUrl = getVehicleImage(vehicle.make, vehicle.model)

  return (
    <div className="luxury-card overflow-hidden group">
      {/* Vehicle Image */}
      <div className={`relative h-40 overflow-hidden ${imageError ? `bg-gradient-to-br ${getGradient(vehicle.make)}` : 'bg-gray-100'}`}>
        {!imageError ? (
          <img
            src={vehicleImageUrl}
            alt={`${vehicle.make} ${vehicle.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Car size={48} className="text-white/30" />
          </div>
        )}

        {/* Status Badge */}
        <div className={`absolute top-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold ${status.bg} ${status.color}`}>
          {status.label}
        </div>

        {/* Location Badge */}
        <div className={`absolute top-3 right-3 px-2 py-1 rounded-lg text-[10px] font-medium backdrop-blur-sm
          ${isDarkMode ? 'bg-black/50 text-white' : 'bg-white/80 text-gray-900'}
        `}>
          {vehicle.location === 'Showroom' ? <Store size={10} className="inline mr-1" /> : <Warehouse size={10} className="inline mr-1" />}
          {vehicle.location}
        </div>

        {/* Aging indicator */}
        {vehicle.daysInStock > 30 && (
          <div className={`absolute bottom-3 left-3 px-2 py-1 rounded-lg text-[10px] font-bold
            ${vehicle.daysInStock > 90 ? 'bg-red-500/90 text-white' :
              vehicle.daysInStock > 60 ? 'bg-amber-500/90 text-white' : 'bg-blue-500/90 text-white'}
          `}>
            <Clock size={10} className="inline mr-1" />
            {vehicle.daysInStock} days
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {vehicle.year} {vehicle.make}
            </h3>
            <p className={`text-lg font-serif font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
              {vehicle.model}
            </p>
          </div>
          <div className={`w-4 h-4 rounded-full border-2 ${isDarkMode ? 'border-white/20' : 'border-gray-200'}`}
            style={{ backgroundColor: vehicle.color?.toLowerCase() || '#888' }}
            title={vehicle.color}
          />
        </div>

        <div className={`text-[10px] font-mono mb-3 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          VIN: {vehicle.vin?.slice(-8) || 'N/A'}
        </div>

        {/* Price Section */}
        <div className={`p-3 rounded-xl mb-3 ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
          <div className="flex items-center justify-between">
            <div>
              <div className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Selling Price</div>
              <div className={`text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                ₹{(vehicle.price / 100000).toFixed(1)}L
              </div>
            </div>
            <div className="text-right">
              <div className={`text-[10px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Margin</div>
              <div className="flex items-center gap-1 text-emerald-500">
                <TrendingUp size={12} />
                <span className="text-sm font-bold">{profitMargin}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <Car size={12} />
            {vehicle.category}
          </div>
          <div className={`flex items-center gap-1.5 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <IndianRupee size={12} />
            Cost: ₹{(vehicle.costPrice / 100000).toFixed(1)}L
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(vehicle)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
              ${isDarkMode
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                : 'bg-[#003366]/10 text-[#003366] hover:bg-[#003366]/20'}
            `}
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onMove(vehicle)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
              ${isDarkMode ? 'border border-white/10 hover:bg-white/5' : 'border border-gray-200 hover:bg-gray-50'}
            `}
          >
            <ArrowRightLeft size={12} /> Move
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STAT CARD
// ============================================================================
const StatCard = ({ label, value, icon: Icon, isDarkMode }: any) => (
  <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
      <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
    </div>
    <div className={`text-2xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>{value}</div>
  </div>
)

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function VehicleInventoryPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [status, setStatus] = React.useState("all")
  const [location, setLocation] = React.useState("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Vehicle | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [viewMode, setViewMode] = React.useState<'cards' | 'table'>('cards')

  React.useEffect(() => { setMounted(true) }, [])

  React.useEffect(() => {
    let ignore = false
    async function load() {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (query.trim()) params.set("q", query.trim())
        if (category !== "all") params.set("category", category)
        if (status !== "all") params.set("status", status)
        if (location !== "all") params.set("location", location)
        const res = await fetch(`/api/vehicles?${params.toString()}`)
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load vehicles")
        if (!ignore) setVehicles(json.data || [])
      } catch (e: any) {
        if (!ignore) setError(e.message || "Error loading vehicles")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    if (mounted) load()
    return () => { ignore = true }
  }, [query, category, status, location, mounted])

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const body = {
      vin: String(formData.get("vin") || ""),
      make: String(formData.get("make") || ""),
      model: String(formData.get("model") || ""),
      year: Number(formData.get("year") || 2024),
      category: String(formData.get("category") || "SUV"),
      color: String(formData.get("color") || "-"),
      price: Number(formData.get("price") || 0),
      stock: Number(formData.get("stock") || 0),
      reorderPoint: Number(formData.get("reorderPoint") || 0),
      status: String(formData.get("status") || "in_stock"),
      location: String(formData.get("location") || "Stockyard"),
      costPrice: Number(formData.get("costPrice") || 0),
    }

    try {
      setError(null)
      if (editing) {
        const res = await fetch(`/api/vehicles/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to update vehicle")
        setVehicles(prev => prev.map(v => v.id === editing.id ? { ...v, ...body } as any : v))
        toast.success("Vehicle updated")
      } else {
        const res = await fetch("/api/vehicles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || "Failed to create vehicle")
        setVehicles([json.data, ...vehicles])
        toast.success("Vehicle created")
      }
      setEditing(null)
      setDialogOpen(false)
    } catch (e: any) {
      setError(e.message || "Save failed")
      toast.error(e.message || "Save failed")
    }
  }

  async function handleMoveStock(vehicle: Vehicle) {
    const newLocation = vehicle.location === "Stockyard" ? "Showroom" : "Stockyard"
    setVehicles(prev => prev.map(v => v.id === vehicle.id ? { ...v, location: newLocation } : v))
    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: newLocation }),
      })
      if (!res.ok) throw new Error("Failed to move stock")
      toast.success(`Moved to ${newLocation}`)
    } catch {
      toast.error("Failed to move stock")
    }
  }

  // Stats
  const totalVehicles = vehicles.length
  const inStock = vehicles.filter(v => v.status === 'in_stock' || v.status === 'in-stock').length
  const totalValue = vehicles.reduce((a, b) => a + b.price, 0)
  const avgDays = vehicles.length > 0 ? Math.round(vehicles.reduce((a, b) => a + (b.daysInStock || 0), 0) / vehicles.length) : 0

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Car size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">Inventory</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Vehicle Inventory
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className={`p-2.5 rounded-xl border text-xs ${isDarkMode ? 'border-white/10 hover:bg-white/5' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <Eye size={16} />
            </button>
            <button
              onClick={() => { setEditing(null); setDialogOpen(true) }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all
                ${isDarkMode
                  ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                  : 'bg-[#003366] text-white hover:bg-[#004488]'}
              `}
            >
              <Plus size={14} /> Add Vehicle
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Vehicles" value={totalVehicles} icon={Car} isDarkMode={isDarkMode} />
          <StatCard label="In Stock" value={inStock} icon={Check} isDarkMode={isDarkMode} />
          <StatCard label="Total Value" value={`₹${(totalValue / 10000000).toFixed(1)}Cr`} icon={IndianRupee} isDarkMode={isDarkMode} />
          <StatCard label="Avg. Days" value={avgDays} icon={Clock} isDarkMode={isDarkMode} />
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-white border border-gray-100'}`}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search vehicles..."
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none
                ${isDarkMode
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:border-[#D4AF37]/50'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 focus:border-[#003366]/50'}
              `}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          {[
            { value: category, setter: setCategory, options: ['all', 'SUV', 'Sedan', 'Hatchback', 'Luxury'], label: 'Category' },
            { value: location, setter: setLocation, options: ['all', 'Showroom', 'Stockyard'], label: 'Location' },
            { value: status, setter: setStatus, options: ['all', 'in_stock', 'reserved', 'sold'], label: 'Status' },
          ].map((filter) => (
            <select
              key={filter.label}
              value={filter.value}
              onChange={(e) => filter.setter(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm outline-none cursor-pointer
                ${isDarkMode
                  ? 'bg-white/5 border border-white/10 text-white'
                  : 'bg-gray-50 border border-gray-200 text-gray-900'}
              `}
            >
              {filter.options.map(opt => (
                <option key={opt} value={opt} className={isDarkMode ? 'bg-gray-900' : 'bg-white'}>
                  {opt === 'all' ? `All ${filter.label}` : opt.replace('_', ' ')}
                </option>
              ))}
            </select>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 text-red-500 p-4 rounded-xl flex items-center gap-2">
            <AlertTriangle size={16} />
            {error}
          </div>
        )}

        {/* Vehicle Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-[#D4AF37]' : 'border-[#003366]'}`} />
          </div>
        ) : vehicles.length === 0 ? (
          <div className={`text-center py-20 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Car size={48} className="mx-auto mb-4 opacity-30" />
            <p>No vehicles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {vehicles.map((vehicle) => (
              <VehicleCard
                key={vehicle.id}
                vehicle={vehicle}
                isDarkMode={isDarkMode}
                onEdit={(v: Vehicle) => { setEditing(v); setDialogOpen(true) }}
                onMove={handleMoveStock}
              />
            ))}
          </div>
        )}

        {/* Dialog */}
        {dialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className={`w-full max-w-2xl rounded-2xl p-6 ${isDarkMode ? 'bg-[#0a0a0a] border border-white/10' : 'bg-white border border-gray-200'}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
                  {editing ? 'Edit Vehicle' : 'Add New Vehicle'}
                </h2>
                <button onClick={() => setDialogOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={onSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'vin', label: 'VIN', type: 'text', value: editing?.vin },
                    { name: 'make', label: 'Make', type: 'text', value: editing?.make },
                    { name: 'model', label: 'Model', type: 'text', value: editing?.model },
                    { name: 'year', label: 'Year', type: 'number', value: editing?.year || 2024 },
                    { name: 'color', label: 'Color', type: 'text', value: editing?.color },
                    { name: 'price', label: 'Selling Price', type: 'number', value: editing?.price },
                    { name: 'costPrice', label: 'Cost Price', type: 'number', value: editing?.costPrice },
                    { name: 'stock', label: 'Stock', type: 'number', value: editing?.stock || 1 },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className={`text-xs font-medium mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        type={field.type}
                        defaultValue={field.value}
                        required={['vin', 'make', 'model', 'price'].includes(field.name)}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none
                          ${isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white focus:border-[#D4AF37]/50'
                            : 'bg-gray-50 border border-gray-200 text-gray-900 focus:border-[#003366]/50'}
                        `}
                      />
                    </div>
                  ))}

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Category</label>
                    <select
                      name="category"
                      defaultValue={editing?.category || 'SUV'}
                      className={`w-full px-3 py-2 rounded-lg text-sm outline-none
                        ${isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}
                      `}
                    >
                      <option value="SUV" className={isDarkMode ? 'bg-gray-900' : ''}>SUV</option>
                      <option value="Sedan" className={isDarkMode ? 'bg-gray-900' : ''}>Sedan</option>
                      <option value="Hatchback" className={isDarkMode ? 'bg-gray-900' : ''}>Hatchback</option>
                      <option value="Luxury" className={isDarkMode ? 'bg-gray-900' : ''}>Luxury</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</label>
                    <select
                      name="location"
                      defaultValue={editing?.location || 'Stockyard'}
                      className={`w-full px-3 py-2 rounded-lg text-sm outline-none
                        ${isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}
                      `}
                    >
                      <option value="Stockyard" className={isDarkMode ? 'bg-gray-900' : ''}>Stockyard</option>
                      <option value="Showroom" className={isDarkMode ? 'bg-gray-900' : ''}>Showroom</option>
                    </select>
                  </div>

                  <div>
                    <label className={`text-xs font-medium mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Status</label>
                    <select
                      name="status"
                      defaultValue={editing?.status || 'in_stock'}
                      className={`w-full px-3 py-2 rounded-lg text-sm outline-none
                        ${isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}
                      `}
                    >
                      <option value="in_stock" className={isDarkMode ? 'bg-gray-900' : ''}>In Stock</option>
                      <option value="reserved" className={isDarkMode ? 'bg-gray-900' : ''}>Reserved</option>
                      <option value="sold" className={isDarkMode ? 'bg-gray-900' : ''}>Sold</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${isDarkMode ? 'border border-white/10 hover:bg-white/5' : 'border border-gray-200 hover:bg-gray-50'}
                    `}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${isDarkMode
                        ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                        : 'bg-[#003366] text-white hover:bg-[#004488]'}
                    `}
                  >
                    {editing ? 'Update Vehicle' : 'Add Vehicle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}