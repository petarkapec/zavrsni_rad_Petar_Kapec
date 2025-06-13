"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { CalendarIcon, MapPin, Users, Clock, CreditCard, Plus, X } from "lucide-react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { format } from "date-fns"
import { useAuth } from "../../context/AuthContext" // Import useAuth hook

type Event = {
  dogadjajId: number
  naziv: string
  opis: string
  ukCijenaPoOsobi: number | null
  ukCijenaFiksna: number | null
  otkazniRok: number
  prostorId: number
  prostorNaziv: string
  prostorAdresa: string
  prostorKapacitet: number
  organizatorIme: string
  organizatorPrezime: string
}

type Offer = {
  ponudaId: number
  naziv: string
  opis: string
  cijena: number
  tipCijene: "FIKSNO" | "PO_OSOBI"
  kategorija: string
}

type Termin = {
  terminId: number
  datumPocetka: string
  datumZavrsetka: string
  zauzeto: boolean
}

type Guest = {
  id: string
  ime: string
  prezime: string
  email: string
}

const EventDetails = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [event, setEvent] = useState<Event | null>(null)
  const [offers, setOffers] = useState<Offer[]>([])
  const [termini, setTermini] = useState<Termin[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTermin, setSelectedTermin] = useState<Termin | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [guests, setGuests] = useState<Guest[]>([{ id: "1", ime: "", prezime: "", email: "" }])
  const [specialRequests, setSpecialRequests] = useState("")
  const [totalPrice, setTotalPrice] = useState(0)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const { user } = useAuth() // Declare useAuth hook

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const eventResponse = await api.get(`/dogadjaji/${id}`)
        setEvent(eventResponse.data)

        const offersResponse = await api.get(`/dogadjaji/${id}/ponude`)
        setOffers(offersResponse.data)

        const terminiResponse = await api.get(`/dogadjaji/${id}/termini`)
        console.log("Fetched termini:", terminiResponse.data)
        setTermini(terminiResponse.data)
      } catch (error) {
        console.error("Failed to fetch event details", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEventDetails()
  }, [id])

  useEffect(() => {
    if (event) {
      calculateTotalPrice()
    }
  }, [event, guests])

  const calculateTotalPrice = () => {
    if (!event) return

    // Handle null values by defaulting to 0
    const fixedPrice = Number(event.ukCijenaFiksna || 0)
    const perPersonPrice = Number(event.ukCijenaPoOsobi || 0) * guests.length

    // Ensure we're adding numbers, not concatenating strings
    setTotalPrice(fixedPrice + perPersonPrice)
  }

  const handleAddGuest = () => {
    setGuests([...guests, { id: Date.now().toString(), ime: "", prezime: "", email: "" }])
  }

  const handleRemoveGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter((guest) => guest.id !== id))
    }
  }

  const handleGuestChange = (id: string, field: keyof Guest, value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest)))
  }

  const handleReservationSubmit = async () => {
    if (!event || !selectedTermin || !user) return

    try {
      // Updated payload structure to match backend expectations
      const payload = {
        ukupnaCijena: totalPrice,
        posebniZahtjevi: specialRequests,
        status: "CEKA_POTVRDU",
        korisnik: user.korisnikId,
        dogadjaj: event.dogadjajId,
        prostorTermin: selectedTermin.terminId,
        gosti: guests.map((g) => ({
          ime: g.ime,
          prezime: g.prezime,
          email: g.email,
        })),
      }

      await api.post("/rezervacije", payload)
      setReservationSuccess(true)
    } catch (error) {
      console.error("Failed to create reservation", error)
    }
  }

  const handlePayment = async () => {
    // In a real app, this would integrate with a payment gateway
    // For now, we'll just simulate a successful payment
    setTimeout(() => {
      navigate("/customer/reservations")
    }, 1500)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  // Safe price formatting function that handles null values
  const formatPrice = (price: number | null): string => {
    return `${Number(price || 0).toFixed(2)} €`
  }

  // Function to check if a date has available time slots
  const hasTimeSlots = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return termini.some((slot) => {
      const slotDate = format(new Date(slot.datumPocetka), "yyyy-MM-dd")
      return slotDate === dateString && !slot.zauzeto
    })
  }

  // Get available time slots for a specific date
  const getTimeSlotsForDate = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return termini.filter((slot) => {
      const slotDate = format(new Date(slot.datumPocetka), "yyyy-MM-dd")
      return slotDate === dateString && !slot.zauzeto
    })
  }

  // Custom tile content for the calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasTimeSlots(date)) {
      return <div className="h-2 w-2 bg-green-500 rounded-full mx-auto mt-1"></div>
    }
    return null
  }

  // Custom tile class for the calendar
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return ""

    // Check if the date is selected
    if (selectedDate && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      return "bg-indigo-100 rounded-lg"
    }

    // Check if the date has available time slots
    if (hasTimeSlots(date)) {
      return "cursor-pointer hover:bg-gray-100"
    }

    return "text-gray-300 cursor-not-allowed"
  }

  // Handle date selection in calendar
  const handleDateSelect = (value: Date | Date[]) => {
    const date = Array.isArray(value) ? value[0] : value
    setSelectedDate(date)

    // Get available time slots for this date
    const availableSlots = getTimeSlotsForDate(date)

    // If there are available slots, show them
    if (availableSlots.length > 0) {
      // Don't automatically select a time slot, just show the available ones
      console.log("Available slots for selected date:", availableSlots)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!event) {
    return <div className="text-center py-12">Event not found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{event.naziv}</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Organized by {event.organizatorIme} {event.organizatorPrezime}
            </p>
          </div>
          <button
            onClick={() => setShowReservationModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Book Now
          </button>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{event.opis}</dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Location</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {event.prostorNaziv}, {event.prostorAdresa}
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Capacity</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <Users className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  Up to {event.prostorKapacitet} guests
                </div>
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Pricing</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Fixed price:</span>
                    <span>{formatPrice(event.ukCijenaFiksna)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Price per person:</span>
                    <span>{formatPrice(event.ukCijenaPoOsobi)}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-medium">
                    <span>Starting from:</span>
                    <span>{formatPrice(Number(event.ukCijenaFiksna || 0) + Number(event.ukCijenaPoOsobi || 0))}</span>
                  </div>
                </div>
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Cancellation Policy</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {event.otkazniRok} days before the event
                </div>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Included Offers</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Services and items included in this event.</p>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {offers.length > 0 ? (
              offers.map((offer) => (
                <li key={offer.ponudaId} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{offer.naziv}</p>
                      <p className="text-sm text-gray-500">{offer.opis}</p>
                    </div>
                    <div className="flex items-center">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                        {offer.kategorija}
                      </span>
                      <span className="ml-2 px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        {offer.cijena} € ({offer.tipCijene})
                      </span>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-5 text-center text-gray-500">No offers available for this event.</li>
            )}
          </ul>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Available Dates</h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Select a date for your reservation.</p>
        </div>
        <div className="border-t border-gray-200">
          <div className="p-4">
            <div className="mb-4">
              <Calendar
                onChange={handleDateSelect}
                value={selectedDate}
                tileContent={tileContent}
                tileClassName={tileClassName}
                minDate={new Date()}
                className="w-full border-none"
              />
            </div>

            {selectedDate && (
              <div className="mt-4">
                <h3 className="text-md font-medium text-gray-900 mb-2">
                  Available time slots for {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {getTimeSlotsForDate(selectedDate).map((termin) => (
                    <div
                      key={termin.terminId}
                      onClick={() => setSelectedTermin(termin)}
                      className={`p-3 border rounded-md cursor-pointer ${
                        selectedTermin?.terminId === termin.terminId
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <p className="text-sm font-medium">
                            {format(new Date(termin.datumPocetka), "h:mm a")} -
                            {format(new Date(termin.datumZavrsetka), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {getTimeSlotsForDate(selectedDate).length === 0 && (
                    <p className="text-sm text-gray-500 col-span-full">No available time slots for this date.</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowReservationModal(true)}
                disabled={!selectedTermin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {selectedTermin ? "Continue with Selected Time" : "Select a Time Slot"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              {!reservationSuccess ? (
                <>
                  <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <div className="sm:flex sm:items-start">
                      <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Make a Reservation</h3>
                        <div className="mt-4 space-y-4">
                          {/* Selected Time Slot */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700">Selected Date & Time</label>
                            {selectedTermin ? (
                              <div className="mt-1 p-3 border border-gray-300 rounded-md bg-gray-50">
                                <div className="flex items-center">
                                  <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-sm font-medium">
                                    {format(new Date(selectedTermin.datumPocetka), "MMMM d, yyyy")}
                                  </span>
                                </div>
                                <div className="flex items-center mt-1">
                                  <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                  <span className="text-sm">
                                    {format(new Date(selectedTermin.datumPocetka), "h:mm a")} -
                                    {format(new Date(selectedTermin.datumZavrsetka), "h:mm a")}
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="mt-1 p-3 border border-red-300 rounded-md bg-red-50 text-red-700">
                                Please select a time slot first
                              </div>
                            )}
                          </div>

                          {/* Guest List Summary */}
                          <div>
                            <div className="flex justify-between items-center">
                              <label className="block text-sm font-medium text-gray-700">Guest List</label>
                              <span className="text-xs text-gray-500">
                                {guests.length} {guests.length === 1 ? "guest" : "guests"}
                              </span>
                            </div>
                            <div className="mt-1 p-3 border border-gray-300 rounded-md">
                              <div className="max-h-32 overflow-y-auto">
                                {guests.map((guest, index) => (
                                  <div key={guest.id} className="flex items-center justify-between py-1">
                                    <span className="text-sm">
                                      {guest.ime || "Guest"} {guest.prezime || index + 1}
                                    </span>
                                    {guest.email && <span className="text-xs text-gray-500">{guest.email}</span>}
                                  </div>
                                ))}
                              </div>
                              <div className="mt-2 flex justify-between">
                                <button
                                  type="button"
                                  onClick={() => setShowGuestModal(true)}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Users className="h-4 w-4 mr-1" />
                                  Manage Guests
                                </button>
                                <button
                                  type="button"
                                  onClick={handleAddGuest}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Guest
                                </button>
                              </div>
                            </div>
                          </div>

                          <div>
                            <label htmlFor="special-requests" className="block text-sm font-medium text-gray-700">
                              Special Requests
                            </label>
                            <textarea
                              id="special-requests"
                              rows={3}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              placeholder="Any special requests or requirements..."
                              value={specialRequests}
                              onChange={(e) => setSpecialRequests(e.target.value)}
                            />
                          </div>

                          <div className="border-t border-gray-200 pt-4">
                            <div className="flex justify-between text-sm">
                              <span>Fixed price:</span>
                              <span>{formatPrice(event.ukCijenaFiksna)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span>Per person ({guests.length} guests):</span>
                              <span>{formatPrice((event.ukCijenaPoOsobi || 0) * guests.length)}</span>
                            </div>
                            <div className="flex justify-between font-medium text-lg mt-2 pt-2 border-t border-gray-200">
                              <span>Total:</span>
                              <span>{formatPrice(totalPrice)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="button"
                      onClick={handleReservationSubmit}
                      disabled={!selectedTermin || guests.some((g) => !g.ime || !g.prezime || !g.email)}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                    >
                      Reserve
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReservationModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">Reservation Successful!</h3>
                      <div className="mt-4 space-y-4">
                        <p className="text-sm text-gray-500">
                          Your reservation has been created successfully. Please proceed to payment to confirm your
                          booking.
                        </p>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between font-medium text-lg">
                            <span>Total Amount:</span>
                            <span>{formatPrice(totalPrice)}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handlePayment}
                          className="w-full inline-flex justify-center items-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          <CreditCard className="h-5 w-5 mr-2" />
                          Proceed to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Guest Management Modal */}
      {showGuestModal && (
        <div className="fixed z-20 inset-0 overflow-y-auto">
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Manage Guest List</h3>
                    <div className="mt-4 space-y-4 max-h-96 overflow-y-auto">
                      {guests.map((guest, index) => (
                        <div key={guest.id} className="border border-gray-200 rounded-md p-3">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium">Guest {index + 1}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveGuest(guest.id)}
                              className="text-gray-400 hover:text-gray-500"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <input
                                type="text"
                                placeholder="First Name"
                                value={guest.ime}
                                onChange={(e) => handleGuestChange(guest.id, "ime", e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div>
                              <input
                                type="text"
                                placeholder="Last Name"
                                value={guest.prezime}
                                onChange={(e) => handleGuestChange(guest.id, "prezime", e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                            <div className="col-span-2">
                              <input
                                type="email"
                                placeholder="Email"
                                value={guest.email}
                                onChange={(e) => handleGuestChange(guest.id, "email", e.target.value)}
                                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddGuest}
                        className="flex items-center justify-center w-full py-2 px-4 border border-dashed border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Guest
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setShowGuestModal(false)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetails
