"use client"

import Link from "next/link"
import { Truck } from "lucide-react"

export default function Navbar() {
  return (
    <nav className="bg-slate-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Truck className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-white tracking-wide">FleetTracker</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}
