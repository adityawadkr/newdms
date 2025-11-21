"use client"

import * as React from "react"
import { PackagePlus, Wrench, Search, Filter, Pencil, Trash2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

export default function SparePartsInventoryPage() {
  const [parts, setParts] = React.useState<Part[]>([])
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState("")
  const [category, setCategory] = React.useState("all")
  const [showLowStock, setShowLowStock] = React.useState(false)
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Part | null>(null)

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
    } catch (error) {
      console.error("Failed to fetch parts", error)
      toast.error("Failed to load spare parts")
    } finally {
      setLoading(false)
    }
  }, [q, category, showLowStock])

  React.useEffect(() => {
    fetchParts()
  }, [fetchParts])

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
        toast.success("Part updated successfully")
      } else {
        const res = await fetch("/api/inventory/spare-parts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        })
        if (!res.ok) {
          const json = await res.json()
          throw new Error(json.error || "Failed to create")
        }
        toast.success("Part created successfully")
      }
      setDialogOpen(false)
      setEditing(null)
      fetchParts()
    } catch (error: any) {
      toast.error(error.message || "Operation failed")
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this part?")) return
    try {
      const res = await fetch(`/api/inventory/spare-parts/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete")
      toast.success("Part deleted")
      fetchParts()
    } catch (error) {
      toast.error("Failed to delete part")
    }
  }

  const low = (p: Part) => p.stock <= p.reorderPoint

  // Unique categories for filter
  const categories = Array.from(new Set(parts.map(p => p.category))).sort()

  return (
    <div className="space-y-6 p-8 bg-zinc-50/50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Wrench className="h-8 w-8" /> Spare Parts Inventory
          </h1>
          <p className="text-zinc-500 mt-1">Manage stock, reordering, and suppliers.</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditing(null)} className="bg-zinc-900 text-white hover:bg-zinc-800">
              <PackagePlus className="mr-2 h-4 w-4" /> Add Part
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editing ? "Edit Part" : "Add New Part"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={onSave} className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input id="sku" name="sku" defaultValue={editing?.sku} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" name="name" defaultValue={editing?.name} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" name="category" defaultValue={editing?.category} required placeholder="e.g. Engine, Brakes" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" name="supplier" defaultValue={editing?.supplier} placeholder="e.g. Bosch" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" defaultValue={editing?.location} placeholder="e.g. Shelf A-1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" name="stock" type="number" defaultValue={editing?.stock ?? 0} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reorderPoint">Reorder Point</Label>
                  <Input id="reorderPoint" name="reorderPoint" type="number" defaultValue={editing?.reorderPoint ?? 5} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="costPrice">Cost Price (₹)</Label>
                  <Input id="costPrice" name="costPrice" type="number" defaultValue={editing?.costPrice ?? 0} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                  <Input id="sellingPrice" name="sellingPrice" type="number" defaultValue={editing?.sellingPrice ?? 0} />
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

      <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by Name or SKU..."
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant={showLowStock ? "destructive" : "outline"}
          onClick={() => setShowLowStock(!showLowStock)}
          className="gap-2"
        >
          <AlertTriangle className="h-4 w-4" />
          {showLowStock ? "Showing Low Stock" : "Show Low Stock"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Total {parts.length} items found.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50/50">
                <TableHead>SKU</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Location</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-zinc-500">Loading inventory...</TableCell>
                </TableRow>
              ) : parts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-zinc-500">No parts found.</TableCell>
                </TableRow>
              ) : (
                parts.map((p) => (
                  <TableRow key={p.id} className={low(p) ? "bg-red-50 hover:bg-red-100/50" : ""}>
                    <TableCell className="font-mono text-xs font-medium">{p.sku}</TableCell>
                    <TableCell>
                      <div className="font-medium">{p.name}</div>
                      {low(p) && <div className="text-xs text-red-600 font-medium flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Low Stock (Reorder: {p.reorderPoint})</div>}
                    </TableCell>
                    <TableCell><Badge variant="outline">{p.category}</Badge></TableCell>
                    <TableCell className="text-zinc-500 text-sm">{p.location || "-"}</TableCell>
                    <TableCell className="text-right font-medium">
                      {p.stock}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="font-medium">₹{p.sellingPrice}</div>
                      <div className="text-xs text-zinc-400">Cost: ₹{p.costPrice}</div>
                    </TableCell>
                    <TableCell className="text-zinc-500 text-sm">{p.supplier || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => {
                          setEditing(p)
                          setDialogOpen(true)
                        }}>
                          <Pencil className="h-4 w-4 text-zinc-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(p.id)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}