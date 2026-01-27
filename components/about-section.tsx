"use client"

import { motion } from "framer-motion"
import { Flower2, Heart, Calendar, Gift } from "lucide-react"

const highlights = [
  { icon: Calendar, label: "Founded 2024" },
  { icon: Flower2, label: "Custom Floral Art" },
  { icon: Heart, label: "Wedding Division" },
  { icon: Gift, label: "Premium Botanicals" },
]

export function AboutSection() {
  return (
    <section id="about" className="py-24 lg:py-32 bg-[#F7F7F5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C9A24D] text-[10px] tracking-[0.4em] uppercase mb-6 block">
              About Us
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#0E2A47] leading-tight mb-8">
              Our Story — Where Every <em className="italic text-[#C9A24D]">Bloom</em> Tells a Tale
            </h2>
            <p className="text-[#0E2A47]/70 text-base lg:text-lg leading-relaxed mb-8 font-light">
              Aura – House of Flowers is a luxury floral atelier based in Bhavnagar, Gujarat. 
              We blend floral artistry with refined boutique sensibilities to craft experiences 
              that feel personal, elegant, and unforgettable.
            </p>
            <p className="text-[#0E2A47]/60 text-sm lg:text-base leading-relaxed font-light">
              Each arrangement and installation is meticulously planned and designed 
              to elevate your moments into memories.
            </p>

            {/* Highlights */}
            <div className="grid grid-cols-2 gap-4 mt-12">
              {highlights.map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-center gap-3 text-[#0E2A47]/80"
                >
                  <item.icon className="h-5 w-5 text-[#C9A24D]" strokeWidth={1.5} />
                  <span className="text-sm tracking-wide">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] relative overflow-hidden">
              <img
                src="/aura-hero-premium.png"
                alt="Aura – House of Flowers Storefront"
                className="w-full h-full object-cover"
              />
              {/* Decorative border */}
              <div className="absolute inset-4 border border-[#C9A24D]/30 pointer-events-none" />
            </div>
            {/* Floating badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="absolute -bottom-8 -left-8 bg-[#0E2A47] text-white p-6 lg:p-8"
            >
              <span className="font-serif text-3xl lg:text-4xl text-[#C9A24D]">2024</span>
              <span className="block text-[10px] tracking-[0.3em] uppercase mt-1 text-white/70">Est.</span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
