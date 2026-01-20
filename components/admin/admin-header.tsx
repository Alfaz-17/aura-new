"use client"

import { signOut } from "next-auth/react"
import { LogOut, Menu } from "lucide-react"

interface AdminHeaderProps {
  user: {
    email?: string | null
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-[#0E2A47] border-b border-[#C9A24D]/20 z-50 flex items-center justify-between px-6">
      {/* Mobile menu button */}
      <button className="lg:hidden text-white p-2 -ml-2">
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
    </header>
  )
}
