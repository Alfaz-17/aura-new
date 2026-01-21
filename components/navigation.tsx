"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { MessageCircle, Menu, X, Search, Flower2, Trees, Sprout, Leaf, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Categories with icons
const CATEGORIES = [
  { value: "artificial-flowers", label: "Artificial Flowers", icon: Flower2 },
  { value: "artificial-green-plants", label: "Artificial Green Plants", icon: Trees },
  { value: "bonsai", label: "Bonsai", icon: Sprout },
  { value: "hanging-greenery", label: "Hanging Greenery", icon: Leaf },
  { value: "decor-accessories", label: "Décor Accessories", icon: Sparkles },
]

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollectionOpen, setIsCollectionOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsCollectionOpen(false)
  }, [pathname])

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0E2A47] border-b border-[#C9A24D]/20"
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            
            {/* Left Navigation */}
            <div className="hidden lg:flex items-center gap-10">
              <Link
                href="/"
                className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors ${
                  pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/#about"
                className="text-[11px] tracking-[0.2em] uppercase font-medium text-white/70 hover:text-white transition-colors"
              >
                About Us
              </Link>
              
              {/* Collection Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setIsCollectionOpen(true)}
                onMouseLeave={() => setIsCollectionOpen(false)}
              >
                <button
                  className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors flex items-center gap-1 ${
                    pathname.startsWith("/shop") ? "text-white" : "text-white/70 hover:text-white"
                  }`}
                >
                  Collection
                </button>
                
                <AnimatePresence>
                  {isCollectionOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-0 mt-4 w-60 bg-[#0E2A47] border border-[#C9A24D]/30 shadow-2xl p-3"
                    >
                      <Link
                        href="/shop"
                        className="flex items-center gap-3 px-4 py-2.5 text-[10px] tracking-widest uppercase text-white hover:text-[#C9A24D] hover:bg-white/5 transition-all"
                      >
                        <Sparkles className="h-4 w-4 text-[#C9A24D]" />
                        All Products
                      </Link>
                      <div className="h-[1px] bg-white/10 my-2 mx-2" />
                      {CATEGORIES.map((cat) => (
                        <Link
                          key={cat.value}
                          href={`/shop?category=${cat.value}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-[10px] tracking-widest uppercase text-white/70 hover:text-[#C9A24D] hover:bg-white/5 transition-all group"
                        >
                          <cat.icon className="h-4 w-4 text-white/40 group-hover:text-[#C9A24D] transition-colors" strokeWidth={1.5} />
                          {cat.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-white"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <Image
                src="/logo.png"
                alt="Aura"
                width={140}
                height={50}
                className="h-20 lg:h-20 mt-3 w-auto"
                priority
              />
            </Link>

            {/* Right Navigation */}
            <div className="flex items-center gap-6 lg:gap-8">
              <Link
                href="/#contact"
                className="hidden lg:block text-[11px] tracking-[0.2em] uppercase font-medium text-white/70 hover:text-white transition-colors"
              >
                Contact
              </Link>
              
              <button
                aria-label="Search"
                className="hidden sm:block p-2 text-white/70 hover:text-white transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
              
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="hidden lg:block p-2 text-white/70 hover:text-white transition-colors"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-[#0E2A47]/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-y-0 left-0 w-[85%] max-w-sm z-50 bg-[#0E2A47] border-r border-[#C9A24D]/20 shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between h-20 px-6 border-b border-white/10">
                <Image src="/logo.png" alt="Aura" width={100} height={40} className="h-8 w-auto" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6">
                <Link href="/" className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">Home</Link>
                <Link href="/#about" className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">About Us</Link>
                
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24D] font-medium border-b border-[#C9A24D]/20 pb-2">
                    Collection
                  </p>
                  <Link href="/shop" className="text-lg tracking-wide uppercase text-white/80 pl-2 flex items-center gap-3 hover:text-[#C9A24D]">
                    <Sparkles className="h-4 w-4 text-[#C9A24D]" />
                    All Products
                  </Link>
                  {CATEGORIES.map((cat) => (
                    <Link
                      key={cat.value}
                      href={`/shop?category=${cat.value}`}
                      className="text-base tracking-wide uppercase text-white/60 pl-2 flex items-center gap-3 hover:text-white"
                    >
                      <cat.icon className="h-4 w-4 text-white/40" strokeWidth={1.5} />
                      {cat.label}
                    </Link>
                  ))}
                </div>

                <Link href="/#contact" className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">Contact</Link>
                
                <hr className="border-white/10 mt-4" />
                
                <a
                  href="https://wa.me/919737828614"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-[#25D366] text-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  WhatsApp Enquiry
                </a>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
