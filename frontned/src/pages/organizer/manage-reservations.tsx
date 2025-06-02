"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Calendar, Users, Search, Check, X, Eye } from "lucide-react"

interface Reservation {
  rezervacija_id: number
  dogadjaj: {
    dogadjaj_id: number
    naziv: string
  }
  kupac: {
    ime: string
    prezime: string
    email: string
  }
  datum_pocetka: string
  datum_zavrsetka: string
  ukupna_cijena: number
  broj_gostiju: number
  posebni_zahtjevi: string
  status: "Čeka potvrdu" | "Potvrđeno" | "Otkazano"
  status_placanja: "Nije plaćeno" | "Plaćeno"
}

export function ManageReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch('/api/organizer/reservations')
    //   .then(res => res.json())
    //   .then(setReservations)

    // Mock data
    setTimeout(() => {
      setReservations([
        {
          rezervacija_id: 1,
          dogadjaj: {
            dogadjaj_id: 1,
            naziv: "Rođendanska zabava",
          },
          kupac: {
            ime: "Ana",
            prezime: "Anić",
            email: "ana@example.com",
          },
          datum_pocetka: "2024-02-15T18:00",
          datum_zavrsetka: "2024-02-15T23:00",
          ukupna_cijena: 275,
          broj_gostiju: 3,
          posebni_zahtjevi: "Molimo pripremiti vegetarijanski meni za 2 osobe",
          status: "Čeka potvrdu",
          status_placanja: "Nije plaćeno",
        },
        {
          rezervacija_id: 2,
          dogadjaj: {
            dogadjaj_id: 2,
            naziv: "Poslovni seminar",
          },
          kupac: {
            ime: "Marko",
            prezime: "Marković",
            email: "marko@example.com",
          },
          datum_pocetka: "2024-03-10T09:00",
          datum_zavrsetka: "2024-03-10T17:00",
          ukupna_cijena: 450,
          broj_gostiju: 20,
          posebni_zahtjevi: "",
          status: "Potvrđeno",
          status_placanja: "Plaćeno",
        },
        {
          rezervacija_id: 3,
          dogadjaj: {
            dogadjaj_id: 3,
            naziv: "Vjenčana svečanost",
          },
          kupac: {
            ime: "Petra",
            prezime: "Petrić",
            email: "petra@example.com",
          },
          datum_pocetka: "2024-04-20T16:00",
          datum_zavrsetka: "2024-04-20T23:00",
          ukupna_cijena: 1200,
          broj_gostiju: 50,
          posebni_zahtjevi: "Potrebna je dodatna dekoracija u ružičastoj boji",
          status: "Čeka potvrdu",
          status_placanja: "Nije plaćeno",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleConfirmReservation = async (reservationId: number) => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/reservations/${reservationId}/confirm`, {
      //   method: 'POST'
      // })

      setReservations(reservations.map((r) => (r.rezervacija_id === reservationId ? { ...r, status: "Potvrđeno" } : r)))
    } catch (error) {
      console.error("Error confirming reservation:", error)
    }
  }

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm("Jeste li sigurni da želite otkazati ovu rezervaciju?")) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/reservations/${reservationId}/cancel`, {
      //   method: 'POST'
      // })

      setReservations(reservations.map((r) => (r.rezervacija_id === reservationId ? { ...r, status: "Otkazano" } : r)))
    } catch (error) {
      console.error("Error cancelling reservation:", error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("hr-HR")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Potvrđeno":
        return "default"
      case "Čeka potvrdu":
        return "secondary"
      case "Otkazano":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    return status === "Plaćeno" ? "default" : "destructive"
  }

  const filteredReservations = reservations.filter(
    (reservation) =>
      reservation.dogadjaj.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${reservation.kupac.ime} ${reservation.kupac.prezime}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const pendingReservations = filteredReservations.filter((r) => r.status === "Čeka potvrdu")
  const confirmedReservations = filteredReservations.filter((r) => r.status === "Potvrđeno")
  const cancelledReservations = filteredReservations.filter((r) => r.status === "Otkazano")

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const ReservationCard = ({ reservation }: { reservation: Reservation }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg text-blue-900">{reservation.dogadjaj.naziv}</CardTitle>
            <CardDescription>
              {reservation.kupac.ime} {reservation.kupac.prezime} • #{reservation.rezervacija_id}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">{reservation.ukupna_cijena}€</div>
            <div className="text-sm text-gray-600">{reservation.kupac.email}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-blue-600" />
            <div>
              <div>Početak: {formatDate(reservation.datum_pocetka)}</div>
              <div>Završetak: {formatDate(reservation.datum_zavrsetka)}</div>
            </div>
          </div>
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-blue-600" />
            {reservation.broj_gostiju} gostiju
          </div>
        </div>

        {reservation.posebni_zahtjevi && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="font-medium text-sm mb-1">Posebni zahtjevi:</h4>
            <p className="text-sm text-gray-600">{reservation.posebni_zahtjevi}</p>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(reservation.status)}>{reservation.status}</Badge>
          <Badge variant={getPaymentStatusColor(reservation.status_placanja)}>{reservation.status_placanja}</Badge>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Detalji
          </Button>

          {reservation.status === "Čeka potvrdu" && (
            <>
              <Button
                size="sm"
                onClick={() => handleConfirmReservation(reservation.rezervacija_id)}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-4 w-4 mr-2" />
                Potvrdi
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCancelReservation(reservation.rezervacija_id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Otkaži
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Upravljanje rezervacijama</h1>
          <p className="text-gray-600">Pregled i upravljanje rezervacijama vaših događaja</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pretraži rezervacije..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="pending">Na čekanju ({pendingReservations.length})</TabsTrigger>
          <TabsTrigger value="confirmed">Potvrđene ({confirmedReservations.length})</TabsTrigger>
          <TabsTrigger value="cancelled">Otkazane ({cancelledReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          {pendingReservations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingReservations.map((reservation) => (
                <ReservationCard key={reservation.rezervacija_id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema rezervacija na čekanju</h3>
              <p className="text-gray-600">Sve rezervacije su obrađene.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="confirmed" className="space-y-4">
          {confirmedReservations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {confirmedReservations.map((reservation) => (
                <ReservationCard key={reservation.rezervacija_id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Check className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema potvrđenih rezervacija</h3>
              <p className="text-gray-600">Potvrđene rezervacije će se prikazati ovdje.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          {cancelledReservations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {cancelledReservations.map((reservation) => (
                <ReservationCard key={reservation.rezervacija_id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <X className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema otkazanih rezervacija</h3>
              <p className="text-gray-600">Otkazane rezervacije će se prikazati ovdje.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
