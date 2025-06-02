"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Users, MapPin } from "lucide-react"
import Dashboard from "./components/dashboard"

type User = {
  korisnik_id: number
  username: string
  ime: string
  prezime: string
  email: string
  uloga: "Organizator" | "Kupac"
}

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    ime: "",
    prezime: "",
    email: "",
    uloga: "Kupac" as "Organizator" | "Kupac",
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulacija login-a
    const mockUser: User = {
      korisnik_id: 1,
      username: formData.username,
      ime: "Ana",
      prezime: "Marić",
      email: "ana@example.com",
      uloga: formData.username === "organizator" ? "Organizator" : "Kupac",
    }
    setCurrentUser(mockUser)
    setIsLoggedIn(true)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulacija registracije
    const newUser: User = {
      korisnik_id: Date.now(),
      username: formData.username,
      ime: formData.ime,
      prezime: formData.prezime,
      email: formData.email,
      uloga: formData.uloga,
    }
    setCurrentUser(newUser)
    setIsLoggedIn(true)
  }

  if (isLoggedIn && currentUser) {
    return <Dashboard user={currentUser} onLogout={() => setIsLoggedIn(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Hero sekcija */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">Organizirajte savršene događaje</h1>
            <p className="text-lg text-slate-600">
              Platforma koja povezuje organizatore i kupce za nezaboravne događaje. Upravljajte rezervacijama,
              prostorima i uslugama na jednom mjestu.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg">
              <Calendar className="h-8 w-8 text-sky-600" />
              <div>
                <h3 className="font-semibold text-slate-800">Događaji</h3>
                <p className="text-sm text-slate-600">Kreirajte i upravljajte</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg">
              <MapPin className="h-8 w-8 text-sky-600" />
              <div>
                <h3 className="font-semibold text-slate-800">Prostori</h3>
                <p className="text-sm text-slate-600">Rezervirajte lokacije</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-white/60 rounded-lg">
              <Users className="h-8 w-8 text-sky-600" />
              <div>
                <h3 className="font-semibold text-slate-800">Gosti</h3>
                <p className="text-sm text-slate-600">Upravljajte listama</p>
              </div>
            </div>
          </div>
        </div>

        {/* Login/Register forma */}
        <Card className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm border-sky-200">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-slate-800">{isLogin ? "Prijavite se" : "Registrirajte se"}</CardTitle>
            <CardDescription className="text-slate-600">
              {isLogin ? "Unesite svoje podatke za prijavu" : "Kreirajte novi račun"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Korisničko ime</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Unesite korisničko ime"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                  className="border-sky-200 focus:border-sky-400"
                />
              </div>

              {!isLogin && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ime">Ime</Label>
                      <Input
                        id="ime"
                        type="text"
                        placeholder="Vaše ime"
                        value={formData.ime}
                        onChange={(e) => setFormData({ ...formData, ime: e.target.value })}
                        required
                        className="border-sky-200 focus:border-sky-400"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="prezime">Prezime</Label>
                      <Input
                        id="prezime"
                        type="text"
                        placeholder="Vaše prezime"
                        value={formData.prezime}
                        onChange={(e) => setFormData({ ...formData, prezime: e.target.value })}
                        required
                        className="border-sky-200 focus:border-sky-400"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="vas@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="border-sky-200 focus:border-sky-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uloga">Uloga</Label>
                    <Select
                      value={formData.uloga}
                      onValueChange={(value: "Organizator" | "Kupac") => setFormData({ ...formData, uloga: value })}
                    >
                      <SelectTrigger className="border-sky-200 focus:border-sky-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Kupac">Kupac</SelectItem>
                        <SelectItem value="Organizator">Organizator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Lozinka</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Unesite lozinku"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="border-sky-200 focus:border-sky-400"
                />
              </div>

              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700">
                {isLogin ? "Prijavite se" : "Registrirajte se"}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sky-600 hover:text-sky-700 text-sm"
              >
                {isLogin ? "Nemate račun? Registrirajte se" : "Već imate račun? Prijavite se"}
              </button>
            </div>

            {isLogin && (
              <div className="mt-4 p-3 bg-sky-50 rounded-lg text-sm text-slate-600">
                <p className="font-medium mb-1">Demo pristup:</p>
                <p>• Organizator: username "organizator"</p>
                <p>• Kupac: bilo koje drugo korisničko ime</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
