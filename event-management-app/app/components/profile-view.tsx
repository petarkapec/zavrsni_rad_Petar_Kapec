"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Save, X, Mail, Phone, MapPin } from "lucide-react"

type UserType = {
  korisnik_id: number
  username: string
  ime: string
  prezime: string
  email: string
  uloga: "Organizator" | "Kupac"
}

type ProfileViewProps = {
  user: UserType
}

export default function ProfileView({ user }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    ime: user.ime,
    prezime: user.prezime,
    email: user.email,
    telefon: "+385 99 123 4567",
    adresa: "Zagreb, Hrvatska",
    opis:
      user.uloga === "Organizator"
        ? "Profesionalni organizator događaja s više od 5 godina iskustva u kreiranju nezaboravnih trenutaka."
        : "Ljubitelj kvalitetnih događaja i novih iskustava.",
  })

  const handleSave = () => {
    // Ovdje bi se poslali podaci na backend
    setIsEditing(false)
  }

  const handleCancel = () => {
    setFormData({
      ime: user.ime,
      prezime: user.prezime,
      email: user.email,
      telefon: "+385 99 123 4567",
      adresa: "Zagreb, Hrvatska",
      opis:
        user.uloga === "Organizator"
          ? "Profesionalni organizator događaja s više od 5 godina iskustva u kreiranju nezaboravnih trenutaka."
          : "Ljubitelj kvalitetnih događaja i novih iskustava.",
    })
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Moj profil</h2>
          <p className="text-slate-600">Upravljajte svojim osobnim podacima</p>
        </div>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)} className="bg-sky-600 hover:bg-sky-700">
            <Edit className="h-4 w-4 mr-2" />
            Uredi profil
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
              <Save className="h-4 w-4 mr-2" />
              Spremi
            </Button>
            <Button variant="outline" onClick={handleCancel} className="border-slate-300">
              <X className="h-4 w-4 mr-2" />
              Odustani
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Osnovne informacije */}
        <Card className="lg:col-span-2 bg-white/80 border-sky-200">
          <CardHeader>
            <CardTitle className="text-slate-800">Osnovne informacije</CardTitle>
            <CardDescription className="text-slate-600">Vaši osobni podaci i kontakt informacije</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ime">Ime</Label>
                {isEditing ? (
                  <Input
                    id="ime"
                    value={formData.ime}
                    onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                    className="border-sky-200 focus:border-sky-400"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 rounded-md text-slate-800">{formData.ime}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="prezime">Prezime</Label>
                {isEditing ? (
                  <Input
                    id="prezime"
                    value={formData.prezime}
                    onChange={(e) => setFormData({ ...formData, prezime: e.target.value })}
                    className="border-sky-200 focus:border-sky-400"
                  />
                ) : (
                  <div className="p-2 bg-slate-50 rounded-md text-slate-800">{formData.prezime}</div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-sky-200 focus:border-sky-400"
                />
              ) : (
                <div className="p-2 bg-slate-50 rounded-md text-slate-800 flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-500" />
                  {formData.email}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefon">Telefon</Label>
              {isEditing ? (
                <Input
                  id="telefon"
                  value={formData.telefon}
                  onChange={(e) => setFormData({ ...formData, telefon: e.target.value })}
                  className="border-sky-200 focus:border-sky-400"
                />
              ) : (
                <div className="p-2 bg-slate-50 rounded-md text-slate-800 flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-500" />
                  {formData.telefon}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="adresa">Adresa</Label>
              {isEditing ? (
                <Input
                  id="adresa"
                  value={formData.adresa}
                  onChange={(e) => setFormData({ ...formData, adresa: e.target.value })}
                  className="border-sky-200 focus:border-sky-400"
                />
              ) : (
                <div className="p-2 bg-slate-50 rounded-md text-slate-800 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-slate-500" />
                  {formData.adresa}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="opis">O meni</Label>
              {isEditing ? (
                <Textarea
                  id="opis"
                  value={formData.opis}
                  onChange={(e) => setFormData({ ...formData, opis: e.target.value })}
                  className="border-sky-200 focus:border-sky-400"
                  rows={3}
                />
              ) : (
                <div className="p-2 bg-slate-50 rounded-md text-slate-800">{formData.opis}</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profil slika i statistike */}
        <div className="space-y-6">
          <Card className="bg-white/80 border-sky-200">
            <CardHeader className="text-center">
              <CardTitle className="text-slate-800">Profilna slika</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <Avatar className="h-24 w-24 mx-auto">
                <AvatarImage src="/placeholder.svg?height=96&width=96" />
                <AvatarFallback className="bg-sky-100 text-sky-700 text-xl">
                  {formData.ime.charAt(0)}
                  {formData.prezime.charAt(0)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <h3 className="font-semibold text-slate-800">
                  {formData.ime} {formData.prezime}
                </h3>
                <Badge variant="outline" className="border-sky-300 text-sky-700">
                  {user.uloga}
                </Badge>
                <p className="text-sm text-slate-600">@{user.username}</p>
              </div>

              {isEditing && (
                <Button variant="outline" className="border-sky-200 hover:bg-sky-50">
                  Promijeni sliku
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/80 border-sky-200">
            <CardHeader>
              <CardTitle className="text-slate-800">Statistike računa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-slate-600">Član od:</span>
                <span className="text-sm font-medium text-slate-800">Siječanj 2024</span>
              </div>

              {user.uloga === "Organizator" ? (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Ukupno događaja:</span>
                    <span className="text-sm font-medium text-slate-800">12</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Prosječna ocjena:</span>
                    <span className="text-sm font-medium text-slate-800">4.8 ⭐</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Ukupni prihod:</span>
                    <span className="text-sm font-medium text-slate-800">€15,420</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Rezervacije:</span>
                    <span className="text-sm font-medium text-slate-800">5</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Ukupno potrošeno:</span>
                    <span className="text-sm font-medium text-slate-800">€2,340</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Omiljeni događaji:</span>
                    <span className="text-sm font-medium text-slate-800">8</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
