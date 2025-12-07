"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, FileText, Printer, Mail, Share2, AlertTriangle, CheckCircle2, Lock, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { motion, AnimatePresence } from "framer-motion"

// --- Types ---
interface Quotation {
  id: number
  number: string
  customer: string
  vehicle: string
  total: number
  status: string
  createdAt: number
  // New Fields
  model?: string
  variant?: string
  color?: string
  exShowroomPrice?: number
  registrationAmount?: number
  insuranceAmount?: number
  accessoriesAmount?: number
  discountAmount?: number
  approvalStatus?: string
}

// --- Vehicle Models for Builder (50+ Popular Indian Cars) ---
const VEHICLE_MODELS = [
  // Maruti Suzuki
  { id: "swift", name: "Maruti Suzuki Swift", basePrice: 639000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/159099/swift-exterior-right-front-three-quarter.jpeg" },
  { id: "baleno", name: "Maruti Suzuki Baleno", basePrice: 679000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/143401/baleno-exterior-right-front-three-quarter.jpeg" },
  { id: "dzire", name: "Maruti Suzuki Dzire", basePrice: 674000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/160307/dzire-exterior-right-front-three-quarter.jpeg" },
  { id: "brezza", name: "Maruti Suzuki Brezza", basePrice: 849000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/102737/brezza-exterior-right-front-three-quarter-7.jpeg" },
  { id: "grandvitara", name: "Maruti Suzuki Grand Vitara", basePrice: 1099000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/105263/grand-vitara-exterior-right-front-three-quarter.jpeg" },
  { id: "ertiga", name: "Maruti Suzuki Ertiga", basePrice: 879000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/144411/ertiga-exterior-right-front-three-quarter.jpeg" },
  { id: "wagonr", name: "Maruti Suzuki Wagon R", basePrice: 554000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/135591/wagon-r-exterior-right-front-three-quarter-5.jpeg" },
  { id: "fronx", name: "Maruti Suzuki Fronx", basePrice: 769000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/118437/fronx-exterior-right-front-three-quarter.jpeg" },
  { id: "jimny", name: "Maruti Suzuki Jimny", basePrice: 1274000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/112423/jimny-exterior-right-front-three-quarter.jpeg" },
  // Hyundai
  { id: "creta", name: "Hyundai Creta", basePrice: 1100000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106815/creta-exterior-right-front-three-quarter.jpeg" },
  { id: "venue", name: "Hyundai Venue", basePrice: 779000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/141113/venue-exterior-right-front-three-quarter.jpeg" },
  { id: "i20", name: "Hyundai i20", basePrice: 719000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/150543/i20-exterior-right-front-three-quarter.jpeg" },
  { id: "verna", name: "Hyundai Verna", basePrice: 1093000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/119825/verna-exterior-right-front-three-quarter.jpeg" },
  { id: "alcazar", name: "Hyundai Alcazar", basePrice: 1691000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106835/alcazar-exterior-right-front-three-quarter.jpeg" },
  { id: "tucson", name: "Hyundai Tucson", basePrice: 2950000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/97440/tucson-exterior-right-front-three-quarter-25.jpeg" },
  { id: "exter", name: "Hyundai Exter", basePrice: 608000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/118797/exter-exterior-right-front-three-quarter.jpeg" },
  // Tata
  { id: "nexon", name: "Tata Nexon", basePrice: 800000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/132921/nexon-exterior-right-front-three-quarter.jpeg" },
  { id: "punch", name: "Tata Punch", basePrice: 610000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/149660/punch-exterior-right-front-three-quarter.jpeg" },
  { id: "harrier", name: "Tata Harrier", basePrice: 1500000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/138063/harrier-exterior-right-front-three-quarter.jpeg" },
  { id: "safari", name: "Tata Safari", basePrice: 1600000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/138062/safari-exterior-right-front-three-quarter.jpeg" },
  { id: "tiago", name: "Tata Tiago", basePrice: 550000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/137393/tiago-exterior-right-front-three-quarter.jpeg" },
  { id: "altroz", name: "Tata Altroz", basePrice: 670000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/115943/altroz-exterior-right-front-three-quarter.jpeg" },
  { id: "curvv", name: "Tata Curvv", basePrice: 1000000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/159093/curvv-exterior-right-front-three-quarter.jpeg" },
  // Mahindra
  { id: "thar", name: "Mahindra Thar", basePrice: 1100000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/140855/thar-exterior-right-front-three-quarter.jpeg" },
  { id: "xuv700", name: "Mahindra XUV700", basePrice: 1399000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/124919/xuv700-exterior-right-front-three-quarter.jpeg" },
  { id: "scorpion", name: "Mahindra Scorpio N", basePrice: 1385000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/103178/scorpio-n-exterior-right-front-three-quarter-2.jpeg" },
  { id: "xuv3xo", name: "Mahindra XUV 3XO", basePrice: 787000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/132023/xuv-3xo-exterior-right-front-three-quarter.jpeg" },
  { id: "tharroxx", name: "Mahindra Thar Roxx", basePrice: 1299000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/152867/thar-roxx-exterior-right-front-three-quarter.jpeg" },
  // Kia
  { id: "seltos", name: "Kia Seltos", basePrice: 1099000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/144999/seltos-exterior-right-front-three-quarter.jpeg" },
  { id: "sonet", name: "Kia Sonet", basePrice: 799000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/117015/sonet-exterior-right-front-three-quarter-2.jpeg" },
  { id: "carens", name: "Kia Carens", basePrice: 1070000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/106253/carens-exterior-right-front-three-quarter-2.jpeg" },
  { id: "ev6", name: "Kia EV6", basePrice: 6095000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/99217/ev6-exterior-right-front-three-quarter.jpeg" },
  // Toyota
  { id: "fortuner", name: "Toyota Fortuner", basePrice: 3500000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/115025/fortuner-exterior-right-front-three-quarter.jpeg" },
  { id: "innovacrysta", name: "Toyota Innova Crysta", basePrice: 1957000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/51435/innova-crysta-exterior-right-front-three-quarter.jpeg" },
  { id: "innovahycross", name: "Toyota Innova Hycross", basePrice: 1992000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/103867/innova-hycross-exterior-right-front-three-quarter.jpeg" },
  { id: "hyryder", name: "Toyota Urban Cruiser Hyryder", basePrice: 1102000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/102473/urban-cruiser-hyryder-exterior-right-front-three-quarter.jpeg" },
  // Honda
  { id: "city", name: "Honda City", basePrice: 1200000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/134287/city-exterior-right-front-three-quarter.jpeg" },
  { id: "amaze", name: "Honda Amaze", basePrice: 799000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/166653/amaze-exterior-right-front-three-quarter.jpeg" },
  { id: "elevate", name: "Honda Elevate", basePrice: 1110000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/119195/elevate-exterior-right-front-three-quarter.jpeg" },
  // MG
  { id: "hector", name: "MG Hector", basePrice: 1400000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/130583/hector-exterior-right-front-three-quarter.jpeg" },
  { id: "astor", name: "MG Astor", basePrice: 1098000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/94893/astor-exterior-right-front-three-quarter-2.jpeg" },
  { id: "zsev", name: "MG ZS EV", basePrice: 1898000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/126041/zs-ev-exterior-right-front-three-quarter.jpeg" },
  // Volkswagen & Skoda
  { id: "taigun", name: "Volkswagen Taigun", basePrice: 1170000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/144681/taigun-exterior-right-front-three-quarter.jpeg" },
  { id: "virtus", name: "Volkswagen Virtus", basePrice: 1184000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/98573/virtus-exterior-right-front-three-quarter.jpeg" },
  { id: "kushaq", name: "Skoda Kushaq", basePrice: 1134000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/144451/kushaq-exterior-right-front-three-quarter.jpeg" },
  { id: "slavia", name: "Skoda Slavia", basePrice: 1129000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/98609/slavia-exterior-right-front-three-quarter.jpeg" },
  // Renault & Nissan
  { id: "kiger", name: "Renault Kiger", basePrice: 609000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/137671/kiger-exterior-right-front-three-quarter.jpeg" },
  { id: "magnite", name: "Nissan Magnite", basePrice: 600000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/94947/magnite-exterior-right-front-three-quarter.jpeg" },
  // Jeep
  { id: "compass", name: "Jeep Compass", basePrice: 1896000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/133457/compass-exterior-right-front-three-quarter.jpeg" },
  // Citroen
  { id: "c3", name: "Citroen C3", basePrice: 624000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/101669/c3-exterior-right-front-three-quarter-7.jpeg" },
  { id: "basalt", name: "Citroen Basalt", basePrice: 799000, image: "https://imgd.aeplcdn.com/664x374/n/cw/ec/152499/basalt-exterior-right-front-three-quarter.jpeg" },
]

const VARIANTS = [
  { id: "base", name: "Base", priceMod: 0 },
  { id: "mid", name: "Mid", priceMod: 100000 },
  { id: "top", name: "Top", priceMod: 250000 },
  { id: "topplus", name: "Top+", priceMod: 400000 },
]

const COLORS = [
  { id: "white", name: "Pearl White", hex: "#f3f4f6" },
  { id: "grey", name: "Titanium Grey", hex: "#4b5563" },
  { id: "black", name: "Midnight Black", hex: "#1f2937" },
  { id: "red", name: "Flame Red", hex: "#ef4444" },
  { id: "blue", name: "Royal Blue", hex: "#3b82f6" },
  { id: "silver", name: "Silky Silver", hex: "#9ca3af" },
]

const ACCESSORY_BUNDLES = [
  { id: "basic", name: "Basic Kit", description: "Mats, Mudguards, Perfume", price: 4500 },
  { id: "chrome", name: "Chrome Pack", description: "Handles, Garnish, Visors", price: 8000 },
  { id: "protection", name: "Protection Pack", description: "Coating, Cover, Scuff Plates", price: 12000 },
  { id: "tech", name: "Tech Pack", description: "Dashcam, Ambient Light, Puddle Lamps", price: 15000 },
]

export default function QuotationsPage() {
  const router = useRouter()
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [builderOpen, setBuilderOpen] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [emailAddress, setEmailAddress] = useState("")

  // --- Builder State ---
  const [customerName, setCustomerName] = useState("")
  const [selectedModel, setSelectedModel] = useState(VEHICLE_MODELS[0])
  const [selectedVariant, setSelectedVariant] = useState(VARIANTS[0])
  const [selectedColor, setSelectedColor] = useState(COLORS[0])
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([])
  const [insuranceType, setInsuranceType] = useState("1yr")
  const [discount, setDiscount] = useState(0)
  const [isEmiView, setIsEmiView] = useState(false)

  // --- Calculations ---
  const exShowroom = selectedModel.basePrice + selectedVariant.priceMod
  const registration = Math.round(exShowroom * 0.10) // 10% RTO
  const insuranceBase = Math.round(exShowroom * 0.04)
  const insurance = insuranceType === "3yr" ? insuranceBase * 2.5 : insuranceType === "ZeroDep" ? insuranceBase * 1.3 : insuranceBase
  const accessoriesTotal = selectedAccessories.reduce((sum, id) => {
    const bundle = ACCESSORY_BUNDLES.find(b => b.id === id)
    return sum + (bundle ? bundle.price : 0)
  }, 0)

  const totalOnRoad = exShowroom + registration + insurance + accessoriesTotal - discount
  const approvalRequired = discount > 15000

  // EMI Calculation (Standard: 9% interest, 5 years)
  const loanAmount = totalOnRoad * 0.8
  const monthlyInterest = 0.09 / 12
  const months = 60
  const emi = Math.round((loanAmount * monthlyInterest * Math.pow(1 + monthlyInterest, months)) / (Math.pow(1 + monthlyInterest, months) - 1))

  useEffect(() => {
    fetchQuotations()
  }, [])

  async function fetchQuotations() {
    const res = await fetch("/api/sales/quotations")
    const data = await res.json()
    if (data.data) setQuotations(data.data)
  }

  async function createQuotation() {
    const lineItems = [
      { description: `Ex-Showroom Price (${selectedModel.name} ${selectedVariant.name})`, amount: exShowroom },
      { description: "Registration & RTO", amount: registration },
      { description: `Insurance (${insuranceType})`, amount: Math.round(insurance) },
      { description: "Accessories", amount: accessoriesTotal },
      { description: "Discount", amount: -discount },
    ]

    const res = await fetch("/api/sales/quotations", {
      method: "POST",
      body: JSON.stringify({
        customer: customerName,
        vehicle: `${selectedModel.name} ${selectedVariant.name}`,
        lineItems: JSON.stringify(lineItems),
        validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days validity
        // New Fields
        model: selectedModel.id,
        variant: selectedVariant.id,
        color: selectedColor.id,
        exShowroomPrice: exShowroom,
        registrationAmount: registration,
        insuranceAmount: Math.round(insurance),
        insuranceType,
        accessoriesAmount: accessoriesTotal,
        accessoriesData: selectedAccessories,
        discountAmount: discount,
        approvalStatus: approvalRequired ? "Pending" : "Approved"
      })
    })

    if (res.ok) {
      setBuilderOpen(false)
      fetchQuotations()
      toast.success(approvalRequired ? "Quotation created (Pending Approval)" : "Quotation created successfully")
      // Reset
      setCustomerName("")
      setDiscount(0)
      setSelectedAccessories([])
    } else {
      toast.error("Failed to create quotation")
    }
  }

  async function sendEmail() {
    if (!selectedQuotation) return
    const res = await fetch(`/api/sales/quotations/${selectedQuotation.id}/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: emailAddress })
    })
    if (res.ok) {
      toast.success("Email sent successfully")
      setEmailOpen(false)
      fetchQuotations()
    } else {
      toast.error("Failed to send email")
    }
  }

  function handlePrint(quotationId: number) {
    router.push(`/sales/quotations/print?id=${quotationId}`)
  }

  const handleWhatsAppShare = () => {
    const message = `Here is your quotation for ${selectedModel.name} ${selectedVariant.name}. Total On-Road Price: ₹${totalOnRoad.toLocaleString()}. View details: https://autoflow.app/q/123`
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
  }

  return (
    <div className="flex flex-col h-[calc(100vh-1rem)] p-2 space-y-4 overflow-hidden bg-zinc-50/50">
      <div className="flex items-center justify-between shrink-0 px-2">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Quotations</h1>
          <p className="text-sm text-zinc-500">Manage sales proposals and invoices.</p>
        </div>
        <Dialog open={builderOpen} onOpenChange={setBuilderOpen}>
          <DialogTrigger asChild>
            <Button className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-900/20">
              <Plus className="mr-2 h-4 w-4" /> New Quotation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[98vw] w-[98vw] max-h-[90vh] sm:max-w-[98vw] p-0 gap-0 overflow-hidden flex flex-col md:flex-row bg-white border-zinc-200 sm:rounded-xl shadow-2xl">

            {/* LEFT PANEL: BUILDER */}
            <div className="flex-[3] p-6 md:p-8 overflow-y-auto border-r border-zinc-100 bg-white relative max-h-[90vh]">
              <div className="max-w-5xl mx-auto space-y-6 flex flex-col">
                <div className="flex items-center justify-between shrink-0">
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Configure Vehicle</h2>
                    <p className="text-base text-zinc-500 mt-1">Select model, variant, and options to build the perfect car.</p>
                  </div>
                  <div className="flex items-center gap-2 bg-zinc-50 px-4 py-2 rounded-full border border-zinc-100">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-sm font-medium text-zinc-600">Live Deal Desk</span>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Main Config Column */}
                  <div className="lg:col-span-8 space-y-8">
                    {/* Dynamic Image with Animation - HERO */}
                    <div className="relative aspect-[16/9] bg-gradient-to-b from-zinc-50 to-zinc-100 rounded-3xl border border-zinc-100 flex items-center justify-center overflow-hidden group shadow-inner">
                      <motion.img
                        key={selectedModel.id + selectedColor.id}
                        initial={{ opacity: 0, scale: 0.9, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 80, damping: 20 }}
                        src={selectedModel.image}
                        alt={selectedModel.name}
                        className="object-contain w-[95%] h-[95%] mix-blend-multiply z-10 drop-shadow-2xl"
                      />
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Color Selector Overlay */}
                      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/90 p-3 rounded-full backdrop-blur-md shadow-xl border border-zinc-100 z-20">
                        {COLORS.map(c => (
                          <motion.button
                            key={c.id}
                            whileHover={{ scale: 1.2 }}
                            whileTap={{ scale: 0.9 }}
                            className={`w-10 h-10 rounded-full border-2 transition-all shadow-sm ${selectedColor.id === c.id ? 'border-zinc-900 ring-2 ring-zinc-900/20' : 'border-transparent'}`}
                            style={{ backgroundColor: c.hex }}
                            onClick={() => setSelectedColor(c)}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Accessories Grid */}
                    <div className="space-y-4">
                      <Label className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Smart Accessory Bundles</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {ACCESSORY_BUNDLES.map(bundle => (
                          <motion.div
                            key={bundle.id}
                            whileHover={{ scale: 1.01, backgroundColor: "#f4f4f5" }}
                            whileTap={{ scale: 0.99 }}
                            className={`flex items-start space-x-4 border p-5 rounded-2xl cursor-pointer transition-all ${selectedAccessories.includes(bundle.id)
                              ? 'border-zinc-900 bg-zinc-50 shadow-md'
                              : 'border-zinc-100 bg-white hover:border-zinc-300'
                              }`}
                            onClick={() => {
                              if (selectedAccessories.includes(bundle.id)) {
                                setSelectedAccessories(selectedAccessories.filter(id => id !== bundle.id))
                              } else {
                                setSelectedAccessories([...selectedAccessories, bundle.id])
                              }
                            }}
                          >
                            <Checkbox
                              id={bundle.id}
                              checked={selectedAccessories.includes(bundle.id)}
                              className="mt-1 w-5 h-5 border-2"
                            />
                            <div className="flex-1">
                              <label htmlFor={bundle.id} className="text-base font-bold text-zinc-900 cursor-pointer block">
                                {bundle.name}
                              </label>
                              <p className="text-sm text-zinc-500 mt-1">{bundle.description}</p>
                            </div>
                            <span className="text-base font-bold text-zinc-900">₹{bundle.price.toLocaleString()}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Config Column */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Customer Name</Label>
                      <Input
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Enter name"
                        className="h-14 text-lg bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/20 transition-all rounded-xl"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Model</Label>
                      <Select value={selectedModel.id} onValueChange={val => setSelectedModel(VEHICLE_MODELS.find(m => m.id === val) || VEHICLE_MODELS[0])}>
                        <SelectTrigger className="h-14 bg-zinc-50 border-zinc-200 rounded-xl text-lg font-medium"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {VEHICLE_MODELS.map(m => <SelectItem key={m.id} value={m.id} className="text-base py-3">{m.name}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Variant</Label>
                      <Select value={selectedVariant.id} onValueChange={val => setSelectedVariant(VARIANTS.find(v => v.id === val) || VARIANTS[0])}>
                        <SelectTrigger className="h-14 bg-zinc-50 border-zinc-200 rounded-xl text-lg font-medium"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {VARIANTS.map(v => <SelectItem key={v.id} value={v.id} className="text-base py-3">{v.name} (+₹{(v.priceMod / 100000).toFixed(1)}L)</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Discount Slider */}
                    <div className="space-y-4 pt-6 border-t border-zinc-100">
                      <div className="flex justify-between items-center">
                        <Label className="text-zinc-500 uppercase text-xs font-bold tracking-wider">Discount / Offer</Label>
                        <motion.span
                          key={discount}
                          initial={{ scale: 1.2, color: "#10b981" }}
                          animate={{ scale: 1, color: approvalRequired ? "#d97706" : "#18181b" }}
                          className="text-xl font-bold"
                        >
                          ₹{discount.toLocaleString()}
                        </motion.span>
                      </div>
                      <Slider
                        value={[discount]}
                        onValueChange={vals => setDiscount(vals[0])}
                        max={50000}
                        step={1000}
                        className="py-4"
                      />
                      <AnimatePresence>
                        {approvalRequired && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-3 text-sm text-amber-700 bg-amber-50 p-4 rounded-xl border border-amber-200"
                          >
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <span className="font-medium leading-tight">Manager approval required for discounts above ₹15,000</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL: PROPOSAL */}
            <div className="flex-1 min-w-[350px] md:min-w-[450px] max-w-[500px] bg-zinc-50/80 backdrop-blur-xl flex flex-col border-l border-zinc-200 shadow-2xl z-30 relative max-h-[90vh]">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 z-10"
                onClick={() => setBuilderOpen(false)}
              >
                <X className="h-6 w-6" />
              </Button>

              {/* Scrollable content area */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 mt-8">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Proposal Summary</h2>
                  <p className="text-sm text-zinc-500 mt-1">Real-time on-road price calculation.</p>
                </div>

                <div className="bg-white rounded-3xl border border-zinc-200 shadow-lg overflow-hidden">
                  <div className="p-8 space-y-5">
                    <div className="flex justify-between text-base group">
                      <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Ex-Showroom</span>
                      <span className="font-semibold">₹{exShowroom.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base group">
                      <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Registration (RTO)</span>
                      <span className="font-semibold">₹{registration.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base items-center group">
                      <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Insurance</span>
                      <Select value={insuranceType} onValueChange={setInsuranceType}>
                        <SelectTrigger className="h-8 w-[100px] text-xs px-2 border-zinc-200 rounded-lg"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1yr">1 Year</SelectItem>
                          <SelectItem value="3yr">3 Years</SelectItem>
                          <SelectItem value="ZeroDep">Zero Dep</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between text-sm pl-4 text-zinc-400 border-l-2 border-zinc-100 ml-1">
                      <span>Premium Amount</span>
                      <span>₹{Math.round(insurance).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base group">
                      <span className="text-zinc-500 group-hover:text-zinc-900 transition-colors">Accessories</span>
                      <span className="font-semibold">₹{accessoriesTotal.toLocaleString()}</span>
                    </div>
                    <AnimatePresence>
                      {discount > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between text-base text-emerald-600 font-bold bg-emerald-50 p-3 rounded-xl"
                        >
                          <span>Discount Applied</span>
                          <span>- ₹{discount.toLocaleString()}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="bg-zinc-900 p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-zinc-800 rounded-full blur-3xl -mr-20 -mt-20 opacity-50" />
                    <div className="relative z-10 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-zinc-400 uppercase tracking-wider font-bold mb-2">Total On-Road</p>
                        <motion.p
                          key={totalOnRoad}
                          initial={{ scale: 0.9, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="text-4xl font-bold tracking-tight"
                        >
                          ₹{totalOnRoad.toLocaleString()}
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Affordability Toggle */}
                <div className="bg-white p-8 rounded-3xl border border-zinc-200 space-y-6 shadow-lg">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-bold uppercase tracking-wider text-zinc-500">Affordability View</Label>
                    <div className="flex items-center gap-2 bg-zinc-100 p-1.5 rounded-full">
                      <button
                        onClick={() => setIsEmiView(false)}
                        className={`text-xs px-4 py-2 rounded-full transition-all ${!isEmiView ? 'bg-white shadow-sm font-bold text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                      >
                        Cash
                      </button>
                      <button
                        onClick={() => setIsEmiView(true)}
                        className={`text-xs px-4 py-2 rounded-full transition-all ${isEmiView ? 'bg-white shadow-sm font-bold text-zinc-900' : 'text-zinc-500 hover:text-zinc-900'}`}
                      >
                        EMI
                      </button>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    {isEmiView ? (
                      <motion.div
                        key="emi"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-2 text-center"
                      >
                        <p className="text-base text-zinc-500 mb-2">Drive home today for just</p>
                        <p className="text-5xl font-bold text-emerald-600 tracking-tight">₹{emi.toLocaleString()}<span className="text-xl text-zinc-400 font-normal">/mo</span></p>
                        <p className="text-xs text-zinc-400 mt-4 bg-zinc-50 inline-block px-4 py-2 rounded-full font-medium">
                          *20% Down Payment • 9% Interest • 5 Years
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="cash"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="pt-2 text-center"
                      >
                        <p className="text-base text-zinc-500 mb-2">One-time payment of</p>
                        <p className="text-4xl font-bold text-zinc-900 tracking-tight">₹{totalOnRoad.toLocaleString()}</p>
                        <p className="text-xs text-zinc-400 mt-4">Includes all taxes & fees</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Fixed button footer */}
              <div className="shrink-0 p-6 border-t border-zinc-200 bg-zinc-50/95 backdrop-blur-sm space-y-3">
                <Button className="w-full h-12 text-base font-bold bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl shadow-zinc-900/10 transition-all hover:scale-[1.01] rounded-xl" onClick={createQuotation}>
                  {approvalRequired ? <Lock className="mr-2 h-5 w-5" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                  {approvalRequired ? "Submit for Approval" : "Create Quotation"}
                </Button>
                <Button variant="outline" className="w-full h-10 text-sm font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900 rounded-xl" onClick={handleWhatsAppShare}>
                  <Share2 className="mr-2 h-4 w-4" /> Share on WhatsApp
                </Button>
              </div>
            </div>

          </DialogContent>
        </Dialog>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotations.map(quotation => (
            <QuotationCard
              key={quotation.id}
              quotation={quotation}
              onSendEmail={() => {
                setSelectedQuotation(quotation)
                setEmailOpen(true)
              }}
              onPrint={() => handlePrint(quotation.id)}
            />
          ))}
        </div>
      </div>

      {/* Email Dialog */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quotation via Email</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Recipient Email</Label>
              <Input value={emailAddress} onChange={e => setEmailAddress(e.target.value)} placeholder="customer@example.com" />
            </div>
            <Button className="w-full" onClick={sendEmail}>
              <Mail className="mr-2 h-4 w-4" /> Send Email
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function QuotationCard({ quotation, onSendEmail, onPrint }: { quotation: Quotation, onSendEmail: () => void, onPrint: () => void }) {
  const isPending = quotation.approvalStatus === "Pending"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-zinc-200 p-5 hover:border-zinc-300 hover:shadow-lg transition-all group"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-base text-zinc-900">{quotation.customer}</h4>
            {isPending && (
              <Badge variant="outline" className="text-[10px] bg-amber-50 text-amber-700 border-amber-200">Pending</Badge>
            )}
          </div>
          <div className="text-xs text-zinc-500 mt-1 font-medium">{quotation.vehicle}</div>
        </div>
        <Badge variant="secondary" className="text-[10px] font-mono bg-zinc-100 text-zinc-600">{quotation.number}</Badge>
      </div>

      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Total Value</div>
          <div className="text-xl font-bold text-zinc-900">₹{quotation.total.toLocaleString()}</div>
        </div>
        <div className={`text-xs px-2.5 py-1 rounded-full font-bold ${quotation.status === "Accepted" ? "bg-emerald-100 text-emerald-700" :
          quotation.status === "Sent" ? "bg-blue-100 text-blue-700" :
            "bg-zinc-100 text-zinc-700"
          }`}>
          {quotation.status}
        </div>
      </div>

      <div className="flex gap-3 mt-auto pt-4 border-t border-zinc-50">
        <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900" onClick={onPrint}>
          <Printer className="mr-2 h-3.5 w-3.5" /> Print
        </Button>
        <Button size="sm" variant="outline" className="flex-1 h-9 text-xs font-medium border-zinc-200 hover:bg-zinc-50 hover:text-zinc-900" onClick={onSendEmail}>
          <Mail className="mr-2 h-3.5 w-3.5" /> Email
        </Button>
      </div>
    </motion.div>
  )
}