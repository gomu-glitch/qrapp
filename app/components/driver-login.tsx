"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

interface DriverLoginProps {
  onLogin: (email: string, password: string) => Promise<void>
  isLoading: boolean
}

export default function DriverLogin({ onLogin, isLoading }: DriverLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await onLogin(email, password)
    } catch (err) {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12">
      <form onSubmit={handleSubmit} className="space-y-10">
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-700 font-bold text-xl">{error}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-xl font-bold text-slate-700 mb-4">
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
              className="block w-full pl-16 pr-6 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-colors bg-slate-50 text-lg"
              placeholder="Enter your email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xl font-bold text-slate-700 mb-4">
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
              className="block w-full pl-16 pr-16 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-colors bg-slate-50 text-lg"
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
          className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-xl"
        >
          {isLoading ? "LOGGING IN..." : "LOGIN"}
        </button>
      </form>
    </div>
  )
}
