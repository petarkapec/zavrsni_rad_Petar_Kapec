"use client"

import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Calendar, User, LogOut } from "lucide-react"

export function OrganizerNavbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/organizer" className="flex items-center space-x-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              <span className="text-xl font-bold text-blue-900">OrganizatorDogađaja</span>
            </Link>

            <div className="hidden md:flex space-x-6">
              <Link
                to="/organizer"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/organizer")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/organizer/create-event"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/organizer/create-event")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Kreiraj događaj
              </Link>
              <Link
                to="/organizer/events"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/organizer/events")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Moji događaji
              </Link>
              <Link
                to="/organizer/reservations"
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive("/organizer/reservations")
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                Rezervacije
              </Link>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Dobrodošli, {user?.ime}</span>
            <Link to="/organizer/profile">
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
