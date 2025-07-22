"use client"

import { useState, useEffect } from "react"
import { TruckIcon, Users, BarChart3, MapPin, Calendar, User, Phone, Mail, CreditCard } from "lucide-react"

interface Truck {
  id: string
  licensePlate: string
  model: string
  year: number
  status: "active" | "maintenance" | "available"
  driverId?: string
  driverName?: string
  lastCheckIn?: string
  location?: string
}

interface Driver {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  licenseNumber: string
  status: "pending" | "approved" | "rejected"
  assignedTruckId?: string
  createdAt: string
  lastCheckIn?: string
}

export default function AdminDashboard() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [drivers, setDrivers] = useState<Driver[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"overview" | "trucks" | "drivers">("overview")

  useEffect(() => {
    // Simulate fetching data from Firebase
    const fetchData = async () => {
      setIsLoading(true)

      // Mock truck data
      const mockTrucks: Truck[] = [
        {
          id: "truck_001",
          licensePlate: "TRK-001A",
          model: "Freightliner Cascadia",
          year: 2022,
          status: "active",
          driverId: "driver_123",
          driverName: "John Doe",
          lastCheckIn: "2024-01-21 08:30:00",
          location: "Highway 95, Mile 45",
        },
        {
          id: "truck_002",
          licensePlate: "TRK-002B",
          model: "Peterbilt 579",
          year: 2021,
          status: "active",
          driverId: "driver_456",
          driverName: "Jane Smith",
          lastCheckIn: "2024-01-21 09:15:00",
          location: "Interstate 10, Mile 120",
        },
        {
          id: "truck_003",
          licensePlate: "TRK-003C",
          model: "Kenworth T680",
          year: 2023,
          status: "available",
          lastCheckIn: "2024-01-20 17:45:00",
          location: "Depot - Bay 3",
        },
        {
          id: "truck_004",
          licensePlate: "TRK-004D",
          model: "Volvo VNL",
          year: 2020,
          status: "maintenance",
          lastCheckIn: "2024-01-19 14:20:00",
          location: "Service Center",
        },
        {
          id: "truck_005",
          licensePlate: "TRK-005E",
          model: "Mack Anthem",
          year: 2022,
          status: "active",
          driverId: "driver_789",
          driverName: "Mike Johnson",
          lastCheckIn: "2024-01-21 07:45:00",
          location: "Route 66, Mile 200",
        },
      ]

      // Mock driver data
      const mockDrivers: Driver[] = [
        {
          id: "driver_123",
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@email.com",
          phone: "(555) 123-4567",
          licenseNumber: "D123456789",
          status: "approved",
          assignedTruckId: "truck_001",
          createdAt: "2024-01-15T10:30:00Z",
          lastCheckIn: "2024-01-21 08:30:00",
        },
        {
          id: "driver_456",
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@email.com",
          phone: "(555) 234-5678",
          licenseNumber: "D234567890",
          status: "approved",
          assignedTruckId: "truck_002",
          createdAt: "2024-01-10T14:20:00Z",
          lastCheckIn: "2024-01-21 09:15:00",
        },
        {
          id: "driver_789",
          firstName: "Mike",
          lastName: "Johnson",
          email: "mike.johnson@email.com",
          phone: "(555) 345-6789",
          licenseNumber: "D345678901",
          status: "approved",
          assignedTruckId: "truck_005",
          createdAt: "2024-01-12T09:15:00Z",
          lastCheckIn: "2024-01-21 07:45:00",
        },
        {
          id: "driver_101",
          firstName: "Sarah",
          lastName: "Wilson",
          email: "sarah.wilson@email.com",
          phone: "(555) 456-7890",
          licenseNumber: "D456789012",
          status: "pending",
          createdAt: "2024-01-20T16:45:00Z",
        },
        {
          id: "driver_102",
          firstName: "Robert",
          lastName: "Brown",
          email: "robert.brown@email.com",
          phone: "(555) 567-8901",
          licenseNumber: "D567890123",
          status: "approved",
          createdAt: "2024-01-18T11:30:00Z",
        },
      ]

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setTrucks(mockTrucks)
      setDrivers(mockDrivers)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-green-100 text-green-800"
      case "maintenance":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "available":
        return "bg-slate-100 text-slate-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-600"></div>
      </div>
    )
  }

  const activeTrucks = trucks.filter((truck) => truck.status === "active").length
  const approvedDrivers = drivers.filter((driver) => driver.status === "approved").length
  const pendingDrivers = drivers.filter((driver) => driver.status === "pending").length

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Fleet Management Dashboard</h1>
          <p className="text-gray-600">Monitor and manage your truck fleet and drivers</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("overview")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "overview"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("trucks")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "trucks"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Trucks
            </button>
            <button
              onClick={() => setActiveTab("drivers")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "drivers"
                  ? "border-orange-500 text-orange-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Drivers
            </button>
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center">
                  <div className="bg-orange-100 p-3 rounded-xl">
                    <TruckIcon className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Trucks</p>
                    <p className="text-2xl font-bold text-gray-900">{trucks.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Active Trucks</p>
                    <p className="text-2xl font-bold text-gray-900">{activeTrucks}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Drivers</p>
                    <p className="text-2xl font-bold text-gray-900">{drivers.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-3 rounded-xl">
                    <Calendar className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                    <p className="text-2xl font-bold text-gray-900">{pendingDrivers}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Check-ins</h3>
              <div className="space-y-4">
                {trucks
                  .filter((truck) => truck.lastCheckIn)
                  .sort((a, b) => new Date(b.lastCheckIn!).getTime() - new Date(a.lastCheckIn!).getTime())
                  .slice(0, 5)
                  .map((truck) => (
                    <div key={truck.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <TruckIcon className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-gray-900">{truck.licensePlate}</p>
                          <p className="text-sm text-gray-600">{truck.driverName || "No driver assigned"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{truck.lastCheckIn}</p>
                        <p className="text-sm text-gray-600">{truck.location}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Trucks Tab */}
        {activeTab === "trucks" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Trucks</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Truck
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Check-in
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {trucks.map((truck) => (
                    <tr key={truck.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TruckIcon className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{truck.licensePlate}</div>
                            <div className="text-sm text-gray-500">
                              {truck.model} ({truck.year})
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-xl ${getStatusColor(truck.status)}`}
                        >
                          {truck.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {truck.driverName || "Not assigned"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {truck.lastCheckIn || "Never"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          {truck.location || "Unknown"}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Drivers Tab */}
        {activeTab === "drivers" && (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">All Drivers</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Driver
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      License
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Truck
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Check-in
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {drivers.map((driver) => {
                    const assignedTruck = trucks.find((truck) => truck.id === driver.assignedTruckId)
                    return (
                      <tr key={driver.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {driver.firstName} {driver.lastName}
                              </div>
                              <div className="text-sm text-gray-500">ID: {driver.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            <div className="flex items-center mb-1">
                              <Mail className="h-4 w-4 text-gray-400 mr-1" />
                              {driver.email}
                            </div>
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 text-gray-400 mr-1" />
                              {driver.phone}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-900">
                            <CreditCard className="h-4 w-4 text-gray-400 mr-1" />
                            {driver.licenseNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-xl ${getStatusColor(driver.status)}`}
                          >
                            {driver.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {assignedTruck ? assignedTruck.licensePlate : "Not assigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {driver.lastCheckIn || "Never"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
