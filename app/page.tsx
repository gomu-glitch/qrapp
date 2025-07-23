import Link from "next/link"
import { Users, Shield, Truck } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-20">
            <Truck className="h-32 w-32 text-orange-500 mx-auto mb-12" />
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-bold text-slate-900 mb-8">Fleet Management</h1>
            <p className="text-2xl sm:text-3xl text-slate-600 mb-16 font-medium">Choose your access level</p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-6">
            <Link
              href="/driver"
              className="block w-full max-w-xl mx-auto bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-4">
                <Users className="h-8 w-8" />
                <span>I AM A DRIVER</span>
              </div>
            </Link>

            <Link
              href="/admin"
              className="block w-full max-w-xl mx-auto bg-slate-600 hover:bg-slate-700 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
            >
              <div className="flex items-center justify-center space-x-4">
                <Shield className="h-8 w-8" />
                <span>I AM AN ADMIN</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
