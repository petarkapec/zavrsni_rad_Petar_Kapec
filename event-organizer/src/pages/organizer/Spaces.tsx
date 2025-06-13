"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import api from "../../services/api"
import { MapPin, Edit, Trash2, Plus, Search, Users, Calendar } from "lucide-react"

type Space = {
  prostorId: number
  naziv: string
  opis: string
  cijena: number
  adresa: string
  kapacitet: number
}

const OrganizerSpaces = () => {
  const [spaces, setSpaces] = useState<Space[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSpace, setEditingSpace] = useState<Space | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const user = { korisnikId: 1 } // Mock user object

  const [formData, setFormData] = useState({
    naziv: "",
    opis: "",
    cijena: 0,
    adresa: "",
    kapacitet: 0,
    korisnik: user?.korisnikId || 0,
  })

  useEffect(() => {
    fetchSpaces()
  }, [])

  useEffect(() => {
    if (user?.korisnikId) {
      setFormData((prev) => ({
        ...prev,
        korisnik: user.korisnikId,
      }))
    }
  }, [user])

  const fetchSpaces = async () => {
    try {
      const response = await api.get("/prostori")
      setSpaces(response.data)
    } catch (error) {
      console.error("Failed to fetch spaces", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "cijena" || name === "kapacitet" ? Number.parseFloat(value) : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingSpace) {
        await api.put(`/prostori/${editingSpace.prostorId}`, formData)
      } else {
        await api.post("/prostori", formData)
      }

      fetchSpaces()
      resetForm()
    } catch (error) {
      console.error("Failed to save space", error)
    }
  }

  const handleEdit = (space: Space) => {
    setEditingSpace(space)
    setFormData({
      naziv: space.naziv,
      opis: space.opis || "",
      cijena: space.cijena,
      adresa: space.adresa,
      kapacitet: space.kapacitet,
      korisnik: user?.korisnikId || 0,
    })
    setShowModal(true)
  }

  const handleDelete = async (spaceId: number) => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      try {
        await api.delete(`/prostori/${spaceId}`)
        fetchSpaces()
      } catch (error) {
        console.error("Failed to delete space", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      naziv: "",
      opis: "",
      cijena: 0,
      adresa: "",
      kapacitet: 0,
      korisnik: user?.korisnikId || 0,
    })
    setEditingSpace(null)
    setShowModal(false)
  }

  const filteredSpaces = spaces.filter(
    (space) =>
      space.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (space.opis && space.opis.toLowerCase().includes(searchTerm.toLowerCase())) ||
      space.adresa.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Spaces</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your event spaces and venues.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Space
        </button>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search spaces..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredSpaces.length > 0 ? (
            filteredSpaces.map((space) => (
              <li key={space.prostorId}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <MapPin className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{space.naziv}</p>
                        <p className="text-sm text-gray-500">{space.opis}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/organizer/spaces/${space.prostorId}/time-slots`}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        title="Manage Time Slots"
                      >
                        <Calendar className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(space)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(space.prostorId)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        {space.adresa}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                          {space.cijena} €
                        </span>
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {space.kapacitet}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">No spaces found. Create your first space!</li>
          )}
        </ul>
      </div>

      {/* Modal for creating/editing spaces */}
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
                        {editingSpace ? "Edit Space" : "Create New Space"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="naziv" className="block text-sm font-medium text-gray-700">
                            Space Name
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
                            Description
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
                        <div>
                          <label htmlFor="adresa" className="block text-sm font-medium text-gray-700">
                            Address
                          </label>
                          <input
                            type="text"
                            name="adresa"
                            id="adresa"
                            required
                            value={formData.adresa}
                            onChange={handleInputChange}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="cijena" className="block text-sm font-medium text-gray-700">
                              Price (€)
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
                          <div>
                            <label htmlFor="kapacitet" className="block text-sm font-medium text-gray-700">
                              Capacity
                            </label>
                            <input
                              type="number"
                              name="kapacitet"
                              id="kapacitet"
                              min="1"
                              required
                              value={formData.kapacitet}
                              onChange={handleInputChange}
                              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            />
                          </div>
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
                    {editingSpace ? "Update" : "Create"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancel
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

export default OrganizerSpaces
