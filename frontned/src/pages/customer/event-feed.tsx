"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Calendar, Users, Search } from "lucide-react"

interface Event {
  dogadjaj_id: number
  naziv: string
  opis: string
  uk_cijena_po_osobi: number
  uk_cijena_fiksna: number
  prostor: {
    naziv: string
    adresa: string
    kapacitet: number
  }
  organizator: {
    ime: string
    prezime: string
  }
  ponude: Array<{
    naziv: string
    kategorija: string
  }>
}

export function EventFeed() {
  const [events, setEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // TODO: Replace with actual API call
    // fetch('/api/events')
    //   .then(res => res.json())
    //   .then(setEvents)

    // Mock data
    setTimeout(() => {
      setEvents([
        {
          dogadjaj_id: 1,
          naziv: "Rođendanska zabava",
          opis: "Organizujemo nezaboravnu rođendansku zabavu sa kompletnim uslugama.",
          uk_cijena_po_osobi: 25,
          uk_cijena_fiksna: 200,
          prostor: {
            naziv: "Sala Kristal",
            adresa: "Trg Republike 5, Zagreb",
            kapacitet: 100,
          },
          organizator: {
            ime: "Marko",
            prezime: "Marković",
          },
          ponude: [
            { naziv: "Catering", kategorija: "Catering" },
            { naziv: "DJ usluge", kategorija: "Usluga" },
            { naziv: "Dekoracija", kategorija: "Rekviziti" },
          ],
        },
        {
          dogadjaj_id: 2,
          naziv: "Poslovni seminar",
          opis: "Profesionalni prostor za poslovne događaje sa modernom opremom.",
          uk_cijena_po_osobi: 15,
          uk_cijena_fiksna: 150,
          prostor: {
            naziv: "Konferencijska sala Alpha",
            adresa: "Ilica 242, Zagreb",
            kapacitet: 50,
          },
          organizator: {
            ime: "Marko",
            prezime: "Marković",
          },
          ponude: [
            { naziv: "Projektor i zvuk", kategorija: "Usluga" },
            { naziv: "Coffee break", kategorija: "Catering" },
          ],
        },
        {
          dogadjaj_id: 3,
          naziv: "Vjenčana svečanost",
          opis: "Romantična atmosfera za najvažniji dan u vašem životu.",
          uk_cijena_po_osobi: 45,
          uk_cijena_fiksna: 500,
          prostor: {
            naziv: "Vila Harmony",
            adresa: "Maksimirska 128, Zagreb",
            kapacitet: 150,
          },
          organizator: {
            ime: "Marko",
            prezime: "Marković",
          },
          ponude: [
            { naziv: "Vjenčani meni", kategorija: "Catering" },
            { naziv: "Fotografiranje", kategorija: "Usluga" },
            { naziv: "Cvijeće", kategorija: "Rekviziti" },
          ],
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const filteredEvents = events.filter(
    (event) =>
      event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.opis.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dostupni događaji</h1>
          <p className="text-gray-600 mt-1">Pronađite savršen događaj za vašu priliku</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Pretraži događaje..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.dogadjaj_id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl text-blue-900">{event.naziv}</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {event.prostor.naziv}
                </Badge>
              </div>
              <CardDescription className="text-gray-600">{event.opis}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                {event.prostor.adresa}
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-2 text-blue-600" />
                Kapacitet: {event.prostor.kapacitet} osoba
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cijena:</span>
                  <div className="text-right">
                    <div className="font-semibold text-blue-900">{event.uk_cijena_fiksna}€ fiksno</div>
                    <div className="text-blue-700">+ {event.uk_cijena_po_osobi}€ po osobi</div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-gray-700">Uključene usluge:</div>
                <div className="flex flex-wrap gap-1">
                  {event.ponude.slice(0, 3).map((ponuda, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {ponuda.naziv}
                    </Badge>
                  ))}
                  {event.ponude.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{event.ponude.length - 3} više
                    </Badge>
                  )}
                </div>
              </div>

              <div className="pt-2">
                <Link to={`/customer/events/${event.dogadjaj_id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">Pogledaj detalje</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nema pronađenih događaja</h3>
          <p className="text-gray-600">Pokušajte s drugim pojmom za pretraživanje.</p>
        </div>
      )}
    </div>
  )
}
