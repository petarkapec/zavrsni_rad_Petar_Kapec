"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { Package, Edit, Trash2, Plus, Search } from "lucide-react"
import { useAuth } from "../../context/AuthContext" // Dodajte ovaj import na vrh

type Offer = {
  ponudaId: number
  naziv: string
  opis: string
  cijena: number
  tipCijene: "FIKSNO" | "PO_OSOBI"
  kategorija: "REKVIZITI" | "CATERING" | "PICE" | "USLUGA"
}

const OrganizerOffers = () => {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    naziv: "",
    opis: "",
    cijena: 0,
    tipCijene: "FIKSNO" as "FIKSNO" | "PO_OSOBI",
    kategorija: "REKVIZITI" as "REKVIZITI" | "CATERING" | "PICE" | "USLUGA",
    korisnik: user?.korisnikId || 0, // Dodajte fallback vrijednost
  })

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      const response = await api.get("/ponude")
      setOffers(response.data)
    } catch (error) {
      console.error("Failed to fetch offers", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cijena" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingOffer) {
        await api.put(`/ponude/${editingOffer.ponudaId}`, formData)
      } else {
        await api.post("/ponude", formData)
      }

      fetchOffers()
      resetForm()
    } catch (error) {
      console.error("Failed to save offer", error)
    }
  }

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer)
    setFormData({
      naziv: offer.naziv,
      opis: offer.opis || "",
      cijena: offer.cijena,
      tipCijene: offer.tipCijene,
      kategorija: offer.kategorija,
      korisnik: user?.korisnikId || 0, // Dodajte fallback vrijednost
    })
    setShowModal(true)
  }

  const handleDelete = async (offerId: number) => {
    if (window.confirm("Jeste li sigurni da želite obrisati ovu ponudu?")) {
      try {
        await api.delete(`/ponude/${offerId}`)
        fetchOffers()
      } catch (error) {
        console.error("Failed to delete offer", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      naziv: "",
      opis: "",
      cijena: 0,
      tipCijene: "FIKSNO",
      kategorija: "REKVIZITI",
      korisnik: user?.korisnikId || 0, // Dodajte fallback vrijednost
    })
    setEditingOffer(null)
    setShowModal(false)
  }

  const filteredOffers = offers.filter(
    (offer) =>
      offer.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (offer.opis && offer.opis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      offer.kategorija.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "REKVIZITI":
        return "bg-blue-100 text-blue-800"
      case "CATERING":
        return "bg-green-100 text-green-800"
      case "PICE":
        return "bg-purple-100 text-purple-800"
      case "USLUGA":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Učitavam...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Ponude</h1>
          <p className="mt-1 text-sm text-gray-500">Upravljajte svojim ponudama i uslugama.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova ponuda
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Pretraži ponude..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredOffers.length > 0 ? (
            filteredOffers.map((offer) => (
              <li key={offer.ponudaId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Package className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{offer.naziv}</p>
                        <p className="text-sm text-gray-500">{offer.opis}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(offer)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(offer.ponudaId)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(offer.kategorija)}`}
                      >
                        {offer.kategorija}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {offer.cijena} € ({offer.tipCijene})
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">Nema pronađenih ponuda. Stvorite svoju prvu ponudu!</li>
          )}
        </ul>
      </div>

      {/* Modal for creating/editing offers */}
      {showModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        {editingOffer ? "Uredi ponudu" : "Stvori novu ponudu"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="naziv" className="block text-sm font-medium text-gray-700">
                            Naziv ponude
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
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="kategorija" className="block text-sm font-medium text-gray-700">
                              Kategorija
                            </label>
                            <select
                              name="kategorija"
                              id="kategorija"
                              required
                              value={formData.kategorija}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="REKVIZITI">REKVIZITI</option>
                              <option value="CATERING">CATERING</option>
                              <option value="PICE">PICE</option>
                              <option value="USLUGA">USLUGA</option>
                            </select>
                          </div>
                          <div>
                            <label htmlFor="tipCijene" className="block text-sm font-medium text-gray-700">
                              Tip cijene
                            </label>
                            <select
                              name="tipCijene"
                              id="tipCijene"
                              required
                              value={formData.tipCijene}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            >
                              <option value="FIKSNO">FIKSNO</option>
                              <option value="PO_OSOBI">PO_OSOBI</option>
                            </select>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="cijena" className="block text-sm font-medium text-gray-700">
                            Cijena (€)
                          </label>
                          <input
                            type="number"
                            name="cijena"
                            id="cijena"
                            min="0"
                            step="0.01"
                            required
                            value={formData.cijena}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {editingOffer ? "Ažuriraj" : "Stvori"}
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

export default OrganizerOffers
