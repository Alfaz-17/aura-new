"use client"

import { Navigation } from "@/components/navigation"
import { ContactSection } from "@/components/contact-section"
import { PremiumFooter } from "@/components/premium-footer"

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 bg-[#F7F7F5] min-h-screen">
        <ContactSection />
      </main>
      <PremiumFooter />
    </>
  )
}
