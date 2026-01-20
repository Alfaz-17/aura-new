import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"

interface RouteParams {
  params: { id: string }
}

// GET single item
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase()
    
    const item = await Item.findById(params.id).lean()
    
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    )
  }
}

// PUT update item
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { title, description, category, images, price, dimensions, material } = body

    if (!title || !description || !category) {
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      )
    }

    const item = await Item.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        category,
        images: images || [],
        price,
        dimensions,
        material,
      },
      { new: true, runValidators: true }
    )

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An item with this title already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    )
  }
}

// DELETE item
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase()
    
    const item = await Item.findByIdAndDelete(params.id)

    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: "Item deleted successfully" })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    )
  }
}
