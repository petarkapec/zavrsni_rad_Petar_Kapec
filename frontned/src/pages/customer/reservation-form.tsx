"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Calendar, Users, Plus, Trash2, ArrowLeft } from "lucide-react"

interface Guest {
  ime: string
  prezime: string
  email: string
}

interface EventSummary {
  dogadjaj_id: number
  naziv: string
  uk_cijena_po_osobi: number
  uk_cijena_fiksna: number
  otkazni_rok: number
}

export function ReservationForm() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [event, setEvent] = useState<EventSummary | null>(null)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [guests, setGuests] = useState<Guest[]>([{ ime: "", prezime: "", email: "" }])
  const [specialRequests, setSpecialRequests] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch(`/api/events/${id}`)
    //   .then(res => res.json())
    //   .then(setEvent)

    // Mock data
    setTimeout(() => {
      setEvent({
        dogadjaj_id: Number.parseInt(id || "1"),
        naziv: "Rođendanska zabava",
        uk_cijena_po_osobi: 25,
        uk_cijena_fiksna: 200,
        otkazni_rok: 7,
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

  const addGuest = () => {
    setGuests([...guests, { ime: "", prezime: "", email: "" }])
  }

  const removeGuest = (index: number) => {
    if (guests.length > 1) {
      setGuests(guests.filter((_, i) => i !== index))
    }
  }

  const updateGuest = (index: number, field: keyof Guest, value: string) => {
    const updatedGuests = guests.map((guest, i) => (i === index ? { ...guest, [field]: value } : guest))
    setGuests(updatedGuests)
  }

  const calculateTotal = () => {
    if (!event) return 0
    const guestCount = guests.filter((g) => g.ime.trim()).length
    return event.uk_cijena_fiksna + event.uk_cijena_po_osobi * guestCount
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!event || !user) return

    setIsSubmitting(true)

    const reservationData = {
      korisnik_id: user.korisnik_id,
      dogadjaj_id: event.dogadjaj_id,
      datum_pocetka: startDate,
      datum_zavrsetka: endDate,
      ukupna_cijena: calculateTotal(),
      posebni_zahtjevi: specialRequests,
      gosti: guests.filter((g) => g.ime.trim()),
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/reservations', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reservationData)
      // })
      // const reservation = await response.json()

      // Mock response
      const mockReservation = { rezervacija_id: 1, ...reservationData }

      setTimeout(() => {
        navigate(`/customer/payment/${mockReservation.rezervacija_id}`)
      }, 1000)
    } catch (error) {
      console.error("Error creating reservation:", error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Događaj nije pronađen</h2>
        <Button variant="outline" onClick={() => navigate("/customer")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Povratak na događaje
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={() => navigate(`/customer/events/${id}`)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Nazad
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rezervacija događaja</h1>
          <p className="text-gray-600">{event.naziv}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Date Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Datum i vrijeme
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Početak događaja</Label>
                  <Input
                    id="startDate"
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">Završetak događaja</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  Lista gostiju
                </CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={addGuest}>
                  <Plus className="h-4 w-4 mr-2" />
                  Dodaj gosta
                </Button>
              </div>
              <CardDescription>Dodajte informacije o gostovima koji će prisustvovati događaju</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {guests.map((guest, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-medium">Gost {index + 1}</h4>
                    {guests.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeGuest(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label htmlFor={`guest-${index}-ime`}>Ime</Label>
                      <Input
                        id={`guest-${index}-ime`}
                        value={guest.ime}
                        onChange={(e) => updateGuest(index, "ime", e.target.value)}
                        placeholder="Ime gosta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`guest-${index}-prezime`}>Prezime</Label>
                      <Input
                        id={`guest-${index}-prezime`}
                        value={guest.prezime}
                        onChange={(e) => updateGuest(index, "prezime", e.target.value)}
                        placeholder="Prezime gosta"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`guest-${index}-email`}>Email (opcionalno)</Label>
                      <Input
                        id={`guest-${index}-email`}
                        type="email"
                        value={guest.email}
                        onChange={(e) => updateGuest(index, "email", e.target.value)}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Special Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Posebni zahtjevi</CardTitle>
              <CardDescription>Opišite dodatne zahtjeve ili napomene za organizatora</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                placeholder="Unesite posebne zahtjeve ili napomene..."
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Sažetak rezervacije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fiksna cijena:</span>
                  <span className="font-semibold">{event.uk_cijena_fiksna}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Broj gostiju:</span>
                  <span className="font-semibold">{guests.filter((g) => g.ime.trim()).length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cijena po gostu:</span>
                  <span className="font-semibold">{event.uk_cijena_po_osobi}€</span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-blue-900">
                  <span>Ukupno:</span>
                  <span>{calculateTotal()}€</span>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Napomena:</p>
                <p>Rezervacija se može otkazati do {event.otkazni_rok} dana prije događaja bez naknade.</p>
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                disabled={isSubmitting || !startDate || !endDate}
              >
                {isSubmitting ? "Kreiranje rezervacije..." : "Nastavi na plaćanje"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
