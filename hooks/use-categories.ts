"use client"

import { useCategoriesContext } from "@/context/categories-context"

// Re-export types if needed, or import from context
export type { Category } from "@/context/categories-context"

export function useCategories() {
  return useCategoriesContext()
}
