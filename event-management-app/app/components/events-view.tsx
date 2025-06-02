"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Plus, Edit, Trash2, Eye, Calendar, MapPin, Users, Euro, Clock, Search } from "lucide-react"

type Event = {
  dogadjaj_id: number
  naziv: string
  opis: string
  prostor_id: number
  prostor_naziv: string
  prostor_adresa: string
  uk_cijena_po_osobi: number
  uk_cijena_fiksna: number
  otkazni_rok: number
  status: "Aktivan" | "Neaktivan" | "Završen"
  rezervacije_count: number
}

export default function EventsView() {
  const [events, setEvents] = useState<Event[]>([
    {
      dogadjaj_id: 1,
      naziv: "Ljetna zabava na terasi",
      opis: "Nezaboravna ljetna zabava s pogledom na more, uključuje catering i DJ-a",
      prostor_id: 1,
      prostor_naziv: "Terasa Vista",
      prostor_adresa: "Obala kralja Zvonimira 15, Split",
      uk_cijena_po_osobi: 85,
      uk_cijena_fiksna: 500,
      otkazni_rok: 7,
      status: "Aktivan",
      rezervacije_count: 3,
    },
    {
      dogadjaj_id: 2,
      naziv: "Poslovni seminar",
      opis: "Profesionalni prostor za poslovne događaje s kompletnom AV opremom",
      prostor_id: 2,
      prostor_naziv: "Business Center",
      prostor_adresa: "Ilica 242, Zagreb",
      uk_cijena_po_osobi: 45,
      uk_cijena_fiksna: 800,
      otkazni_rok: 14,
      status: "Aktivan",
      rezervacije_count: 1,
    },
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const [newEvent, setNewEvent] = useState({
    naziv: "",
    opis: "",
    prostor_id: "",
    uk_cijena_po_osobi: "",
    uk_cijena_fiksna: "",
    otkazni_rok: "",
  })

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.prostor_naziv.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleCreateEvent = () => {
    const event: Event = {
      dogadjaj_id: Date.now(),
      naziv: newEvent.naziv,
      opis: newEvent.opis,
      prostor_id: Number.parseInt(newEvent.prostor_id),
      prostor_naziv: "Novi prostor", // Ovo bi se dohvatilo iz baze
      prostor_adresa: "Adresa prostora",
      uk_cijena_po_osobi: Number.parseFloat(newEvent.uk_cijena_po_osobi),
      uk_cijena_fiksna: Number.parseFloat(newEvent.uk_cijena_fiksna),
      otkazni_rok: Number.parseInt(newEvent.otkazni_rok),
      status: "Aktivan",
      rezervacije_count: 0,
    }

    setEvents([...events, event])
    setNewEvent({
      naziv: "",
      opis: "",
      prostor_id: "",
      uk_cijena_po_osobi: "",
      uk_cijena_fiksna: "",
      otkazni_rok: "",
    })
    setIsCreateDialogOpen(false)
  }

  const handleDeleteEvent = (id: number) => {
    setEvents(events.filter((event) => event.dogadjaj_id !== id))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Aktivan":
        return "bg-green-100 text-green-800 border-green-200"
      case "Neaktivan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Završen":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Moji događaji</h2>
          <p className="text-slate-600">Upravljajte svojim događajima i rezervacijama</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Plus className="h-4 w-4 mr-2" />
              Novi događaj
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Kreiraj novi događaj</DialogTitle>
              <DialogDescription>Unesite podatke za novi događaj</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="naziv">Naziv događaja</Label>
                <Input
                  id="naziv"
                  value={newEvent.naziv}
                  onChange={(e) => setNewEvent({ ...newEvent, naziv: e.target.value })}
                  placeholder="Unesite naziv događaja"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opis">Opis</Label>
                <Textarea
                  id="opis"
                  value={newEvent.opis}
                  onChange={(e) => setNewEvent({ ...newEvent, opis: e.target.value })}
                  placeholder="Opišite svoj događaj"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prostor">Prostor</Label>
                <Select
                  value={newEvent.prostor_id}
                  onValueChange={(value) => setNewEvent({ ...newEvent, prostor_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberite prostor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Terasa Vista - Split</SelectItem>
                    <SelectItem value="2">Business Center - Zagreb</SelectItem>
                    <SelectItem value="3">Villa Sunset - Dubrovnik</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cijena_po_osobi">Cijena po osobi (€)</Label>
                  <Input
                    id="cijena_po_osobi"
                    type="number"
                    value={newEvent.uk_cijena_po_osobi}
                    onChange={(e) => setNewEvent({ ...newEvent, uk_cijena_po_osobi: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cijena_fiksna">Fiksna cijena (€)</Label>
                  <Input
                    id="cijena_fiksna"
                    type="number"
                    value={newEvent.uk_cijena_fiksna}
                    onChange={(e) => setNewEvent({ ...newEvent, uk_cijena_fiksna: e.target.value })}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="otkazni_rok">Otkazni rok (dani)</Label>
                <Input
                  id="otkazni_rok"
                  type="number"
                  value={newEvent.otkazni_rok}
                  onChange={(e) => setNewEvent({ ...newEvent, otkazni_rok: e.target.value })}
                  placeholder="7"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Odustani
                </Button>
                <Button onClick={handleCreateEvent} className="bg-sky-600 hover:bg-sky-700">
                  Kreiraj događaj
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filteri */}
      <Card className="bg-white/80 border-sky-200">
        <CardContent className="pt-6">
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
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48 border-sky-200">
                <SelectValue placeholder="Filtriraj po statusu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Svi statusi</SelectItem>
                <SelectItem value="Aktivan">Aktivni</SelectItem>
                <SelectItem value="Neaktivan">Neaktivni</SelectItem>
                <SelectItem value="Završen">Završeni</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista događaja */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map((event) => (
          <Card key={event.dogadjaj_id} className="bg-white/80 border-sky-200 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-slate-800">{event.naziv}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-slate-600">
                    <MapPin className="h-4 w-4" />
                    {event.prostor_naziv}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(event.status)}>{event.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600 line-clamp-2">{event.opis}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Po osobi: €{event.uk_cijena_po_osobi}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Euro className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">Fiksno: €{event.uk_cijena_fiksna}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{event.rezervacije_count} rezervacija</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-slate-500" />
                  <span className="text-slate-600">{event.otkazni_rok} dana otkazni rok</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" className="border-sky-200 hover:bg-sky-50">
                  <Eye className="h-4 w-4 mr-1" />
                  Pregled
                </Button>
                <Button variant="outline" size="sm" className="border-sky-200 hover:bg-sky-50">
                  <Edit className="h-4 w-4 mr-1" />
                  Uredi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-200 hover:bg-red-50 text-red-600"
                  onClick={() => handleDeleteEvent(event.dogadjaj_id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Obriši
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <Card className="bg-white/80 border-sky-200">
          <CardContent className="text-center py-12">
            <Calendar className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Nema događaja</h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Nema događaja koji odgovaraju vašim kriterijima pretrage."
                : "Još niste kreirali nijedan događaj."}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-sky-600 hover:bg-sky-700">
                <Plus className="h-4 w-4 mr-2" />
                Kreiraj prvi događaj
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
