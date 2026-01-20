import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"

// GET all items
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    
    const query: any = {}
    
    if (category && category !== "all") {
      query.category = category
    }
    
    if (search) {
      query.title = { $regex: search, $options: "i" }
    }
    
    const items = await Item.find(query).sort({ createdAt: -1 }).lean()
    
    return NextResponse.json(items)
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
}

// POST create new item
export async function POST(request: NextRequest) {
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

    const item = new Item({
      title,
      description,
      category,
      images: images || [],
      price,
      dimensions,
      material,
    })

    await item.save()

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An item with this title already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    )
  }
}
