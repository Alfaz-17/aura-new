"use client"

import { useState, useEffect } from "react"
import { Sparkles } from "lucide-react"

export interface Category {
  _id: string
  name: string
  slug: string
  // For UI compatibility, we map name/slug to label/value
  label: string
  value: string
  image?: string
  description?: string
  icon?: any
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories")
        if (res.ok) {
          const data = await res.json()
          // Map to format compatible with existing components
          const mapped = data.map((cat: any) => ({
            ...cat,
            label: cat.name,
            value: cat.slug || cat.name.toLowerCase().replace(/\s+/g, "-"),
            icon: Sparkles // Default icon for now
          }))
          setCategories(mapped)
        }
      } catch (error) {
        console.error("Failed to fetch categories", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, isLoading }
}
