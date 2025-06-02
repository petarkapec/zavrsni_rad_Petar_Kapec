"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Mail, Edit, Save, X, Calendar, Euro, Users } from "lucide-react"

export function OrganizerProfile() {
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Moj profil</h1>
        <p className="text-gray-600">Upravljajte svojim osobnim podacima i statistikama</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
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

          {/* Business Statistics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-blue-600" />
                Poslovne statistike
              </CardTitle>
              <CardDescription>Pregled vaših poslovnih aktivnosti</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-900">8</div>
                    <div className="text-sm text-gray-600">Aktivni događaji</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-900">24</div>
                    <div className="text-sm text-gray-600">Ukupno rezervacija</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Euro className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-purple-900">4,250€</div>
                    <div className="text-sm text-gray-600">Mjesečni prihod</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-orange-900">3</div>
                    <div className="text-sm text-gray-600">Čeka potvrdu</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Brze akcije</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Kreiraj događaj
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Upravljaj rezervacijama
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Euro className="h-4 w-4 mr-2" />
                Pregled prihoda
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nedavna aktivnost</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Nova rezervacija</span>
                  <span className="text-blue-600">2h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Događaj kreiran</span>
                  <span className="text-blue-600">1d</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rezervacija potvrđena</span>
                  <span className="text-blue-600">2d</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
