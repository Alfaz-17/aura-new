"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Calendar, Send } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    whatsapp: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // WhatsApp redirect with form data
    const text = `Hi! I'm ${formData.name}. ${formData.message}`
    window.open(`https://wa.me/919737828614?text=${encodeURIComponent(text)}`, "_blank")
  }

  return (
    <section id="contact" className="py-24 lg:py-32 bg-[#0E2A47] text-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C9A24D] text-[10px] tracking-[0.4em] uppercase mb-6 block">
              Get In Touch
            </span>
            <h2 className="font-serif text-3xl lg:text-4xl xl:text-5xl text-white leading-tight mb-6">
              Let's Bring Your <em className="italic text-[#C9A24D]">Vision</em> to Life
            </h2>
            <p className="text-white/70 text-base lg:text-lg leading-relaxed mb-10 font-light">
              Ready to elevate your moments with curated botanical elegance? 
              Get in touch via WhatsApp or schedule a consultation.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a
                href="https://wa.me/919737828614"
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto bg-[#25D366] text-white px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enquire on WhatsApp
                </motion.button>
              </a>
              
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto bg-transparent text-[#C9A24D] border border-[#C9A24D]/60 px-8 py-4 text-[11px] tracking-[0.2em] uppercase font-medium transition-all duration-300 hover:bg-[#C9A24D]/10 flex items-center justify-center gap-3"
              >
                <Calendar className="h-4 w-4" />
                Book Appointment
              </motion.button>
            </div>

            {/* Contact Info */}
            <div className="space-y-3 text-white/50 text-sm">
              <p>📍 Bhavnagar, Gujarat, India</p>
              <p>📞 +91 97378 28614</p>
              <p>✉️ hello@auraflowers.in</p>
            </div>
          </motion.div>

          {/* Right - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div>
                <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>

              <div>
                <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 px-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors resize-none"
                  placeholder="Tell us about your requirements..."
                  required
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-[#C9A24D] text-[#0E2A47] px-8 py-5 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:bg-[#d4af5a] flex items-center justify-center gap-3"
              >
                <Send className="h-4 w-4" />
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
