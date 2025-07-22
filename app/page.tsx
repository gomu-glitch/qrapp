import Link from "next/link"
import { Users, Shield, Truck, MapPin, BarChart3, Clock } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 py-20">
          {/* Header Content */}
          <div className="mb-16">
            <div className="mb-8">
              <Truck className="h-24 w-24 text-orange-500 mx-auto mb-8" />
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight">
              Fleet Management
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Professional truck fleet operations with real-time tracking and comprehensive management tools
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center max-w-4xl mx-auto">
            <Link
              href="/driver"
              className="group w-full sm:w-96 bg-orange-600 hover:bg-orange-700 text-white font-bold py-8 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-4"
            >
              <Users className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span>Driver Portal</span>
            </Link>

            <Link
              href="/admin"
              className="group w-full sm:w-96 bg-slate-600 hover:bg-slate-700 text-white font-bold py-8 px-10 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center space-x-4"
            >
              <Shield className="h-8 w-8 group-hover:scale-110 transition-transform" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-20">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-6">System Features</h2>
            <div className="w-24 h-1 bg-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Professional fleet management tools designed for maximum efficiency and reliability
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-200 hover:shadow-2xl hover:bg-white transition-all duration-300">
              <div className="bg-orange-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Truck className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">QR Code Check-In</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Quick and secure driver check-in system using advanced QR code scanning technology
              </p>
            </div>

            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-200 hover:shadow-2xl hover:bg-white transition-all duration-300">
              <div className="bg-blue-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Real-Time Tracking</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Monitor fleet location and status with comprehensive tracking and reporting capabilities
              </p>
            </div>

            <div className="group bg-slate-50 p-10 rounded-3xl border border-slate-200 hover:shadow-2xl hover:bg-white transition-all duration-300">
              <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-6">Analytics Dashboard</h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Comprehensive reporting and fleet performance analytics for operational optimization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Section */}
      <section className="py-16 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <Clock className="h-6 w-6 text-orange-500" />
            <span className="text-slate-300 font-semibold text-lg">System Status: Online</span>
          </div>
          <p className="text-slate-400 text-lg">Fleet management system operational and ready for use</p>
        </div>
      </section>
    </div>
  )
}
