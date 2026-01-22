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
  } catch (error: any) {
    console.error("GET /api/items Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    )
  }
};


// POST create new item
export async function POST(request: NextRequest) {
  try {
    console.log("=== Create Item API Called ===")
    await connectToDatabase()
    console.log("Database connected")
    
    const body = await request.json()
    console.log("Request body:", {
      title: body.title,
      category: body.category,
      imageCount: body.images?.length || 0
    })
    
    const { title, description, category, images, price, dimensions, material } = body

    if (!title || !description || !category) {
      console.error("Validation failed - missing required fields")
      return NextResponse.json(
        { error: "Title, description, and category are required" },
        { status: 400 }
      )
    }

    console.log("Creating new item...")
    // Generate slug
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    console.log("Creating new item with slug:", slug)

    const item = new Item({
      title,
      slug,
      description,
      category,
      images: images || [],
      price,
      dimensions,
      material,
    })

    await item.save()
    console.log("Item created successfully:", item._id)

    return NextResponse.json(item, { status: 201 })
  } catch (error: any) {
    console.error("Create item error:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "An item with this title already exists" },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: error.message || "Failed to create item" },
      { status: 500 }
    )
  }
};

