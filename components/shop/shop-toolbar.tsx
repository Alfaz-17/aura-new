"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, SlidersHorizontal, ArrowUpDown, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function ShopToolbar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "")
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sort, setSort] = useState(searchParams.get("sort") || "newest")

  // Update URL function
  const applyFilters = () => {
    const params = new URLSearchParams()
    
    // Preserve category if exists
    const currentCategory = searchParams.get("category")
    if (currentCategory) params.set("category", currentCategory)

    if (search) params.set("search", search)
    if (minPrice) params.set("minPrice", minPrice)
    if (maxPrice) params.set("maxPrice", maxPrice)
    if (sort && sort !== "newest") params.set("sort", sort)

    router.replace(`/shop?${params.toString()}`)
    setIsFilterOpen(false)
  }

  // Handle Sort Change
  const handleSortChange = (newSort: string) => {
    setSort(newSort)
    const params = new URLSearchParams(searchParams.toString())
    if (newSort === "newest") {
      params.delete("sort")
    } else {
      params.set("sort", newSort)
    }
    router.replace(`/shop?${params.toString()}`)
  }

  // Handle Search Submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  return (
    <section className="sticky top-[64px] lg:top-[80px] z-30 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-[#0E2A47]/10 py-4 lg:py-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-center items-center">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-xl">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search our collection..."
              className="w-full bg-white border border-[#0E2A47]/10 px-6 py-3 pl-12 text-sm focus:outline-none focus:border-[#C9A24D] transition-colors rounded-none"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#0E2A47]/40" />
            
            {/* Clear Search */}
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#0E2A47]/40 hover:text-[#0E2A47]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
