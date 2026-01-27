"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { MessageCircle, Menu, X, Search, Flower2, Trees, Sprout, Leaf, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

import { useCategories } from "@/hooks/use-categories"

// ...

export function Navigation() {
  const { categories } = useCategories()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCollectionOpen, setIsCollectionOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const router = useRouter()


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
    setIsSearchOpen(false)
  }, [pathname])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#0E2A47] border-b border-[#C9A24D]/20"
      >
        <nav className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-3 h-16 lg:h-20 items-center">
            
            {/* Left Navigation - Aligned Start */}
            <div className="hidden lg:flex items-center gap-10 justify-self-start">
              <Link
                href="/"
                className={`text-[11px] tracking-[0.2em] uppercase font-medium transition-colors ${
                  pathname === "/" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
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
                      {categories.map((cat) => {
                        const Icon = cat.icon || Flower2
                        return (
                        <Link
                          key={cat._id}
                          href={`/shop?category=${cat.value}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-[10px] tracking-widest uppercase text-white/70 hover:text-[#C9A24D] hover:bg-white/5 transition-all group"
                        >
                          {cat.image ? (
                            <div className="relative h-6 w-6 rounded-sm overflow-hidden border border-white/10 group-hover:border-[#C9A24D] transition-colors">
                              <Image src={cat.image} alt="" fill className="object-cover" />
                            </div>
                          ) : (
                            <Icon className="h-4 w-4 text-white/40 group-hover:text-[#C9A24D] transition-colors" strokeWidth={1.5} />
                          )}
                          {cat.label}
                        </Link>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile Menu Button - Visible only on mobile */}
            <div className="lg:hidden justify-self-start">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 -ml-2 text-white"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

            {/* Center Logo - Aligned Center */}
            <div className="justify-self-center flex justify-center">
              <Link href="/">
                <Image
                  src="/logo.png"
                  alt="Aura"
                  width={140}
                  height={50}
                  className="h-20 lg:h-20  w-auto object-contain"
                  priority
                />
              </Link>
            </div>

            {/* Right Navigation - Aligned End */}
            <div className="flex items-center gap-6 lg:gap-8 justify-self-end">
              <Link
                href="/contact"
                className="hidden lg:block text-[11px] tracking-[0.2em] uppercase font-medium text-white/70 hover:text-white transition-colors"
              >
                Contact
              </Link>
              
              <div className="flex items-center relative">
                <AnimatePresence mode="wait">
                  {isSearchOpen ? (
                    <motion.form
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: typeof window !== 'undefined' && window.innerWidth < 640 ? 120 : 160, opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handleSearch}
                      className="absolute right-0 flex items-center bg-[#0E2A47] z-10"
                    >
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search..."
                        autoFocus
                        className="w-full bg-transparent border-b border-white/30 text-white text-xs py-1 pr-8 focus:outline-none focus:border-[#C9A24D] placeholder:text-white/40"
                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                      />
                      <button 
                        type="submit" 
                        className="absolute right-0 text-white/70 hover:text-[#C9A24D]"
                      >
                        <Search className="h-4 w-4" />
                      </button>
                    </motion.form>
                  ) : (
                    <button
                      onClick={() => setIsSearchOpen(true)}
                      aria-label="Search"
                      className="p-2 text-white/70 hover:text-white transition-colors"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  )}
                </AnimatePresence>
              </div>
              
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
                <Image src="/logo.png" alt="Aura" width={160} height={60} className="h-25 w-auto" />
                <button onClick={() => setIsMenuOpen(false)} className="p-2 text-white">
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-6 ">
                <Link href="/" onClick={() => setIsMenuOpen(false)} className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">Home</Link>
                <Link href="/about" onClick={() => setIsMenuOpen(false)} className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">About Us</Link>
                
                <div className="flex flex-col gap-3">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A24D] font-medium border-b border-[#C9A24D]/20 pb-2">
                    Collection
                  </p>
                  <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="text-lg tracking-wide uppercase text-white/80 pl-2 flex items-center gap-3 hover:text-[#C9A24D]">
                    <Sparkles className="h-4 w-4 text-[#C9A24D]" />
                    All Products
                  </Link>
                  {categories.map((cat) => {
                    // If image exists, use it. Else use Icon.
                    const Icon = cat.icon || Flower2
                    
                    return (
                    <Link
                      key={cat._id}
                      href={`/shop?category=${cat.value}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-base tracking-wide uppercase text-white/60 pl-2 flex items-center gap-3 hover:text-white group"
                    >
                      {cat.image ? (
                        <div className="relative h-6 w-6 rounded-sm overflow-hidden border border-white/10 group-hover:border-[#C9A24D] transition-colors">
                          <Image src={cat.image} alt="" fill className="object-cover" />
                        </div>
                      ) : (
                        <Icon className="h-4 w-4 text-white/40" strokeWidth={1.5} />
                      )}
                      
                      {cat.label}
                    </Link>
                    )
                  })}
                </div>

                <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="text-xl tracking-wide uppercase text-white hover:text-[#C9A24D] transition-colors">Contact</Link>
                
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
