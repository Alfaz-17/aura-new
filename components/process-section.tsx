"use client"

import { motion } from "framer-motion"
import { MessageSquare, Palette, Flower, Truck } from "lucide-react"

const steps = [
  {
    icon: MessageSquare,
    title: "Consultation",
    description: "Understand your vision and requirements",
  },
  {
    icon: Palette,
    title: "Curation",
    description: "Tailored floral design plan crafted for you",
  },
  {
    icon: Flower,
    title: "Crafting",
    description: "Hand-selected botanicals arranged with care",
  },
  {
    icon: Truck,
    title: "Delivery & Setup",
    description: "Punctual and professional installation",
  },
]

export function ProcessSection() {
  return (
    <section className="py-24 lg:py-32 bg-white">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-[#C9A24D] text-[10px] tracking-[0.4em] uppercase mb-6 block">
            How We Work
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#0E2A47]">
            Our Crafting <em className="italic text-[#C9A24D]">Process</em>
          </h2>
        </motion.div>

        {/* Steps */}
        <div className="grid md:grid-cols-4 gap-8 lg:gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="text-center relative"
            >
              {/* Step Number */}
              <div className="text-[#C9A24D]/20 font-serif text-6xl absolute -top-4 left-1/2 -translate-x-1/2">
                {index + 1}
              </div>
              
              {/* Icon */}
              <div className="relative z-10 mb-6 flex justify-center">
                <div className="w-16 h-16 bg-[#0E2A47] flex items-center justify-center">
                  <step.icon className="h-7 w-7 text-[#C9A24D]" strokeWidth={1.5} />
                </div>
              </div>
              
              {/* Content */}
              <h3 className="font-serif text-lg text-[#0E2A47] mb-2">{step.title}</h3>
              <p className="text-[#0E2A47]/60 text-sm font-light leading-relaxed">
                {step.description}
              </p>

              {/* Connector line (except last) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-[1px] bg-[#C9A24D]/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
