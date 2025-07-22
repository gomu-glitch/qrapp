"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

interface QRScannerProps {
  onScanSuccess: (result: string) => void
  onScanError: (error: string) => void
}

export default function QRScanner({ onScanSuccess, onScanError }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (!isInitialized) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
        },
        false,
      )

      scanner.render(
        (decodedText) => {
          onScanSuccess(decodedText)
          scanner.clear()
        },
        (error) => {
          // Handle scan errors silently for better UX
          // Only log actual errors, not "No QR code found" messages
          if (!error.includes("No QR code found")) {
            onScanError(error)
          }
        },
      )

      scannerRef.current = scanner
      setIsInitialized(true)
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error)
      }
    }
  }, [isInitialized, onScanSuccess, onScanError])

  return (
    <div className="w-full">
      <div id="qr-reader" className="w-full"></div>
    </div>
  )
}
