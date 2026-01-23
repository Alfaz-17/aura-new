import { CategoryForm } from "@/components/admin/category-form"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/models/Category"
import { notFound } from "next/navigation"

interface EditCategoryPageProps {
  params: { id: string }
}

async function getCategory(id: string) {
  try {
    await connectToDatabase()
    const category = await Category.findById(id).lean() as any
    if (!category) return null
    return {
      ...category,
      _id: category._id.toString(),
    }
  } catch (error) {
    return null
  }
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params // Await params in newer Next.js or use directly if older, sticking to standard async component pattern for safer future comp.
  const category = await getCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <div className="p-10 max-w-5xl mx-auto">
      <CategoryForm initialData={category as any} />
    </div>
  )
}
