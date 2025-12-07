"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  PackagePlus,
  Wrench,
  Search,
  Pencil,
  Trash2,
  AlertTriangle,
  Package,
  MapPin,
  IndianRupee,
  X,
  Check,
  TrendingUp,
  Truck,
  AlertCircle
} from "lucide-react"
import { toast } from "sonner"

type Part = {
  id: number
  sku: string
  name: string
  category: string
  stock: number
  reorderPoint: number
  location: string
  costPrice: number
  sellingPrice: number
  supplier: string
}

// ============================================================================
// PART CARD
// ============================================================================
const PartCard = ({ part, isDarkMode, onEdit, onDelete }: any) => {
  const isLowStock = part.stock <= part.reorderPoint
  const margin = part.costPrice > 0 ? (((part.sellingPrice - part.costPrice) / part.costPrice) * 100).toFixed(0) : 0

  // Category colors
  const getCategoryColor = (cat: string) => {
    const colors: any = {
      'Lubricants': 'bg-amber-500',
      'Filters': 'bg-blue-500',
      'Brakes': 'bg-red-500',
      'Electrical': 'bg-yellow-500',
      'Accessories': 'bg-purple-500',
      'Engine': 'bg-green-500',
      'Tyres': 'bg-gray-500',
    }
    return colors[cat] || 'bg-gray-500'
  }

  return (
    <div className={`luxury-card overflow-hidden group relative ${isLowStock ? 'ring-1 ring-red-500/30' : ''}`}>
      {/* Low stock indicator */}
      {isLowStock && (
        <a
          href={`https://www.indiamart.com/search.html?ss=${encodeURIComponent(part.name + ' auto spare part')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-0 left-0 right-0 py-1.5 px-3 bg-red-500/90 hover:bg-red-600 text-white text-[10px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
        >
          <AlertCircle size={10} />
          LOW STOCK - Click to Reorder →
        </a>
      )}

      <div className={`p-4 ${isLowStock ? 'pt-8' : ''}`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${getCategoryColor(part.category)}`} />
            <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              {part.category}
            </span>
          </div>
          <span className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            {part.sku}
          </span>
        </div>

        {/* Name */}
        <h3 className={`font-semibold text-sm mb-3 line-clamp-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {part.name}
        </h3>

        {/* Stock & Price Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Stock</div>
            <div className={`text-lg font-bold ${isLowStock ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {part.stock}
              {!isLowStock && <span className={`text-[10px] font-normal ml-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>units</span>}
            </div>
          </div>
          <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-white/5' : 'bg-gray-50'}`}>
            <div className={`text-[9px] font-mono ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Sell Price</div>
            <div className={`text-lg font-bold ${isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'}`}>
              ₹{part.sellingPrice.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <IndianRupee size={10} /> Cost
            </span>
            <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ₹{part.costPrice.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <TrendingUp size={10} /> Margin
            </span>
            <span className="text-xs font-bold text-emerald-500">+{margin}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <MapPin size={10} /> Location
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {part.location || '-'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>
              <Truck size={10} /> Supplier
            </span>
            <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {part.supplier || '-'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(part)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all
              ${isDarkMode
                ? 'bg-[#D4AF37]/10 text-[#D4AF37] hover:bg-[#D4AF37]/20'
                : 'bg-[#003366]/10 text-[#003366] hover:bg-[#003366]/20'}
            `}
          >
            <Pencil size={12} /> Edit
          </button>
          <button
            onClick={() => onDelete(part.id)}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// STAT CARD
// ============================================================================
const StatCard = ({ label, value, icon: Icon, alert, isDarkMode }: any) => (
  <div className={`p-4 rounded-xl border ${alert ? 'border-red-500/30 bg-red-500/5' : isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-gray-100 bg-gray-50/50'}`}>
    <div className="flex items-center gap-2 mb-1">
      <Icon size={14} className={alert ? 'text-red-500' : isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
      <span className={`text-[10px] font-mono uppercase ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>{label}</span>
    </div>
    <div className={`text-2xl font-serif font-bold ${alert ? 'text-red-500' : isDarkMode ? 'text-white' : 'text-[#003366]'}`}>{value}</div>
  </div>
)

// ============================================================================
// MAIN PAGE
// ============================================================================
export default function SparePartsInventoryPage() {
  const { resolvedTheme } = useTheme()
  const isDarkMode = resolvedTheme === "dark"
  const [mounted, setMounted] = React.useState(false)
  const [parts, setParts] = React.useState<Part[]>([])
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [showLowStock, setShowLowStock] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Part | null>(null)

  React.useEffect(() => { setMounted(true) }, [])

  const fetchParts = React.useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (q) params.set("q", q)
      if (category !== "all") params.set("category", category)
      if (showLowStock) params.set("lowStock", "true")
      const res = await fetch(`/api/inventory/spare-parts?${params.toString()}`)
      const json = await res.json()
      if (json.data) setParts(json.data)
    } catch {
      toast.error("Failed to load spare parts")
    } finally {
      setLoading(false)
    }
  }, [q, category, showLowStock])

  React.useEffect(() => {
    if (mounted) fetchParts()
  }, [fetchParts, mounted])

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const body = {
      sku: fd.get("sku"),
      name: fd.get("name"),
      category: fd.get("category"),
      stock: Number(fd.get("stock")),
      reorderPoint: Number(fd.get("reorderPoint")),
      location: fd.get("location"),
      costPrice: Number(fd.get("costPrice")),
      sellingPrice: Number(fd.get("sellingPrice")),
      supplier: fd.get("supplier"),
    }

    try {
      if (editing) {
        const res = await fetch(`/api/inventory/spare-parts/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to update")
        toast.success("Part updated")
      } else {
        const res = await fetch("/api/inventory/spare-parts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) throw new Error("Failed to create")
        toast.success("Part created")
      }
      setDialogOpen(false)
      setEditing(null)
      fetchParts()
    } catch (error: any) {
      toast.error(error.message || "Operation failed")
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this part?")) return
    try {
      await fetch(`/api/inventory/spare-parts/${id}`, { method: "DELETE" })
      toast.success("Part deleted")
      fetchParts()
    } catch {
      toast.error("Failed to delete")
    }
  }

  // Stats
  const totalParts = parts.length
  const totalStock = parts.reduce((a, b) => a + b.stock, 0)
  const lowStockCount = parts.filter(p => p.stock <= p.reorderPoint).length
  const totalValue = parts.reduce((a, b) => a + (b.stock * b.costPrice), 0)

  // Categories
  const categories = Array.from(new Set(parts.map(p => p.category))).sort()

  if (!mounted) return null

  return (
    <div className={`min-h-screen p-4 sm:p-6 lg:p-8 ${isDarkMode ? 'gradient-mesh-dark text-white' : 'gradient-mesh-light text-gray-900'}`}>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wrench size={20} className={isDarkMode ? 'text-[#D4AF37]' : 'text-[#003366]'} />
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] opacity-50">Inventory</span>
            </div>
            <h1 className={`text-2xl sm:text-3xl font-serif font-bold ${isDarkMode ? 'text-white' : 'text-[#003366]'}`}>
              Spare Parts
            </h1>
          </div>

          <button
            onClick={() => { setEditing(null); setDialogOpen(true) }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium transition-all
              ${isDarkMode
                ? 'bg-[#D4AF37] text-black hover:bg-[#E5C158]'
                : 'bg-[#003366] text-white hover:bg-[#004488]'}
            `}
          >
            <PackagePlus size={14} /> Add Part
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Items" value={totalParts} icon={Package} isDarkMode={isDarkMode} />
          <StatCard label="Total Stock" value={totalStock} icon={Check} isDarkMode={isDarkMode} />
          <StatCard label="Low Stock" value={lowStockCount} icon={AlertTriangle} alert={lowStockCount > 0} isDarkMode={isDarkMode} />
          <StatCard label="Inventory Value" value={`₹${(totalValue / 100000).toFixed(1)}L`} icon={IndianRupee} isDarkMode={isDarkMode} />
        </div>

        {/* Filters */}
        <div className={`flex flex-wrap gap-3 p-4 rounded-xl ${isDarkMode ? 'bg-white/[0.02] border border-white/5' : 'bg-white border border-gray-100'}`}>
          <div className="relative flex-1 min-w-[200px]">
            <Search className={`absolute left-3 top-2.5 h-4 w-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder="Search parts..."
              className={`w-full pl-9 pr-4 py-2 rounded-lg text-sm outline-none
                ${isDarkMode
                  ? 'bg-white/5 border border-white/10 text-white placeholder-gray-500'
                  : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'}
              `}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`px-3 py-2 rounded-lg text-sm outline-none
              ${isDarkMode ? 'bg-white/5 border border-white/10 text-white' : 'bg-gray-50 border border-gray-200 text-gray-900'}
            `}
          >
            <option value="all" className={isDarkMode ? 'bg-gray-900' : ''}>All Categories</option>
            {categories.map(c => (
              <option key={c} value={c} className={isDarkMode ? 'bg-gray-900' : ''}>{c}</option>
            ))}
          </select>

          <button
            onClick={() => setShowLowStock(!showLowStock)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium transition-all
              ${showLowStock
                ? 'bg-red-500 text-white'
                : isDarkMode ? 'border border-white/10 hover:bg-white/5' : 'border border-gray-200 hover:bg-gray-50'}
            `}
          >
            <AlertTriangle size={14} />
            {showLowStock ? 'Showing Low Stock' : 'Show Low Stock'}
          </button>
        </div>

        {/* Parts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className={`w-8 h-8 border-2 border-t-transparent rounded-full animate-spin ${isDarkMode ? 'border-[#D4AF37]' : 'border-[#003366]'}`} />
          </div>
        ) : parts.length === 0 ? (
          <div className={`text-center py-20 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            <Package size={48} className="mx-auto mb-4 opacity-30" />
            <p>No parts found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {parts.map((part) => (
              <PartCard
                key={part.id}
                part={part}
                isDarkMode={isDarkMode}
                onEdit={(p: Part) => { setEditing(p); setDialogOpen(true) }}
                onDelete={handleDelete}
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
                  {editing ? 'Edit Part' : 'Add New Part'}
                </h2>
                <button onClick={() => setDialogOpen(false)} className="p-2 rounded-lg hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={onSave} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'sku', label: 'SKU', value: editing?.sku },
                    { name: 'name', label: 'Name', value: editing?.name },
                    { name: 'category', label: 'Category', value: editing?.category, placeholder: 'e.g. Engine, Brakes' },
                    { name: 'supplier', label: 'Supplier', value: editing?.supplier },
                    { name: 'location', label: 'Location', value: editing?.location, placeholder: 'e.g. Shelf A-1' },
                    { name: 'stock', label: 'Stock', type: 'number', value: editing?.stock ?? 0 },
                    { name: 'reorderPoint', label: 'Reorder Point', type: 'number', value: editing?.reorderPoint ?? 5 },
                    { name: 'costPrice', label: 'Cost Price (₹)', type: 'number', value: editing?.costPrice ?? 0 },
                    { name: 'sellingPrice', label: 'Selling Price (₹)', type: 'number', value: editing?.sellingPrice ?? 0 },
                  ].map((field) => (
                    <div key={field.name}>
                      <label className={`text-xs font-medium mb-1 block ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {field.label}
                      </label>
                      <input
                        name={field.name}
                        type={field.type || 'text'}
                        defaultValue={field.value}
                        placeholder={field.placeholder}
                        required={['sku', 'name'].includes(field.name)}
                        className={`w-full px-3 py-2 rounded-lg text-sm outline-none
                          ${isDarkMode
                            ? 'bg-white/5 border border-white/10 text-white'
                            : 'bg-gray-50 border border-gray-200 text-gray-900'}
                        `}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setDialogOpen(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${isDarkMode ? 'border border-white/10' : 'border border-gray-200'}`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-sm font-medium
                      ${isDarkMode ? 'bg-[#D4AF37] text-black' : 'bg-[#003366] text-white'}
                    `}
                  >
                    {editing ? 'Update Part' : 'Add Part'}
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