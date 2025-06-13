"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { Calendar, Clock, Check, X, AlertTriangle, Users, MapPin, List } from "lucide-react"

type Reservation = {
  rezervacijaId: number
  dogadjajNaziv: string
  prostorNaziv: string
  korisnikIme: string
  korisnikPrezime: string
  korisnikEmail: string
  datumPocetka: string
  datumZavrsetka: string
  ukupnaCijena: number
  status: "CEKA_POTVRDU" | "PLACENO" | "OTKAZANO"
  brojGostiju: number
  posebniZahtjevi?: string
  gosti: Array<{
    ime: string
    prezime: string
    email: string
  }>
}

const OrganizerReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "paid" | "cancelled">("all")
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [showGuestListModal, setShowGuestListModal] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Update the fetchReservations function to also fetch event and time slot data
  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get("/rezervacije")
      console.log("Fetched organizer reservations:", response.data)

      // Fetch additional data for each reservation
      const enhancedReservations = await Promise.all(
        response.data.map(async (reservation: any) => {
          try {
            // Fetch event details
            const eventResponse = await api.get(`/rezervacije/${reservation.rezervacijaId}/dogadjaj`)
            const event = eventResponse.data

            // Fetch time slot details
            const terminResponse = await api.get(`/rezervacije/${reservation.rezervacijaId}/termin`)
            const termin = terminResponse.data

            // Make sure gosti is always an array
            if (!reservation.gosti) {
              reservation.gosti = []
            }

            // Combine all data
            return {
              ...reservation,
              dogadjajNaziv: event.naziv || "Unknown Event",
              prostorNaziv: event.prostorNaziv || "Unknown Venue",
              datumPocetka: termin.datumPocetka || new Date().toISOString(),
              datumZavrsetka: termin.datumZavrsetka || new Date().toISOString(),
              brojGostiju: reservation.gosti.length,
            }
          } catch (error) {
            console.error(`Error fetching details for reservation ${reservation.rezervacijaId}:`, error)
            // Return reservation with default values if fetching additional data fails
            return {
              ...reservation,
              dogadjajNaziv: "Unknown Event",
              prostorNaziv: "Unknown Venue",
              datumPocetka: new Date().toISOString(),
              datumZavrsetka: new Date().toISOString(),
              brojGostiju: reservation.gosti ? reservation.gosti.length : 0,
              gosti: reservation.gosti || [],
            }
          }
        }),
      )

      setReservations(enhancedReservations)
    } catch (error) {
      console.error("Failed to fetch reservations", error)
      setError("Failed to load reservations. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [])

  const handleCancelReservation = async (id: number) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        setLoading(true)
        await api.put(`/rezervacije/${id}/cancel`)
        fetchReservations()
      } catch (error) {
        console.error("Failed to cancel reservation", error)
        setError("Failed to cancel the reservation. Please try again.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handleConfirmReservation = async (id: number) => {
    try {
      setLoading(true)
      await api.put(`/rezervacije/${id}/confirm`)
      fetchReservations()
    } catch (error) {
      console.error("Failed to confirm reservation", error)
      setError("Failed to confirm the reservation. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      return dateString
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CEKA_POTVRDU":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </span>
        )
      case "PLACENO":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Paid
          </span>
        )
      case "OTKAZANO":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center">
            <X className="h-3 w-3 mr-1" />
            Cancelled
          </span>
        )
      default:
        return null
    }
  }

  const filteredReservations = reservations.filter((reservation) => {
    switch (activeTab) {
      case "pending":
        return reservation.status === "CEKA_POTVRDU"
      case "paid":
        return reservation.status === "PLACENO"
      case "cancelled":
        return reservation.status === "OTKAZANO"
      default:
        return true
    }
  })

  const showReservationDetails = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowDetailsModal(true)
  }

  const showGuestList = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowGuestListModal(true)
  }

  if (loading && reservations.length === 0) {
    return <div className="flex justify-center items-center h-64">Loading reservations...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Reservations</h1>
        <p className="mt-1 text-sm text-gray-500">Manage all reservations for your events.</p>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("all")}
            className={`${
              activeTab === "all"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            All ({reservations.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`${
              activeTab === "pending"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Pending ({reservations.filter((r) => r.status === "CEKA_POTVRDU").length})
          </button>
          <button
            onClick={() => setActiveTab("paid")}
            className={`${
              activeTab === "paid"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Paid ({reservations.filter((r) => r.status === "PLACENO").length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`${
              activeTab === "cancelled"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Cancelled ({reservations.filter((r) => r.status === "OTKAZANO").length})
          </button>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredReservations.length > 0 ? (
            filteredReservations.map((reservation) => (
              <li key={reservation.rezervacijaId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{reservation.dogadjajNaziv}</p>
                        <p className="text-sm text-gray-500">
                          {reservation.korisnikIme} {reservation.korisnikPrezime}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">{getStatusBadge(reservation.status)}</div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:space-x-4">
                      <p className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(reservation.datumPocetka)}
                      </p>
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {reservation.prostorNaziv}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {reservation.brojGostiju}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {reservation.ukupnaCijena} €
                        </span>
                      </div>
                    </div>
                  </div>
                  {reservation.posebniZahtjevi && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <AlertTriangle className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-400" />
                      <p>Special requests: {reservation.posebniZahtjevi}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-3">
                      <button
                        onClick={() => showReservationDetails(reservation)}
                        className="text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => showGuestList(reservation)}
                        className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                      >
                        <List className="h-4 w-4 mr-1" />
                        Guest List
                      </button>
                    </div>
                    <div className="flex space-x-3">
                      {reservation.status === "CEKA_POTVRDU" && (
                        <button
                          onClick={() => handleConfirmReservation(reservation.rezervacijaId)}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Confirm
                        </button>
                      )}
                      {reservation.status !== "OTKAZANO" && (
                        <button
                          onClick={() => handleCancelReservation(reservation.rezervacijaId)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">No reservations found for the selected filter.</li>
          )}
        </ul>
      </div>

      {/* Reservation Details Modal */}
      {showDetailsModal && selectedReservation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Reservation Details</h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Event</h4>
                        <p className="text-sm text-gray-900">{selectedReservation.dogadjajNaziv}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Customer</h4>
                        <p className="text-sm text-gray-900">
                          {selectedReservation.korisnikIme} {selectedReservation.korisnikPrezime}
                        </p>
                        <p className="text-sm text-gray-500">{selectedReservation.korisnikEmail}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Date & Time</h4>
                        <p className="text-sm text-gray-900">
                          {formatDate(selectedReservation.datumPocetka)} -{" "}
                          {formatDate(selectedReservation.datumZavrsetka)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Location</h4>
                        <p className="text-sm text-gray-900">{selectedReservation.prostorNaziv}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Total Price</h4>
                        <p className="text-sm text-gray-900">{selectedReservation.ukupnaCijena} €</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Status</h4>
                        <div className="mt-1">{getStatusBadge(selectedReservation.status)}</div>
                      </div>
                      {selectedReservation.posebniZahtjevi && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700">Special Requests</h4>
                          <p className="text-sm text-gray-900">{selectedReservation.posebniZahtjevi}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">
                          Guest List ({selectedReservation.brojGostiju} guests)
                        </h4>
                        <div className="mt-2 max-h-40 overflow-y-auto">
                          <ul className="divide-y divide-gray-200">
                            {selectedReservation.gosti && selectedReservation.gosti.length > 0 ? (
                              selectedReservation.gosti.map((guest, index) => (
                                <li key={`detail-guest-${index}`} className="py-2">
                                  <div className="text-sm text-gray-900">
                                    {guest.ime} {guest.prezime}
                                  </div>
                                  <div className="text-sm text-gray-500">{guest.email}</div>
                                </li>
                              ))
                            ) : (
                              <li className="py-2 text-sm text-gray-500">No guest information available</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Guest List Modal */}
      {showGuestListModal && selectedReservation && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Guest List</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {selectedReservation.gosti ? selectedReservation.gosti.length : 0} guests
                      </span>
                    </div>
                    <div className="mt-4">
                      {selectedReservation.gosti && selectedReservation.gosti.length > 0 ? (
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                          <ul className="divide-y divide-gray-200">
                            {selectedReservation.gosti.map((guest, index) => (
                              <li key={index} className="px-4 py-3">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {guest.ime} {guest.prezime}
                                    </p>
                                    <p className="text-sm text-gray-500">{guest.email}</p>
                                  </div>
                                  <div className="text-xs text-gray-500">Guest #{index + 1}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">No guest information available</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowGuestListModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && reservations.length > 0 && (
        <div className="flex justify-center py-4">
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-indigo-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Updating...
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizerReservations
