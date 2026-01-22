"use client"

import { motion } from "framer-motion"

export function LoadingSpinner() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      <motion.div
        className="relative h-16 w-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 rounded-full border-2 border-[#C9A24D]/20" />
        <div className="absolute inset-0 rounded-full border-t-2 border-[#C9A24D]" />
        <div className="absolute inset-4 rounded-full border-2 border-[#0E2A47]/20" />
        <div className="absolute inset-4 rounded-full border-b-2 border-[#0E2A47]" />
      </motion.div>
    </div>
  )
}
