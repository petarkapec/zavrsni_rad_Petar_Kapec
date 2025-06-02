"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Eye, X } from "lucide-react"

interface Reservation {
  rezervacija_id: number
  dogadjaj: {
    dogadjaj_id: number
    naziv: string
    prostor: {
      naziv: string
      adresa: string
    }
  }
  datum_pocetka: string
  datum_zavrsetka: string
  ukupna_cijena: number
  status: "Čeka potvrdu" | "Potvrđeno" | "Otkazano"
  status_placanja: "Nije plaćeno" | "Plaćeno"
  broj_gostiju: number
}

export function CustomerReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch('/api/reservations/my')
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
            prostor: {
              naziv: "Sala Kristal",
              adresa: "Trg Republike 5, Zagreb",
            },
          },
          datum_pocetka: "2024-02-15T18:00",
          datum_zavrsetka: "2024-02-15T23:00",
          ukupna_cijena: 275,
          status: "Potvrđeno",
          status_placanja: "Plaćeno",
          broj_gostiju: 3,
        },
        {
          rezervacija_id: 2,
          dogadjaj: {
            dogadjaj_id: 2,
            naziv: "Poslovni seminar",
            prostor: {
              naziv: "Konferencijska sala Alpha",
              adresa: "Ilica 242, Zagreb",
            },
          },
          datum_pocetka: "2024-03-10T09:00",
          datum_zavrsetka: "2024-03-10T17:00",
          ukupna_cijena: 450,
          status: "Čeka potvrdu",
          status_placanja: "Nije plaćeno",
          broj_gostiju: 20,
        },
        {
          rezervacija_id: 3,
          dogadjaj: {
            dogadjaj_id: 3,
            naziv: "Vjenčana svečanost",
            prostor: {
              naziv: "Vila Harmony",
              adresa: "Maksimirska 128, Zagreb",
            },
          },
          datum_pocetka: "2024-01-20T16:00",
          datum_zavrsetka: "2024-01-20T23:00",
          ukupna_cijena: 1200,
          status: "Otkazano",
          status_placanja: "Nije plaćeno",
          broj_gostiju: 50,
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleCancelReservation = async (reservationId: number) => {
    if (!confirm("Jeste li sigurni da želite otkazati rezervaciju?")) return

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

  const activeReservations = reservations.filter((r) => r.status !== "Otkazano")
  const pastReservations = reservations.filter((r) => r.status === "Otkazano" || new Date(r.datum_pocetka) < new Date())

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
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {reservation.dogadjaj.prostor.naziv}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="font-semibold text-lg">{reservation.ukupna_cijena}€</div>
            <div className="text-sm text-gray-600">#{reservation.rezervacija_id}</div>
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

        <div className="flex items-center gap-2">
          <Badge variant={getStatusColor(reservation.status)}>{reservation.status}</Badge>
          <Badge variant={getPaymentStatusColor(reservation.status_placanja)}>{reservation.status_placanja}</Badge>
        </div>

        <div className="flex gap-2">
          <Link to={`/customer/events/${reservation.dogadjaj.dogadjaj_id}`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Pogledaj događaj
            </Button>
          </Link>

          {reservation.status === "Čeka potvrdu" && (
            <>
              {reservation.status_placanja === "Nije plaćeno" && (
                <Link to={`/customer/payment/${reservation.rezervacija_id}`}>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    Plati
                  </Button>
                </Link>
              )}
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Moje rezervacije</h1>
        <p className="text-gray-600">Pregled svih vaših rezervacija</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Aktivne rezervacije ({activeReservations.length})</TabsTrigger>
          <TabsTrigger value="past">Prošle rezervacije ({pastReservations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeReservations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeReservations.map((reservation) => (
                <ReservationCard key={reservation.rezervacija_id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema aktivnih rezervacija</h3>
              <p className="text-gray-600 mb-4">Rezervirajte svoj prvi događaj!</p>
              <Link to="/customer">
                <Button>Pregledaj događaje</Button>
              </Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastReservations.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pastReservations.map((reservation) => (
                <ReservationCard key={reservation.rezervacija_id} reservation={reservation} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nema prošlih rezervacija</h3>
              <p className="text-gray-600">Ovdje će se prikazati vaše završene i otkazane rezervacije.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
