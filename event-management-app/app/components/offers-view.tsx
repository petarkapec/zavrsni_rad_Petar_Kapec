"use client"

import { useState, useEffect } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Eye, MapPin, Euro, Users, Search, ImageIcon, Loader2 } from "lucide-react"
import { ponudaApi, prostorApi, type PonudaDTO, type ProstorDTO, handleApiError } from "@/lib/api"

export default function OffersView() {
  const [ponude, setPonude] = useState<PonudaDTO[]>([])
  const [prostori, setProstori] = useState<ProstorDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("ponude")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const [newPonuda, setNewPonuda] = useState({
    naziv: "",
    opis: "",
    ukCijenaFiksna: "",
    cijenaPoOsobi: "",
    kategorija: "Usluga" as string,
    adresa: "",
    kapacitet: "",
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [ponudeData, prostoriData] = await Promise.all([ponudaApi.getAll(), prostorApi.getAll()])
      setPonude(ponudeData)
      setProstori(prostoriData)
    } catch (error) {
      toast({
        title: "Greška",
        description: handleApiError(error),
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filteredPonude = ponude.filter((ponuda) => {
    const matchesSearch = ponuda.naziv.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || ponuda.kategorija === categoryFilter
    return matchesSearch && matchesCategory
  })

  const filteredProstori = prostori.filter((prostor) => {
    const matchesSearch =
      prostor.naziv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prostor.adresa.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const handleCreatePonuda = async () => {
    if (!newPonuda.naziv || !newPonuda.ukCijenaFiksna || !newPonuda.cijenaPoOsobi) {
      toast({
        title: "Greška",
        description: "Molimo unesite sve obavezne podatke.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (newPonuda.kategorija === "Prostor") {
        if (!newPonuda.adresa || !newPonuda.kapacitet) {
          toast({
            title: "Greška",
            description: "Za prostor morate unijeti adresu i kapacitet.",
            variant: "destructive",
          })
          return
        }

        const prostorData: Omit<ProstorDTO, "ponudaId"> = {
          naziv: newPonuda.naziv,
          opis: newPonuda.opis,
          ukCijenaFiksna: Number.parseFloat(newPonuda.ukCijenaFiksna),
          cijenaPoOsobi: Number.parseFloat(newPonuda.cijenaPoOsobi),
          kategorija: "Prostor",
          adresa: newPonuda.adresa,
          kapacitet: Number.parseInt(newPonuda.kapacitet),
        }

        await prostorApi.create(prostorData)
        toast({
          title: "Uspjeh",
          description: "Prostor je uspješno kreiran.",
        })
      } else {
        const ponudaData: Omit<PonudaDTO, "ponudaId"> = {
          naziv: newPonuda.naziv,
          opis: newPonuda.opis,
          ukCijenaFiksna: Number.parseFloat(newPonuda.ukCijenaFiksna),
          cijenaPoOsobi: Number.parseFloat(newPonuda.cijenaPoOsobi),
          kategorija: newPonuda.kategorija,
        }

        await ponudaApi.create(ponudaData)
        toast({
          title: "Uspjeh",
          description: "Ponuda je uspješno kreirana.",
        })
      }

      // Reset form and reload data
      setNewPonuda({
        naziv: "",
        opis: "",
        ukCijenaFiksna: "",
        cijenaPoOsobi: "",
        kategorija: "Usluga",
        adresa: "",
        kapacitet: "",
      })
      setIsCreateDialogOpen(false)
      await loadData()
    } catch (error) {
      toast({
        title: "Greška",
        description: handleApiError(error),
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeletePonuda = async (id: number) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovu ponudu?")) return

    try {
      await ponudaApi.delete(id)
      toast({
        title: "Uspjeh",
        description: "Ponuda je uspješno obrisana.",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Greška",
        description: handleApiError(error),
        variant: "destructive",
      })
    }
  }

  const handleDeleteProstor = async (id: number) => {
    if (!confirm("Jeste li sigurni da želite obrisati ovaj prostor?")) return

    try {
      await prostorApi.delete(id)
      toast({
        title: "Uspjeh",
        description: "Prostor je uspješno obrisan.",
      })
      await loadData()
    } catch (error) {
      toast({
        title: "Greška",
        description: handleApiError(error),
        variant: "destructive",
      })
    }
  }

  const getCategoryColor = (kategorija: string) => {
    switch (kategorija) {
      case "Prostor":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Catering":
        return "bg-green-100 text-green-800 border-green-200"
      case "Usluga":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Rekviziti":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "Piće":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
        <span className="ml-2 text-slate-600">Učitavanje ponuda...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Moje ponude</h2>
          <p className="text-slate-600">Upravljajte svojim ponudama i prostorima</p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-sky-600 hover:bg-sky-700">
              <Plus className="h-4 w-4 mr-2" />
              Nova ponuda
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Kreiraj novu ponudu</DialogTitle>
              <DialogDescription>Unesite podatke za novu ponudu ili prostor</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="naziv">Naziv ponude *</Label>
                <Input
                  id="naziv"
                  value={newPonuda.naziv}
                  onChange={(e) => setNewPonuda({ ...newPonuda, naziv: e.target.value })}
                  placeholder="Unesite naziv ponude"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opis">Opis</Label>
                <Textarea
                  id="opis"
                  value={newPonuda.opis}
                  onChange={(e) => setNewPonuda({ ...newPonuda, opis: e.target.value })}
                  placeholder="Opišite svoju ponudu"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="kategorija">Kategorija *</Label>
                <Select
                  value={newPonuda.kategorija}
                  onValueChange={(value) => setNewPonuda({ ...newPonuda, kategorija: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Odaberite kategoriju" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Prostor">Prostor</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Usluga">Usluga</SelectItem>
                    <SelectItem value="Rekviziti">Rekviziti</SelectItem>
                    <SelectItem value="Piće">Piće</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ukCijenaFiksna">Fiksna cijena (€) *</Label>
                  <Input
                    id="ukCijenaFiksna"
                    type="number"
                    step="0.01"
                    value={newPonuda.ukCijenaFiksna}
                    onChange={(e) => setNewPonuda({ ...newPonuda, ukCijenaFiksna: e.target.value })}
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cijenaPoOsobi">Cijena po osobi (€) *</Label>
                  <Input
                    id="cijenaPoOsobi"
                    type="number"
                    step="0.01"
                    value={newPonuda.cijenaPoOsobi}
                    onChange={(e) => setNewPonuda({ ...newPonuda, cijenaPoOsobi: e.target.value })}
                    placeholder="0.00"
                  />
                </div>
              </div>

              {newPonuda.kategorija === "Prostor" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="adresa">Adresa *</Label>
                    <Input
                      id="adresa"
                      value={newPonuda.adresa}
                      onChange={(e) => setNewPonuda({ ...newPonuda, adresa: e.target.value })}
                      placeholder="Unesite adresu prostora"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kapacitet">Kapacitet (broj osoba) *</Label>
                    <Input
                      id="kapacitet"
                      type="number"
                      value={newPonuda.kapacitet}
                      onChange={(e) => setNewPonuda({ ...newPonuda, kapacitet: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} disabled={isSubmitting}>
                  Odustani
                </Button>
                <Button onClick={handleCreatePonuda} className="bg-sky-600 hover:bg-sky-700" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Kreiranje...
                    </>
                  ) : (
                    "Kreiraj ponudu"
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white/60 border border-sky-200">
          <TabsTrigger value="ponude" className="data-[state=active]:bg-sky-100">
            Ponude ({ponude.length})
          </TabsTrigger>
          <TabsTrigger value="prostori" className="data-[state=active]:bg-sky-100">
            Prostori ({prostori.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ponude" className="space-y-6">
          {/* Filteri za ponude */}
          <Card className="bg-white/80 border-sky-200">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                    <Input
                      placeholder="Pretraži ponude..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-sky-200 focus:border-sky-400"
                    />
                  </div>
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48 border-sky-200">
                    <SelectValue placeholder="Filtriraj po kategoriji" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Sve kategorije</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Usluga">Usluga</SelectItem>
                    <SelectItem value="Rekviziti">Rekviziti</SelectItem>
                    <SelectItem value="Piće">Piće</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Lista ponuda */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPonude.map((ponuda) => (
              <Card key={ponuda.ponudaId} className="bg-white/80 border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-slate-800">{ponuda.naziv}</CardTitle>
                      <Badge className={getCategoryColor(ponuda.kategorija)}>{ponuda.kategorija}</Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">€{ponuda.ukCijenaFiksna}</div>
                      <div className="text-sm text-slate-600">+ €{ponuda.cijenaPoOsobi}/osoba</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2">{ponuda.opis}</p>

                  <div className="flex justify-end gap-2">
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
                      onClick={() => ponuda.ponudaId && handleDeletePonuda(ponuda.ponudaId)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prostori" className="space-y-6">
          {/* Filteri za prostore */}
          <Card className="bg-white/80 border-sky-200">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  placeholder="Pretraži prostore..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-sky-200 focus:border-sky-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Lista prostora */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProstori.map((prostor) => (
              <Card key={prostor.ponudaId} className="bg-white/80 border-sky-200 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <CardTitle className="text-slate-800">{prostor.naziv}</CardTitle>
                      <CardDescription className="flex items-center gap-2 text-slate-600">
                        <MapPin className="h-4 w-4" />
                        {prostor.adresa}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">€{prostor.ukCijenaFiksna}</div>
                      <div className="text-sm text-slate-600">+ €{prostor.cijenaPoOsobi}/osoba</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-slate-600 line-clamp-2">{prostor.opis}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-slate-500" />
                      <span className="text-slate-600">Kapacitet: {prostor.kapacitet} osoba</span>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" className="border-sky-200 hover:bg-sky-50">
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Slike
                    </Button>
                    <Button variant="outline" size="sm" className="border-sky-200 hover:bg-sky-50">
                      <Edit className="h-4 w-4 mr-1" />
                      Uredi
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-200 hover:bg-red-50 text-red-600"
                      onClick={() => prostor.ponudaId && handleDeleteProstor(prostor.ponudaId)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Obriši
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Prazno stanje */}
      {((activeTab === "ponude" && filteredPonude.length === 0) ||
        (activeTab === "prostori" && filteredProstori.length === 0)) && (
        <Card className="bg-white/80 border-sky-200">
          <CardContent className="text-center py-12">
            <div className="h-12 w-12 text-slate-400 mx-auto mb-4">
              {activeTab === "ponude" ? <Euro className="h-12 w-12" /> : <MapPin className="h-12 w-12" />}
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">
              {activeTab === "ponude" ? "Nema ponuda" : "Nema prostora"}
            </h3>
            <p className="text-slate-600 mb-4">
              {searchTerm || categoryFilter !== "all"
                ? `Nema ${activeTab} koji odgovaraju vašim kriterijima pretrage.`
                : `Još niste kreirali nijednu ${activeTab === "ponude" ? "ponudu" : "prostor"}.`}
            </p>
            {!searchTerm && categoryFilter === "all" && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-sky-600 hover:bg-sky-700">
                <Plus className="h-4 w-4 mr-2" />
                {activeTab === "ponude" ? "Kreiraj prvu ponudu" : "Kreiraj prvi prostor"}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
