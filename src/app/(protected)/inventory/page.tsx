"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Car, DollarSign, AlertTriangle, Warehouse, Store } from "lucide-react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

interface Vehicle {
    id: number
    vin: string
    make: string
    model: string
    price: number
    costPrice: number
    status: string
    location: string
    daysInStock: number
    createdAt: string
}

export default function InventoryDashboard() {
    const [vehicles, setVehicles] = useState<Vehicle[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("/api/vehicles?pageSize=100")
            .then(res => res.json())
            .then(data => {
                if (data.data) setVehicles(data.data)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [])

    const totalValue = vehicles.reduce((acc, v) => acc + v.price, 0)
    const totalCost = vehicles.reduce((acc, v) => acc + v.costPrice, 0)
    const totalStock = vehicles.filter(v => v.status === "in_stock").length
    const showroomStock = vehicles.filter(v => v.location === "Showroom" && v.status === "in_stock").length
    const stockyardStock = vehicles.filter(v => v.location === "Stockyard" && v.status === "in_stock").length
    const agingStock = vehicles.filter(v => v.daysInStock > 90 && v.status === "in_stock").length

    // Chart Data: Stock by Make
    const stockByMake = vehicles.reduce((acc: any, v) => {
        if (v.status === "in_stock") {
            acc[v.make] = (acc[v.make] || 0) + 1
        }
        return acc
    }, {})
    const chartData = Object.keys(stockByMake).map(make => ({ name: make, total: stockByMake[make] }))

    return (
        <div className="p-8 space-y-8 bg-zinc-50/50 min-h-screen">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Inventory Overview</h1>
                <p className="text-zinc-500 mt-1">Real-time insights into vehicle stock and valuation.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Inventory Value</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">₹{(totalValue / 10000000).toFixed(2)} Cr</div>
                        <p className="text-xs text-zinc-500 mt-1">Cost: ₹{(totalCost / 10000000).toFixed(2)} Cr</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Total Units</CardTitle>
                        <Car className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{totalStock}</div>
                        <div className="flex gap-2 mt-1 text-xs">
                            <span className="flex items-center gap-1 text-zinc-600"><Store className="h-3 w-3" /> {showroomStock}</span>
                            <span className="flex items-center gap-1 text-zinc-600"><Warehouse className="h-3 w-3" /> {stockyardStock}</span>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-zinc-500">Aging Stock (&gt;90 Days)</CardTitle>
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-zinc-900">{agingStock}</div>
                        <p className="text-xs text-zinc-500 mt-1">Needs attention</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Stock Distribution by Make</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                    <Bar dataKey="total" fill="#18181b" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Recent Additions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {vehicles.slice(0, 5).map((vehicle) => (
                                <div key={vehicle.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className="h-10 w-10 rounded-full bg-zinc-100 flex items-center justify-center">
                                            <Car className="h-5 w-5 text-zinc-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-zinc-900">{vehicle.make} {vehicle.model}</p>
                                            <p className="text-xs text-zinc-500">{vehicle.vin}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium text-zinc-900">₹{(vehicle.price / 100000).toFixed(2)} L</p>
                                        <p className="text-xs text-zinc-500">{new Date(vehicle.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
