import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { Category } from "@/models/Category"
import { Plus, Edit, Trash2 } from "lucide-react"
import { DeleteItemButton } from "@/components/admin/delete-item-button"
import { DeleteCategoryButton } from "@/components/admin/delete-category-button"

// Reuse DeleteItemButton? It targets /api/items/[id]. 
// We need DeleteCategoryButton. 
// For now, I'll inline a client component for delete or create a new DeleteCategoryButton.
// To save time, I'll create a simple client component here or reuse standard delete logic.
// Actually, `DeleteItemButton` is specific to items. I'll make a quick `DeleteCategoryButton`.

// Let's stick to Server Component fetching here.

async function getCategories() {
  await connectToDatabase()
  const categories = await Category.find().sort({ createdAt: -1 }).lean()
  return categories
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="max-w-6xl p-6 md:p-10 mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#0E2A47] mb-2">Categories</h1>
          <p className="text-[#0E2A47]/60 text-sm">Manage your product categories</p>
        </div>
        <Link
          href="/admin/categories/new"
          className="flex items-center gap-2 bg-[#0E2A47] text-white px-6 py-3 text-xs tracking-wider uppercase hover:bg-[#1a3d5c] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Link>
      </div>

      <div className="bg-white border border-[#0E2A47]/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0E2A47]/5">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Image</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Name</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Slug</th>
              <th className="text-right px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 ? (
              categories.map((cat: any) => (
                <tr key={cat._id.toString()} className="border-t border-[#0E2A47]/5 hover:bg-[#F7F7F5]/50">
                  <td className="px-4 py-3">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-12 h-12 object-cover bg-[#F7F7F5]"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#F7F7F5] flex items-center justify-center text-[#0E2A47]/20 text-xs">
                        No Img
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0E2A47]">{cat.name}</p>
                    <p className="text-xs text-[#0E2A47]/50 line-clamp-1">{cat.description}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#0E2A47]/70">
                    {cat.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${cat._id.toString()}`}
                        className="p-2 text-[#0E2A47]/50 hover:text-[#0E2A47] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      {/* We need a delete button working for categories */}
                      <DeleteCategoryButton id={cat._id.toString()} /> 
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-12 text-center text-[#0E2A47]/50 text-sm">
                  No categories found. Add your first category!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
       
      {/* Seed Button - Keep it optional or hidden, but user liked it? 
          Since they can now Add Category manually, maybe redundant. 
          But I'll add a small link/button below for convenience if it's empty? */}
    </div>
  )
}


