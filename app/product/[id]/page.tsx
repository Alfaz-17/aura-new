"use client"

import { use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PremiumFooter } from "@/components/premium-footer"
import { ChevronRight, MessageCircle, ArrowLeft } from "lucide-react"

// Static products (matching shop page)
const staticProducts = [
  {
    id: "elegant-orchid",
    name: "Elegant Orchid Arrangement",
    price: 4500,
    category: "artificial-flowers",
    image: "/luxury-artificial-orchid-arrangement.jpg",
    description: "Premium silk orchid blooms that bring timeless elegance to any space.",
    longDescription: "This exquisite orchid arrangement features hand-selected premium silk blooms, meticulously arranged to capture the natural beauty and grace of real Phalaenopsis orchids. Each petal is crafted with attention to detail, creating lifelike textures and gentle color gradients. Perfect for offices, living rooms, or as a stunning centerpiece.",
    materials: ["Premium silk orchid blooms", "Natural-touch leaves", "Handcrafted ceramic pot", "Preserved moss base"],
    dimensions: "Height: 60cm | Width: 35cm",
  },
  {
    id: "botanical-stone",
    name: "Botanical Stone Accent",
    price: 3200,
    category: "artificial-flowers",
    image: "/minimal-botanical-arrangement-on-stone.jpg",
    description: "Minimalist botanical arrangement on natural stone.",
    longDescription: "A harmonious blend of natural stone and carefully placed botanicals, this accent piece embodies modern minimalism. The weighted stone base provides stability while creating a striking visual anchor for any tabletop or shelf.",
    materials: ["Natural stone base", "Faux botanicals", "UV-resistant coating"],
    dimensions: "Height: 25cm | Base: 15cm",
  },
  {
    id: "floral-wall",
    name: "Grand Floral Wall Installation",
    price: 25000,
    category: "hanging-greenery",
    image: "/large-artificial-floral-installation-wall.jpg",
    description: "Large-scale floral installation for dramatic impact.",
    longDescription: "Transform any space with this breathtaking wall installation. Featuring a cascading arrangement of premium artificial flowers and greenery, this piece creates an unforgettable focal point for weddings, events, or permanent installations in luxury spaces.",
    materials: ["Premium silk flowers", "Wire frame structure", "Mounting hardware included", "Customizable color palette"],
    dimensions: "Custom sizing available",
  },
  {
    id: "luxury-greenery",
    name: "Luxury Interior Greenery",
    price: 8500,
    category: "artificial-green-plants",
    image: "/luxury-interior-with-artificial-floral-installatio.jpg",
    description: "Transform your interior with lush greenery.",
    longDescription: "Bring the outdoors in with this sophisticated greenery arrangement. Designed for luxury interiors, this piece features a variety of premium faux plants that require zero maintenance while providing year-round freshness and vitality.",
    materials: ["Premium faux plants", "Decorative planter", "Natural-looking soil cover"],
    dimensions: "Height: 120cm | Planter: 40cm",
  },
  {
    id: "ceramic-pot",
    name: "Ceramic Gradient Pot",
    price: 1800,
    category: "decor-accessories",
    image: "/ceramic-gradient-pot-minimal.jpg",
    description: "Handcrafted ceramic pot with subtle gradient finish.",
    longDescription: "Each pot is hand-thrown and finished with our signature gradient glaze technique. The organic shape and subtle color transitions make it perfect as a standalone piece or paired with our botanical arrangements.",
    materials: ["Hand-thrown ceramic", "Gradient glaze finish", "Drainage hole with plug"],
    dimensions: "Height: 22cm | Diameter: 18cm",
  },
  {
    id: "console-table",
    name: "Handcrafted Console Table",
    price: 18500,
    category: "decor-accessories",
    image: "/minimal-handcrafted-console-table.jpg",
    description: "Artisan-made console table perfect for floral displays.",
    longDescription: "This minimalist console table is handcrafted by local artisans using sustainable materials. Its clean lines and natural finish provide the perfect backdrop for showcasing our botanical arrangements.",
    materials: ["Solid mango wood", "Hand-finished natural stain", "Steel accents"],
    dimensions: "Length: 120cm | Height: 80cm | Depth: 35cm",
  },
]

function getProductById(id: string) {
  return staticProducts.find((p) => p.id === id)
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const product = getProductById(id)

  if (!product) {
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
          <span className="text-[#0E2A47]">{product.name}</span>
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
                src={product.image}
                alt={product.name}
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
              {product.category.replace(/-/g, " ")}
            </p>

            {/* Title */}
            <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#0E2A47] mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-2xl text-[#0E2A47] mb-6">
              ₹{product.price.toLocaleString()}
            </p>

            {/* Description */}
            <p className="text-[#0E2A47]/70 leading-relaxed mb-8 font-light">
              {product.longDescription}
            </p>

            {/* Details */}
            <div className="border-t border-[#0E2A47]/10 pt-6 mb-8">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#0E2A47] mb-4">Materials</h3>
              <ul className="space-y-2">
                {product.materials.map((material, i) => (
                  <li key={i} className="text-[#0E2A47]/60 text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C9A24D]" />
                    {material}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dimensions */}
            <div className="border-t border-[#0E2A47]/10 pt-6 mb-10">
              <h3 className="text-xs tracking-[0.2em] uppercase text-[#0E2A47] mb-2">Dimensions</h3>
              <p className="text-[#0E2A47]/60 text-sm">{product.dimensions}</p>
            </div>

            {/* CTA */}
            <a
              href={`https://wa.me/919737828614?text=Hi! I'm interested in the ${product.name} (₹${product.price.toLocaleString()})`}
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
