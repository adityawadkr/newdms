import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { vehicle } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required"
      }, { status: 400 });
    }

    const foundVehicle = await db.select().from(vehicle).where(eq(vehicle.id, Number(id))).limit(1);

    if (foundVehicle.length === 0) {
      return NextResponse.json({
        error: "Vehicle not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      data: foundVehicle[0]
    }, { status: 200 });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required"
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { vin, make, model, year, category, color, price, stock, reorderPoint, status } = requestBody;

    // Validate fields if provided
    if (vin !== undefined && (!vin || vin.trim() === '')) {
      return NextResponse.json({
        error: "VIN must be non-empty"
      }, { status: 400 });
    }

    if (year !== undefined && (typeof year !== 'number' || year < 1900)) {
      return NextResponse.json({
        error: "Year must be an integer >= 1900"
      }, { status: 400 });
    }

    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
      return NextResponse.json({
        error: "Price must be an integer >= 0"
      }, { status: 400 });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
      return NextResponse.json({
        error: "Stock must be an integer >= 0"
      }, { status: 400 });
    }

    if (reorderPoint !== undefined && (typeof reorderPoint !== 'number' || reorderPoint < 0)) {
      return NextResponse.json({
        error: "Reorder point must be an integer >= 0"
      }, { status: 400 });
    }

    if (status !== undefined && !['in_stock', 'reserved', 'sold'].includes(status)) {
      return NextResponse.json({
        error: "Status must be one of: in_stock, reserved, sold"
      }, { status: 400 });
    }

    // Check if vehicle exists
    const existingVehicle = await db.select()
      .from(vehicle)
      .where(eq(vehicle.id, Number(id)))
      .limit(1);

    if (existingVehicle.length === 0) {
      return NextResponse.json({
        error: "Vehicle not found"
      }, { status: 404 });
    }

    // Check VIN uniqueness if provided
    if (vin !== undefined) {
      const existingVin = await db.select()
        .from(vehicle)
        .where(eq(vehicle.vin, vin.trim()))
        .limit(1);

      if (existingVin.length > 0 && existingVin[0].id !== Number(id)) {
        return NextResponse.json({
          error: "VIN must be unique"
        }, { status: 400 });
      }
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date() // Fix: Use Date object if schema expects timestamp, or number if integer
    };
    // Schema says: updatedAt: integer("updated_at", { mode: "timestamp" })
    // So it expects a Date object if using drizzle-orm with { mode: "timestamp" }?
    // Actually, if it's integer in sqlite, Drizzle handles the conversion if mode is timestamp.
    // Let's check schema again.
    // updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().default(sql`(unixepoch())`),
    // So it expects a Date object in JS.

    if (vin !== undefined) updateData.vin = vin.trim();
    if (make !== undefined) updateData.make = make;
    if (model !== undefined) updateData.model = model;
    if (year !== undefined) updateData.year = year;
    if (category !== undefined) updateData.category = category;
    if (color !== undefined) updateData.color = color;
    if (price !== undefined) updateData.price = price;
    if (stock !== undefined) updateData.stock = stock;
    if (reorderPoint !== undefined) updateData.reorderPoint = reorderPoint;
    if (status !== undefined) updateData.status = status;

    const updated = await db.update(vehicle)
      .set(updateData)
      .where(eq(vehicle.id, Number(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({
        error: "Vehicle not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      data: updated[0]
    }, { status: 200 });

  } catch (error) {
    console.error('PUT error:', error);

    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({
        error: "VIN must be unique"
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const { id } = await params;

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({
        error: "Valid ID is required"
      }, { status: 400 });
    }

    // Check if vehicle exists
    const existingVehicle = await db.select()
      .from(vehicle)
      .where(eq(vehicle.id, Number(id)))
      .limit(1);

    if (existingVehicle.length === 0) {
      return NextResponse.json({
        error: "Vehicle not found"
      }, { status: 404 });
    }

    const deleted = await db.delete(vehicle)
      .where(eq(vehicle.id, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({
        error: "Vehicle not found"
      }, { status: 404 });
    }

    return NextResponse.json({
      data: { message: "Vehicle deleted successfully" }
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({
      error: 'Internal server error: ' + error
    }, { status: 500 });
  }
}