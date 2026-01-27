import { NextRequest, NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/models/Category"
import mongoose from "mongoose"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    console.log(`[API] Updating category: ${id}`)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`[API] Invalid category ID format: ${id}`)
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }

    const body = await request.json()

    if (body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
    }

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    })

    if (!category) {
      console.warn(`[API] Category not found for update: ${id}`)
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error("Failed to update category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase()
    const { id } = await params
    console.log(`[API] Deleting category: ${id}`)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error(`[API] Invalid category ID format: ${id}`)
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 })
    }
    
    const category = await Category.findByIdAndDelete(id)

    if (!category) {
      console.warn(`[API] Category not found for deletion: ${id}`)
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    console.log(`[API] Category deleted: ${id}`)
    return NextResponse.json({ message: "Category deleted successfully" })
  } catch (error) {
    console.error("Failed to delete category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
