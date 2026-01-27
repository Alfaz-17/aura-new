import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"

export async function GET() {
  try {
    await connectToDatabase()
    
    const items = await Item.find({}).limit(5).lean()
    
    return NextResponse.json({
      success: true,
      itemCount: items.length,
      items: items.map(item => ({
        id: item._id.toString(),
        title: item.title,
        category: item.category,
        hasSlug: !!item.slug,
        slug: item.slug,
      })),
      firstItemFull: items[0] || null,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack,
    }, { status: 500 })
  }
}
