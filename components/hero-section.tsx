"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image - Full Cover */}
      <div className="absolute inset-0">
        <Image
          src="/aura-hero-wide.png"
          alt="Aura – House of Flowers Storefront"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={{ objectPosition: 'center 30%' }}
        />
        
        {/* Strong Gradient Overlay (65-70%) */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(
              to bottom,
              rgba(14, 42, 71, 0.60) 0%,
              rgba(14, 42, 71, 0.50) 35%,
              rgba(14, 42, 71, 0.65) 65%,
              rgba(14, 42, 71, 0.80) 100%
            )`
          }}
        />
        
        {/* Stronger Vignette */}
        <div 
          className="absolute inset-0"
          style={{
            background: `radial-gradient(
              ellipse at center,
              transparent 20%,
              rgba(14, 42, 71, 0.40) 100%
            )`
          }}
        />
      </div>

      {/* Content - Centered */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-center w-full max-w-3xl mx-auto"
        >
          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
            className="font-serif mb-5 md:mb-6"
          >
            <span className="block text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight">
              Botanical <em className="italic text-[#C9A24D]">Elegance</em>
            </span>
            <span className="block text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.2] tracking-tight mt-1">
              & <em className="italic text-[#C9A24D]">Timeless</em> Design
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-white/85 text-base md:text-lg lg:text-xl tracking-wide font-light leading-relaxed mb-8 md:mb-10 max-w-xl mx-auto"
          >
            Luxury floral installations & bespoke arrangements<br className="hidden sm:block" />
            for refined spaces, events & celebrations.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col items-center gap-5"
          >
            {/* Primary CTA */}
            <a
              href="https://wa.me/919737828614"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto"
            >
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px rgba(201, 162, 77, 0.35)" }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-[#C9A24D] text-[#0E2A47] px-14 md:px-20 py-4 md:py-5 text-sm md:text-base tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:bg-[#d4b15a]"
              >
                Enquire Now
              </motion.button>
            </a>
            
            {/* Secondary CTA */}
            <Link href="/shop" className="group">
              <span className="text-white/70 text-sm md:text-base tracking-[0.15em] uppercase font-light flex items-center gap-2 hover:text-white transition-colors">
                View Collection
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>

          {/* Trust Signal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.3 }}
            className="text-white/40 text-xs md:text-sm tracking-[0.15em] uppercase font-light mt-14 md:mt-16"
          >
            Trusted by discerning clients in Bhavnagar since 2024
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
