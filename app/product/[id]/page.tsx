"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { optimizeCloudinaryUrl } from "@/lib/cloudinary"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ChevronRight, MessageCircle, ArrowLeft } from "lucide-react"
import { ProductDetailSkeleton } from "@/components/ui/loading-skeleton"

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [product, setProduct] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const res = await fetch(`/api/items/${id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        } else {
          setError(true)
        }
      } catch (err) {
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F7F7F5]">
        <Navigation />
        <ProductDetailSkeleton />
        <PremiumFooter />
      </main>
    )
  }

  if (error || !product) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <Navigation />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 pt-28 pb-6">
        <nav className="flex items-center gap-2 text-sm text-[#0E2A47]/50">
          <Link href="/" className="hover:text-[#0E2A47] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-[#0E2A47] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#0E2A47]">{product.title}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative overflow-hidden bg-white">
              <Image
                src={optimizeCloudinaryUrl(product.images?.[0]) || "/placeholder-image.jpg"}
                alt={product.title}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {/* Back button */}
            <Link
              href="/shop"
              className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-3 flex items-center gap-2 text-[#0E2A47] text-xs tracking-wider uppercase hover:bg-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Link>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:py-8"
          >
            {/* Category */}
            <p className="text-[10px] tracking-[0.3em] text-[#C9A24D] uppercase mb-4">
              {product.category?.replace(/-/g, " ")}
            </p>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0E2A47] mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <p className="text-2xl text-[#0E2A47] mb-6">
              ₹{product.price?.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-[#0E2A47]/70 leading-relaxed mb-8 font-light">
              {product.description}
            </p>

            {/* Details */}
            {product.material && (
              <div className="border-t border-[#0E2A47]/10 pt-6 mb-8">
                <h3 className="text-xs tracking-[0.2em] uppercase text-[#0E2A47] mb-4">Material</h3>
                <p className="text-[#0E2A47]/60 text-sm flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#C9A24D]" />
                  {product.material}
                </p>
              </div>
            )}

            {/* Dimensions */}
            {product.dimensions && (
              <div className="border-t border-[#0E2A47]/10 pt-6 mb-10">
                <h3 className="text-xs tracking-[0.2em] uppercase text-[#0E2A47] mb-2">Dimensions</h3>
                <p className="text-[#0E2A47]/60 text-sm">{product.dimensions}</p>
              </div>
            )}

            {/* CTA */}
            <a
              href={`https://wa.me/919737828614?text=Hi! I'm interested in the ${product.title} (₹${product.price?.toLocaleString()})`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#25D366] text-white py-5 text-sm tracking-[0.15em] uppercase font-semibold flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors"
              >
                <MessageCircle className="h-5 w-5" />
                Enquire on WhatsApp
              </motion.button>
            </a>

            <p className="text-center text-[#0E2A47]/40 text-xs mt-4 tracking-wide">
              Made with care in Bhavnagar, Gujarat
            </p>
          </motion.div>
        </div>
      </section>

      <PremiumFooter />
    </main>
  )
}
