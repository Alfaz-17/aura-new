"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload } from "lucide-react"

interface CategoryFormProps {
  initialData?: {
    _id?: string
    name: string
    description?: string
    image?: string
    isActive: boolean
  }
}

export function CategoryForm({ initialData }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!initialData?._id

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
  })
  const [imageUrl, setImageUrl] = useState("") // For URL input
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setFormData({ ...formData, image: imageUrl.trim() })
      setImageUrl("")
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const url = isEditing
        ? `/api/categories/${initialData._id}`
        : "/api/categories"
      
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/admin/categories")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save category")
      }
    } catch {
      setError("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/categories"
          className="p-2 text-[#0E2A47]/50 hover:text-[#0E2A47] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-[#0E2A47]">
            {isEditing ? "Edit Category" : "Add New Category"}
          </h1>
          <p className="text-[#0E2A47]/60 text-sm">
            {isEditing ? "Update category details" : "Create a new product category"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#0E2A47]/10 p-6 space-y-6">
        {/* Name */}
        <div>
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2">
            Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
            placeholder="Category Name"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50 resize-none"
            placeholder="Category description"
          />
        </div>

        {/* Image */}
        <div className="space-y-4">
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block">
            Cover Image
          </label>
          
          {/* Image Upload Area */}
          <div className={`border-2 border-dashed border-[#0E2A47]/10 p-6 text-center transition-colors relative ${isUploading ? 'bg-gray-50' : 'hover:bg-[#F7F7F5]'}`}>
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0E2A47] mb-2"></div>
                <span className="text-xs font-medium text-[#0E2A47] animate-pulse">Uploading...</span>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0]
                  setIsUploading(true)
                  setError("")
                  
                  try {
                    // 1. Get Signature
                    const signRes = await fetch("/api/sign-cloudinary", { method: "POST" })
                    if (!signRes.ok) throw new Error("Failed to get upload signature")
                    const signData = await signRes.json()
                    const { signature, timestamp, folder, api_key, cloud_name } = signData

                    // 2. Upload
                    const formData = new FormData()
                    formData.append("file", file)
                    formData.append("api_key", api_key)
                    formData.append("timestamp", timestamp.toString())
                    formData.append("signature", signature)
                    formData.append("folder", folder)

                    const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`
                    
                    const res = await fetch(url, {
                      method: "POST",
                      body: formData,
                    })
                    
                    if (!res.ok) {
                      const errorData = await res.json()
                      throw new Error(errorData.error?.message || "Upload failed")
                    }
                    const data = await res.json()
                    setFormData(prev => ({ ...prev, image: data.secure_url }))
                  } catch (err: any) {
                    console.error("Upload error:", err)
                    setError(err.message || "Failed to upload image.")
                  } finally {
                    setIsUploading(false)
                    e.target.value = ""
                  }
                }
              }}
              className="hidden"
              id="cat-image-upload"
              disabled={isUploading}
            />
            <label htmlFor="cat-image-upload" className={`cursor-pointer block ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-8 w-8 mx-auto text-[#0E2A47]/30 mb-2" />
              <span className="text-sm text-[#0E2A47]/60 block mb-1">
                Click to upload cover image
              </span>
              <span className="text-xs text-[#0E2A47]/40 block">
                SVG, PNG, JPG or GIF (max. 10MB)
              </span>
            </label>
          </div>

          {/* URL Fallback */}
          <div className="flex gap-2">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Or paste image URL..."
              className="flex-1 border border-[#0E2A47]/10 px-4 py-2 text-sm text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
              disabled={isUploading}
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-[#0E2A47]/5 text-[#0E2A47] text-xs uppercase tracking-wider hover:bg-[#0E2A47]/10 transition-colors"
              disabled={!imageUrl || isUploading}
            >
              Add URL
            </button>
          </div>

          {/* Preview */}
          {formData.image && (
            <div className="relative group w-32 aspect-square bg-[#F7F7F5] overflow-hidden mt-4">
              <img src={formData.image} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
              >
                <span className="text-xs font-medium uppercase tracking-wider">Remove</span>
              </button>
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#0E2A47]/10">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 bg-[#C9A24D] text-[#0E2A47] px-8 py-3 text-xs tracking-wider uppercase font-semibold hover:bg-[#d4af5a] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : isEditing ? "Update Category" : "Create Category"}
          </button>
        </div>
      </form>
    </div>
  )
}
