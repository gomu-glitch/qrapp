"use client"

import { useState, useEffect } from "react"

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
}

export function useDriverAuth() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedDriver = localStorage.getItem("driver")
    if (savedDriver) {
      const driverData = JSON.parse(savedDriver)
      setDriver(driverData)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - in real app, this would call your authentication API
    if (email && password) {
      const mockDriver: Driver = {
        id: "driver_" + Date.now(),
        firstName: email.split("@")[0].split(".")[0] || "Driver",
        lastName: email.split("@")[0].split(".")[1] || "User",
        email: email,
      }

      setDriver(mockDriver)
      setIsAuthenticated(true)
      localStorage.setItem("driver", JSON.stringify(mockDriver))
    } else {
      throw new Error("Invalid credentials")
    }
  }

  const logout = () => {
    setDriver(null)
    setIsAuthenticated(false)
    localStorage.removeItem("driver")
  }

  return {
    driver,
    isAuthenticated,
    isLoading,
    login,
    logout,
  }
}
