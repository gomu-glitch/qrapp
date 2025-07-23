"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, CreditCard, Lock, Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import { useFirebase } from "../../hooks/use-firebase"
import Link from "next/link"

export default function DriverRegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    licenseNumber: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const { registerDriver } = useFirebase()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      setIsLoading(false)
      return
    }

    try {
      await registerDriver(formData)
      setIsSuccess(true)
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
            <CheckCircle className="h-24 w-24 text-green-600 mx-auto mb-8" />
            <h1 className="text-4xl font-bold text-slate-900 mb-6">Registration Successful!</h1>
            <p className="text-xl text-slate-600 mb-12">
              Your account has been created. You can now log in to access the driver portal.
            </p>
            <Link
              href="/driver"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              GO TO LOGIN
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Link
          href="/driver"
          className="inline-flex items-center space-x-3 text-slate-600 hover:text-slate-800 mb-12 text-xl font-semibold"
        >
          <ArrowLeft className="h-6 w-6" />
          <span>Back to Login</span>
        </Link>

        {/* Page Header */}
        <div className="text-center mb-16">
          <User className="h-24 w-24 text-green-600 mx-auto mb-8" />
          <h1 className="text-5xl font-bold text-slate-900 mb-6">Driver Registration</h1>
          <p className="text-2xl text-slate-600">Create your account</p>
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
                <p className="text-red-700 font-bold text-xl">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label htmlFor="firstName" className="block text-xl font-bold text-slate-700 mb-4">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="block w-full px-6 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="John"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-xl font-bold text-slate-700 mb-4">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="block w-full px-6 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-xl font-bold text-slate-700 mb-4">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="john.doe@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xl font-bold text-slate-700 mb-4">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="(555) 123-4567"
                />
              </div>
            </div>

            <div>
              <label htmlFor="licenseNumber" className="block text-xl font-bold text-slate-700 mb-4">
                Driver's License Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <CreditCard className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="licenseNumber"
                  name="licenseNumber"
                  type="text"
                  required
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-4 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="D123456789"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xl font-bold text-slate-700 mb-4">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="h-6 w-6 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xl font-bold text-slate-700 mb-4">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="block w-full pl-12 pr-12 py-4 border-2 border-slate-300 rounded-xl focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-colors bg-slate-50 text-lg"
                  placeholder="Confirm password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
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
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg text-xl"
            >
              {isLoading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
