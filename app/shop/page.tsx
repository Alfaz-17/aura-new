"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { CategoryTabs } from "@/components/category-tabs"
import { ArrowRight } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Temporary static products until we connect to database
const fetcher = (url: string) => fetch(url).then((res) => res.json())

function ShopContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")
  const [activeCategory, setActiveCategory] = useState(categoryParam || "All")
  const [products, setProducts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam)
    }
  }, [categoryParam])

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const url = activeCategory === "All" 
          ? "/api/items"
          : `/api/items?category=${activeCategory}`
        
        const res = await fetch(url)
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        }
      } catch (error) {
        console.error("Failed to fetch products", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [activeCategory])

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category)
    if (category === "All") {
      router.push("/shop")
    } else {
      router.push(`/shop?category=${category}`)
    }
  }

  return (
    <>
      {/* Hero Banner */}
      <section className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/cinematic-floral.png"
            alt="Aura luxury floral collection"
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0E2A47]/60 via-[#0E2A47]/40 to-[#0E2A47]/70" />
        </div>

        <motion.div
          className="relative z-10 text-center text-white px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A24D] mb-4 block">Shop</span>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl mb-4">Our <em className="italic text-[#C9A24D]">Collection</em></h1>
          <p className="text-base md:text-lg text-white/70 max-w-xl mx-auto font-light tracking-wide">
            Curated botanical artistry, handcrafted with intention
          </p>
        </motion.div>
      </section>

      {/* Category Tabs */}
      <CategoryTabs 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
      />

      {/* Product Grid */}
      <section className="py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Results Count */}
          {!isLoading && (
            <div className="mb-8 flex items-center justify-between">
              <p className="text-[#0E2A47]/50 text-sm">
                Showing <span className="text-[#0E2A47] font-medium">{products.length}</span> products
              </p>
            </div>
          )}

          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
              >
                {products.length > 0 ? (
                  products.map((product, index) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                    >
                      <Link href={`/product/${product._id}`} className="group block">
                        <div className="relative aspect-[3/4] overflow-hidden bg-white mb-4">
                          <Image
                            src={product.images?.[0] || "/placeholder-image.jpg"}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-[#0E2A47]/0 group-hover:bg-[#0E2A47]/20 transition-colors duration-300" />
                          {/* Quick View */}
                          <div className="absolute inset-x-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/95 backdrop-blur-sm px-4 py-3 text-center">
                              <span className="text-[10px] tracking-[0.2em] uppercase text-[#0E2A47] font-medium">View Details</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[9px] tracking-[0.2em] text-[#C9A24D] uppercase">
                            {product.category?.replace(/-/g, " ")}
                          </p>
                          <h3 className="font-serif text-lg text-[#0E2A47] group-hover:text-[#C9A24D] transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                          <p className="text-sm text-[#0E2A47]/70">
                            ₹{product.price?.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-[#0E2A47]/50 text-lg">No products found in this category</p>
                    <button 
                      onClick={() => handleCategoryChange("All")}
                      className="mt-4 text-[#C9A24D] text-sm tracking-wider uppercase hover:underline"
                    >
                      View all products
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-[#0E2A47]/10 py-16 md:py-24 bg-[#0E2A47] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="text-[10px] tracking-[0.4em] uppercase text-[#C9A24D] mb-4 block">Bespoke Orders</span>
          <h2 className="font-serif text-3xl md:text-4xl mb-6">Looking for Something <em className="italic text-[#C9A24D]">Unique</em>?</h2>
          <p className="text-white/70 mb-8 max-w-xl mx-auto font-light">
            We create custom botanical arrangements tailored to your space and vision.
          </p>
          <a
            href="https://wa.me/919737828614"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#C9A24D] text-[#0E2A47] px-10 py-4 text-xs tracking-[0.2em] uppercase font-semibold hover:bg-[#d4af5a] transition-colors"
          >
            Enquire on WhatsApp
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    </>
  )
}



export default function ShopPage() {
  return (
    <main className="min-h-screen bg-[#F7F7F5]">
      <Navigation />
      <Suspense fallback={<LoadingSpinner />}>
        <ShopContent />
      </Suspense>
      <PremiumFooter />
    </main>
  )
}

