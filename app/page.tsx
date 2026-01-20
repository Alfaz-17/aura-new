"use client"

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { AboutSection } from "@/components/about-section"
import { ArchiveSection } from "@/components/archive-section"
import { SignatureSection } from "@/components/signature-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { ProcessSection } from "@/components/process-section"
import { ContactSection } from "@/components/contact-section"
import { PremiumFooter } from "@/components/premium-footer"
import { motion, useScroll, useSpring } from "framer-motion"

export default function HomePage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <>
      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] bg-[#C9A24D] origin-left z-[60]"
        style={{ scaleX }}
      />
      
      <Navigation />
      
      <main className="relative bg-[#F7F7F5] overflow-hidden">
        {/* 1. Hero Section */}
        <HeroSection />

        {/* 2. About Section */}
        <AboutSection />

        {/* 3. The Archive - Collections */}
        <ArchiveSection />

        {/* 4. Signature Series */}
        <SignatureSection />

        {/* 5. Testimonials */}
        <TestimonialsSection />

        {/* 6. How We Work - Process */}
        <ProcessSection />

        {/* 7. Contact Section */}
        <ContactSection />
      </main>

      <PremiumFooter />
    </>
  )
}
