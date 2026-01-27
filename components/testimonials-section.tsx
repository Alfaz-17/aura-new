"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "Absolutely breathtaking arrangements that transformed our event into something magical.",
    author: "Priya Sharma",
    role: "Wedding Client",
  },
  {
    id: 2,
    quote: "Aura made our wedding decor unforgettable. Every detail was perfect.",
    author: "Rahul & Neha",
    role: "Bhavnagar Wedding",
  },
  {
    id: 3,
    quote: "Premium botanical artistry with a personal touch. Highly recommend for any occasion.",
    author: "Meera Patel",
    role: "Corporate Event",
  },
]

export function TestimonialsSection() {
  return (
    <section className="py-24 lg:py-32 bg-[#F7F7F5]">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 lg:mb-20"
        >
          <span className="text-[#C9A24D] text-[10px] tracking-[0.4em] uppercase mb-6 block">
            Testimonials
          </span>
          <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-[#0E2A47]">
            What Our <em className="italic text-[#C9A24D]">Clients</em> Say
          </h2>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="bg-white p-8 lg:p-10 relative"
            >
              {/* Quote Icon */}
              <Quote className="h-8 w-8 text-[#C9A24D]/30 mb-6" strokeWidth={1} />
              
              {/* Quote Text */}
              <p className="text-[#0E2A47]/80 text-base lg:text-lg leading-relaxed mb-8 font-light italic">
                "{testimonial.quote}"
              </p>
              
              {/* Author */}
              <div className="border-t border-[#0E2A47]/10 pt-6">
                <p className="text-[#0E2A47] font-medium text-sm">{testimonial.author}</p>
                <p className="text-[#0E2A47]/50 text-xs tracking-wide mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
