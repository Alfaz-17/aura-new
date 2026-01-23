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
    <section className="sticky top-[138px] lg:top-[160px] z-20 bg-[#F7F7F5]/95 backdrop-blur-sm border-b border-[#0E2A47]/10 py-4">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search our collection..."
              className="w-full bg-white border border-[#0E2A47]/10 px-4 py-2.5 pl-10 text-sm focus:outline-none focus:border-[#C9A24D] transition-colors"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E2A47]/40" />
            
            {/* Clear Search */}
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch("")
                  // Optional: auto-trigger clear
                  // const params = new URLSearchParams(searchParams.toString())
                  // params.delete("search")
                  // router.replace(`/shop?${params.toString()}`)
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0E2A47]/40 hover:text-[#0E2A47]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Filter Toggle (Price) */}
            <div className="relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 border text-sm font-medium transition-colors ${
                  isFilterOpen || minPrice || maxPrice 
                    ? "bg-[#0E2A47] text-white border-[#0E2A47]" 
                    : "bg-white text-[#0E2A47] border-[#0E2A47]/10 hover:border-[#0E2A47]/30"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filter</span>
                {(minPrice || maxPrice) && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-[#C9A24D]" />
                )}
              </button>

              {/* Filter Dropdown */}
              <AnimatePresence>
                {isFilterOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute left-0 md:left-auto md:right-0 top-full mt-2 w-[calc(100vw-3rem)] xs:w-72 max-w-sm bg-white border border-[#0E2A47]/10 shadow-xl z-20 p-4 rounded-sm"
                    >
                      <h4 className="text-sm font-medium text-[#0E2A47] mb-3 uppercase tracking-wider">Price Range</h4>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            type="number"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-full pl-6 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#C9A24D]"
                          />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                          <input
                            type="number"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-full pl-6 py-2 border border-gray-200 text-sm focus:outline-none focus:border-[#C9A24D]"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMinPrice("")
                            setMaxPrice("")
                            const params = new URLSearchParams(searchParams.toString())
                            params.delete("minPrice")
                            params.delete("maxPrice")
                            router.replace(`/shop?${params.toString()}`)
                            setIsFilterOpen(false)
                          }}
                          className="flex-1 px-3 py-2 text-xs font-medium text-[#0E2A47] bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                          Reset
                        </button>
                        <button
                          onClick={applyFilters}
                          className="flex-1 px-3 py-2 text-xs font-medium text-white bg-[#0E2A47] hover:bg-[#0E2A47]/90 transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Sort Dropdown */}
            <div className="relative flex-1 md:flex-none">
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full appearance-none bg-white border border-[#0E2A47]/10 px-4 py-2.5 pr-8 text-sm focus:outline-none focus:border-[#C9A24D] cursor-pointer"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#0E2A47]/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
