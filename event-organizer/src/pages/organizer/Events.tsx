"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { Calendar, Edit, Trash2, Plus, Search, MapPin, Users, X, Upload, ImageIcon } from "lucide-react"
import { useAuth } from "../../context/AuthContext"

type Event = {
  dogadjajId: number
  naziv: string
  opis: string
  ukCijenaPoOsobi: string | null
  ukCijenaFiksna: string | null
  otkazniRok: number
  korisnik: number
  prostorId: number
  dogadjajPonudaPonudas: number[]
  prostorNaziv?: string
  prostorAdresa?: string
  prostorKapacitet?: number
  komisija?: number
  slikaUrl?: string
}

type Space = {
  prostorId: number
  naziv: string
  adresa: string
  kapacitet: number
  cijena?: number
}

type Offer = {
  ponudaId: number
  naziv: string
  kategorija: string
  cijena: number
  tipCijene: "FIKSNO" | "PO_OSOBI"
}

// Cloudinary configuration - replace with your actual cloud name
const CLOUDINARY_CLOUD_NAME = "your-cloud-name" // Replace with your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "your-upload-preset" // Replace with your upload preset

const OrganizerEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [spaces, setSpaces] = useState<Space[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedOffers, setSelectedOffers] = useState<number[]>([])
  const { user } = useAuth()

  // Search states
  const [spaceSearchTerm, setSpaceSearchTerm] = useState("")
  const [offerSearchTerm, setOfferSearchTerm] = useState("")
  const [showSpaceDropdown, setShowSpaceDropdown] = useState(false)
  const [showOfferDropdown, setShowOfferDropdown] = useState(false)

  // Image upload states
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [uploadingImage, setUploadingImage] = useState(false)

  const safeToFixed = (value: any) => {
    const num = Number(value)
    return isNaN(num) ? "0.00" : num.toFixed(2)
  }

  // Fix the formData structure to use prostorId instead of prostor
  const [formData, setFormData] = useState({
    naziv: "",
    opis: "",
    prostorId: 0,
    komisija: 0,
    otkazniRok: 7,
    slikaUrl: "",
  })

  // Calculated prices (for display only)
  const [calculatedPrices, setCalculatedPrices] = useState({
    fixedPrice: 0,
    perPersonPrice: 0,
  })

  // Calculate prices based on selected space and offers
  const calculatePrices = () => {
    let fixedPrice = 0
    let perPersonPrice = 0

    // Add space price (always fixed)
    const selectedSpaceData = spaces.find((space) => space.prostorId === formData.prostorId)
    if (selectedSpaceData) {
      fixedPrice += Number(selectedSpaceData.cijena) || 0
    }

    // Add prices from offers
    selectedOffers.forEach((offerId) => {
      const offer = offers.find((o) => o.ponudaId === offerId)
      if (offer) {
        if (offer.tipCijene === "FIKSNO") {
          fixedPrice += Number(offer.cijena) || 0
        } else {
          perPersonPrice += Number(offer.cijena) || 0
        }
      }
    })

    // Add commission to fixed price
    fixedPrice += Number(formData.komisija) || 0

    return { fixedPrice, perPersonPrice }
  }

  // Update calculated prices whenever relevant data changes
  useEffect(() => {
    const prices = calculatePrices()
    setCalculatedPrices(prices)
  }, [formData.prostorId, formData.komisija, selectedOffers, spaces, offers])

  useEffect(() => {
    fetchEvents()
    fetchSpaces()
    fetchOffers()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await api.get("/dogadjaji/svi")
      // Fetch additional space details for each event
      const eventsWithSpaceDetails = await Promise.all(
        response.data.map(async (event: Event) => {
          try {
            const spaceResponse = await api.get(`/prostori/${event.prostorId}`)
            return {
              ...event,
              prostorNaziv: spaceResponse.data.naziv,
              prostorAdresa: spaceResponse.data.adresa,
              prostorKapacitet: spaceResponse.data.kapacitet,
            }
          } catch (error) {
            return event
          }
        }),
      )
      setEvents(eventsWithSpaceDetails)
    } catch (error) {
      console.error("Failed to fetch events", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchSpaces = async () => {
    try {
      const response = await api.get("/prostori")
      setSpaces(response.data)
    } catch (error) {
      console.error("Failed to fetch spaces", error)
    }
  }

  const fetchOffers = async () => {
    try {
      const response = await api.get("/ponude")
      setOffers(response.data)
    } catch (error) {
      console.error("Failed to fetch offers", error)
    }
  }

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET)

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to upload image")
      }

      const data = await response.json()
      return data.secure_url
    } catch (error) {
      console.error("Error uploading image:", error)
      throw error
    }
  }

  // Update the handleInputChange function to use prostorId instead of prostor
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "prostorId" || name === "otkazniRok" || name === "komisija"
          ? value
            ? Number(value)
            : 0 // Ensure we have a number, default to 0 if empty
          : value,
    }))
  }

  const handleOfferToggle = (offerId: number) => {
    setSelectedOffers((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
  }

  // Update the handleSubmit function to correctly format the payload
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setUploadingImage(true)

      // Calculate final prices before submitting
      const { fixedPrice, perPersonPrice } = calculatePrices()

      let imageUrl = formData.slikaUrl

      // Upload image if a new one is selected
      if (imageFile) {
        imageUrl = await uploadImageToCloudinary(imageFile)
      }

      const eventData = {
        naziv: formData.naziv,
        opis: formData.opis,
        ukCijenaFiksna: fixedPrice.toFixed(2),
        ukCijenaPoOsobi: perPersonPrice.toFixed(2),
        otkazniRok: formData.otkazniRok,
        korisnik: user?.korisnikId,
        prostorId: Number(formData.prostorId) || 0, // Ensure prostorId is a number
        dogadjajPonudaPonudas: selectedOffers,
        slikaUrl: imageUrl,
      }

      if (editingEvent) {
        await api.put(`/dogadjaji/${editingEvent.dogadjajId}`, eventData)
      } else {
        await api.post("/dogadjaji", eventData)
      }

      fetchEvents()
      resetForm()
    } catch (error) {
      console.error("Failed to save event", error)
      alert("Greška pri spremanju događaja. Molimo pokušajte ponovo.")
    } finally {
      setUploadingImage(false)
    }
  }

  // Update the handleEdit function to use prostorId
  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      naziv: event.naziv,
      opis: event.opis || "",
      prostorId: event.prostorId,
      komisija: event.komisija || 0,
      otkazniRok: event.otkazniRok,
      slikaUrl: event.slikaUrl || "",
    })
    setSelectedOffers(event.dogadjajPonudaPonudas || [])
    setImagePreview(event.slikaUrl || "")
    setImageFile(null)
    setShowModal(true)
  }

  const handleDelete = async (eventId: number) => {
    if (window.confirm("Jeste li sigurni da želite obrisati ovaj događaj?")) {
      try {
        await api.delete(`/dogadjaji/${eventId}`)
        fetchEvents()
      } catch (error) {
        console.error("Failed to delete event", error)
      }
    }
  }

  // Update the resetForm function to use prostorId
  const resetForm = () => {
    setFormData({
      naziv: "",
      opis: "",
      prostorId: 0,
      komisija: 0,
      otkazniRok: 7,
      slikaUrl: "",
    })
    setSelectedOffers([])
    setEditingEvent(null)
    setShowModal(false)
    setSpaceSearchTerm("")
    setOfferSearchTerm("")
    setShowSpaceDropdown(false)
    setShowOfferDropdown(false)
    setImageFile(null)
    setImagePreview("")
  }

  const filteredEvents = events.filter(
    (event) =>
      event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.opis && event.opis.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const filteredSpaces = spaces.filter((space) => space.naziv.toLowerCase().includes(spaceSearchTerm.toLowerCase()))

  const filteredOffers = offers.filter((offer) => offer.naziv.toLowerCase().includes(offerSearchTerm.toLowerCase()))

  // Update the selectedSpace constant to use prostorId
  const selectedSpace = spaces.find((space) => space.prostorId === formData.prostorId)

  const formatPrice = (price: string | null) => {
    if (!price) return "0.00"
    return safeToFixed(Number.parseFloat(price))
  }

  // Update the space selection to use prostorId
  const handleSpaceSelection = (spaceId: number) => {
    setFormData((prev) => ({ ...prev, prostorId: Number(spaceId) || 0 }))
    setSpaceSearchTerm("")
    setShowSpaceDropdown(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Događaji</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte svojim događajima i stvorite nove.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novi događaj
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pretraži događaje..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <li key={event.dogadjajId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2 w-16 h-16 overflow-hidden">
                        {event.slikaUrl ? (
                          <img
                            src={event.slikaUrl || "/placeholder.svg"}
                            alt={event.naziv}
                            className="w-full h-full object-cover rounded"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                              target.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                        ) : (
                          <Calendar className="h-full w-full text-indigo-600" />
                        )}
                        {event.slikaUrl && <Calendar className="h-full w-full text-indigo-600 hidden" />}
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{event.naziv}</p>
                        <p className="text-sm text-gray-500">{event.opis}</p>
                        {event.prostorNaziv && (
                          <p className="text-xs text-gray-400 flex items-center mt-1">
                            <MapPin className="h-3 w-3 mr-1" />
                            {event.prostorNaziv}
                            {event.prostorAdresa && ` - ${event.prostorAdresa}`}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(event)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(event.dogadjajId)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex sm:space-x-4">
                      <div className="flex space-x-2">
                        {event.ukCijenaFiksna && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Fixed: {formatPrice(event.ukCijenaFiksna)} €
                          </span>
                        )}
                        {event.ukCijenaPoOsobi && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Po osobi: {formatPrice(event.ukCijenaPoOsobi)} €
                          </span>
                        )}
                        {event.komisija && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">
                            Komisija: {event.komisija} €
                          </span>
                        )}
                        <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                          Otkazni rok: {event.otkazniRok} dana
                        </span>
                        {event.prostorKapacitet && (
                          <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            Max: {event.prostorKapacitet}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                        {event.dogadjajPonudaPonudas?.length || 0} ponude
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">
              Nema pronađenih događaja. Stvorite svoj prvi događaj!
            </li>
          )}
        </ul>
      </div>

      {/* Modal for creating/editing events */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingEvent ? "Uredi događaj" : "Stvori novi događaj"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="naziv" className="block text-sm font-medium text-gray-700">
                            Naziv događaja
                          </label>
                          <input
                            type="text"
                            name="naziv"
                            id="naziv"
                            required
                            value={formData.naziv}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label htmlFor="opis" className="block text-sm font-medium text-gray-700">
                            Opis
                          </label>
                          <textarea
                            name="opis"
                            id="opis"
                            rows={3}
                            value={formData.opis}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>

                        {/* Image Upload Section */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Slika događaja</label>
                          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                              {imagePreview ? (
                                <div className="relative">
                                  <img
                                    src={imagePreview || "/placeholder.svg"}
                                    alt="Preview"
                                    className="mx-auto h-32 w-32 object-cover rounded-md"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setImagePreview("")
                                      setImageFile(null)
                                      setFormData((prev) => ({ ...prev, slikaUrl: "" }))
                                    }}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </div>
                              ) : (
                                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                              )}
                              <div className="flex text-sm text-gray-600">
                                <label
                                  htmlFor="image-upload"
                                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                                >
                                  <span>{imagePreview ? "Promijeni sliku" : "Učitaj sliku"}</span>
                                  <input
                                    id="image-upload"
                                    name="image-upload"
                                    type="file"
                                    accept="image/*"
                                    className="sr-only"
                                    onChange={handleImageChange}
                                  />
                                </label>
                              </div>
                              <p className="text-xs text-gray-500">PNG, JPG, GIF do 10MB</p>
                            </div>
                          </div>
                        </div>

                        {/* Space Search */}
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700">Prostor</label>
                          <div className="mt-1 relative">
                            <input
                              type="text"
                              placeholder="Pretraži prostor..."
                              value={selectedSpace ? selectedSpace.naziv : spaceSearchTerm}
                              onChange={(e) => {
                                setSpaceSearchTerm(e.target.value)
                                setShowSpaceDropdown(true)
                                if (!e.target.value) {
                                  setFormData((prev) => ({ ...prev, prostorId: 0 }))
                                }
                              }}
                              onFocus={() => setShowSpaceDropdown(true)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {selectedSpace && (
                              <button
                                type="button"
                                onClick={() => {
                                  setFormData((prev) => ({ ...prev, prostorId: 0 }))
                                  setSpaceSearchTerm("")
                                }}
                                className="absolute right-2 top-2 text-gray-400 hover:text-gray-600"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          {showSpaceDropdown && (
                            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                              {filteredSpaces.map((space) => (
                                <div
                                  key={space.prostorId}
                                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                                  onClick={() => {
                                    setFormData((prev) => ({ ...prev, prostorId: Number(space.prostorId) || 0 }))
                                    setSpaceSearchTerm("")
                                    setShowSpaceDropdown(false)
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{space.naziv}</span>
                                    <span className="text-sm opacity-75">
                                      {space.adresa} • Capacity: {space.kapacitet}
                                    </span>
                                  </div>
                                </div>
                              ))}
                              {filteredSpaces.length === 0 && (
                                <div className="py-2 pl-3 pr-9 text-gray-500">Nema pronađenih prostora</div>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="komisija" className="block text-sm font-medium text-gray-700">
                              Provizija (€)
                            </label>
                            <input
                              type="number"
                              name="komisija"
                              id="komisija"
                              min="0"
                              step="0.01"
                              value={formData.komisija}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            <div className="mt-1 text-xs text-gray-500">Vaša naknada za organizaciju ovog događaja</div>
                          </div>
                          <div>
                            <label htmlFor="otkazniRok" className="block text-sm font-medium text-gray-700">
                              Otkazni rok (dani)
                            </label>
                            <input
                              type="number"
                              name="otkazniRok"
                              id="otkazniRok"
                              min="1"
                              value={formData.otkazniRok}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Sažetak cijene</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Cijena prostora:</span>
                              <span>{selectedSpace ? Number(selectedSpace.cijena).toFixed(2) : "0.00"} €</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Fiksne ponude:</span>
                              <span>
                                {selectedOffers
                                  .reduce((sum, offerId) => {
                                    const offer = offers.find((o) => o.ponudaId === offerId)
                                    return sum + (offer && offer.tipCijene === "FIKSNO" ? Number(offer.cijena) : 0)
                                  }, 0)
                                  .toFixed(2)}{" "}
                                €
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Provizija:</span>
                              <span>{Number(formData.komisija).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Ponude po osobi:</span>
                              <span>
                                {selectedOffers
                                  .reduce((sum, offerId) => {
                                    const offer = offers.find((o) => o.ponudaId === offerId)
                                    return sum + (offer && offer.tipCijene === "PO_OSOBI" ? Number(offer.cijena) : 0)
                                  }, 0)
                                  .toFixed(2)}{" "}
                                €
                              </span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <div className="flex justify-between font-medium">
                                <span>Ukupna fiksna cijena:</span>
                                <span>{calculatedPrices.fixedPrice.toFixed(2)} €</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Ukupna cijena po osobi:</span>
                                <span>{calculatedPrices.perPersonPrice.toFixed(2)} €</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Offers Search */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Odaberite ponude</label>
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="Pretraži ponude..."
                              value={offerSearchTerm}
                              onChange={(e) => {
                                setOfferSearchTerm(e.target.value)
                                setShowOfferDropdown(true)
                              }}
                              onFocus={() => setShowOfferDropdown(true)}
                              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                            {showOfferDropdown && (
                              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                                {filteredOffers.map((offer) => (
                                  <div
                                    key={offer.ponudaId}
                                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
                                    onClick={() => {
                                      handleOfferToggle(offer.ponudaId)
                                      setOfferSearchTerm("")
                                      setShowOfferDropdown(false)
                                    }}
                                  >
                                    <div className="flex justify-between items-center">
                                      <div className="flex flex-col">
                                        <span className="font-medium">{offer.naziv}</span>
                                        <span className="text-sm opacity-75">
                                          {offer.kategorija} • {offer.cijena}€ ({offer.tipCijene})
                                        </span>
                                      </div>
                                      {selectedOffers.includes(offer.ponudaId) && (
                                        <span className="text-indigo-600">✓</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                                {filteredOffers.length === 0 && (
                                  <div className="py-2 pl-3 pr-9 text-gray-500">Nema pronađenih ponuda</div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Selected offers */}
                          {selectedOffers.length > 0 && (
                            <div className="mt-2">
                              <div className="text-sm text-gray-700 mb-2">Odabrane ponude:</div>
                              <div className="flex flex-wrap gap-2">
                                {selectedOffers.map((offerId) => {
                                  const offer = offers.find((o) => o.ponudaId === offerId)
                                  return offer ? (
                                    <span
                                      key={offerId}
                                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                                    >
                                      {offer.naziv} ({offer.tipCijene === "FIKSNO" ? "Fiksno" : "Po osobi"})
                                      <button
                                        type="button"
                                        onClick={() => handleOfferToggle(offerId)}
                                        className="ml-1 text-indigo-600 hover:text-indigo-800"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </span>
                                  ) : null
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={!formData.prostorId || uploadingImage}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingImage ? (
                      <div className="flex items-center">
                        <Upload className="animate-spin h-4 w-4 mr-2" />
                        Učitavam...
                      </div>
                    ) : editingEvent ? (
                      "Ažuriraj"
                    ) : (
                      "Stvori"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Odustani
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrganizerEvents
