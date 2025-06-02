"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Search, MapPin, Users, Calendar, Star, Heart, Clock, Filter } from "lucide-react"

type Event = {
  dogadjaj_id: number
  naziv: string
  opis: string
  organizator_ime: string
  prostor_naziv: string
  prostor_adresa: string
  prostor_kapacitet: number
  uk_cijena_po_osobi: number
  uk_cijena_fiksna: number
  otkazni_rok: number
  ocjena: number
  broj_ocjena: number
  kategorija: string
  dostupni_termini: string[]
  slike: string[]
}

export default function EventsFeed() {
  const [events, setEvents] = useState<Event[]>([
    {
      dogadjaj_id: 1,
      naziv: "Ljetna zabava na terasi",
      opis: "Nezaboravna ljetna zabava s pogledom na more. Uključuje premium catering, DJ-a, dekoracije i sve potrebno za savršenu zabavu. Idealno za rođendane, proslave i privatne događaje.",
      organizator_ime: "Marina Events",
      prostor_naziv: "Terasa Vista",
      prostor_adresa: "Obala kralja Zvonimira 15, Split",
      prostor_kapacitet: 80,
      uk_cijena_po_osobi: 85,
      uk_cijena_fiksna: 500,
      otkazni_rok: 7,
      ocjena: 4.8,
      broj_ocjena: 24,
      kategorija: "Zabava",
      dostupni_termini: ["2024-07-15", "2024-07-22", "2024-07-29"],
      slike: ["/placeholder.svg?height=200&width=300"],
    },
    {
      dogadjaj_id: 2,
      naziv: "Poslovni seminar",
      opis: "Profesionalni prostor za poslovne događaje s kompletnom AV opremom, catering servisom i parking mjestima. Idealno za konferencije, seminare i poslovne prezentacije.",
      organizator_ime: "Business Solutions",
      prostor_naziv: "Business Center",
      prostor_adresa: "Ilica 242, Zagreb",
      prostor_kapacitet: 50,
      uk_cijena_po_osobi: 45,
      uk_cijena_fiksna: 800,
      otkazni_rok: 14,
      ocjena: 4.6,
      broj_ocjena: 18,
      kategorija: "Poslovno",
      dostupni_termini: ["2024-06-20", "2024-06-27", "2024-07-04"],
      slike: ["/placeholder.svg?height=200&width=300"],
    },
    {
      dogadjaj_id: 3,
      naziv: "Vjenčana ceremonija",
      opis: "Romantična vjenčana ceremonija u prekrasnom ambijentu s pogledom na more. Uključuje dekoracije, fotografa, catering i sve potrebno za savršen dan.",
      organizator_ime: "Dream Weddings",
      prostor_naziv: "Villa Sunset",
      prostor_adresa: "Lapadska obala 37, Dubrovnik",
      prostor_kapacitet: 120,
      uk_cijena_po_osobi: 120,
      uk_cijena_fiksna: 2000,
      otkazni_rok: 30,
      ocjena: 4.9,
      broj_ocjena: 35,
      kategorija: "Vjenčanje",
      dostupni_termini: ["2024-08-10", "2024-08-17", "2024-08-24"],
      slike: ["/placeholder.svg?height=200&width=300"],
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [priceFilter, setPriceFilter] = useState<string>("all")
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const [reservationData, setReservationData] = useState({
    datum_pocetka: "",
    datum_zavrsetka: "",
    broj_gostiju: "",
    posebni_zahtjevi: "",
  })

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.opis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.prostor_naziv.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesLocation =
      locationFilter === "all" || event.prostor_adresa.toLowerCase().includes(locationFilter.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.kategorija === categoryFilter

    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "budget" && event.uk_cijena_po_osobi <= 50) ||
      (priceFilter === "mid" && event.uk_cijena_po_osobi > 50 && event.uk_cijena_po_osobi <= 100) ||
      (priceFilter === "premium" && event.uk_cijena_po_osobi > 100)

    return matchesSearch && matchesLocation && matchesCategory && matchesPrice
  })

  const toggleFavorite = (eventId: number) => {
    setFavorites((prev) => (prev.includes(eventId) ? prev.filter((id) => id !== eventId) : [...prev, eventId]))
  }

  const handleReservation = () => {
    if (!selectedEvent) return

    const ukupnaCijena =
      selectedEvent.uk_cijena_fiksna + selectedEvent.uk_cijena_po_osobi * Number.parseInt(reservationData.broj_gostiju)

    // Ovdje bi se poslala rezervacija na backend
    console.log("Nova rezervacija:", {
      dogadjaj_id: selectedEvent.dogadjaj_id,
      ...reservationData,
      ukupna_cijena: ukupnaCijena,
    })

    setIsReservationDialogOpen(false)
    setReservationData({
      datum_pocetka: "",
      datum_zavrsetka: "",
      broj_gostiju: "",
      posebni_zahtjevi: "",
    })

    alert("Rezervacija je uspješno poslana! Organizator će je uskoro potvrditi.")
  }

  const calculateTotalPrice = () => {
    if (!selectedEvent || !reservationData.broj_gostiju) return 0
    return (
      selectedEvent.uk_cijena_fiksna + selectedEvent.uk_cijena_po_osobi * Number.parseInt(reservationData.broj_gostiju)
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Dostupni događaji</h2>
          <p className="text-slate-600">Pronađite savršen događaj za svaku priliku</p>
        </div>
      </div>

      {/* Filteri */}
      <Card className="bg-white/80 border-sky-200">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Pretraži događaje..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-sky-200 focus:border-sky-400"
                  />
                </div>
              </div>
              <Button variant="outline" className="border-sky-200 hover:bg-sky-50">
                <Filter className="h-4 w-4 mr-2" />
                Napredni filteri
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue placeholder="Lokacija" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve lokacije</SelectItem>
                  <SelectItem value="zagreb">Zagreb</SelectItem>
                  <SelectItem value="split">Split</SelectItem>
                  <SelectItem value="dubrovnik">Dubrovnik</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue placeholder="Kategorija" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve kategorije</SelectItem>
                  <SelectItem value="Zabava">Zabava</SelectItem>
                  <SelectItem value="Poslovno">Poslovno</SelectItem>
                  <SelectItem value="Vjenčanje">Vjenčanje</SelectItem>
                  <SelectItem value="Rođendan">Rođendan</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="border-sky-200">
                  <SelectValue placeholder="Cijena" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Sve cijene</SelectItem>
                  <SelectItem value="budget">Do €50 po osobi</SelectItem>
                  <SelectItem value="mid">€50-100 po osobi</SelectItem>
                  <SelectItem value="premium">Preko €100 po osobi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista događaja */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card
            key={event.dogadjaj_id}
            className="bg-white/80 border-sky-200 hover:shadow-lg transition-shadow overflow-hidden"
          >
            <div className="relative">
              <img src={event.slike[0] || "/placeholder.svg"} alt={event.naziv} className="w-full h-48 object-cover" />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => toggleFavorite(event.dogadjaj_id)}
              >
                <Heart
                  className={`h-4 w-4 ${favorites.includes(event.dogadjaj_id) ? "fill-red-500 text-red-500" : "text-slate-600"}`}
                />
              </Button>
              <Badge className="absolute top-2 left-2 bg-sky-600 text-white">{event.kategorija}</Badge>
            </div>

            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-slate-800">{event.naziv}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {event.prostor_naziv}, {event.prostor_adresa.split(",").pop()}
                  </CardDescription>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{event.ocjena}</span>
                      <span className="text-sm text-slate-500">({event.broj_ocjena})</span>
                    </div>
                    <span className="text-sm text-slate-500">• {event.organizator_ime}</span>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{event.opis}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Do {event.prostor_kapacitet} osoba</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{event.otkazni_rok} dana otkazni rok</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-1">
                  <div className="text-lg font-bold text-slate-800">
                    €{event.uk_cijena_po_osobi} <span className="text-sm font-normal text-slate-600">po osobi</span>
                  </div>
                  <div className="text-sm text-slate-600">+ €{event.uk_cijena_fiksna} fiksno</div>
                </div>

                <div className="flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-sky-200 hover:bg-sky-50"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Detalji
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{event.naziv}</DialogTitle>
                        <DialogDescription>
                          {event.organizator_ime} • {event.prostor_naziv}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedEvent && (
                        <div className="space-y-6">
                          <img
                            src={selectedEvent.slike[0] || "/placeholder.svg"}
                            alt={selectedEvent.naziv}
                            className="w-full h-64 object-cover rounded-lg"
                          />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">O događaju</h4>
                                <p className="text-sm text-slate-600">{selectedEvent.opis}</p>
                              </div>

                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">Lokacija</h4>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-slate-500" />
                                    {selectedEvent.prostor_naziv}
                                  </div>
                                  <div className="text-slate-600 ml-6">{selectedEvent.prostor_adresa}</div>
                                  <div className="flex items-center gap-2 ml-6">
                                    <Users className="h-4 w-4 text-slate-500" />
                                    Kapacitet: {selectedEvent.prostor_kapacitet} osoba
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">Cijena</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Po osobi:</span>
                                    <span className="font-medium">€{selectedEvent.uk_cijena_po_osobi}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Fiksni trošak:</span>
                                    <span className="font-medium">€{selectedEvent.uk_cijena_fiksna}</span>
                                  </div>
                                  <div className="flex justify-between border-t pt-2">
                                    <span>Otkazni rok:</span>
                                    <span className="font-medium">{selectedEvent.otkazni_rok} dana</span>
                                  </div>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">Ocjene</h4>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{selectedEvent.ocjena}</span>
                                  </div>
                                  <span className="text-sm text-slate-600">({selectedEvent.broj_ocjena} ocjena)</span>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">Dostupni termini</h4>
                                <div className="space-y-1">
                                  {selectedEvent.dostupni_termini.map((termin, index) => (
                                    <Badge key={index} variant="outline" className="mr-2 mb-1">
                                      {new Date(termin).toLocaleDateString("hr-HR")}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>

                  <Dialog open={isReservationDialogOpen} onOpenChange={setIsReservationDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-sky-600 hover:bg-sky-700" onClick={() => setSelectedEvent(event)}>
                        Rezerviraj
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Rezervacija događaja</DialogTitle>
                        <DialogDescription>
                          {selectedEvent?.naziv} - {selectedEvent?.prostor_naziv}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="datum_pocetka">Datum početka</Label>
                            <Input
                              id="datum_pocetka"
                              type="datetime-local"
                              value={reservationData.datum_pocetka}
                              onChange={(e) =>
                                setReservationData({ ...reservationData, datum_pocetka: e.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="datum_zavrsetka">Datum završetka</Label>
                            <Input
                              id="datum_zavrsetka"
                              type="datetime-local"
                              value={reservationData.datum_zavrsetka}
                              onChange={(e) =>
                                setReservationData({ ...reservationData, datum_zavrsetka: e.target.value })
                              }
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="broj_gostiju">Broj gostiju</Label>
                          <Input
                            id="broj_gostiju"
                            type="number"
                            placeholder="Unesite broj gostiju"
                            value={reservationData.broj_gostiju}
                            onChange={(e) => setReservationData({ ...reservationData, broj_gostiju: e.target.value })}
                            max={selectedEvent?.prostor_kapacitet}
                          />
                          {selectedEvent && (
                            <p className="text-sm text-slate-600">
                              Maksimalni kapacitet: {selectedEvent.prostor_kapacitet} osoba
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="posebni_zahtjevi">Posebni zahtjevi (opcionalno)</Label>
                          <Textarea
                            id="posebni_zahtjevi"
                            placeholder="Unesite posebne zahtjeve..."
                            value={reservationData.posebni_zahtjevi}
                            onChange={(e) =>
                              setReservationData({ ...reservationData, posebni_zahtjevi: e.target.value })
                            }
                            rows={3}
                          />
                        </div>

                        {reservationData.broj_gostiju && (
                          <div className="p-4 bg-sky-50 rounded-lg">
                            <h4 className="font-medium text-slate-800 mb-2">Pregled cijene</h4>
                            <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                <span>Fiksni trošak:</span>
                                <span>€{selectedEvent?.uk_cijena_fiksna}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>
                                  {reservationData.broj_gostiju} × €{selectedEvent?.uk_cijena_po_osobi}:
                                </span>
                                <span>
                                  €
                                  {selectedEvent
                                    ? selectedEvent.uk_cijena_po_osobi * Number.parseInt(reservationData.broj_gostiju)
                                    : 0}
                                </span>
                              </div>
                              <div className="flex justify-between font-medium border-t pt-1">
                                <span>Ukupno:</span>
                                <span>€{calculateTotalPrice()}</span>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-end gap-2 pt-4">
                          <Button variant="outline" onClick={() => setIsReservationDialogOpen(false)}>
                            Odustani
                          </Button>
                          <Button
                            onClick={handleReservation}
                            className="bg-sky-600 hover:bg-sky-700"
                            disabled={
                              !reservationData.datum_pocetka ||
                              !reservationData.datum_zavrsetka ||
                              !reservationData.broj_gostiju
                            }
                          >
                            Potvrdi rezervaciju
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-white/80 border-sky-200">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nema dostupnih događaja</h3>
            <p className="text-slate-600">
              Nema događaja koji odgovaraju vašim kriterijima pretrage. Pokušajte s drugačijim filterima.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
