import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { Item } from "@/models/Item"
import { CATEGORIES } from "@/types/item"
import { Plus, Search, Edit, Trash2 } from "lucide-react"
import { DeleteItemButton } from "@/components/admin/delete-item-button"
import { ItemFilters } from "@/components/admin/item-filters"

interface ItemsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

async function getItems(category?: string, search?: string) {
  await connectToDatabase()
  
  const query: any = {}
  
  if (category && category !== "all") {
    query.category = category
  }
  
  if (search) {
    query.title = { $regex: search, $options: "i" }
  }
  
  const items = await Item.find(query).sort({ createdAt: -1 }).lean()
  return items
}

export default async function ItemsPage({ searchParams }: ItemsPageProps) {
  const { category, search } = await searchParams
  const items = await getItems(category, search)

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-[#0E2A47] mb-2">Items</h1>
          <p className="text-[#0E2A47]/60 text-sm">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/items/new"
          className="flex items-center gap-2 bg-[#0E2A47] text-white px-6 py-3 text-xs tracking-wider uppercase hover:bg-[#1a3d5c] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Item
        </Link>
      </div>

      {/* Filters */}
      <ItemFilters />

      {/* Items Table */}
      <div className="bg-white border border-[#0E2A47]/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#0E2A47]/5">
            <tr>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Image</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Title</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60 hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60 hidden lg:table-cell">Price</th>
              <th className="text-right px-4 py-3 text-[10px] tracking-wider uppercase text-[#0E2A47]/60">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length > 0 ? (
              items.map((item: any) => (
                <tr key={item._id.toString()} className="border-t border-[#0E2A47]/5 hover:bg-[#F7F7F5]/50">
                  <td className="px-4 py-3">
                    {item.images?.[0] ? (
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="w-12 h-12 object-cover bg-[#F7F7F5]"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-[#F7F7F5]" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-sm font-medium text-[#0E2A47]">{item.title}</p>
                    <p className="text-xs text-[#0E2A47]/50 md:hidden capitalize">
                      {item.category.replace(/-/g, " ")}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs text-[#0E2A47]/70 capitalize">
                      {item.category.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="text-sm text-[#0E2A47]">
                      {item.price ? `₹${item.price.toLocaleString()}` : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/items/${item._id.toString()}`}
                        className="p-2 text-[#0E2A47]/50 hover:text-[#0E2A47] transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <DeleteItemButton itemId={item._id.toString()} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[#0E2A47]/50 text-sm">
                  No items found. Add your first item!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
