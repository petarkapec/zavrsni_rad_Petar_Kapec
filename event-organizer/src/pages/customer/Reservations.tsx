"use client"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { Calendar, Clock, AlertTriangle, Check, X, List } from "lucide-react"

type Reservation = {
  rezervacijaId: number
  ukupnaCijena: string
  posebniZahtjevi?: string
  status: "CEKA_POTVRDU" | "PLACENO" | "OTKAZANO"
  korisnik: number
  dogadjaj: number
  prostorTermin: number
  gosti: Array<{
    ime: string
    prezime: string
    email: string
  }>
  // Additional fields we'll fetch
  dogadjaj_naziv?: string
  prostor_naziv?: string
  datum_pocetka?: string
  datum_zavrsetka?: string
  broj_gostiju?: number
}

const CustomerReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [error, setError] = useState<string | null>(null)
  const [showGuestListModal, setShowGuestListModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await api.get("/rezervacije")
      console.log("Fetched reservations:", response.data)

      // Enhance reservations with additional data
      const enhancedReservations = await Promise.all(
        response.data.map(async (reservation: Reservation) => {
          try {
            // Fetch event details
            const eventResponse = await api.get(`/dogadjaji/${reservation.dogadjaj}`)
            const event = eventResponse.data

            // Fetch time slot details
            const terminResponse = await api.get(`/termini/${reservation.prostorTermin}`)
            const termin = terminResponse.data

            // Fetch space details if needed
            let prostorNaziv = "Unknown venue"
            if (event.prostorId) {
              try {
                const prostorResponse = await api.get(`/prostori/${event.prostorId}`)
                prostorNaziv = prostorResponse.data.naziv
              } catch (e) {
                console.error("Error fetching space details:", e)
              }
            }

            // Count guests if available
            const brojGostiju = reservation.gosti ? reservation.gosti.length : 0

            return {
              ...reservation,
              dogadjaj_naziv: event.naziv,
              prostor_naziv: prostorNaziv,
              datum_pocetka: termin.datumPocetka,
              datum_zavrsetka: termin.datumZavrsetka,
              broj_gostiju: brojGostiju,
            }
          } catch (error) {
            console.error(`Error enhancing reservation ${reservation.rezervacijaId}:`, error)
            return {
              ...reservation,
              dogadjaj_naziv: "Nepoznat događaj",
              prostor_naziv: "Nepoznato mjesto",
              datum_pocetka: new Date().toISOString(),
              datum_zavrsetka: new Date().toISOString(),
              broj_gostiju: 0,
            }
          }
        }),
      )

      setReservations(enhancedReservations)
    } catch (error) {
      console.error("Failed to fetch reservations:", error)
      setError("Neuspješno učitavanje vaših rezervacija. Molimo pokušajte kasnije.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancelReservation = async (id: number) => {
    if (window.confirm("Jeste li sigurni da želite otkazati ovu rezervaciju?")) {
      try {
        setLoading(true)
        await api.put(`/rezervacije/${id}/otkazi`)
        fetchReservations() // Refresh the list
      } catch (error) {
        console.error("Failed to cancel reservation:", error)
        setError("Neuspješno otkazivanje rezervacije. Molimo pokušajte ponovo.")
      } finally {
        setLoading(false)
      }
    }
  }

  const handlePayReservation = async (id: number) => {
    try {
      setLoading(true)
      await api.put(`/rezervacije/${id}/plati`)
      fetchReservations() // Refresh the list
    } catch (error) {
      console.error("Failed to process payment:", error)
      setError("Neuspješno procesiranje plaćanja. Molimo pokušajte ponovo.")
    } finally {
      setLoading(false)
    }
  }

  const showGuestList = (reservation: Reservation) => {
    setSelectedReservation(reservation)
    setShowGuestListModal(true)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (e) {
      return "Neispravan datum"
    }
  }

  const now = new Date()

  const upcomingReservations = reservations.filter((res) =>
    res.datum_pocetka ? new Date(res.datum_pocetka) > now : false,
  )

  const pastReservations = reservations.filter((res) => (res.datum_pocetka ? new Date(res.datum_pocetka) <= now : true))

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CEKA_POTVRDU":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Čeka plaćanje
          </span>
        )
      case "PLACENO":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 flex items-center">
            <Check className="h-3 w-3 mr-1" />
            Plaćeno
          </span>
        )
      case "OTKAZANO":
        return (
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 flex items-center">
            <X className="h-3 w-3 mr-1" />
            Otkazano
          </span>
        )
      default:
        return <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  if (loading && reservations.length === 0) {
    return <div className="flex justify-center items-center h-64">Učitavam vaše rezervacije...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Moje rezervacije</h1>
        <p className="mt-1 text-sm text-gray-500">Upravljajte svojim nadolazećim i prošlim rezervacijama.</p>
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
            onClick={() => setActiveTab("upcoming")}
            className={`${
              activeTab === "upcoming"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Nadolazeće ({upcomingReservations.length})
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`${
              activeTab === "past"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Prošle ({pastReservations.length})
          </button>
        </nav>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {(activeTab === "upcoming" ? upcomingReservations : pastReservations).length > 0 ? (
            (activeTab === "upcoming" ? upcomingReservations : pastReservations).map((reservation) => (
              <li key={reservation.rezervacijaId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">
                          {reservation.dogadjaj_naziv || `Event #${reservation.dogadjaj}`}
                        </p>
                        <p className="text-sm text-gray-500">
                          {reservation.prostor_naziv || "Učitavam detalje mjesta..."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">{getStatusBadge(reservation.status)}</div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {formatDate(reservation.datum_pocetka)} - {formatDate(reservation.datum_zavrsetka)}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {reservation.broj_gostiju || 0} gosta
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {Number(reservation.ukupnaCijena).toFixed(2)} €
                        </span>
                      </div>
                    </div>
                  </div>
                  {reservation.posebniZahtjevi && (
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <AlertTriangle className="flex-shrink-0 mr-1.5 h-4 w-4 text-yellow-400" />
                      <p>Posebni zahtjevi: {reservation.posebniZahtjevi}</p>
                    </div>
                  )}
                  <div className="mt-4 flex justify-between items-center">
                    <button
                      onClick={() => showGuestList(reservation)}
                      className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Lista gostiju
                    </button>
                    {activeTab === "upcoming" && reservation.status !== "OTKAZANO" && (
                      <div className="flex space-x-3">
                        {reservation.status === "CEKA_POTVRDU" && (
                          <button
                            onClick={() => handlePayReservation(reservation.rezervacijaId)}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            Plati sada
                          </button>
                        )}
                        <button
                          onClick={() => handleCancelReservation(reservation.rezervacijaId)}
                          className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Odustani
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              {activeTab === "upcoming" ? "Nemate nadolazećih rezervacija." : "Nemate prošlih rezervacija."}
            </li>
          )}
        </ul>
      </div>

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
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Lista gostiju</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                        {selectedReservation.gosti ? selectedReservation.gosti.length : 0} gosta
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
                                  <div className="text-xs text-gray-500">Gost #{index + 1}</div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <div className="text-center py-6 text-gray-500">Nema dostupnih informacija o gostima</div>
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
                  Zatvori
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
            Ažuriram...
          </div>
        </div>
      )}
    </div>
  )
}

export default CustomerReservations
