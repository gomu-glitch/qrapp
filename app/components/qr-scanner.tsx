"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Html5Qrcode, Html5QrcodeScannerState } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (result: string) => void
  onScanError: (error: string) => void
}

// Function to validate if QR code contains expected truck ID format
const isValidTruckQR = (qrText: string): boolean => {
  // Exact format: 4 letters + dash + 2 numbers (e.g., ABCD-12)
  const truckPlatePattern = /^[A-Z]{4}-\d{2}$/i

  return truckPlatePattern.test(qrText.trim())
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const html5QrCodeRef = useRef<Html5Qrcode | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [cameras, setCameras] = useState<any[]>([])
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(true)
  const [hasScanned, setHasScanned] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  // Debouncing and rate limiting refs
  const lastScanTime = useRef<number>(0)
  const lastScanText = useRef<string>("")
  const scanCooldown = useRef<NodeJS.Timeout | null>(null)
  const processingTimeout = useRef<NodeJS.Timeout | null>(null)

  // Heavily debounced scan success handler
  const handleScanSuccess = useCallback(
    (decodedText: string) => {
      const now = Date.now()
      const trimmedText = decodedText.trim()

      // Prevent rapid-fire scanning (minimum 1 second between scans)
      if (now - lastScanTime.current < 1000) {
        return
      }

      // Prevent processing if already processing or already scanned
      if (hasScanned || isProcessing) {
        return
      }

      // Prevent processing the same QR code repeatedly
      if (trimmedText === lastScanText.current) {
        return
      }

      // Clear any existing cooldown
      if (scanCooldown.current) {
        clearTimeout(scanCooldown.current)
      }

      // Set cooldown to prevent multiple rapid scans
      scanCooldown.current = setTimeout(() => {
        // Validate QR code format
        if (!isValidTruckQR(trimmedText)) {
          console.log("Invalid QR code format, ignoring:", trimmedText)
          // Reset for next scan attempt
          lastScanTime.current = now
          lastScanText.current = trimmedText
          return
        }

        // Valid QR code detected
        console.log("Valid truck QR Code detected:", trimmedText)

        // Set processing state immediately
        setIsProcessing(true)
        setHasScanned(true)
        lastScanTime.current = now
        lastScanText.current = trimmedText

        // Stop scanning immediately
        stopScanning().then(() => {
          // Add small delay to ensure UI updates
          processingTimeout.current = setTimeout(() => {
            onScanSuccess(trimmedText)
          }, 100)
        })
      }, 300) // 300ms debounce delay
    },
    [hasScanned, isProcessing, onScanSuccess],
  )

  const stopScanning = async () => {
    if (html5QrCodeRef.current && isScanning) {
      try {
        const state = html5QrCodeRef.current.getState()
        if (state === Html5QrcodeScannerState.SCANNING) {
          await html5QrCodeRef.current.stop()
        }
        setIsScanning(false)
      } catch (err) {
        console.error("Stop scanning error:", err)
      }
    }
  }

  const startScanning = async (html5QrCode: Html5Qrcode, cameraId: string) => {
    try {
      const config = {
        fps: 5, // Further reduced FPS to minimize processing
        qrbox: { width: 200, height: 200 }, // Smaller scan area
        aspectRatio: 1.0,
        disableFlip: false,
        experimentalFeatures: {
          useBarCodeDetectorIfSupported: true,
        },
      }

      await html5QrCode.start(cameraId, config, handleScanSuccess, (errorMessage) => {
        // Completely suppress error messages to reduce noise
        // Only log critical errors
        if (errorMessage.includes("Camera") || errorMessage.includes("Permission")) {
          console.warn("Critical QR scan error:", errorMessage)
        }
      })

      setIsScanning(true)
      setError(null)
      setHasScanned(false)
      setIsProcessing(false)

      // Reset tracking variables
      lastScanTime.current = 0
      lastScanText.current = ""
    } catch (err: any) {
      console.error("Start scanning error:", err)
      setError(`Scanning error: ${err.message}`)
      onScanError(err.message)
    }
  }

  useEffect(() => {
    const initializeCamera = async () => {
      try {
        setIsInitializing(true)
        setHasScanned(false)
        setIsProcessing(false)

        // Get available cameras
        const devices = await Html5Qrcode.getCameras()
        console.log("Available cameras:", devices)

        if (devices && devices.length > 0) {
          setCameras(devices)
          // Prefer back camera if available, otherwise use first camera
          const backCamera = devices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear") ||
              device.label.toLowerCase().includes("environment"),
          )
          const cameraToUse = backCamera || devices[0]
          setSelectedCamera(cameraToUse.id)

          // Initialize Html5Qrcode
          const html5QrCode = new Html5Qrcode("qr-reader")
          html5QrCodeRef.current = html5QrCode

          // Start scanning
          await startScanning(html5QrCode, cameraToUse.id)
        } else {
          throw new Error("No cameras found")
        }
      } catch (err: any) {
        console.error("Camera initialization error:", err)
        setError(`Camera error: ${err.message || "Unable to access camera"}`)
        onScanError(err.message || "Camera initialization failed")
      } finally {
        setIsInitializing(false)
      }
    }

    initializeCamera()

    return () => {
      // Cleanup all timeouts
      if (scanCooldown.current) {
        clearTimeout(scanCooldown.current)
      }
      if (processingTimeout.current) {
        clearTimeout(processingTimeout.current)
      }
      stopScanning()
    }
  }, [])

  const switchCamera = async () => {
    if (cameras.length > 1 && html5QrCodeRef.current && !hasScanned && !isProcessing) {
      try {
        await stopScanning()

        const currentIndex = cameras.findIndex((cam) => cam.id === selectedCamera)
        const nextIndex = (currentIndex + 1) % cameras.length
        const nextCamera = cameras[nextIndex]

        setSelectedCamera(nextCamera.id)
        setHasScanned(false)
        setIsProcessing(false)

        // Reset tracking variables
        lastScanTime.current = 0
        lastScanText.current = ""

        await startScanning(html5QrCodeRef.current, nextCamera.id)
      } catch (err: any) {
        console.error("Switch camera error:", err)
        setError(`Camera switch error: ${err.message}`)
      }
    }
  }

  if (error) {
    return (
      <div className="w-full p-8 text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
          <p className="text-red-700 font-bold text-lg mb-4">Camera Error</p>
          <p className="text-red-600 mb-4">{error}</p>
          <div className="text-sm text-red-500 space-y-2">
            <p>Troubleshooting steps:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Make sure you allowed camera permissions</li>
              <li>Check if another app is using the camera</li>
              <li>Try refreshing the page</li>
              <li>Ensure you're using HTTPS (required for camera access)</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {isInitializing && (
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing camera...</p>
        </div>
      )}

      <div id="qr-reader" className="w-full"></div>

      {isScanning && !hasScanned && !isProcessing && cameras.length > 1 && (
        <div className="text-center mt-4">
          <button
            onClick={switchCamera}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
          >
            Switch Camera ({cameras.length} available)
          </button>
        </div>
      )}

      {isScanning && !hasScanned && !isProcessing && (
        <div className="text-center mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">📷 Camera is active</p>
            <p className="text-green-600 text-sm">Point your camera at a truck QR code</p>
            <div className="mt-2 text-xs text-green-600">
              <p>Expected format: ABCD-12 (4 letters, dash, 2 numbers)</p>
              <p className="mt-1 text-green-500">Hold steady for best results</p>
            </div>
          </div>
        </div>
      )}

      {isProcessing && (
        <div className="text-center mt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <p className="text-blue-700 font-medium">Processing QR Code...</p>
            </div>
            <p className="text-blue-600 text-sm mt-1">Please wait</p>
          </div>
        </div>
      )}

      {hasScanned && !isProcessing && (
        <div className="text-center mt-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-700 font-medium">✅ Valid Truck QR Code Detected!</p>
            <p className="text-green-600 text-sm">Finalizing scan result...</p>
          </div>
        </div>
      )}
    </div>
  )
}
