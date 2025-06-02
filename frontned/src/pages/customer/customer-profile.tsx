"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Edit, Save, X } from "lucide-react"

export function CustomerProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    ime: user?.ime || "",
    prezime: user?.prezime || "",
    email: user?.email || "",
    username: user?.username || "",
  })

  const handleSave = async () => {
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/users/${user?.korisnik_id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })

      console.log("Saving profile:", formData)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
    }
  }

  const handleCancel = () => {
    setFormData({
      ime: user?.ime || "",
      prezime: user?.prezime || "",
      email: user?.email || "",
      username: user?.username || "",
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Moj profil</h1>
        <p className="text-gray-600">Upravljajte svojim osobnim podacima</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-blue-600" />
                Osobni podaci
              </CardTitle>
              <CardDescription>Vaše osnovne informacije</CardDescription>
            </div>
            {!isEditing ? (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Uredi
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Otkaži
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Spremi
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ime">Ime</Label>
              <Input
                id="ime"
                value={formData.ime}
                onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prezime">Prezime</Label>
              <Input
                id="prezime"
                value={formData.prezime}
                onChange={(e) => setFormData({ ...formData, prezime: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Korisničko ime</Label>
            <Input id="username" value={formData.username} disabled />
            <p className="text-sm text-gray-500">Korisničko ime se ne može mijenjati</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-blue-600" />
            Statistike računa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-900">12</div>
              <div className="text-sm text-gray-600">Ukupno rezervacija</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-900">8</div>
              <div className="text-sm text-gray-600">Završene rezervacije</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-900">2</div>
              <div className="text-sm text-gray-600">Aktivne rezervacije</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
