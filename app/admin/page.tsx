"use client"

import type React from "react"
import { useState } from "react"
import { Shield, Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFirebase } from "../hooks/use-firebase"
import Link from "next/link"

export default function AdminPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const { loginAdmin } = useFirebase()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await loginAdmin(email, password)
      router.push("/admin/dashboard")
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center space-x-3 text-slate-600 hover:text-slate-800 mb-12 text-xl font-semibold"
        >
          <ArrowLeft className="h-6 w-6" />
          <span>Back to Home</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <Shield className="h-24 w-24 text-slate-600 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Admin Login</h1>
          <p className="text-xl text-slate-600">Access the management dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12">
          <form onSubmit={handleSubmit} className="space-y-10">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-700 font-bold text-xl">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-2xl font-bold text-slate-700 mb-6">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Mail className="h-8 w-8 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-16 pr-6 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-slate-200 focus:border-slate-500 transition-colors bg-slate-50 text-lg"
                  placeholder="tomaspancetti@gmail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-2xl font-bold text-slate-700 mb-6">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Lock className="h-8 w-8 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-16 pr-16 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-slate-200 focus:border-slate-500 transition-colors bg-slate-50 text-lg"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-6 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-8 w-8 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-8 w-8 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-xl"
            >
              {isLoading ? "LOGGING IN..." : "ACCESS DASHBOARD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
