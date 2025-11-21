"use client"

import * as React from "react"
import { Plus, Pencil, Search, AlertTriangle, Filter, Store, Warehouse, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

// Mock vehicle type
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
  status: "in_stock" | "reserved" | "sold"
  location: "Stockyard" | "Showroom"
  daysInStock: number
  costPrice: number
}

export default function VehicleInventoryPage() {
  const [vehicles, setVehicles] = React.useState<Vehicle[]>([])
  const [query, setQuery] = React.useState("")
  const [category, setCategory] = React.useState<string>("all")
  const [status, setStatus] = React.useState<string>("all")
  const [location, setLocation] = React.useState<string>("all")
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Vehicle | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

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
        const res = await fetch(`/api/vehicles?${params.toString()}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("bearer_token") || ""}`,
          },
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json?.error || "Failed to load vehicles")
        if (!ignore) setVehicles(json.data || [])
      } catch (e: any) {
        if (!ignore) setError(e.message || "Error loading vehicles")
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => { ignore = true }
  }, [query, category, status, location])

  function onSave(formData: FormData) {
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
      status: String(formData.get("status") || "in_stock") as Vehicle["status"],
      location: String(formData.get("location") || "Stockyard") as Vehicle["location"],
      costPrice: Number(formData.get("costPrice") || 0),
    }

    const token = localStorage.getItem("bearer_token") || ""

    const run = async () => {
      try {
        setError(null)
        if (editing) {
          // optimistic update
          const prev = vehicles
          const optimistic = prev.map((p) => (p.id === editing.id ? { ...p, ...body } as any : p))
          setVehicles(optimistic)
          const res = await fetch(`/api/vehicles/${editing.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify(body),
          })
          if (!res.ok) {
            setVehicles(prev) // revert
            const j = await res.json().catch(() => ({}))
            throw new Error(j.error || "Failed to update vehicle")
          }
          toast.success("Vehicle updated")
        } else {
          const res = await fetch("/api/vehicles", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
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
    run()
  }

  async function handleMoveStock(vehicle: Vehicle) {
    const newLocation = vehicle.location === "Stockyard" ? "Showroom" : "Stockyard"
    const token = localStorage.getItem("bearer_token") || ""

    // Optimistic
    const prev = vehicles
    setVehicles(prev.map(v => v.id === vehicle.id ? { ...v, location: newLocation } : v))

    try {
      const res = await fetch(`/api/vehicles/${vehicle.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ location: newLocation }),
      })
      if (!res.ok) throw new Error("Failed to move stock")
      toast.success(`Moved to ${newLocation}`)
    } catch (error) {
      setVehicles(prev)
      toast.error("Failed to move stock")
    }
  }

  return (
    <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Vehicle List</h1>
          <p className="text-zinc-500 mt-1">Manage detailed inventory records.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)} className="bg-zinc-900 text-white hover:bg-zinc-800">
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
            </DialogHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                onSave(new FormData(e.currentTarget))
              }}
              className="grid gap-4 py-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>VIN</Label>
                  <Input name="vin" defaultValue={editing?.vin} required />
                </div>
                <div className="space-y-2">
                  <Label>Make</Label>
                  <Input name="make" defaultValue={editing?.make} required />
                </div>
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Input name="model" defaultValue={editing?.model} required />
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input name="year" type="number" defaultValue={editing?.year || 2024} required />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select name="category" defaultValue={editing?.category || "SUV"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUV">SUV</SelectItem>
                      <SelectItem value="Sedan">Sedan</SelectItem>
                      <SelectItem value="Hatchback">Hatchback</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Color</Label>
                  <Input name="color" defaultValue={editing?.color} />
                </div>
                <div className="space-y-2">
                  <Label>Selling Price</Label>
                  <Input name="price" type="number" defaultValue={editing?.price} required />
                </div>
                <div className="space-y-2">
                  <Label>Cost Price</Label>
                  <Input name="costPrice" type="number" defaultValue={editing?.costPrice} required />
                </div>
                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input name="stock" type="number" defaultValue={editing?.stock || 1} required />
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Select name="location" defaultValue={editing?.location || "Stockyard"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Stockyard">Stockyard</SelectItem>
                      <SelectItem value="Showroom">Showroom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select name="status" defaultValue={editing?.status || "in_stock"}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_stock">In Stock</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search by VIN, Make, or Model..."
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="SUV">SUV</SelectItem>
            <SelectItem value="Sedan">Sedan</SelectItem>
            <SelectItem value="Hatchback">Hatchback</SelectItem>
          </SelectContent>
        </Select>
        <Select value={location} onValueChange={setLocation}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Stockyard">Stockyard</SelectItem>
            <SelectItem value="Showroom">Showroom</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="reserved">Reserved</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-zinc-50/50">
              <TableHead>Vehicle</TableHead>
              <TableHead>VIN</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-zinc-500">Loading...</TableCell>
              </TableRow>
            ) : vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-zinc-500">No vehicles found.</TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="font-medium">{vehicle.year} {vehicle.make} {vehicle.model}</div>
                    <div className="text-xs text-zinc-500">{vehicle.color}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{vehicle.vin}</TableCell>
                  <TableCell>{vehicle.category}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1">
                      {vehicle.location === "Showroom" ? <Store className="h-3 w-3" /> : <Warehouse className="h-3 w-3" />}
                      {vehicle.location}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className={`flex items-center gap-1 font-medium ${vehicle.daysInStock > 90 ? "text-red-600" :
                        vehicle.daysInStock > 60 ? "text-amber-600" : "text-emerald-600"
                      }`}>
                      {vehicle.daysInStock} Days
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">₹{(vehicle.price / 100000).toFixed(2)} L</div>
                    <div className="text-xs text-zinc-500">Cost: ₹{(vehicle.costPrice / 100000).toFixed(2)} L</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={
                      vehicle.status === "in_stock" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                        vehicle.status === "reserved" ? "bg-amber-50 text-amber-700 border-amber-200" :
                          "bg-zinc-100 text-zinc-700 border-zinc-200"
                    }>
                      {vehicle.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleMoveStock(vehicle)} title="Move Stock">
                        <ArrowRightLeft className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setEditing(vehicle)
                        setDialogOpen(true)
                      }}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}