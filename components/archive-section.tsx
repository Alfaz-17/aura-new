"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Flower2, Trees, Sprout, Leaf, Sparkles } from "lucide-react"
import { optimizeCloudinaryUrl } from "@/lib/cloudinary"

// Categories matching the database schema
const categories = [
  {
    value: "artificial-flowers",
    label: "Artificial Flowers",
    description: "Lifelike silk blooms that never fade",
    image: "/luxury-artificial-orchid-arrangement.jpg",
    icon: Flower2,
    featured: true,
  },
  {
    value: "artificial-green-plants",
    label: "Artificial Green Plants",
    description: "Lush greenery for any space",
    image: "/luxury-interior-with-artificial-floral-installatio.jpg",
    icon: Trees,
    featured: false,
  },
  {
    value: "bonsai",
    label: "Bonsai",
    description: "Miniature botanical art pieces",
    image: "/minimal-botanical-arrangement-on-stone.jpg",
    icon: Sprout,
    featured: false,
  },
  {
    value: "hanging-greenery",
    label: "Hanging Greenery",
    description: "Cascading installations & wall pieces",
    image: "/large-artificial-floral-installation-wall.jpg",
    icon: Leaf,
    featured: true,
  },
  {
    value: "decor-accessories",
    label: "Décor Accessories",
    description: "Vessels, pots & finishing touches",
    image: "/ceramic-gradient-pot-minimal.jpg",
    icon: Sparkles,
    featured: false,
  },
]

export function ArchiveSection() {
  return (
    <section id="collections" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-[#C9A24D] text-[10px] tracking-[0.4em] uppercase mb-6 block">
            Our Collections
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#0E2A47] mb-6">
            Explore by <em className="italic text-[#C9A24D]">Category</em>
          </h2>
          <p className="text-[#0E2A47]/60 text-base lg:text-lg max-w-2xl mx-auto font-light">
            Discover our curated collections, thoughtfully organized to help you find the perfect botanical piece.
          </p>
        </motion.div>

        {/* Featured Categories - Large Cards */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 mb-8">
          {categories.filter(c => c.featured).map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link 
                href={`/shop?category=${category.value}`} 
                className="group block relative overflow-hidden"
              >
                <div className="aspect-[16/9] lg:aspect-[16/10] relative">
                  <Image
                    src={optimizeCloudinaryUrl(category.image)}
                    alt={category.label}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Premium Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A47]/90 via-[#0E2A47]/40 to-transparent" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-6 left-6 w-12 h-12 bg-[#C9A24D]/20 backdrop-blur-sm border border-[#C9A24D]/40 flex items-center justify-center">
                    <category.icon className="h-5 w-5 text-[#C9A24D]" strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 lg:p-10 flex flex-col justify-end">
                    <h3 className="font-serif text-2xl lg:text-3xl text-white mb-2 group-hover:text-[#C9A24D] transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-white/70 text-sm lg:text-base font-light mb-4 max-w-md">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-2 text-[#C9A24D] text-xs tracking-[0.2em] uppercase">
                      <span>Browse Collection</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Other Categories - Smaller Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.filter(c => !c.featured).map((category, index) => (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            >
              <Link 
                href={`/shop?category=${category.value}`} 
                className="group block relative overflow-hidden"
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    src={optimizeCloudinaryUrl(category.image)}
                    alt={category.label}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E2A47]/85 via-[#0E2A47]/30 to-transparent" />
                  
                  {/* Icon */}
                  <div className="absolute top-4 left-4 w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-[#C9A24D]/20 group-hover:border-[#C9A24D]/40 transition-colors">
                    <category.icon className="h-4 w-4 text-white group-hover:text-[#C9A24D] transition-colors" strokeWidth={1.5} />
                  </div>
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-5 lg:p-6 flex flex-col justify-end">
                    <h3 className="font-serif text-lg lg:text-xl text-white mb-1 group-hover:text-[#C9A24D] transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-white/60 text-xs font-light mb-3 line-clamp-2">
                      {category.description}
                    </p>
                    <div className="flex items-center gap-1.5 text-[#C9A24D] text-[10px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Explore</span>
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-14 lg:mt-20"
        >
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-[#0E2A47] text-white px-12 py-5 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:bg-[#1a3d5c] inline-flex items-center gap-3"
            >
              View All Products
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
