"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { LogOut, Menu, X, Flower2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { navItems } from "./admin-sidebar"

interface AdminHeaderProps {
  user: {
    email?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0E2A47] border-b border-[#C9A24D]/20 z-50 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden text-white p-2 -ml-2"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Logo */}
      <div className="hidden lg:block">
        <span className="font-serif text-xl text-white tracking-[0.3em] uppercase">
          Aura <span className="text-[#C9A24D]">Admin</span>
        </span>
      </div>

      {/* User info & Sign out */}
      <div className="flex items-center gap-6">
        <span className="text-white/60 text-sm hidden sm:block">
          {user.email}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-2 text-white/70 hover:text-[#C9A24D] transition-colors text-sm"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:block">Sign Out</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-[80%] max-w-sm bg-[#F7F7F5] z-[70] lg:hidden flex flex-col shadow-2xl"
            >
              {/* Mobile Header */}
              <div className="h-16 flex items-center justify-between px-6 border-b border-[#0E2A47]/10 bg-white">
                <div className="flex items-center gap-2">
                  <Flower2 className="h-5 w-5 text-[#C9A24D]" />
                  <span className="font-serif text-lg text-[#0E2A47]">Aura Admin</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 -mr-2 text-[#0E2A47]/60 hover:text-[#0E2A47]"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Mobile Nav Links */}
              <nav className="flex-1 overflow-y-auto p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href || 
                    (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
                  
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                        isActive
                          ? "bg-[#0E2A47] text-white"
                          : "text-[#0E2A47]/70 hover:bg-[#0E2A47]/5 hover:text-[#0E2A47]"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile Footer */}
              <div className="p-6 border-t border-[#0E2A47]/10 bg-white">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-full bg-[#0E2A47]/5 flex items-center justify-center text-[#0E2A47] font-medium text-xs">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#0E2A47] truncate">{user.email}</p>
                    <p className="text-xs text-[#0E2A47]/50">Administrator</p>
                  </div>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/admin/login" })}
                  className="w-full flex items-center justify-center gap-2 bg-[#0E2A47]/5 text-[#0E2A47] py-2.5 rounded-lg text-sm font-medium hover:bg-[#0E2A47]/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
