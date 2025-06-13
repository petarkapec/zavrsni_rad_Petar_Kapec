"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { Calendar, BookOpen, Clock } from "lucide-react"

type DashboardStats = {
  totalReservations: number
  upcomingEvents: number
  featuredEvents: Array<{
    dogadjaj_id: number
    naziv: string
    opis: string
    prostor_naziv: string
    uk_cijena_po_osobi: number
    uk_cijena_fiksna: number
  }>
}

const CustomerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalReservations: 0,
    upcomingEvents: 0,
    featuredEvents: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get("korisnici/statistika/kupac")
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
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Customer Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">Overview of your reservations and upcoming events.</p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">My Reservations</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.totalReservations}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/customer/reservations" className="font-medium text-indigo-600 hover:text-indigo-500">
                View all
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Upcoming Events</dt>
                  <dd>
                    <div className="text-lg font-medium text-gray-900">{stats.upcomingEvents}</div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-5 py-3">
            <div className="text-sm">
              <Link to="/customer/events" className="font-medium text-indigo-600 hover:text-indigo-500">
                Browse events
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Featured Events</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Check out these popular events.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {stats.featuredEvents.length > 0 ? (
              stats.featuredEvents.map((event) => (
                <li key={event.dogadjaj_id} className="px-4 py-4 sm:px-6">
                  <Link to={`/events/${event.dogadjaj_id}`} className="block hover:bg-gray-50">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-600 truncate">{event.naziv}</p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              From {event.uk_cijena_fiksna + event.uk_cijena_po_osobi} €
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="flex items-center text-sm text-gray-500">
                            <p className="truncate">{event.prostor_naziv}</p>
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>Book now</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 text-center text-gray-500">No featured events available.</li>
            )}
          </ul>
        </div>
        <div className="bg-gray-50 px-4 py-4 sm:px-6">
          <Link
            to="/customer/events"
            className="w-full flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse All Events
          </Link>
        </div>
      </div>
    </div>
  )
}

export default CustomerDashboard
