"use client"

import { motion } from "framer-motion"
import { Flower2, Trees, Sprout, Leaf, Sparkles } from "lucide-react"

interface CategoryTabsProps {
  activeCategory: string
  onCategoryChange: (category: string) => void
}

const categories = [
  { value: "All", label: "All", icon: Sparkles },
  { value: "artificial-flowers", label: "Flowers", icon: Flower2 },
  { value: "artificial-green-plants", label: "Plants", icon: Trees },
  { value: "bonsai", label: "Bonsai", icon: Sprout },
  { value: "hanging-greenery", label: "Hanging", icon: Leaf },
  { value: "decor-accessories", label: "Décor", icon: Sparkles },
]

export function CategoryTabs({ activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <section className="sticky top-16 lg:top-20 z-30 bg-[#F7F7F5] border-b border-[#0E2A47]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-start lg:justify-center gap-1 sm:gap-2 py-4 overflow-x-auto scrollbar-hide">
          {categories.map((category) => {
            const isActive = activeCategory === category.value
            return (
              <motion.button
                key={category.value}
                onClick={() => onCategoryChange(category.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 text-[10px] sm:text-xs tracking-[0.15em] uppercase font-medium transition-all duration-300 whitespace-nowrap ${
                  isActive
                    ? "text-white"
                    : "text-[#0E2A47]/60 hover:text-[#0E2A47]"
                }`}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-[#0E2A47]"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                
                {/* Icon */}
                <category.icon 
                  className={`relative z-10 h-3.5 w-3.5 sm:h-4 sm:w-4 ${
                    isActive ? "text-[#C9A24D]" : ""
                  }`} 
                  strokeWidth={1.5} 
                />
                
                {/* Label */}
                <span className="relative z-10">{category.label}</span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
