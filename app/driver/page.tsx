"use client"

import { useState } from "react"
import { Camera, Truck, User, CheckCircle, LogOut, UserPlus } from "lucide-react"
import QRScanner from "../components/qr-scanner"
import DriverLogin from "../components/driver-login"
import { useFirebase } from "../hooks/use-firebase"
import { useDriverAuth } from "../hooks/use-auth"
import Link from "next/link"

export default function DriverPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [driverInfo, setDriverInfo] = useState<any>(null)
  const [truckInfo, setTruckInfo] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { checkInDriver, getTruckInfo } = useFirebase()
  const { driver, isAuthenticated, login, logout, isLoading: authLoading } = useDriverAuth()

  const handleScanSuccess = async (result: string) => {
    setIsLoading(true)
    setScanResult(result)
    setIsScanning(false)

    try {
      const truckId = result
      const truck = await getTruckInfo(truckId)
      setTruckInfo(truck)

      const checkInResult = await checkInDriver(truckId, driver?.id || "")
      setDriverInfo(checkInResult)
    } catch (error) {
      console.error("Error processing scan:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetScan = () => {
    setScanResult(null)
    setDriverInfo(null)
    setTruckInfo(null)
    setIsScanning(false)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 py-16">
        <div className="max-w-lg mx-auto px-4 sm:px-6">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="bg-orange-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <User className="h-12 w-12 text-orange-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-4">Driver Portal</h1>
            <p className="text-xl text-slate-600">Access your fleet management dashboard</p>
          </div>

          {/* Login Form */}
          <div className="mb-12">
            <DriverLogin onLogin={login} isLoading={authLoading} />
          </div>

          {/* Registration Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
            <div className="bg-green-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-8">
              <UserPlus className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">New Driver?</h3>
            <p className="text-slate-600 mb-8 text-lg">
              Create your account to get started with the fleet management system.
            </p>
            <Link
              href="/driver/register"
              className="inline-flex items-center space-x-3 bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-lg"
            >
              <UserPlus className="h-6 w-6" />
              <span>Register Now</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="bg-orange-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <User className="h-12 w-12 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome, {driver?.firstName}!</h1>
          <p className="text-xl text-slate-600 mb-6">Scan the QR code on your assigned truck to check in</p>

          <button
            onClick={logout}
            className="inline-flex items-center space-x-2 text-slate-500 hover:text-slate-700 transition-colors font-semibold"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>

        {!scanResult && !isScanning && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center">
            <div className="bg-blue-100 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-10">
              <Camera className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to Check In?</h2>
            <p className="text-slate-600 mb-10 text-lg leading-relaxed">
              Tap the button below to activate the QR code scanner and check in with your assigned truck
            </p>
            <button
              onClick={() => setIsScanning(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 px-8 rounded-2xl text-xl transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-4 shadow-lg"
            >
              <Camera className="h-7 w-7" />
              <span>Start QR Scanner</span>
            </button>
          </div>
        )}

        {isScanning && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 bg-blue-600 text-white text-center">
              <h2 className="text-2xl font-bold mb-3">QR Scanner Active</h2>
              <p className="text-blue-100 text-lg">Point your camera at the QR code on your truck's dashboard</p>
            </div>
            <QRScanner onScanSuccess={handleScanSuccess} onScanError={(error) => console.error("Scan error:", error)} />
            <div className="p-8">
              <button
                onClick={() => setIsScanning(false)}
                className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold py-4 px-6 rounded-2xl transition-colors text-lg"
              >
                Cancel Scanner
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-600 mx-auto mb-8"></div>
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Processing Check-In</h3>
            <p className="text-slate-600 font-medium text-lg">Please wait while we verify your information...</p>
          </div>
        )}

        {scanResult && !isLoading && (
          <div className="space-y-8">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-10">
              <div className="flex items-center space-x-4 mb-8">
                <CheckCircle className="h-10 w-10 text-green-600" />
                <h2 className="text-3xl font-bold text-slate-900">Check-In Successful!</h2>
              </div>

              {truckInfo && (
                <div className="bg-slate-50 rounded-2xl p-8 mb-8 border border-slate-200">
                  <div className="flex items-center space-x-4 mb-6">
                    <Truck className="h-8 w-8 text-orange-600" />
                    <h3 className="font-bold text-slate-900 text-2xl">Truck Information</h3>
                  </div>
                  <div className="space-y-3 text-slate-700 text-lg">
                    <p>
                      <span className="font-bold">Truck ID:</span> {truckInfo.id}
                    </p>
                    <p>
                      <span className="font-bold">License Plate:</span> {truckInfo.licensePlate}
                    </p>
                    <p>
                      <span className="font-bold">Model:</span> {truckInfo.model}
                    </p>
                    <p>
                      <span className="font-bold">Status:</span>
                      <span className="text-green-600 font-bold ml-2">Active</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="text-slate-600 bg-green-50 rounded-2xl p-6 border border-green-200">
                <p className="font-semibold text-lg mb-2">Check-in time: {new Date().toLocaleString()}</p>
                <p className="text-green-700 font-bold text-xl">Have a safe trip!</p>
              </div>
            </div>

            <button
              onClick={resetScan}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-6 px-8 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-xl"
            >
              Scan Another Truck
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
