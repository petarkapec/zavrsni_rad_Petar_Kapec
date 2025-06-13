"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../../services/api"
import { CalendarIcon, Clock, Trash2, Plus, ArrowLeft, Check } from "lucide-react"
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"
import { format, addDays, isSaturday, isSunday } from "date-fns"

type TimeSlot = {
  terminId?: number
  datumPocetka: string
  datumZavrsetka: string
  zauzeto: boolean
  prostor?: number
}

type Space = {
  prostorId: number
  naziv: string
  adresa: string
  kapacitet: number
  cijena: number
}

const SpaceTimeSlots = () => {
  const { prostorId } = useParams<{ prostorId: string }>()
  const navigate = useNavigate()
  const [space, setSpace] = useState<Space | null>(null)
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])
  const [showBulkAddModal, setShowBulkAddModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTimeSlot, setNewTimeSlot] = useState<{
    startDate: Date
    startTime: string
    endDate: Date
    endTime: string
  }>({
    startDate: new Date(),
    startTime: "09:00",
    endDate: new Date(),
    endTime: "17:00",
  })
  const [bulkSettings, setBulkSettings] = useState({
    startTime: "09:00",
    endTime: "17:00",
    option: "all", // "all", "weekdays", "weekends"
    period: 30, // days
  })
  const [calendarView, setCalendarView] = useState<"month" | "year">("month")
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  useEffect(() => {
    if (!prostorId) return

    const fetchSpaceAndTimeSlots = async () => {
      setLoading(true)
      try {
        // Fetch space details
        const spaceResponse = await api.get(`/prostori/${prostorId}`)
        setSpace(spaceResponse.data)

        // Fetch time slots
        const timeSlotsResponse = await api.get(`/prostori/${prostorId}/termini`)
        console.log("Fetched time slots:", timeSlotsResponse.data)

        // Normalize the data to ensure consistent property names
        const normalizedTimeSlots = timeSlotsResponse.data.map((slot: any) => ({
          terminId: slot.terminId || slot.termin_id,
          datumPocetka: slot.datumPocetka || slot.datum_pocetka,
          datumZavrsetka: slot.datumZavrsetka || slot.datum_zavrsetka,
          zauzeto: slot.zauzeto || false,
        }))

        setTimeSlots(normalizedTimeSlots)
      } catch (error) {
        console.error("Failed to fetch space or time slots", error)
      } finally {
        setLoading(false)
      }
    }

    fetchSpaceAndTimeSlots()
  }, [prostorId])

  // Helper function to format date without timezone
  const formatDateForBackend = (date: Date, timeString: string) => {
    const [hours, minutes] = timeString.split(":").map(Number)
    const formattedDate = new Date(date)
    formattedDate.setHours(hours, minutes, 0, 0)

    // Format as ISO-8601 with timezone offset (e.g., "2025-06-19T09:00:00Z")
    return formattedDate.toISOString()
  }

  const handleAddTimeSlot = async () => {
    if (!prostorId) return

    try {
      setIsSaving(true)

      // Format dates without timezone information
      const startDateTime = formatDateForBackend(newTimeSlot.startDate, newTimeSlot.startTime)
      const endDateTime = formatDateForBackend(newTimeSlot.endDate, newTimeSlot.endTime)

      const newSlot = {
        datumPocetka: startDateTime,
        datumZavrsetka: endDateTime,
        zauzeto: false,
        prostor: Number(prostorId),
      }

      const response = await api.post(`/prostori/${prostorId}/termini`, newSlot)

      // Add the new time slot to the list
      setTimeSlots([
        ...timeSlots,
        {
          ...newSlot,
          terminId: response.data.terminId || response.data.id,
        },
      ])

      setShowAddModal(false)
      showSuccessMessage("Time slot added successfully")
    } catch (error) {
      console.error("Failed to add time slot", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteTimeSlot = async (terminId: number) => {
    if (!prostorId || !terminId) return

    if (window.confirm("Are you sure you want to delete this time slot?")) {
      try {
        await api.delete(`/prostori/${prostorId}/termini/${terminId}`)

        // Remove the deleted time slot from the list
        setTimeSlots(timeSlots.filter((slot) => slot.terminId !== terminId))
        showSuccessMessage("Time slot deleted successfully")
      } catch (error) {
        console.error("Failed to delete time slot", error)
      }
    }
  }

  const handleBulkAddTimeSlots = async () => {
    if (!prostorId) return

    try {
      setIsSaving(true)
      let addedCount = 0

      // Determine which dates to process
      const datesToProcess = selectedDates.length > 0 ? selectedDates : generateDatesBasedOnOption()

      // Process each date individually
      for (const date of datesToProcess) {
        // Format dates without timezone information
        const startDateTime = formatDateForBackend(date, bulkSettings.startTime)
        const endDateTime = formatDateForBackend(date, bulkSettings.endTime)

        const newSlot = {
          datumPocetka: startDateTime,
          datumZavrsetka: endDateTime,
          zauzeto: false,
          prostor: Number(prostorId),
        }

        // Send individual request for each time slot
        try {
          await api.post(`/prostori/${prostorId}/termini`, newSlot)
          addedCount++
        } catch (error) {
          console.error(`Failed to add time slot for ${format(date, "yyyy-MM-dd")}`, error)
        }
      }

      // Refresh the time slots list
      const refreshResponse = await api.get(`/prostori/${prostorId}/termini`)
      setTimeSlots(refreshResponse.data)

      setShowBulkAddModal(false)
      setSelectedDates([]) // Clear selected dates after adding
      showSuccessMessage(`${addedCount} time slots added successfully`)
    } catch (error) {
      console.error("Failed to bulk add time slots", error)
    } finally {
      setIsSaving(false)
    }
  }

  // Helper function to generate dates based on selected option
  const generateDatesBasedOnOption = () => {
    const dates: Date[] = []
    const today = new Date()
    const endDate = addDays(today, bulkSettings.period)

    for (let date = new Date(today); date <= endDate; date = addDays(date, 1)) {
      const isWeekend = isSaturday(date) || isSunday(date)

      if (
        bulkSettings.option === "all" ||
        (bulkSettings.option === "weekdays" && !isWeekend) ||
        (bulkSettings.option === "weekends" && isWeekend)
      ) {
        dates.push(new Date(date))
      }
    }

    return dates
  }

  const handleCalendarDateClick = (value: Date | Date[] | null) => {
    if (!value) return

    const date = Array.isArray(value) ? value[0] : value
    setSelectedDate(date)
    setNewTimeSlot({
      ...newTimeSlot,
      startDate: date,
      endDate: date,
    })
    setShowAddModal(true)
  }

  const handleMultiDateSelection = (
    value: Date | Date[] | null,
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    if (!value) return

    // We're handling a single date click
    const date = Array.isArray(value) ? value[0] : value
    const dateString = format(date, "yyyy-MM-dd")

    // Check if the date is already selected
    const isSelected = selectedDates.some((d) => format(d, "yyyy-MM-dd") === dateString)

    if (isSelected) {
      // Remove the date if already selected
      setSelectedDates(selectedDates.filter((d) => format(d, "yyyy-MM-dd") !== dateString))
    } else {
      // Add the date if not selected
      setSelectedDates([...selectedDates, date])
    }
  }

  const handleBulkAddSelectedDates = () => {
    if (selectedDates.length === 0) {
      alert("Please select at least one date")
      return
    }

    // Show the bulk add modal
    setShowBulkAddModal(true)
  }

  const showSuccessMessage = (message: string) => {
    setSuccessMessage(message)
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000)
  }

  const formatDateTime = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "MMM d, yyyy h:mm a")
    } catch (error) {
      return dateString
    }
  }

  // Function to check if a date has time slots
  const hasTimeSlots = (date: Date) => {
    const dateString = format(date, "yyyy-MM-dd")
    return timeSlots.some((slot) => {
      const slotDate = format(new Date(slot.datumPocetka), "yyyy-MM-dd")
      return slotDate === dateString
    })
  }

  // Custom tile content for the calendar
  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === "month" && hasTimeSlots(date)) {
      return <div className="h-2 w-2 bg-green-500 rounded-full mx-auto mt-1"></div>
    }
    return null
  }

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view !== "month") return ""

    // Check if the date is in the selectedDates array
    const isSelected = selectedDates.some((d) => format(d, "yyyy-MM-dd") === format(date, "yyyy-MM-dd"))

    return isSelected ? "bg-indigo-100 rounded-lg" : ""
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  if (!space) {
    return <div className="text-center py-12">Space not found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={() => navigate("/organizer/spaces")} className="mr-4 p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Manage Time Slots</h1>
            <p className="mt-1 text-sm text-gray-500">
              {space.naziv} - {space.adresa}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setSelectedDates([])}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={selectedDates.length === 0}
          >
            Clear Selection ({selectedDates.length})
          </button>
          <button
            onClick={handleBulkAddSelectedDates}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            disabled={selectedDates.length === 0}
          >
            Add Time Slots for Selected Dates
          </button>
          <button
            onClick={() => {
              setSelectedDates([])
              setShowBulkAddModal(true)
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Bulk Add Time Slots
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Calendar</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setCalendarView("month")}
                className={`px-3 py-1 text-sm rounded-md ${
                  calendarView === "month" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setCalendarView("year")}
                className={`px-3 py-1 text-sm rounded-md ${
                  calendarView === "year" ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                Year
              </button>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="mb-4 text-sm text-gray-500">
              Click on dates to select them, then use the blue button to add time slots for selected dates.
            </div>
            <div className="calendar-container">
              <Calendar
                onChange={handleMultiDateSelection}
                value={null}
                view={calendarView}
                tileContent={tileContent}
                tileClassName={tileClassName}
                minDate={new Date()}
                className="w-full border-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Time Slots</h3>
            <p className="mt-1 text-sm text-gray-500">All available time slots for this space.</p>
          </div>
          <div className="border-t border-gray-200">
            <div className="max-h-96 overflow-y-auto">
              {timeSlots.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                  {timeSlots.map((slot) => (
                    <li key={slot.terminId || slot.datumPocetka} className="px-4 py-4 sm:px-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">
                              {formatDateTime(slot.datumPocetka)}
                            </span>
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">to {formatDateTime(slot.datumZavrsetka)}</span>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {slot.zauzeto ? (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              Booked
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Available
                            </span>
                          )}
                          {!slot.zauzeto && slot.terminId && (
                            <button
                              onClick={() => handleDeleteTimeSlot(slot.terminId!)}
                              className="ml-3 p-1 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-4 py-6 text-center text-gray-500">
                  No time slots available. Add some using the calendar or bulk add option.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Time Slot Modal */}
      {showAddModal && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Add Time Slot</h3>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Date</label>
                          <input
                            type="date"
                            value={format(newTimeSlot.startDate, "yyyy-MM-dd")}
                            onChange={(e) =>
                              setNewTimeSlot({
                                ...newTimeSlot,
                                startDate: e.target.value ? new Date(e.target.value) : new Date(),
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Time</label>
                          <input
                            type="time"
                            value={newTimeSlot.startTime}
                            onChange={(e) =>
                              setNewTimeSlot({
                                ...newTimeSlot,
                                startTime: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Date</label>
                          <input
                            type="date"
                            value={format(newTimeSlot.endDate, "yyyy-MM-dd")}
                            onChange={(e) =>
                              setNewTimeSlot({
                                ...newTimeSlot,
                                endDate: e.target.value ? new Date(e.target.value) : new Date(),
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Time</label>
                          <input
                            type="time"
                            value={newTimeSlot.endTime}
                            onChange={(e) =>
                              setNewTimeSlot({
                                ...newTimeSlot,
                                endTime: e.target.value,
                              })
                            }
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
                  type="button"
                  onClick={handleAddTimeSlot}
                  disabled={isSaving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSaving ? "Adding..." : "Add Time Slot"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Modal */}
      {showBulkAddModal && (
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
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Bulk Add Time Slots</h3>
                    <div className="mt-4 space-y-4">
                      {selectedDates.length > 0 ? (
                        <div className="bg-blue-50 p-3 rounded-md">
                          <p className="text-sm text-blue-700">
                            You've selected {selectedDates.length} date{selectedDates.length !== 1 ? "s" : ""}. Time
                            slots will be created for these specific dates.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Date Range Option</label>
                          <select
                            value={bulkSettings.option}
                            onChange={(e) =>
                              setBulkSettings({
                                ...bulkSettings,
                                option: e.target.value as "all" | "weekdays" | "weekends",
                              })
                            }
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="all">All days</option>
                            <option value="weekdays">Weekdays only</option>
                            <option value="weekends">Weekends only</option>
                          </select>
                        </div>
                      )}

                      {!selectedDates.length && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Period (days)</label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={bulkSettings.period}
                            onChange={(e) =>
                              setBulkSettings({
                                ...bulkSettings,
                                period: Number.parseInt(e.target.value) || 30,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            Time slots will be created for the next {bulkSettings.period} days starting from today.
                          </p>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">Start Time</label>
                          <input
                            type="time"
                            value={bulkSettings.startTime}
                            onChange={(e) =>
                              setBulkSettings({
                                ...bulkSettings,
                                startTime: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700">End Time</label>
                          <input
                            type="time"
                            value={bulkSettings.endTime}
                            onChange={(e) =>
                              setBulkSettings({
                                ...bulkSettings,
                                endTime: e.target.value,
                              })
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>

                      {!selectedDates.length && (
                        <div className="bg-yellow-50 p-3 rounded-md">
                          <p className="text-sm text-yellow-700">
                            <strong>Note:</strong> This will create time slots for multiple days based on your settings.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleBulkAddTimeSlots}
                  disabled={isSaving}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {isSaving ? "Adding..." : "Add Time Slots"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkAddModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SpaceTimeSlots
