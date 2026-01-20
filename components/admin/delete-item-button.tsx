"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface DeleteItemButtonProps {
  itemId: string
}

export function DeleteItemButton({ itemId }: DeleteItemButtonProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this item?")) {
      return
    }

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/items/${itemId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert("Failed to delete item")
      }
    } catch {
      alert("An error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-red-500/50 hover:text-red-500 transition-colors disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  )
}
