"use client"

import type React from "react"

import { useState, useEffect } from "react"
import api from "../../services/api"
import { Users, Plus, Edit, Trash2, X, Save } from "lucide-react"

type GuestList = {
  id: number
  name: string
  guests: Guest[]
}

type Guest = {
  id: number
  ime: string
  prezime: string
  email: string
}

const CustomerGuestLists = () => {
  const [guestLists, setGuestLists] = useState<GuestList[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingList, setEditingList] = useState<GuestList | null>(null)
  const [listName, setListName] = useState("")
  const [guests, setGuests] = useState<{ id: string; ime: string; prezime: string; email: string }[]>([
    { id: "1", ime: "", prezime: "", email: "" },
  ])

  useEffect(() => {
    fetchGuestLists()
  }, [])

  const fetchGuestLists = async () => {
    try {
      const response = await api.get("/customer/guest-lists")
      setGuestLists(response.data)
    } catch (error) {
      console.error("Failed to fetch guest lists", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddGuest = () => {
    setGuests([...guests, { id: Date.now().toString(), ime: "", prezime: "", email: "" }])
  }

  const handleRemoveGuest = (id: string) => {
    if (guests.length > 1) {
      setGuests(guests.filter((guest) => guest.id !== id))
    }
  }

  const handleGuestChange = (id: string, field: keyof Omit<Guest, "id">, value: string) => {
    setGuests(guests.map((guest) => (guest.id === id ? { ...guest, [field]: value } : guest)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const guestListData = {
        name: listName,
        guests: guests.map(({ ime, prezime, email }) => ({
          ime,
          prezime,
          email,
        })),
      }

      if (editingList) {
        await api.put(`/customer/guest-lists/${editingList.id}`, guestListData)
      } else {
        await api.post("/customer/guest-lists", guestListData)
      }

      fetchGuestLists()
      resetForm()
    } catch (error) {
      console.error("Failed to save guest list", error)
    }
  }

  const handleEdit = (list: GuestList) => {
    setEditingList(list)
    setListName(list.name)
    setGuests(
      list.guests.map((guest) => ({
        id: guest.id.toString(),
        ime: guest.ime,
        prezime: guest.prezime,
        email: guest.email,
      })),
    )
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this guest list?")) {
      try {
        await api.delete(`/customer/guest-lists/${id}`)
        fetchGuestLists()
      } catch (error) {
        console.error("Failed to delete guest list", error)
      }
    }
  }

  const resetForm = () => {
    setListName("")
    setGuests([{ id: "1", ime: "", prezime: "", email: "" }])
    setEditingList(null)
    setShowModal(false)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Guest Lists</h1>
          <p className="mt-1 text-sm text-gray-500">Create and manage your guest lists for easy reservation.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Guest List
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {guestLists.length > 0 ? (
            guestLists.map((list) => (
              <li key={list.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-100 rounded-md p-2">
                        <Users className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-indigo-600">{list.name}</p>
                        <p className="text-sm text-gray-500">{list.guests.length} guests</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(list)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(list.id)}
                        className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <li className="px-4 py-6 text-center text-gray-500">No guest lists found. Create your first guest list!</li>
          )}
        </ul>
      </div>

      {/* Modal for creating/editing guest lists */}
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
                        {editingList ? "Edit Guest List" : "Create New Guest List"}
                      </h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label htmlFor="list-name" className="block text-sm font-medium text-gray-700">
                            List Name
                          </label>
                          <input
                            type="text"
                            id="list-name"
                            required
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
                          <div className="space-y-3 max-h-60 overflow-y-auto">
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
                                      required
                                      value={guest.ime}
                                      onChange={(e) => handleGuestChange(guest.id, "ime", e.target.value)}
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                  <div>
                                    <input
                                      type="text"
                                      placeholder="Last Name"
                                      required
                                      value={guest.prezime}
                                      onChange={(e) => handleGuestChange(guest.id, "prezime", e.target.value)}
                                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    />
                                  </div>
                                  <div className="col-span-2">
                                    <input
                                      type="email"
                                      placeholder="Email"
                                      required
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
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {editingList ? "Update" : "Create"}
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

export default CustomerGuestLists
