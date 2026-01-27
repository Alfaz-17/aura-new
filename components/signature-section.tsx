"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"
import { optimizeCloudinaryUrl } from "@/lib/cloudinary"
import { ArrowRight } from "lucide-react"

const signaturePieces = [
  {
    id: "orchid-cascade",
    title: "Cymbidium Cascade",
    description: "A breathtaking orchid installation for grand entrances",
    image: "/cinematic-orchid.png",
  },
  {
    id: "ceremonial-arch",
    title: "Ceremonial Arch",
    description: "Bespoke floral archway for wedding celebrations",
    image: "/cinematic-centerpiece.png",
  },
  {
    id: "botanical-vessel",
    title: "Vessel & Bloom",
    description: "Hand-thrown ceramic paired with singular botanical stem",
    image: "/collection_ceramic_vessels.png",
  },
]

export function SignatureSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#0E2A47] text-white">
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
            Exclusive
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-white mb-6">
            The Signature Series — <em className="italic text-[#C9A24D]">Exclusive</em> Pieces
          </h2>
          <p className="text-white/60 text-base lg:text-lg max-w-2xl mx-auto font-light">
            Our most refined and limited floral pieces — handcrafted designs for special events, interiors, and collectors.
          </p>
        </motion.div>

        {/* Signature Pieces Grid */}
        <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
          {signaturePieces.map((piece, index) => (
            <motion.div
              key={piece.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: index * 0.15 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={optimizeCloudinaryUrl(piece.image)}
                  alt={piece.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {/* Subtle overlay */}
                <div className="absolute inset-0 bg-[#0E2A47]/10 group-hover:bg-[#0E2A47]/0 transition-colors duration-500" />
                {/* Border on hover */}
                <div className="absolute inset-4 border border-[#C9A24D]/0 group-hover:border-[#C9A24D]/40 transition-all duration-500" />
              </div>
              
              <div className="text-center">
                <h3 className="font-serif text-xl lg:text-2xl text-white mb-2 group-hover:text-[#C9A24D] transition-colors">
                  {piece.title}
                </h3>
                <p className="text-white/50 text-sm font-light">
                  {piece.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-16"
        >
          <Link href="/signature">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="bg-transparent text-[#C9A24D] border border-[#C9A24D]/60 px-12 py-5 text-[11px] tracking-[0.3em] uppercase font-medium transition-all duration-300 hover:bg-[#C9A24D]/10 hover:border-[#C9A24D] inline-flex items-center gap-3"
            >
              Explore Signature Series
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
