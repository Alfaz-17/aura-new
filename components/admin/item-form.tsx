"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Upload, SlidersHorizontal, Sparkles } from "lucide-react"
import { useCategories } from "@/hooks/use-categories"
import { ImageCropperModal } from "./image-cropper-modal"
import { optimizeCloudinaryUrl } from "@/lib/cloudinary"
import { removeBackgroundClient } from "@/lib/background-removal-client"

// Loose type for category in dynamic system, or import CollectionType but treat it as string
type CollectionType = string 

interface ItemFormProps {
  initialData?: {
    _id?: string
    title: string
    description: string
    category: CollectionType
    images: string[]
    price?: number
    dimensions?: string
    material?: string
  }
}

export function ItemForm({ initialData }: ItemFormProps) {
  const router = useRouter()
  const { categories } = useCategories()
  const isEditing = !!initialData?._id

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "artificial-flowers" as CollectionType,
    images: initialData?.images || [] as string[],
    price: initialData?.price || "",
    dimensions: initialData?.dimensions || "",
    material: initialData?.material || "",
  })
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState("")

  // Cropping States
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Track AI-populated fields
  const [aiPopulatedFields, setAiPopulatedFields] = useState<Set<string>>(new Set())
  const [showAiSuccess, setShowAiSuccess] = useState(false)
  const [useAI, setUseAI] = useState(true) // Toggle for automatic AI analysis
  const [removeBackground, setRemoveBackground] = useState(true) // Toggle for background removal
  const [backgroundType, setBackgroundType] = useState<'custom' | 'transparent'>('custom')
  const [backgroundColor, setBackgroundColor] = useState('#ffffff') // Default to white
  const [isProcessingBg, setIsProcessingBg] = useState(false)

  const handleAIAnalysis = async (url: string) => {
    setIsAnalyzing(true)
    setError("")
    setShowAiSuccess(false)
    try {
      const res = await fetch("/api/ai/analyze-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Use optimized URL for AI (already handled in API but good to be explicit)
        body: JSON.stringify({ imageUrl: optimizeCloudinaryUrl(url, 512, 70) })
      })
      
      if (!res.ok) throw new Error("AI analysis failed")
      
      const data = await res.json()
      
      // Track which fields were populated by AI
      const populatedFields = new Set<string>()
      
      // Update form with AI suggestions
      setFormData(prev => {
        const updates: any = { ...prev }
        
        // Enhanced category matching with multiple strategies
        if (data.category) {
          console.log('[AI] Received category from AI:', data.category)
          console.log('[AI] Available categories:', categories.map(c => `${c.value} (${c.label})`))
          
          // Try multiple matching strategies
          let matchedCat = 
            // 1. Exact slug match (preferred)
            categories.find(c => c.value === data.category) ||
            // 2. Exact label match
            categories.find(c => c.label === data.category) ||
            // 3. Case-insensitive slug match
            categories.find(c => c.value.toLowerCase() === data.category.toLowerCase()) ||
            // 4. Case-insensitive label match
            categories.find(c => c.label.toLowerCase() === data.category.toLowerCase()) ||
            // 5. Slug with spaces converted to hyphens
            categories.find(c => c.value === data.category.toLowerCase().replace(/\s+/g, "-")) ||
            // 6. Partial match in label
            categories.find(c => c.label.toLowerCase().includes(data.category.toLowerCase()))
          
          if (matchedCat) {
            updates.category = matchedCat.value as CollectionType
            populatedFields.add('category')
            console.log('[AI] ✓ Matched category:', matchedCat.value, `(${matchedCat.label})`)
          } else {
            console.warn('[AI] ✗ No category match found for:', data.category)
            console.warn('[AI] Keeping default category:', prev.category)
          }
        }
        
        if (data.title) {
          updates.title = data.title
          populatedFields.add('title')
        }
        if (data.description) {
          updates.description = data.description
          populatedFields.add('description')
        }
        if (data.material) {
          updates.material = data.material
          populatedFields.add('material')
        }
        if (data.dimensions) {
          updates.dimensions = data.dimensions
          populatedFields.add('dimensions')
        }

        return updates
      })
      
      setAiPopulatedFields(populatedFields)
      setShowAiSuccess(true)
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setShowAiSuccess(false), 5000)
    } catch (err: any) {
      console.error("AI Analysis error:", err)
      setError("AI was unable to analyze this image. Please fill details manually.")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      const optimized = optimizeCloudinaryUrl(imageUrl.trim())
      setFormData({
        ...formData,
        images: [...formData.images, optimized],
      })
      setImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const url = isEditing
        ? `/api/items/${initialData._id}`
        : "/api/items"
      
      const method = isEditing ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: formData.price ? Number(formData.price) : undefined,
        }),
      })

      if (res.ok) {
        router.push("/admin/items")
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || "Failed to save item")
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
          href="/admin/items"
          className="p-2 text-[#0E2A47]/50 hover:text-[#0E2A47] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="font-serif text-3xl text-[#0E2A47]">
            {isEditing ? "Edit Item" : "Add New Item"}
          </h1>
          <p className="text-[#0E2A47]/60 text-sm">
            {isEditing ? "Update item details" : "Create a new product"}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-600 px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {showAiSuccess && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 px-4 py-3 mb-6 text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          <span>AI analysis complete! Form fields have been auto-populated.</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-[#0E2A47]/10 p-6 space-y-6">
        {/* IMAGE UPLOAD SECTION - NOW AT TOP */}
        <div className="space-y-4 pb-6 border-b border-[#0E2A47]/10">
          <div className="flex items-center justify-between">
            <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block">
              Product Images *
            </label>
            <div className="flex items-center gap-3">
              {/* AI Toggle Button */}
              <button
                type="button"
                onClick={() => setUseAI(!useAI)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  useAI 
                    ? 'bg-[#C9A24D] text-white shadow-sm' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={useAI ? 'AI analysis enabled' : 'AI analysis disabled'}
              >
                <Sparkles className={`h-3.5 w-3.5 ${useAI ? '' : 'opacity-50'}`} />
                <span>{useAI ? 'AI On' : 'AI Off'}</span>
              </button>
              {isAnalyzing && (
                <span className="text-xs text-[#C9A24D] flex items-center gap-1.5 animate-pulse">
                  <Sparkles className="h-3.5 w-3.5" />
                  Analyzing...
                </span>
              )}
              {isProcessingBg && (
                <span className="text-xs text-blue-500 flex items-center gap-1.5 animate-pulse">
                  <div className="h-3.5 w-3.5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                  Removing background...
                </span>
              )}
            </div>
          </div>

          {/* Background Tools */}
          <div className="flex flex-wrap gap-4 p-3 bg-gray-50/50 border border-gray-100 rounded-lg">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setRemoveBackground(!removeBackground)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  removeBackground 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {removeBackground ? 'Auto-BG On' : 'Auto-BG Off'}
              </button>
            </div>

            {removeBackground && (
              <div className="flex flex-wrap items-center gap-4 border-l border-gray-200 pl-4">
                <div className="flex gap-1">
                  {(['custom', 'transparent'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setBackgroundType(type)}
                      className={`px-3 py-1.5 rounded text-[10px] uppercase tracking-wider font-bold transition-all ${
                        backgroundType === type
                          ? 'bg-[#0E2A47] text-white shadow-sm'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type === 'custom' ? 'Custom Color' : 'Transparent'}
                    </button>
                  ))}
                </div>

                {backgroundType === 'custom' && (
                  <div className="flex items-center gap-2 bg-white border border-gray-200 px-2 py-1 rounded-md">
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="w-6 h-6 p-0 border-0 cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      className="text-[10px] w-16 uppercase font-mono focus:outline-none"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Image Upload Area */}
          <div className={`border-2 border-dashed border-[#0E2A47]/20 p-8 text-center transition-all relative ${isUploading ? 'bg-gray-50' : 'hover:bg-[#F7F7F5] hover:border-[#C9A24D]/30'}`}>
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C9A24D] mb-3"></div>
                <span className="text-sm font-medium text-[#0E2A47] animate-pulse">Uploading image...</span>
              </div>
            )}
            
            {isProcessingBg && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10">
                <div className="h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                <span className="text-sm font-medium text-[#0E2A47]">Making it professional...</span>
                <span className="text-xs text-[#0E2A47]/60 mt-1">Removing background & applying {backgroundType} style</span>
              </div>
            )}
            
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const file = e.target.files[0]
                  setSelectedFile(file)
                  setTempImageUrl(URL.createObjectURL(file))
                  setIsCropping(true)
                }
              }}
              className="hidden"
              id="image-upload"
              disabled={isUploading || isAnalyzing}
            />
            <label htmlFor="image-upload" className={`cursor-pointer block ${isUploading || isAnalyzing ? 'opacity-50 pointer-events-none' : ''}`}>
              <Upload className="h-12 w-12 mx-auto text-[#0E2A47]/30 mb-3" />
              <span className="text-base font-medium text-[#0E2A47] block mb-2">
                Click to upload product image
              </span>
              <span className="text-sm text-[#0E2A47]/60 block mb-1">
                or drag and drop
              </span>
              <span className="text-xs text-[#0E2A47]/40 block">
                SVG, PNG, JPG or GIF (max. 10MB)
              </span>
              {useAI && (
                <span className="text-xs text-[#C9A24D] block mt-3 flex items-center justify-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  AI will automatically analyze your image
                </span>
              )}
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
              disabled={isUploading || isAnalyzing}
            />
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-[#0E2A47]/5 text-[#0E2A47] text-xs uppercase tracking-wider hover:bg-[#0E2A47]/10 transition-colors disabled:opacity-50"
              disabled={!imageUrl || isUploading || isAnalyzing}
            >
              Add URL
            </button>
          </div>

          {/* Image Preview Grid */}
          {formData.images.length > 0 && (
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-4 mt-4">
              {formData.images.map((img, idx) => (
                <div key={idx} className="relative group aspect-square bg-[#F7F7F5] overflow-hidden border border-[#0E2A47]/10">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  
                  {/* AI Re-analyze Button on first image */}
                  {idx === 0 && (
                    <button
                      type="button"
                      onClick={() => handleAIAnalysis(img)}
                      className="absolute top-1 right-1 p-1.5 bg-[#C9A24D] text-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                      title="Re-analyze with AI"
                      disabled={isAnalyzing}
                    >
                      <Sparkles className={`h-3 w-3 ${isAnalyzing ? 'animate-pulse' : ''}`} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute inset-x-0 bottom-0 bg-red-500/80 text-white py-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <span className="text-[10px] font-medium uppercase tracking-wider">Remove</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2 flex items-center gap-1.5">
            Title *
            {aiPopulatedFields.has('title') && (
              <span className="text-[#C9A24D] flex items-center gap-0.5" title="AI suggested">
                <Sparkles className="h-3 w-3" />
                <span className="text-[9px]">AI</span>
              </span>
            )}
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
              setAiPopulatedFields(prev => {
                const next = new Set(prev)
                next.delete('title')
                return next
              })
            }}
            className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
            placeholder="Enter item title"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2 flex items-center gap-1.5">
            Description *
            {aiPopulatedFields.has('description') && (
              <span className="text-[#C9A24D] flex items-center gap-0.5" title="AI suggested">
                <Sparkles className="h-3 w-3" />
                <span className="text-[9px]">AI</span>
              </span>
            )}
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value })
              setAiPopulatedFields(prev => {
                const next = new Set(prev)
                next.delete('description')
                return next
              })
            }}
            rows={4}
            className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50 resize-none"
            placeholder="Enter item description"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2 flex items-center gap-1.5">
            Category *
            {aiPopulatedFields.has('category') && (
              <span className="text-[#C9A24D] flex items-center gap-0.5" title="AI suggested">
                <Sparkles className="h-3 w-3" />
                <span className="text-[9px]">AI</span>
              </span>
            )}
          </label>
          <select
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value as CollectionType })
              setAiPopulatedFields(prev => {
                const next = new Set(prev)
                next.delete('category')
                return next
              })
            }}
            className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50 bg-white"
            required
          >
            {categories.map((cat) => (
              <option key={cat._id} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Price, Dimensions, Material */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2 flex items-center gap-1.5">
              Dimensions
              {aiPopulatedFields.has('dimensions') && (
                <span className="text-[#C9A24D] flex items-center gap-0.5" title="AI suggested">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[9px]">AI</span>
                </span>
              )}
            </label>
            <input
              type="text"
              value={formData.dimensions}
              onChange={(e) => {
                setFormData({ ...formData, dimensions: e.target.value })
                setAiPopulatedFields(prev => {
                  const next = new Set(prev)
                  next.delete('dimensions')
                  return next
                })
              }}
              className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
              placeholder="e.g., 30cm x 20cm"
            />
          </div>
          <div>
            <label className="text-[#0E2A47]/70 text-[10px] tracking-[0.2em] uppercase block mb-2 flex items-center gap-1.5">
              Material
              {aiPopulatedFields.has('material') && (
                <span className="text-[#C9A24D] flex items-center gap-0.5" title="AI suggested">
                  <Sparkles className="h-3 w-3" />
                  <span className="text-[9px]">AI</span>
                </span>
              )}
            </label>
            <input
              type="text"
              value={formData.material}
              onChange={(e) => {
                setFormData({ ...formData, material: e.target.value })
                setAiPopulatedFields(prev => {
                  const next = new Set(prev)
                  next.delete('material')
                  return next
                })
              }}
              className="w-full border border-[#0E2A47]/10 px-4 py-3 text-[#0E2A47] focus:outline-none focus:border-[#C9A24D]/50"
              placeholder="e.g., Silk, Ceramic"
            />
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end pt-4 border-t border-[#0E2A47]/10">
          <button
            type="submit"
            disabled={isSubmitting || isUploading}
            className="flex items-center gap-2 bg-[#C9A24D] text-[#0E2A47] px-8 py-3 text-xs tracking-wider uppercase font-semibold hover:bg-[#d4af5a] transition-colors disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isSubmitting ? "Saving..." : isEditing ? "Update Item" : "Create Item"}
          </button>
        </div>
      </form>

      {/* Cropper Modal */}
      {isCropping && tempImageUrl && (
        <ImageCropperModal
          image={tempImageUrl}
          aspectRatio={3/4} // Items are portraits 3:4
          onClose={() => {
            setIsCropping(false)
            setTempImageUrl(null)
            setSelectedFile(null)
          }}
          onCrop={async (blob) => {
            setIsCropping(false)
            setIsUploading(true)
            setError("")
            
            try {
              // 1. Get Signature & Credentials
              const signRes = await fetch("/api/sign-cloudinary", { method: "POST" })
              if (!signRes.ok) throw new Error("Failed to get upload signature")
              const signData = await signRes.json()
              const { signature, timestamp, folder, api_key, cloud_name } = signData

              // 2. Upload cropped blob
              const uploadFormData = new FormData()
              uploadFormData.append("file", blob, selectedFile?.name || "cropped-image.jpg")
              uploadFormData.append("api_key", api_key)
              uploadFormData.append("timestamp", timestamp.toString())
              uploadFormData.append("signature", signature)
              uploadFormData.append("folder", folder)

              const url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`
              const res = await fetch(url, {
                method: "POST",
                body: uploadFormData,
              })

              if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error?.message || "Upload failed")
              }
              
              // 2. BACKGROUND REMOVAL (Client-Side)
              let data = await res.json()
              let finalImageUrl = data.secure_url

              if (removeBackground) {
                setIsProcessingBg(true)
                try {
                  console.log("[BG] Starting client-side removal (FREE)...")
                  
                  // Use FREE client-side background removal
                  const processedBlob = await removeBackgroundClient(blob)
                  
                  // Upload processed image to Cloudinary
                  const signRes2 = await fetch("/api/sign-cloudinary", { method: "POST" })
                  if (signRes2.ok) {
                    const signData2 = await signRes2.json()
                    
                    const bgFormData = new FormData()
                    bgFormData.append("file", processedBlob, "processed_bg.png")
                    bgFormData.append("api_key", signData2.api_key)
                    bgFormData.append("timestamp", signData2.timestamp.toString())
                    bgFormData.append("signature", signData2.signature)
                    bgFormData.append("folder", signData2.folder)

                    const bgUploadUrl = `https://api.cloudinary.com/v1_1/${signData2.cloud_name}/image/upload`
                    const bgUploadRes = await fetch(bgUploadUrl, {
                      method: "POST",
                      body: bgFormData,
                    })

                    if (bgUploadRes.ok) {
                      const bgData = await bgUploadRes.json()
                      
                      // Apply background style using Cloudinary transformations
                      const baseUrl = bgData.secure_url
                      let transformation = ""
                      
                      if (backgroundType === 'custom') {
                        // Cloudinary background color requires hex without #, so we slice(1)
                        const hex = backgroundColor.startsWith('#') ? backgroundColor.slice(1) : backgroundColor
                        transformation = `b_rgb:${hex}`
                      }
                      
                      if (transformation) {
                        finalImageUrl = baseUrl.replace("/upload/", `/upload/${transformation}/`)
                      } else {
                        finalImageUrl = baseUrl // Transparent
                      }
                      
                      console.log('[BG] ✓ Processed image URL:', finalImageUrl)
                    }
                  }
                } catch (err) {
                  console.error('[BG] Error processing background:', err)
                  // Fallback to original image if BG removal fails
                } finally {
                  setIsProcessingBg(false)
                }
              }

              const optimized = optimizeCloudinaryUrl(finalImageUrl) // Apply optimization
              setFormData(prev => ({
                ...prev,
                images: [...prev.images, optimized]
              }))
              
              // 4. AUTOMATICALLY TRIGGER AI ANALYSIS on first image (if enabled)
              if (formData.images.length === 0 && useAI) {
                // This is the first image and AI is enabled, trigger AI analysis
                handleAIAnalysis(optimized)
              }
            } catch (err: any) {
              console.error("Upload error:", err)
              setError(err.message || "Failed to upload image.")
            } finally {
              setIsUploading(false)
              setIsProcessingBg(false)
              setTempImageUrl(null)
              setSelectedFile(null)
            }
          }}
        />
      )}
    </div>
  )
}
