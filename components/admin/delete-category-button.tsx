"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

interface DeleteCategoryButtonProps {
  id: string
}

export function DeleteCategoryButton({ id }: DeleteCategoryButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this category?")) return

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete category")
      }
    } catch (error) {
      console.error("Failed to delete category", error)
      alert("Failed to delete category")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500/50 hover:text-red-500 transition-colors disabled:opacity-50"
      title="Delete Category"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
