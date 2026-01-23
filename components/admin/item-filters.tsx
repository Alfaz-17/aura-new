"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { useCategories } from "@/hooks/use-categories"
import { Search } from "lucide-react"

export function ItemFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { categories } = useCategories()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [category, setCategory] = useState(searchParams.get("category") || "all")

  // Update URL function
  const updateUrl = (newSearch: string, newCategory: string) => {
    const params = new URLSearchParams()
    if (newSearch) params.set("search", newSearch)
    if (newCategory && newCategory !== "all") params.set("category", newCategory)
    
    router.replace(`${pathname}?${params.toString()}`)
  }

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== (searchParams.get("search") || "")) {
        updateUrl(search, category)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [search, category])

  // Handle Category Change (Immediate)
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory)
    updateUrl(search, newCategory)
  }

  return (
    <div className="bg-white border border-[#0E2A47]/10 p-4 mb-6">
      <div className="flex flex-wrap gap-4">
        {/* Search Input */}
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E2A47]/30" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search items..."
            className="w-full pl-10 pr-4 py-2 border border-[#0E2A47]/10 text-sm focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
          />
        </div>

        {/* Category Select */}
        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-4 py-2 border border-[#0E2A47]/10 text-sm focus:outline-none focus:border-[#C9A24D]/50 bg-white transition-colors cursor-pointer"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.value}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
