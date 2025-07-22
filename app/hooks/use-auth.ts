"use client"

import { useState, useEffect, createContext, useContext } from "react"

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

interface AuthContextType {
  driver: Driver | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function useDriverAuth() {
  const [driver, setDriver] = useState<Driver | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if driver is logged in (from localStorage)
    const savedDriver = localStorage.getItem("driver")
    if (savedDriver) {
      setDriver(JSON.parse(savedDriver))
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      // Simulate API call to authenticate driver
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock driver data - in real app, this would come from Firebase
      const mockDriver: Driver = {
        id: "driver_123",
        firstName: "John",
        lastName: "Doe",
        email: email,
        phone: "(555) 123-4567",
        licenseNumber: "D123456789",
        status: "approved",
        createdAt: new Date().toISOString(),
      }

      setDriver(mockDriver)
      localStorage.setItem("driver", JSON.stringify(mockDriver))
      return true
    } catch (error) {
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setDriver(null)
    localStorage.removeItem("driver")
  }

  return {
    driver,
    isLoading,
    login,
    logout,
    isAuthenticated: !!driver,
  }
}
