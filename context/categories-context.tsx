"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { Flower2 } from "lucide-react"

export interface Category {
  _id: string
  name: string
  slug: string
  label: string
  value: string
  image?: string
  description?: string
  icon?: any
  isActive?: boolean
}

interface CategoriesContextType {
  categories: Category[]
  isLoading: boolean
  refreshCategories: () => Promise<void>
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined)

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchCategories = async () => {
    try {
      // Don't set loading to true on refresh to avoid flickering UI if already loaded
      // Only set if initial load
      if (categories.length === 0) setIsLoading(true)
      
      const res = await fetch("/api/categories")
      if (res.ok) {
        const data = await res.json()
        const mapped = data.map((cat: any) => ({
          ...cat,
          label: cat.name,
          value: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
          icon: Flower2 // Default icon
        }))
<<<<<<< HEAD
        const filtered = mapped.filter((cat: any) => cat.label.toLowerCase() !== "new arrivals")
        setCategories(filtered)
=======
        setCategories(mapped)
>>>>>>> 666998437c0c4430679dbea4368bb188913d1fbc
      }
    } catch (error) {
      console.error("Failed to fetch categories", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return (
    <CategoriesContext.Provider value={{ categories, isLoading, refreshCategories: fetchCategories }}>
      {children}
    </CategoriesContext.Provider>
  )
}

export function useCategoriesContext() {
  const context = useContext(CategoriesContext)
  if (context === undefined) {
    throw new Error("useCategoriesContext must be used within a CategoriesProvider")
  }
  return context
}
