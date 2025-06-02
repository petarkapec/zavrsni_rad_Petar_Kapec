"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { MapPin, Euro, Clock, Plus } from "lucide-react"

interface Space {
  prostor_id: number
  naziv: string
  adresa: string
  kapacitet: number
  cijena: number
}

interface Offer {
  ponuda_id: number
  naziv: string
  opis: string
  cijena: number
  tip_cjene: "Fiksno" | "po osobi"
  kategorija: string
}

export function CreateEvent() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [spaces, setSpaces] = useState<Space[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [selectedSpace, setSelectedSpace] = useState<number | null>(null)
  const [selectedOffers, setSelectedOffers] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    naziv: "",
    opis: "",
    uk_cijena_fiksna: 0,
    uk_cijena_po_osobi: 0,
    otkazni_rok: 7,
  })

  useEffect(() => {
    // TODO: Replace with actual API calls
    // Promise.all([
    //   fetch('/api/spaces'),
    //   fetch('/api/offers')
    // ]).then(([spacesRes, offersRes]) => {
    //   return Promise.all([spacesRes.json(), offersRes.json()])
    // }).then(([spacesData, offersData]) => {
    //   setSpaces(spacesData)
    //   setOffers(offersData)
    //   setIsLoading(false)
    // })

    // Mock data
    setTimeout(() => {
      setSpaces([
        {
          prostor_id: 1,
          naziv: "Sala Kristal",
          adresa: "Trg Republike 5, Zagreb",
          kapacitet: 100,
          cijena: 200,
        },
        {
          prostor_id: 2,
          naziv: "Konferencijska sala Alpha",
          adresa: "Ilica 242, Zagreb",
          kapacitet: 50,
          cijena: 150,
        },
        {
          prostor_id: 3,
          naziv: "Vila Harmony",
          adresa: "Maksimirska 128, Zagreb",
          kapacitet: 150,
          cijena: 500,
        },
      ])

      setOffers([
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
        {
          ponuda_id: 4,
          naziv: "Fotografiranje",
          opis: "Profesionalno fotografiranje događaja",
          cijena: 200,
          tip_cjene: "Fiksno",
          kategorija: "Usluga",
        },
      ])
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleOfferToggle = (offerId: number) => {
    setSelectedOffers((prev) => (prev.includes(offerId) ? prev.filter((id) => id !== offerId) : [...prev, offerId]))
  }

  const calculateTotalPricing = () => {
    const selectedSpace = spaces.find((s) => s.prostor_id === selectedSpace)
    const selectedOffersList = offers.filter((o) => selectedOffers.includes(o.ponuda_id))

    let fiksna = formData.uk_cijena_fiksna + (selectedSpace?.cijena || 0)
    let poOsobi = formData.uk_cijena_po_osobi

    selectedOffersList.forEach((offer) => {
      if (offer.tip_cjene === "Fiksno") {
        fiksna += offer.cijena
      } else {
        poOsobi += offer.cijena
      }
    })

    return { fiksna, poOsobi }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSpace || !user) return

    setIsSubmitting(true)

    const { fiksna, poOsobi } = calculateTotalPricing()

    const eventData = {
      ...formData,
      korisnik_id: user.korisnik_id,
      prostor_id: selectedSpace,
      uk_cijena_fiksna: fiksna,
      uk_cijena_po_osobi: poOsobi,
      ponude: selectedOffers,
    }

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(eventData)
      // })

      console.log("Creating event:", eventData)
      setTimeout(() => {
        navigate("/organizer/events")
      }, 1000)
    } catch (error) {
      console.error("Error creating event:", error)
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

  const { fiksna, poOsobi } = calculateTotalPricing()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Kreiraj novi događaj</h1>
        <p className="text-gray-600">Dodajte novi događaj u svoju ponudu</p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Osnovne informacije</CardTitle>
              <CardDescription>Unesite osnovne podatke o događaju</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="naziv">Naziv događaja</Label>
                <Input
                  id="naziv"
                  value={formData.naziv}
                  onChange={(e) => setFormData({ ...formData, naziv: e.target.value })}
                  placeholder="npr. Rođendanska zabava"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opis">Opis događaja</Label>
                <Textarea
                  id="opis"
                  value={formData.opis}
                  onChange={(e) => setFormData({ ...formData, opis: e.target.value })}
                  placeholder="Opišite svoj događaj..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fiksna">Dodatna fiksna cijena (€)</Label>
                  <Input
                    id="fiksna"
                    type="number"
                    min="0"
                    value={formData.uk_cijena_fiksna}
                    onChange={(e) =>
                      setFormData({ ...formData, uk_cijena_fiksna: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="poOsobi">Dodatna cijena po osobi (€)</Label>
                  <Input
                    id="poOsobi"
                    type="number"
                    min="0"
                    value={formData.uk_cijena_po_osobi}
                    onChange={(e) =>
                      setFormData({ ...formData, uk_cijena_po_osobi: Number.parseFloat(e.target.value) || 0 })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="otkazni">Otkazni rok (dani)</Label>
                  <Input
                    id="otkazni"
                    type="number"
                    min="1"
                    value={formData.otkazni_rok}
                    onChange={(e) => setFormData({ ...formData, otkazni_rok: Number.parseInt(e.target.value) || 7 })}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Space Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Odabir prostora
              </CardTitle>
              <CardDescription>Odaberite prostor za vaš događaj (obavezno)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {spaces.map((space) => (
                  <div
                    key={space.prostor_id}
                    className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                      selectedSpace === space.prostor_id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedSpace(space.prostor_id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-blue-900">{space.naziv}</h3>
                        <p className="text-sm text-gray-600 mt-1">{space.adresa}</p>
                        <p className="text-sm text-gray-600">Kapacitet: {space.kapacitet} osoba</p>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-900">{space.cijena}€</div>
                        <div className="text-sm text-gray-600">fiksno</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Additional Offers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="h-5 w-5 mr-2 text-blue-600" />
                Dodatne usluge
              </CardTitle>
              <CardDescription>Odaberite dodatne usluge koje želite uključiti (opcionalno)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {offers.map((offer) => (
                  <div key={offer.ponuda_id} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      id={`offer-${offer.ponuda_id}`}
                      checked={selectedOffers.includes(offer.ponuda_id)}
                      onCheckedChange={() => handleOfferToggle(offer.ponuda_id)}
                    />
                    <div className="flex-1">
                      <Label htmlFor={`offer-${offer.ponuda_id}`} className="font-medium cursor-pointer">
                        {offer.naziv}
                      </Label>
                      <p className="text-sm text-gray-600 mt-1">{offer.opis}</p>
                      <div className="text-sm text-blue-600 mt-1">{offer.kategorija}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{offer.cijena}€</div>
                      <div className="text-sm text-gray-600">{offer.tip_cjene}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Summary */}
        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Euro className="h-5 w-5 mr-2 text-blue-600" />
                Sažetak cijene
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Prostor:</span>
                  <span>{spaces.find((s) => s.prostor_id === selectedSpace)?.cijena || 0}€</span>
                </div>
                <div className="flex justify-between">
                  <span>Dodatno fiksno:</span>
                  <span>{formData.uk_cijena_fiksna}€</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Ukupno fiksno:</span>
                  <span className="text-blue-900">{fiksna}€</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Dodatno po osobi:</span>
                  <span>{formData.uk_cijena_po_osobi}€</span>
                </div>
                {selectedOffers.length > 0 && (
                  <>
                    {offers
                      .filter((o) => selectedOffers.includes(o.ponuda_id) && o.tip_cjene === "po osobi")
                      .map((offer) => (
                        <div key={offer.ponuda_id} className="flex justify-between text-xs">
                          <span>{offer.naziv}:</span>
                          <span>{offer.cijena}€</span>
                        </div>
                      ))}
                  </>
                )}
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Ukupno po osobi:</span>
                  <span className="text-blue-900">{poOsobi}€</span>
                </div>
              </div>

              <div className="bg-blue-50 p-3 rounded-lg">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-900">
                    {fiksna}€ + {poOsobi}€
                  </div>
                  <div className="text-sm text-gray-600">fiksno + po osobi</div>
                </div>
              </div>

              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-2" />
                Otkazni rok: {formData.otkazni_rok} dana
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting || !selectedSpace}
              >
                {isSubmitting ? "Kreiranje..." : "Kreiraj događaj"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}
