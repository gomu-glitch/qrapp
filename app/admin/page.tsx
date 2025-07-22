"use client"

import type React from "react"
import { useState } from "react"
import { Shield, Eye, EyeOff, Mail, Lock } from "lucide-react"
import { useRouter } from "next/navigation"
import { useFirebase } from "../hooks/use-firebase"

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="bg-slate-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Shield className="h-12 w-12 text-slate-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Admin Access</h1>
          <p className="text-xl text-slate-600">Access the fleet management dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
                <p className="text-red-700 font-semibold text-center">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-lg font-bold text-slate-700 mb-4">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-14 pr-5 py-5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-lg"
                  placeholder="tomaspancetti@gmail.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-bold text-slate-700 mb-4">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-14 pr-14 py-5 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-colors bg-slate-50 text-lg"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-5 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-4 shadow-lg text-xl"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <Shield className="h-6 w-6" />
                  <span>Access Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
