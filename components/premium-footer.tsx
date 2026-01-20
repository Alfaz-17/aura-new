"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export function PremiumFooter() {
  const footerLinks = {
    collections: [
      { label: "The Archive", href: "/archive" },
      { label: "Signature Series", href: "/signature" },
      { label: "Interior Botanicals", href: "/interior" },
      { label: "Decorative Vessels", href: "/vessels" },
      { label: "Wedding & Events", href: "/ceremonial" },
    ],
    theHouse: [
      { label: "Our Story", href: "/about" },
      { label: "Gujarat Florist", href: "/ceremonial" },
      { label: "Bespoke Artistry", href: "/artistry" },
      { label: "Sustainability", href: "/sustainability" },
    ],
    connect: [
      { label: "Contact Us", href: "/contact" },
      { label: "Book Appointment", href: "/appointment" },
      { label: "Store Locator", href: "/location" },
      { label: "Care Guide", href: "/care" },
    ],
  }

  return (
    <footer className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-24">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Newsletter / Invite */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-1"
          >
            <h3 className="font-serif text-2xl mb-4 italic">The Invitation</h3>
            <p className="text-background/60 text-sm mb-6 leading-relaxed">
              Join our private list for botanical insights and early access to our seasonal signature series.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full bg-transparent border-0 border-b border-background/30 py-3 text-sm placeholder:text-background/40 focus:outline-none focus:border-accent transition-colors"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.2em] uppercase hover:text-accent transition-colors">
                Join
              </button>
            </div>
          </motion.div>

          {/* Collections links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h4 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-background/40">Collections</h4>
            <ul className="space-y-4">
              {footerLinks.collections.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-background/80 hover:text-accent tracking-widest transition-colors uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* House links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h4 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-background/40">The House</h4>
            <ul className="space-y-4">
              {footerLinks.theHouse.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-background/80 hover:text-accent tracking-widest transition-colors uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h4 className="text-[10px] tracking-[0.3em] uppercase mb-8 text-background/40">Connect</h4>
            <ul className="space-y-4">
              {footerLinks.connect.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-background/80 hover:text-accent tracking-widest transition-colors uppercase">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <Link href="/" className="font-serif text-2xl tracking-[0.4em] uppercase text-accent">
              Aura
            </Link>
            <div className="flex items-center gap-6">
              <a href="https://instagram.com" className="text-background/40 hover:text-accent transition-colors" aria-label="Instagram">
                <Instagram className="h-4 w-4 stroke-[1.2]" />
              </a>
              <a href="https://facebook.com" className="text-background/40 hover:text-accent transition-colors" aria-label="Facebook">
                <Facebook className="h-4 w-4 stroke-[1.2]" />
              </a>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 text-[9px] tracking-[0.3em] uppercase text-background/30">
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-background/60 transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-background/60 transition-colors">
                Terms
              </Link>
            </div>
            <span>© 2024 Aura – House of Flowers. Bhavnagar, Gujarat.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
