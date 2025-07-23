"use client"

// Mock Firebase integration - replace with actual Firebase calls
export function useFirebase() {
  const registerDriver = async (driverData: any) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("Driver registered:", driverData)
    return { success: true, id: "driver_" + Date.now() }
  }

  const loginAdmin = async (email: string, password: string) => {
    // Simulate admin login
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email === "tomaspancetti@gmail.com" && password === "admin123") {
      return { success: true, role: "admin" }
    }
    throw new Error("Invalid credentials")
  }

  const checkInDriver = async (truckId: string, driverId: string) => {
    // Simulate check-in process
    await new Promise((resolve) => setTimeout(resolve, 1500))
    return {
      success: true,
      checkInTime: new Date().toISOString(),
      truckId,
      driverId,
    }
  }

  const getTruckInfo = async (truckId: string) => {
    // Simulate getting truck information
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Handle the specific truck plate format: ABCD-12
    let processedTruckId = truckId
    const licensePlate = truckId.toUpperCase() // Use the plate as-is since it's already in correct format

    // Validate the format matches ABCD-12
    if (!/^[A-Z]{4}-\d{2}$/i.test(truckId)) {
      throw new Error("Invalid truck plate format. Expected format: ABCD-12")
    }

    // Generate internal truck ID from the plate
    const letters = truckId.substring(0, 4)
    const numbers = truckId.substring(5, 7)
    processedTruckId = `truck_${letters}_${numbers}`

    return {
      id: processedTruckId,
      licensePlate: licensePlate,
      model: "Freightliner Cascadia",
      year: 2022,
      status: "active",
      originalQR: truckId, // Keep original QR for reference
    }
  }

  return {
    registerDriver,
    loginAdmin,
    checkInDriver,
    getTruckInfo,
  }
}
