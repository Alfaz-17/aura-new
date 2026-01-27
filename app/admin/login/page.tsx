"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Flower2, Lock, Mail, AlertCircle } from "lucide-react"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/admin/dashboard"
  
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError("Invalid email or password")
      } else if (result?.ok) {
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-md"
    >
      {/* Logo */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C9A24D]/20 mb-4">
          <Flower2 className="h-8 w-8 text-[#C9A24D]" />
        </div>
        <h1 className="font-serif text-3xl text-white">Aura Admin</h1>
        <p className="text-white/50 text-sm mt-2">Sign in to manage your store</p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 flex items-center gap-3 text-sm"
          >
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </motion.div>
        )}

        <div>
          <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
              placeholder="admin@aurahouseofflowers.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="text-white/50 text-[10px] tracking-[0.2em] uppercase block mb-2">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 pl-12 pr-4 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#C9A24D]/50 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#C9A24D] text-[#0E2A47] py-4 text-[11px] tracking-[0.2em] uppercase font-semibold transition-all duration-300 hover:bg-[#d4af5a] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      <p className="text-white/30 text-xs text-center mt-8">
        © 2024 Aura – House of Flowers
      </p>
    </motion.div>
  )
}

function LoginLoading() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="animate-pulse text-white/50">Loading...</div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#0E2A47] flex items-center justify-center px-6">
      <Suspense fallback={<LoginLoading />}>
        <LoginForm />
      </Suspense>
    </div>
  )
}

