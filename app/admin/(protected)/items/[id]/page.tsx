import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"
import { ItemForm } from "@/components/admin/item-form"

interface EditItemPageProps {
  params: { id: string }
}

async function getItem(id: string) {
  await connectToDatabase()
  
  try {
    const item = await Item.findById(id).lean()
    if (!item) return null
    
    return {
      _id: item._id.toString(),
      title: item.title,
      description: item.description,
      category: item.category,
      images: item.images,
      price: item.price,
      dimensions: item.dimensions,
      material: item.material,
    }
  } catch {
    return null
  }
}

export default async function EditItemPage({ params }: EditItemPageProps) {
  const item = await getItem(params.id)

  if (!item) {
    notFound()
  }

  return <ItemForm initialData={item} />
}
