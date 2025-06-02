"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Users, ArrowLeft, Clock } from "lucide-react"

interface EventDetails {
  dogadjaj_id: number
  naziv: string
  opis: string
  uk_cijena_po_osobi: number
  uk_cijena_fiksna: number
  otkazni_rok: number
  prostor: {
    prostor_id: number
    naziv: string
    adresa: string
    kapacitet: number
    opis: string
  }
  organizator: {
    ime: string
    prezime: string
    email: string
  }
  ponude: Array<{
    ponuda_id: number
    naziv: string
    opis: string
    cijena: number
    tip_cjene: "Fiksno" | "po osobi"
    kategorija: string
  }>
  slike: Array<{
    url: string
  }>
}

export function EventDetails() {
  const { id } = useParams<{ id: string }>()
  const [event, setEvent] = useState<EventDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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
        opis: "Organizujemo nezaboravnu rođendansku zabavu sa kompletnim uslugama. Naš tim će se pobrinuti za sve detalje kako biste vi mogli uživati u posebnom danu. Uključujemo profesionalnu dekoraciju, kvalitetan catering i zabavni program prilagođen vašim željama.",
        uk_cijena_po_osobi: 25,
        uk_cijena_fiksna: 200,
        otkazni_rok: 7,
        prostor: {
          prostor_id: 1,
          naziv: "Sala Kristal",
          adresa: "Trg Republike 5, Zagreb",
          kapacitet: 100,
          opis: "Elegantna sala s modernim dizajnom, klimatizacijom i profesionalnim audio-video sustavom. Idealna za sve vrste proslava.",
        },
        organizator: {
          ime: "Marko",
          prezime: "Marković",
          email: "marko@example.com",
        },
        ponude: [
          {
            ponuda_id: 1,
            naziv: "Premium catering",
            opis: "Raznovrsni meni s toplim i hladnim jelima",
            cijena: 15,
            tip_cjene: "po osobi",
            kategorija: "Catering",
          },
          {
            ponuda_id: 2,
            naziv: "DJ usluge",
            opis: "Profesionalni DJ s kompletnom audio opremom",
            cijena: 150,
            tip_cjene: "Fiksno",
            kategorija: "Usluga",
          },
          {
            ponuda_id: 3,
            naziv: "Tematska dekoracija",
            opis: "Kompletna dekoracija prema vašoj želji",
            cijena: 100,
            tip_cjene: "Fiksno",
            kategorija: "Rekviziti",
          },
        ],
        slike: [
          { url: "/placeholder.svg?height=300&width=400" },
          { url: "/placeholder.svg?height=300&width=400" },
          { url: "/placeholder.svg?height=300&width=400" },
        ],
      })
      setIsLoading(false)
    }, 1000)
  }, [id])

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
        <Link to="/customer">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Povratak na događaje
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/customer">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Nazad
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{event.naziv}</h1>
          <p className="text-gray-600">
            Organizator: {event.organizator.ime} {event.organizator.prezime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Event Images */}
          <Card>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {event.slike.map((slika, index) => (
                  <img
                    key={index}
                    src={slika.url || "/placeholder.svg"}
                    alt={`${event.naziv} ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Description */}
          <Card>
            <CardHeader>
              <CardTitle>Opis događaja</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{event.opis}</p>
            </CardContent>
          </Card>

          {/* Space Details */}
          <Card>
            <CardHeader>
              <CardTitle>Prostor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg text-blue-900">{event.prostor.naziv}</h3>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-2" />
                  {event.prostor.adresa}
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Users className="h-4 w-4 mr-2" />
                  Kapacitet: {event.prostor.kapacitet} osoba
                </div>
              </div>
              <p className="text-gray-700">{event.prostor.opis}</p>
            </CardContent>
          </Card>

          {/* Included Services */}
          <Card>
            <CardHeader>
              <CardTitle>Uključene usluge</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {event.ponude.map((ponuda) => (
                  <div key={ponuda.ponuda_id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{ponuda.naziv}</h4>
                        <Badge variant="outline" className="mt-1">
                          {ponuda.kategorija}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-900">{ponuda.cijena}€</div>
                        <div className="text-sm text-gray-600">{ponuda.tip_cjene}</div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{ponuda.opis}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Booking Sidebar */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="text-xl text-blue-900">Rezervacija</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-900">{event.uk_cijena_fiksna}€</div>
                  <div className="text-sm text-gray-600">fiksna cijena</div>
                  <Separator className="my-2" />
                  <div className="text-lg font-semibold text-blue-900">+ {event.uk_cijena_po_osobi}€</div>
                  <div className="text-sm text-gray-600">po osobi</div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2 text-blue-600" />
                Otkazni rok: {event.otkazni_rok} dana prije događaja
              </div>

              <Link to={`/customer/events/${event.dogadjaj_id}/reserve`}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3">Rezerviraj događaj</Button>
              </Link>

              <div className="text-xs text-gray-500 text-center">
                Rezervacija se može otkazati do {event.otkazni_rok} dana prije događaja
              </div>
            </CardContent>
          </Card>

          {/* Contact Organizer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Kontakt organizatora</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="font-medium">
                  {event.organizator.ime} {event.organizator.prezime}
                </div>
                <div className="text-sm text-gray-600">{event.organizator.email}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
