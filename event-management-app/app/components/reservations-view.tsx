"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar, Users, MapPin, Euro, Search, Eye, Check, X, Mail } from "lucide-react"

type Rezervacija = {
  rezervacija_id: number
  korisnik_ime: string
  korisnik_email: string
  dogadjaj_naziv: string
  prostor_naziv: string
  prostor_adresa: string
  datum_pocetka: string
  datum_zavrsetka: string
  ukupna_cijena: number
  posebni_zahtjevi: string
  status: "Čeka potvrdu" | "Potvrđeno" | "Otkazano"
  status_placanja: "Nije plaćeno" | "Plaćeno"
  broj_gostiju: number
}

type ReservationsViewProps = {
  userRole: "Organizator" | "Kupac"
}

export default function ReservationsView({ userRole }: ReservationsViewProps) {
  const [rezervacije, setRezervacije] = useState<Rezervacija[]>([
    {
      rezervacija_id: 1,
      korisnik_ime: "Marko Petrović",
      korisnik_email: "marko@example.com",
      dogadjaj_naziv: "Ljetna zabava na terasi",
      prostor_naziv: "Terasa Vista",
      prostor_adresa: "Obala kralja Zvonimira 15, Split",
      datum_pocetka: "2024-07-15T18:00",
      datum_zavrsetka: "2024-07-15T23:00",
      ukupna_cijena: 1200,
      posebni_zahtjevi: "Vegetarijanski meni za 5 osoba",
      status: "Čeka potvrdu",
      status_placanja: "Nije plaćeno",
      broj_gostiju: 25,
    },
    {
      rezervacija_id: 2,
      korisnik_ime: "Ana Marić",
      korisnik_email: "ana@example.com",
      dogadjaj_naziv: "Poslovni seminar",
      prostor_naziv: "Business Center",
      prostor_adresa: "Ilica 242, Zagreb",
      datum_pocetka: "2024-06-20T09:00",
      datum_zavrsetka: "2024-06-20T17:00",
      ukupna_cijena: 850,
      posebni_zahtjevi: "Potrebna projekcija i mikrofoni",
      status: "Potvrđeno",
      status_placanja: "Plaćeno",
      broj_gostiju: 15,
    },
    {
      rezervacija_id: 3,
      korisnik_ime: "Petra Novak",
      korisnik_email: "petra@example.com",
      dogadjaj_naziv: "Rođendanska zabava",
      prostor_naziv: "Villa Sunset",
      prostor_adresa: "Lapadska obala 37, Dubrovnik",
      datum_pocetka: "2024-08-10T19:00",
      datum_zavrsetka: "2024-08-11T01:00",
      ukupna_cijena: 2100,
      posebni_zahtjevi: "Torta za 30 osoba, DJ do ponoći",
      status: "Potvrđeno",
      status_placanja: "Nije plaćeno",
      broj_gostiju: 30,
    },
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedRezervacija, setSelectedRezervacija] = useState<Rezervacija | null>(null)

  const filteredRezervacije = rezervacije.filter((rezervacija) => {
    const matchesSearch =
      rezervacija.dogadjaj_naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rezervacija.korisnik_ime.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rezervacija.prostor_naziv.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || rezervacija.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleStatusChange = (rezervacija_id: number, newStatus: "Potvrđeno" | "Otkazano") => {
    setRezervacije(rezervacije.map((r) => (r.rezervacija_id === rezervacija_id ? { ...r, status: newStatus } : r)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Potvrđeno":
        return "bg-green-100 text-green-800 border-green-200"
      case "Čeka potvrdu":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Otkazano":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "Plaćeno":
        return "bg-green-100 text-green-800 border-green-200"
      case "Nije plaćeno":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("hr-HR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {userRole === "Organizator" ? "Rezervacije događaja" : "Moje rezervacije"}
          </h2>
          <p className="text-slate-600">
            {userRole === "Organizator"
              ? "Upravljajte rezervacijama svojih događaja"
              : "Pregled vaših rezervacija i statusa"}
          </p>
        </div>
      </div>

      {/* Filteri */}
      <Card className="bg-white/80 border-sky-200">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Pretraži rezervacije..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-sky-200 focus:border-sky-400"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-sky-200">
                <SelectValue placeholder="Filtriraj po statusu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="Čeka potvrdu">Čeka potvrdu</SelectItem>
                <SelectItem value="Potvrđeno">Potvrđeno</SelectItem>
                <SelectItem value="Otkazano">Otkazano</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista rezervacija */}
      <div className="space-y-4">
        {filteredRezervacije.map((rezervacija) => (
          <Card
            key={rezervacija.rezervacija_id}
            className="bg-white/80 border-sky-200 hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-slate-800">{rezervacija.dogadjaj_naziv}</CardTitle>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {rezervacija.prostor_naziv}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {rezervacija.broj_gostiju} gostiju
                    </div>
                    <div className="flex items-center gap-2">
                      <Euro className="h-4 w-4" />€{rezervacija.ukupna_cijena}
                    </div>
                  </div>
                  {userRole === "Organizator" && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail className="h-4 w-4" />
                      {rezervacija.korisnik_ime} ({rezervacija.korisnik_email})
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex gap-2">
                    <Badge className={getStatusColor(rezervacija.status)}>{rezervacija.status}</Badge>
                    <Badge className={getPaymentStatusColor(rezervacija.status_placanja)}>
                      {rezervacija.status_placanja}
                    </Badge>
                  </div>
                  <div className="text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {formatDate(rezervacija.datum_pocetka)}
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-slate-700">Početak:</span>
                  <div className="text-slate-600">{formatDate(rezervacija.datum_pocetka)}</div>
                </div>
                <div>
                  <span className="font-medium text-slate-700">Završetak:</span>
                  <div className="text-slate-600">{formatDate(rezervacija.datum_zavrsetka)}</div>
                </div>
              </div>

              {rezervacija.posebni_zahtjevi && (
                <div>
                  <span className="font-medium text-slate-700 text-sm">Posebni zahtjevi:</span>
                  <p className="text-sm text-slate-600 mt-1">{rezervacija.posebni_zahtjevi}</p>
                </div>
              )}

              <div className="flex flex-wrap justify-end gap-2 pt-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-sky-200 hover:bg-sky-50"
                      onClick={() => setSelectedRezervacija(rezervacija)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detalji
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Detalji rezervacije</DialogTitle>
                      <DialogDescription>Rezervacija #{rezervacija.rezervacija_id}</DialogDescription>
                    </DialogHeader>
                    {selectedRezervacija && (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-800 mb-2">Informacije o događaju</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Događaj:</span> {selectedRezervacija.dogadjaj_naziv}
                                </div>
                                <div>
                                  <span className="font-medium">Prostor:</span> {selectedRezervacija.prostor_naziv}
                                </div>
                                <div>
                                  <span className="font-medium">Adresa:</span> {selectedRezervacija.prostor_adresa}
                                </div>
                                <div>
                                  <span className="font-medium">Broj gostiju:</span> {selectedRezervacija.broj_gostiju}
                                </div>
                              </div>
                            </div>

                            {userRole === "Organizator" && (
                              <div>
                                <h4 className="font-medium text-slate-800 mb-2">Informacije o korisniku</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="font-medium">Ime:</span> {selectedRezervacija.korisnik_ime}
                                  </div>
                                  <div>
                                    <span className="font-medium">Email:</span> {selectedRezervacija.korisnik_email}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium text-slate-800 mb-2">Termini i cijena</h4>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="font-medium">Početak:</span>{" "}
                                  {formatDate(selectedRezervacija.datum_pocetka)}
                                </div>
                                <div>
                                  <span className="font-medium">Završetak:</span>{" "}
                                  {formatDate(selectedRezervacija.datum_zavrsetka)}
                                </div>
                                <div>
                                  <span className="font-medium">Ukupna cijena:</span> €
                                  {selectedRezervacija.ukupna_cijena}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium text-slate-800 mb-2">Status</h4>
                              <div className="space-y-2">
                                <Badge className={getStatusColor(selectedRezervacija.status)}>
                                  {selectedRezervacija.status}
                                </Badge>
                                <Badge className={getPaymentStatusColor(selectedRezervacija.status_placanja)}>
                                  {selectedRezervacija.status_placanja}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {selectedRezervacija.posebni_zahtjevi && (
                          <div>
                            <h4 className="font-medium text-slate-800 mb-2">Posebni zahtjevi</h4>
                            <p className="text-sm text-slate-600 p-3 bg-slate-50 rounded-lg">
                              {selectedRezervacija.posebni_zahtjevi}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </DialogContent>
                </Dialog>

                {userRole === "Organizator" && rezervacija.status === "Čeka potvrdu" && (
                  <>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(rezervacija.rezervacija_id, "Potvrđeno")}
                    >
                      <Check className="h-4 w-4 mr-1" />
                      Potvrdi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      onClick={() => handleStatusChange(rezervacija.rezervacija_id, "Otkazano")}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Otkaži
                    </Button>
                  </>
                )}

                {userRole === "Kupac" && rezervacija.status !== "Otkazano" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 hover:bg-red-50 text-red-600"
                    onClick={() => handleStatusChange(rezervacija.rezervacija_id, "Otkazano")}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Otkaži rezervaciju
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredRezervacije.length === 0 && (
        <Card className="bg-white/80 border-sky-200">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nema rezervacija</h3>
            <p className="text-slate-600">
              {searchTerm || statusFilter !== "all"
                ? "Nema rezervacija koje odgovaraju vašim kriterijima pretrage."
                : userRole === "Organizator"
                  ? "Još nema rezervacija za vaše događaje."
                  : "Još niste napravili nijednu rezervaciju."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
