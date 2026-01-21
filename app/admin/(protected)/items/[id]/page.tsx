import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"
import { ItemForm } from "@/components/admin/item-form"
import mongoose from "mongoose"

interface EditItemPageProps {
  params: Promise<{ id: string }>
}

async function getItem(id: string) {
  try {
    // Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      console.error("Invalid ObjectId format:", id)
      return null
    }

    await connectToDatabase()
    console.log("Fetching item with ID:", id)
    
    const item = await Item.findById(id).lean()
    console.log("Found item:", item ? "Yes" : "No", item ? `Title: ${item.title}` : "")
    
    if (!item) return null
    
    return {
      _id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      images: item.images || [],
      price: item.price,
      dimensions: item.dimensions,
      material: item.material,
    }
  } catch (error) {
    console.error("Error fetching item:", error)
    return null
  }
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const { id } = await params
  const item = await getItem(id)

  if (!item) {
    notFound()
  }

  return <ItemForm initialData={item} />
}
