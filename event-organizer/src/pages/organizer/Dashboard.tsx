"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { Calendar, Users, Package, MapPin, TrendingUp } from "lucide-react"

type DashboardStats = {
  totalEvents: number
  totalReservations: number
  totalOffers: number
  totalSpaces: number
  upcomingReservations: number
}

const OrganizerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalEvents: 0,
    totalReservations: 0,
    totalOffers: 0,
    totalSpaces: 0,
    upcomingReservations: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("/korisnici/statistika")
        setStats(response.data)
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Učitavam...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Nadzorna ploča organizatora</h1>
        <p className="mt-1 text-sm text-gray-500">Pregled vaših događaja, rezervacija, ponuda i prostora.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ukupno događaja</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalEvents}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/organizer/events" className="font-medium text-indigo-600 hover:text-indigo-500">
                Prikaži sve
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ukupno rezervacija</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalReservations}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/organizer/reservations" className="font-medium text-indigo-600 hover:text-indigo-500">
                Prikaži sve
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ukupno ponuda</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalOffers}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/organizer/offers" className="font-medium text-indigo-600 hover:text-indigo-500">
                Prikaži sve
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Ukupno prostora</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalSpaces}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/organizer/spaces" className="font-medium text-indigo-600 hover:text-indigo-500">
                Prikaži sve
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">Nadolazeće rezervacije</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Vaše najnovije rezervacije koje zahtijevaju pažnju.</p>
          </div>
          <div className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
            <TrendingUp className="h-4 w-4 text-yellow-600 mr-1" />
            <span className="text-sm font-medium text-yellow-800">{stats.upcomingReservations} na čekanju</span>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <Link
            to="/organizer/reservations"
            className="block text-sm font-medium text-indigo-600 hover:text-indigo-500 text-center py-4"
          >
            Prikaži sve rezervacije
          </Link>
        </div>
      </div>
    </div>
  )
}

export default OrganizerDashboard
