"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Users } from "lucide-react"

interface Reservation {
  rezervacija_id: number
  dogadjaj: {
    naziv: string
    uk_cijena_po_osobi: number
    uk_cijena_fiksna: number
    otkazni_rok: number
  }
  datum_pocetka: string
  datum_zavrsetka: string
  ukupna_cijena: number
  posebni_zahtjevi: string
  status: "Čeka potvrdu" | "Potvrđeno" | "Otkazano"
  status_placanja: "Nije plaćeno" | "Plaćeno"
  gosti: Array<{
    ime: string
    prezime: string
    email: string
  }>
}

export function Payment() {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()

  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch(`/api/reservations/${reservationId}`)
    //   .then(res => res.json())
    //   .then(setReservation)

    // Mock data
    setTimeout(() => {
      setReservation({
        rezervacija_id: Number.parseInt(reservationId || "1"),
        dogadjaj: {
          naziv: "Rođendanska zabava",
          uk_cijena_po_osobi: 25,
          uk_cijena_fiksna: 200,
          otkazni_rok: 7,
        },
        datum_pocetka: "2024-02-15T18:00",
        datum_zavrsetka: "2024-02-15T23:00",
        ukupna_cijena: 275,
        posebni_zahtjevi: "Molimo pripremiti vegetarijanski meni za 2 osobe",
        status: "Čeka potvrdu",
        status_placanja: "Nije plaćeno",
        gosti: [
          { ime: "Marko", prezime: "Marković", email: "marko@example.com" },
          { ime: "Ana", prezime: "Anić", email: "ana@example.com" },
          { ime: "Petar", prezime: "Petrović", email: "" },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }, [reservationId])

  const handlePayment = async () => {
    setIsProcessing(true)

    try {
      // TODO: Replace with actual payment processing
      // const response = await fetch(`/api/reservations/${reservationId}/pay`, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' }
      // })

      // Mock payment processing
      setTimeout(() => {
        setPaymentSuccess(true)
        setIsProcessing(false)

        // Update reservation status
        if (reservation) {
          setReservation({
            ...reservation,
            status_placanja: "Plaćeno",
            status: "Potvrđeno",
          })
        }
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
      setIsProcessing(false)
    }
  }

  const handleCancel = async () => {
    if (!confirm("Jeste li sigurni da želite otkazati rezervaciju?")) return

    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/reservations/${reservationId}/cancel`, {
      //   method: 'POST'
      // })

      navigate("/customer/reservations")
    } catch (error) {
      console.error("Cancel error:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!reservation) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Rezervacija nije pronađena</h2>
        <Button variant="outline" onClick={() => navigate("/customer")}>
          Povratak na događaje
        </Button>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
              <h1 className="text-2xl font-bold text-green-900">Plaćanje uspješno!</h1>
              <p className="text-green-700">
                Vaša rezervacija je potvrđena i plaćena. Organizator će vas kontaktirati s dodatnim informacijama.
              </p>
              <div className="flex gap-4 justify-center pt-4">
                <Button onClick={() => navigate("/customer/reservations")}>Moje rezervacije</Button>
                <Button variant="outline" onClick={() => navigate("/customer")}>
                  Povratak na događaje
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("hr-HR")
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Plaćanje rezervacije</h1>
        <p className="text-gray-600">Rezervacija #{reservation.rezervacija_id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Reservation Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-blue-600" />
                Detalji rezervacije
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-blue-900">{reservation.dogadjaj.naziv}</h3>
                <div className="mt-2 space-y-1 text-sm text-gray-600">
                  <div>Početak: {formatDate(reservation.datum_pocetka)}</div>
                  <div>Završetak: {formatDate(reservation.datum_zavrsetka)}</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Badge variant={reservation.status === "Potvrđeno" ? "default" : "secondary"}>
                  {reservation.status}
                </Badge>
                <Badge variant={reservation.status_placanja === "Plaćeno" ? "default" : "destructive"}>
                  {reservation.status_placanja}
                </Badge>
              </div>

              {reservation.posebni_zahtjevi && (
                <div>
                  <h4 className="font-medium mb-1">Posebni zahtjevi:</h4>
                  <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded">{reservation.posebni_zahtjevi}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Guest List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-blue-600" />
                Lista gostiju ({reservation.gosti.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {reservation.gosti.map((guest, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                    <div>
                      <div className="font-medium">
                        {guest.ime} {guest.prezime}
                      </div>
                      {guest.email && <div className="text-sm text-gray-600">{guest.email}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Sažetak plaćanja</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Fiksna cijena:</span>
                  <span className="font-semibold">{reservation.dogadjaj.uk_cijena_fiksna}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Broj gostiju:</span>
                  <span className="font-semibold">{reservation.gosti.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cijena po gostu:</span>
                  <span className="font-semibold">{reservation.dogadjaj.uk_cijena_po_osobi}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Gosti ukupno:</span>
                  <span className="font-semibold">
                    {reservation.gosti.length * reservation.dogadjaj.uk_cijena_po_osobi}€
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between text-lg font-bold text-blue-900">
                    <span>Ukupno za plaćanje:</span>
                    <span>{reservation.ukupna_cijena}€</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Napomena:</p>
                <p>
                  Rezervacija se može otkazati do {reservation.dogadjaj.otkazni_rok} dana prije događaja bez naknade.
                </p>
              </div>

              {reservation.status_placanja === "Nije plaćeno" && (
                <div className="space-y-3">
                  <Button
                    onClick={handlePayment}
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-3"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Obrađuje se plaćanje..." : `Plati ${reservation.ukupna_cijena}€`}
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="w-full text-red-600 border-red-200 hover:bg-red-50"
                    disabled={isProcessing}
                  >
                    Otkaži rezervaciju
                  </Button>
                </div>
              )}

              {reservation.status_placanja === "Plaćeno" && (
                <div className="text-center py-4">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-green-700 font-medium">Rezervacija je plaćena</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
