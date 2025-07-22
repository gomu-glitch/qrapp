
"use client"

import { useState, useEffect } from "react"

interface TruckInfo {
  id: string
  licensePlate: string
  model: string
  status: string
  driverId?: string
}

interface DriverCheckIn {
  driverId: string
  truckId: string
  timestamp: string
  status: string
}

export function useFirebase() {
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    setIsConnected(true)
  }, [])

  const checkInDriver = async (truckId: string, driverId: string): Promise<DriverCheckIn> => {
    const response = await fetch("https://tpancetti.app.n8n.cloud/webhook/registrar-ingreso", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: driverId,
        truck_id: truckId,
        timestamp: new Date().toISOString(),
      }),
    })

    if (!response.ok) {
      throw new Error("Error al registrar ingreso en n8n")
    }

    const result = await response.json()

    return {
      driverId: driverId,
      truckId: truckId,
      timestamp: new Date().toISOString(),
      status: "success",
    }
  }

  return {
    isConnected,
    checkInDriver,
  }
}
