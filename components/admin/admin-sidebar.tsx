"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, Plus, Settings, Flower2 } from "lucide-react"

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/items", label: "Items", icon: Package },
  { href: "/admin/items/new", label: "Add Item", icon: Plus },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-[#0E2A47]/10 p-6">
      {/* Brand */}
      <div className="flex items-center gap-3 mb-8 pb-6 border-b border-[#0E2A47]/10">
        <div className="w-10 h-10 bg-[#0E2A47] flex items-center justify-center">
          <Flower2 className="h-5 w-5 text-[#C9A24D]" />
        </div>
        <div>
          <p className="font-serif text-lg text-[#0E2A47]">Aura</p>
          <p className="text-[10px] text-[#0E2A47]/50 tracking-wider uppercase">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
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

      {/* Footer */}
      <div className="pt-6 border-t border-[#0E2A47]/10">
        <Link
          href="/"
          className="text-xs text-[#0E2A47]/50 hover:text-[#C9A24D] transition-colors"
        >
          ← Back to Store
        </Link>
      </div>
    </aside>
  )
}
