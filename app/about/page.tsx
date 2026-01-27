"use client"

import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { PremiumFooter } from "@/components/premium-footer"
import { HeritageSection } from "@/components/heritage-section"

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20 bg-[#F7F7F5] min-h-screen">
        <AboutSection />
        <HeritageSection />
      </main>
      <PremiumFooter />
    </>
  )
}
