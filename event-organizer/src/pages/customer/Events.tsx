"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { Calendar, Search, Filter, MapPin, Users } from "lucide-react"

type Event = {
  dogadjajId: number
  naziv: string
  opis: string
  ukCijenaPoOsobi: string | null
  ukCijenaFiksna: string | null
  otkazniRok: number
  korisnik: number | null
  prostorId: number
  prostorNaziv: string
  prostorAdresa: string
  prostorKapacitet: number
  organizatorIme: string
  organizatorPrezime: string
  dogadjajPonudaPonudas: number[]
  slikaUrl?: string
}

type FilterOptions = {
  minPrice: number
  maxPrice: number
  minCapacity: number
  maxCapacity: number
}

const CustomerEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    minPrice: 0,
    maxPrice: 2000,
    minCapacity: 0,
    maxCapacity: 1000,
  })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await api.get("/dogadjaji/svi")
        console.log("Fetched events:", response.data)

        // The API already returns all the data we need, no need for additional fetching
        setEvents(response.data)
        setFilteredEvents(response.data)
      } catch (error) {
        console.error("Error fetching events:", error)
        setError("Neuspješno učitavanje događaja. Molimo pokušajte kasnije.")
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    // Add console logs to debug the filtering and rendering process
    // In the useEffect that handles filtering, add this at the beginning:
    console.log("Current events array:", events)
    console.log("Current filtered events before filtering:", filteredEvents)

    // Apply filters and search
    let result = events

    // Apply search term
    if (searchTerm) {
      result = result.filter(
        (event) =>
          (event.naziv && event.naziv.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (event.opis && event.opis.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (event.prostorNaziv && event.prostorNaziv.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (event.prostorAdresa && event.prostorAdresa.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // Apply filters
    result = result.filter((event) => {
      try {
        // Calculate total price more carefully
        const fixedPrice = event.ukCijenaFiksna ? Number.parseFloat(event.ukCijenaFiksna) : 0
        const perPersonPrice = event.ukCijenaPoOsobi ? Number.parseFloat(event.ukCijenaPoOsobi) : 0
        const totalMinPrice = fixedPrice + perPersonPrice

        // Check if the event has valid capacity
        const capacity = event.prostorKapacitet || 0

        // Debug individual filter results
        const priceInRange = totalMinPrice >= filterOptions.minPrice && totalMinPrice <= filterOptions.maxPrice
        const capacityInRange = capacity >= filterOptions.minCapacity && capacity <= filterOptions.maxCapacity

        if (!priceInRange) {
          console.log(
            `Event ${event.dogadjajId} filtered out by price: ${totalMinPrice}€ (range: ${filterOptions.minPrice}-${filterOptions.maxPrice}€)`,
          )
        }

        if (!capacityInRange) {
          console.log(
            `Event ${event.dogadjajId} filtered out by capacity: ${capacity} (range: ${filterOptions.minCapacity}-${filterOptions.maxCapacity})`,
          )
        }

        return priceInRange && capacityInRange
      } catch (e) {
        console.error("Error filtering event:", event.dogadjajId, e)
        return false
      }
    })

    setFilteredEvents(result)

    // And at the end of the useEffect, add:
    console.log("Filtered events after applying filters:", result)
  }, [searchTerm, filterOptions, events])

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFilterOptions((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value),
    }))
  }

  // Helper function to safely format price
  const formatPrice = (price: string | null): string => {
    if (!price) return "0.00"
    try {
      return Number.parseFloat(price).toFixed(2)
    } catch (e) {
      return "0.00"
    }
  }

  // Also, let's modify the calculateMinPrice function to be more robust:
  const calculateMinPrice = (event: Event): number => {
    try {
      const fixedPrice = event.ukCijenaFiksna ? Number.parseFloat(event.ukCijenaFiksna) : 0
      const perPersonPrice = event.ukCijenaPoOsobi ? Number.parseFloat(event.ukCijenaPoOsobi) : 0
      return fixedPrice + perPersonPrice
    } catch (e) {
      console.error("Error calculating price for event:", event.dogadjajId, e)
      return 0
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Učitavam događaje...</div>
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
        <div className="flex">
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 hover:text-red-600"
            >
              Pokušaj ponovo
            </button>
          </div>
        </div>
      </div>
    )
  }

  // In the return statement, just before rendering the grid of events, add:
  console.log("About to render events:", filteredEvents)
  console.log("Number of events to render:", filteredEvents.length)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pregledaj događaje</h1>
        <p className="mt-1 text-sm text-gray-500">Pronađite i rezervirajte svoj savršeni događaj.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Pretraži događaje, lokacije..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filteri
        </button>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-md shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Opcije filtera</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="minPrice" className="block text-sm font-medium text-gray-700">
                Minimalna cijena (€)
              </label>
              <input
                type="range"
                id="minPrice"
                name="minPrice"
                min="0"
                max="2000"
                step="10"
                value={filterOptions.minPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{filterOptions.minPrice} €</div>
            </div>
            <div>
              <label htmlFor="maxPrice" className="block text-sm font-medium text-gray-700">
                Maksimalna cijena (€)
              </label>
              <input
                type="range"
                id="maxPrice"
                name="maxPrice"
                min="0"
                max="2000"
                step="10"
                value={filterOptions.maxPrice}
                onChange={handleFilterChange}
                className="mt-1 block w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{filterOptions.maxPrice} €</div>
            </div>
            <div>
              <label htmlFor="minCapacity" className="block text-sm font-medium text-gray-700">
                Minimalni kapacitet
              </label>
              <input
                type="range"
                id="minCapacity"
                name="minCapacity"
                min="0"
                max="1000"
                step="10"
                value={filterOptions.minCapacity}
                onChange={handleFilterChange}
                className="mt-1 block w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{filterOptions.minCapacity} osoba</div>
            </div>
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                Maksimalni kapacitet
              </label>
              <input
                type="range"
                id="maxCapacity"
                name="maxCapacity"
                min="0"
                max="1000"
                step="10"
                value={filterOptions.maxCapacity}
                onChange={handleFilterChange}
                className="mt-1 block w-full"
              />
              <div className="text-sm text-gray-500 mt-1">{filterOptions.maxCapacity} osoba</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredEvents.length > 0 ? (
          <>
            {console.log("Rendering events:", filteredEvents)}
            {filteredEvents.map((event, index) => {
              console.log(`Rendering event ${index}:`, event)
              return (
                <Link
                  key={event.dogadjajId}
                  to={`/customer/events/${event.dogadjajId}`}
                  className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-300"
                >
                  <div className="h-40 bg-gray-200 flex items-center justify-center overflow-hidden">
                    {event.slikaUrl ? (
                      <img
                        src={event.slikaUrl || "/placeholder.svg"}
                        alt={event.naziv}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to icon if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = "none"
                          target.nextElementSibling?.classList.remove("hidden")
                        }}
                      />
                    ) : (
                      <Calendar className="h-12 w-12 text-gray-400" />
                    )}
                    {event.slikaUrl && <Calendar className="h-12 w-12 text-gray-400 hidden" />}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-indigo-600 truncate">{event.naziv}</h3>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{event.opis}</p>
                    <div className="mt-4 flex items-center">
                      <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500 truncate">{event.prostorNaziv || "Nepoznato mjesto"}</p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                      <p className="text-sm text-gray-500">Do {event.prostorKapacitet || 0} gostiju</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {event.ukCijenaFiksna && Number(event.ukCijenaFiksna) > 0 ? (
                          <span className="flex flex-col">
                            <span>Od {calculateMinPrice(event).toFixed(2)} €</span>
                            {event.ukCijenaFiksna && Number(event.ukCijenaFiksna) > 0 && (
                              <span className="text-xs text-gray-500">
                                Fiksno: {formatPrice(event.ukCijenaFiksna)} €
                              </span>
                            )}
                            {event.ukCijenaPoOsobi && Number(event.ukCijenaPoOsobi) > 0 && (
                              <span className="text-xs text-gray-500">
                                Po osobi: {formatPrice(event.ukCijenaPoOsobi)} €
                              </span>
                            )}
                          </span>
                        ) : (
                          <span>Od {calculateMinPrice(event).toFixed(2)} €</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        Od {event.organizatorIme || "Organizator"} {event.organizatorPrezime || ""}
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </>
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            Nema pronađenih događaja koji odgovaraju vašim kriterijima.
          </div>
        )}
      </div>

      {events.length > 0 && filteredEvents.length === 0 && (
        <div className="text-center">
          <button
            onClick={() => {
              setSearchTerm("")
              setFilterOptions({
                minPrice: 0,
                maxPrice: 2000,
                minCapacity: 0,
                maxCapacity: 1000,
              })
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Očisti sve filtere
          </button>
        </div>
      )}
    </div>
  )
}

export default CustomerEvents
