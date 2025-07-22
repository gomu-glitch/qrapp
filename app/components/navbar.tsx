"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X, Truck } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-slate-900 shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center h-20">
          <Link href="/" className="flex items-center space-x-3">
            <Truck className="h-10 w-10 text-orange-500" />
            <span className="text-3xl font-bold text-white tracking-wide">FleetTracker</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-gray-200 hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/driver" className="text-gray-200 hover:text-blue-600 transition-colors">
            Driver Portal
          </Link>
          <Link href="/driver/register" className="text-gray-200 hover:text-blue-600 transition-colors">
            Driver Registration
          </Link>
          <Link href="/admin" className="text-gray-200 hover:text-blue-600 transition-colors">
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-200 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-900 border-t border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-200 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/driver"
                className="block px-3 py-2 text-gray-200 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Driver Portal
              </Link>
              <Link
                href="/driver/register"
                className="block px-3 py-2 text-gray-200 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Driver Registration
              </Link>
              <Link
                href="/admin"
                className="block px-3 py-2 text-gray-200 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Admin
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
