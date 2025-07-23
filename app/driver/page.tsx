"use client"

import { useState, useCallback } from "react"
import { Camera, Truck, User, CheckCircle, ArrowLeft, UserPlus, AlertCircle, RefreshCw } from "lucide-react"
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
  const [scanError, setScanError] = useState<string | null>(null)
  const { checkInDriver, getTruckInfo } = useFirebase()
  const { driver, isAuthenticated, login, logout, isLoading: authLoading } = useDriverAuth()

  const handleScanSuccess = useCallback(
    async (result: string) => {
      console.log("Scan success received:", result)

      // Immediately set loading and stop scanning to prevent stuttering
      setIsLoading(true)
      setScanResult(result)
      setIsScanning(false)
      setScanError(null)

      try {
        const truckId = result
        const truck = await getTruckInfo(truckId)
        setTruckInfo(truck)

        const checkInResult = await checkInDriver(truckId, driver?.id || "")
        setDriverInfo(checkInResult)
      } catch (error) {
        console.error("Error processing scan:", error)
        setScanError("Failed to process QR code. Please try again.")
        // Reset states on error so user can try again
        setScanResult(null)
        setTruckInfo(null)
        setDriverInfo(null)
      } finally {
        setIsLoading(false)
      }
    },
    [driver?.id, checkInDriver, getTruckInfo],
  )

  const handleScanError = useCallback((error: string) => {
    console.error("Scan error:", error)
    setScanError(error)
  }, [])

  const resetScan = () => {
    setScanResult(null)
    setDriverInfo(null)
    setTruckInfo(null)
    setIsScanning(false)
    setScanError(null)
  }

  const startScanning = () => {
    setScanError(null)
    setScanResult(null) // Clear any previous results
    setIsScanning(true)
  }

  const retryScanning = () => {
    setScanError(null)
    setScanResult(null)
    setIsScanning(false)
    // Force a re-render by toggling state
    setTimeout(() => {
      setIsScanning(true)
    }, 100)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-orange-600 mx-auto mb-8"></div>
          <p className="text-2xl font-bold text-slate-900">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
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
            <User className="h-24 w-24 text-orange-600 mx-auto mb-8" />
            <h1 className="text-5xl font-bold text-slate-900 mb-6">Driver Login</h1>
            <p className="text-2xl text-slate-600">Enter your credentials to continue</p>
          </div>

          {/* Login Form */}
          <div className="mb-16">
            <DriverLogin onLogin={login} isLoading={authLoading} />
          </div>

          {/* Registration Section */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-12 text-center">
            <UserPlus className="h-16 w-16 text-green-600 mx-auto mb-8" />
            <h3 className="text-3xl font-bold text-slate-900 mb-6">New Driver?</h3>
            <p className="text-xl text-slate-600 mb-10">Create your account to get started</p>
            <Link
              href="/driver/register"
              className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-6 px-12 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg text-2xl"
            >
              Register Now
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <div className="flex justify-between items-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center space-x-3 text-slate-600 hover:text-slate-800 text-xl font-semibold"
          >
            <ArrowLeft className="h-6 w-6" />
            <span>Back to Home</span>
          </Link>
          <button
            onClick={logout}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-xl text-lg"
          >
            Logout
          </button>
        </div>

        {/* Welcome Header */}
        <div className="text-center mb-16">
          <User className="h-24 w-24 text-orange-600 mx-auto mb-8" />
          <h1 className="text-4xl font-bold text-slate-900 mb-6">Welcome, {driver?.firstName}!</h1>
          <p className="text-xl text-slate-600">Scan your truck's QR code to check in</p>
        </div>

        {/* Error Display */}
        {scanError && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-red-700 font-bold">Scanner Error</p>
                <p className="text-red-600">{scanError}</p>
              </div>
            </div>
            <button
              onClick={retryScanning}
              className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Retry Scanner</span>
            </button>
          </div>
        )}

        {!scanResult && !isScanning && !isLoading && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
            <Camera className="h-32 w-32 text-blue-600 mx-auto mb-12" />
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Ready to Check In?</h2>
            <p className="text-lg text-slate-600 mb-8">Press the button below to start scanning</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <p className="text-blue-700 text-sm font-medium">📱 Camera Tips:</p>
              <ul className="text-blue-600 text-sm mt-2 space-y-1">
                <li>• Make sure you allow camera permissions</li>
                <li>• Hold your device steady</li>
                <li>• Ensure good lighting</li>
                <li>• Point directly at the QR code</li>
              </ul>
            </div>
            <button
              onClick={startScanning}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              START SCANNER
            </button>
          </div>
        )}

        {isScanning && !isLoading && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="p-8 bg-blue-600 text-white text-center">
              <h2 className="text-2xl font-bold mb-4">Scanner Active</h2>
              <p className="text-lg">Point your camera at the QR code</p>
              <p className="text-sm mt-2 opacity-90">The scanner will automatically detect and process the code</p>
            </div>
            <QRScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />
            <div className="p-8 space-y-4">
              <button
                onClick={() => setIsScanning(false)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-xl text-lg"
              >
                CANCEL SCANNER
              </button>
              <button
                onClick={retryScanning}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-xl text-sm flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>RESTART SCANNER</span>
              </button>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16 text-center">
            <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-orange-600 mx-auto mb-12"></div>
            <h3 className="text-3xl font-bold text-slate-900 mb-4">Processing QR Code...</h3>
            <p className="text-xl text-slate-600">Please wait while we verify your truck</p>
          </div>
        )}

        {scanResult && !isLoading && (
          <div className="space-y-12">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-16">
              <div className="flex items-center justify-center space-x-6 mb-12">
                <CheckCircle className="h-16 w-16 text-green-600" />
                <h2 className="text-3xl font-bold text-slate-900">SUCCESS!</h2>
              </div>

              {truckInfo && (
                <div className="bg-green-50 rounded-2xl p-12 mb-12 border-2 border-green-200">
                  <div className="flex items-center justify-center space-x-6 mb-8">
                    <Truck className="h-12 w-12 text-orange-600" />
                    <h3 className="font-bold text-slate-900 text-3xl">Truck Information</h3>
                  </div>
                  <div className="space-y-4 text-slate-700 text-xl text-center">
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
                      <span className="font-bold text-green-600">Status: ACTIVE</span>
                    </p>
                  </div>
                </div>
              )}

              <div className="text-center bg-blue-50 rounded-2xl p-8 border-2 border-blue-200">
                <p className="font-bold text-2xl text-slate-900 mb-2">Check-in: {new Date().toLocaleString()}</p>
                <p className="text-green-700 font-bold text-3xl">HAVE A SAFE TRIP!</p>
              </div>
            </div>

            <button
              onClick={resetScan}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-xl text-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              SCAN ANOTHER TRUCK
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
